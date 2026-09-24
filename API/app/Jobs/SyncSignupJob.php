<?php

namespace App\Jobs;

use App\Models\Signup;
use App\Services\PlatformClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Rafraîchit l'état du déploiement depuis la plateforme et, à la fin, envoie
 * l'e-mail de bienvenue. Appelé par le polling du site et par `signups:sync`.
 */
class SyncSignupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public function __construct(public int $signupId)
    {
    }

    public function handle(PlatformClient $platform): void
    {
        $signup = Signup::find($this->signupId);
        if ($signup) {
            SignupSync::refresh($signup, $platform);
        }
    }
}
