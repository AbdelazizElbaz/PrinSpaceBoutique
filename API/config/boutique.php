<?php

return [
    // Marque affichée dans les e-mails (même valeur que UI/src/content/site.config.ts)
    'brand' => env('BRAND_NAME', 'PrintIOS'),
    'site_url' => env('SITE_URL', 'http://localhost:3100'),
    // Domaine sur lequel les espaces clients sont créés : <slug>.<app_domain>
    'app_domain' => env('APP_TENANT_DOMAIN', 'app.printios.ma'),
    'app_scheme' => env('APP_TENANT_SCHEME', 'https'),

    // API plateforme Packspace (API2 branche MultiTanant, routes /platform/*)
    'platform' => [
        'url' => rtrim(env('PLATFORM_API_URL', 'http://localhost:8000/api'), '/'),
        'token' => env('PLATFORM_API_TOKEN', ''),
        'timeout' => (int) env('PLATFORM_API_TIMEOUT', 30),
    ],

    // Essai gratuit à l'inscription (jours) — doit correspondre à site.config.ts
    'trial_days' => (int) env('TRIAL_DAYS', 14),

    // Sous-domaines interdits
    'reserved_slugs' => ['www', 'api', 'app', 'admin', 'platform', 'mail', 'smtp', 'ftp', 'store', 'boutique', 'test', 'demo', 'staging', 'dev', 'support', 'help', 'docs', 'status', 'central', 'packspace', 'printios'],

    // Codes des forfaits (doivent exister dans la table centrale `plans` de Packspace)
    'plans' => [
        'starter' => ['name' => 'Starter', 'monthly' => 300, 'yearly' => 250],
        'pro' => ['name' => 'Pro', 'monthly' => 690, 'yearly' => 575],
        'business' => ['name' => 'Business', 'monthly' => 1490, 'yearly' => 1240],
    ],

    // Où envoyer les notifications (leads, nouvelles inscriptions, échecs)
    'notify_email' => env('NOTIFY_EMAIL', 'commercial@printios.ma'),
];
