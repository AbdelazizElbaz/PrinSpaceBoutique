<?php

namespace App\Jobs;

use App\Mail\SignupFailedMail;
use App\Models\Signup;
use App\Services\PlatformClient;
use App\Services\PlatformValidationException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Étape 1 de l'inscription : crée le tenant côté Packspace (qui lance lui-même
 * le déploiement asynchrone) puis souscrit le forfait choisi en période
 * d'essai. Le suivi de la progression est fait par SyncSignupJob / le
 * polling GET /signup/{id}/status.
 */
class ProvisionSignupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 120;

    public function __construct(public int $signupId)
    {
    }

    public function handle(PlatformClient $platform): void
    {
        $signup = Signup::find($this->signupId);
        if (!$signup || $signup->status !== 'pending') {
            return;
        }

        try {
            $plan = $platform->findPlanByCode($signup->plan);
            if (!$plan) {
                throw new \RuntimeException("Forfait « {$signup->plan} » introuvable sur la plateforme (créez-le dans la console, code = {$signup->plan}).");
            }

            $created = $platform->createTenant([
                'slug' => $signup->slug,
                'name' => $signup->company,
                'domains' => [$signup->slug.'.'.config('boutique.app_domain')],
                'admin_logon' => $signup->email,
                'admin_password' => $signup->admin_password,
                'config' => [
                    'signup' => [
                        'source' => 'site',
                        'signup_id' => $signup->public_id,
                        'admin_name' => $signup->admin_name,
                        'email' => $signup->email,
                        'phone' => $signup->phone,
                        'billing' => $signup->billing,
                    ],
                ],
            ]);

            $tenantId = (int) ($created['tenant']['id'] ?? 0);
            if (!$tenantId) {
                throw new \RuntimeException('Réponse inattendue de la plateforme (pas d\'identifiant de tenant).');
            }

            $signup->update([
                'status' => 'provisioning',
                'tenant_id' => $tenantId,
                'provisioning_id' => $created['provisioning']['id'] ?? null,
                'steps' => Signup::defaultSteps(),
                'app_url' => $signup->appUrl(),
            ]);

            // Abonnement en essai (l'activation payante se fait depuis la console
            // plateforme après réception du virement).
            $platform->subscribe($tenantId, (int) $plan['id'], (int) config('boutique.trial_days'), "Inscription site — facturation {$signup->billing}");

            // Premier rafraîchissement immédiat de la progression
            SyncSignupJob::dispatch($signup->id)->delay(now()->addSeconds(3));
        } catch (PlatformValidationException $e) {
            $this->fail_($signup, $e->getMessage());
        } catch (Throwable $e) {
            Log::error('ProvisionSignupJob', ['signup' => $signup->id, 'error' => $e->getMessage()]);
            $this->fail_($signup, 'Erreur technique lors de la création de l\'espace : '.$e->getMessage());
        }
    }

    protected function fail_(Signup $signup, string $message): void
    {
        $signup->update(['status' => 'failed', 'error' => $message]);
        try {
            Mail::to(config('boutique.notify_email'))->send(new SignupFailedMail($signup));
        } catch (Throwable $e) {
            Log::warning('SignupFailedMail', ['error' => $e->getMessage()]);
        }
    }
}
