<?php

return [
    // Marque affichée dans les e-mails (même valeur que UI/src/content/site.config.ts)
    'brand' => env('BRAND_NAME', 'PrintIOS'),
    'site_url' => env('SITE_URL', 'http://localhost:3100'),
    // Essai gratuit à l'inscription (jours) — doit correspondre à site.config.ts
    'trial_days' => (int) env('TRIAL_DAYS', 7),

    // Forfaits proposés (miroir de UI/src/content/*/plans.ts)
    'plans' => [
        'starter' => ['name' => 'Starter', 'monthly' => 290, 'yearly' => 242],
        'pro' => ['name' => 'Pro', 'monthly' => 590, 'yearly' => 492],
        'business' => ['name' => 'Business', 'monthly' => 990, 'yearly' => 825],
    ],

    // Où envoyer les notifications (leads, nouvelles inscriptions, échecs)
    'notify_email' => env('NOTIFY_EMAIL', 'commercial@printios.ma'),

    // Console admin du chat du site (/admin/messages) : mot de passe unique → jeton Bearer
    // (voir Admin\AdminAuthController). Vide = console désactivée.
    'admin_password' => env('ADMIN_PASSWORD', ''),

    // Base de connaissances de l'assistant IA : page /ai-knowledge.json générée par le site Next.js (même
    // conteneur, port 3100) ; repli sur SITE_URL si l'adresse interne ne répond pas. Voir App\Support\ChatAi.
    'site_internal_url' => env('SITE_INTERNAL_URL', 'http://127.0.0.1:3100'),
];
