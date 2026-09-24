<?php

namespace App\Console\Commands;

use App\Jobs\SignupSync;
use App\Models\Signup;
use App\Services\PlatformClient;
use Illuminate\Console\Command;

class SignupsSyncCommand extends Command
{
    protected $signature = 'signups:sync';
    protected $description = 'Rafraîchit les inscriptions en cours de déploiement et envoie les e-mails de bienvenue';

    public function handle(PlatformClient $platform): int
    {
        $n = 0;
        Signup::where('status', 'provisioning')->orWhere(fn ($q) => $q->where('status', 'active')->whereNull('welcome_sent_at'))
            ->each(function (Signup $s) use ($platform, &$n) {
                if ($s->status === 'provisioning') {
                    SignupSync::refresh($s, $platform);
                } elseif (!$s->welcome_sent_at) {
                    // actif mais e-mail non parti (ex. SMTP indisponible) : on retente
                    $s->status = 'provisioning';
                    SignupSync::refresh($s->fresh(), $platform);
                }
                $n++;
            });
        $this->info("{$n} inscription(s) vérifiée(s).");
        return self::SUCCESS;
    }
}
