<?php

namespace App\Jobs;

use App\Mail\WelcomeMail;
use App\Models\Signup;
use App\Services\PlatformClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Logique partagée de rafraîchissement d'une inscription (synchrone, utilisée
 * par le contrôleur de statut, le job et la commande planifiée).
 */
class SignupSync
{
    /** Correspondance étapes Packspace (TenantProvisioning::STEPS) → libellés du site. */
    public const LABELS = [
        'database' => 'Création de la base de données',
        'migrate' => 'Installation de la structure',
        'seed' => 'Données de départ',
        'admin' => 'Compte administrateur',
        'storage' => 'Espace de stockage des fichiers',
        'verify' => 'Vérification finale',
    ];

    public static function refresh(Signup $signup, PlatformClient $platform): Signup
    {
        if ($signup->status !== 'provisioning' || !$signup->tenant_id) {
            return $signup;
        }

        try {
            $data = $platform->provisioning((int) $signup->tenant_id);
        } catch (Throwable $e) {
            Log::warning('SignupSync: plateforme injoignable', ['signup' => $signup->id, 'error' => $e->getMessage()]);
            return $signup; // on garde l'état courant, on réessaiera
        }

        $prov = $data['provisioning'] ?? null;
        $tenant = $data['tenant'] ?? null;

        $steps = [];
        foreach ((array) ($prov['steps'] ?? []) as $s) {
            $key = $s['step'] ?? $s['key'] ?? null;
            if (!$key) {
                continue;
            }
            $status = $s['status'] ?? 'pending';
            $steps[] = [
                'key' => $key,
                'label' => self::LABELS[$key] ?? ($s['label'] ?? $key),
                'status' => $status === 'skipped' ? 'done' : $status,
                'message' => $s['message'] ?? null,
            ];
        }

        $update = [
            'progress' => (int) ($prov['progress'] ?? $signup->progress),
            'current_step' => $prov['current_step'] ?? null,
            'steps' => $steps ?: $signup->steps,
        ];

        $provStatus = $prov['status'] ?? null;
        $tenantStatus = $tenant['status'] ?? null;

        if ($provStatus === 'done' || $tenantStatus === 'active') {
            $update['status'] = 'active';
            $update['progress'] = 100;
            $update['error'] = null;
        } elseif ($provStatus === 'failed' || $tenantStatus === 'provisioning_failed') {
            $update['status'] = 'failed';
            $update['error'] = $prov['error'] ?? 'Le déploiement a échoué.';
        }

        $signup->update($update);

        if ($signup->status === 'active' && !$signup->welcome_sent_at) {
            try {
                Mail::to($signup->email)->send(new WelcomeMail($signup));
                // Mot de passe : on ne le garde pas plus longtemps que nécessaire
                $signup->forceFill(['welcome_sent_at' => now(), 'admin_password' => ''])->save();
            } catch (Throwable $e) {
                Log::error('WelcomeMail', ['signup' => $signup->id, 'error' => $e->getMessage()]);
            }
        }

        return $signup;
    }
}
