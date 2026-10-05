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
];
