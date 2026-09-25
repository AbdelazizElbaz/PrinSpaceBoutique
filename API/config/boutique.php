<?php

return [
    // Marque affichée dans les e-mails (même valeur que UI/src/content/site.config.ts)
    'brand' => env('BRAND_NAME', 'PrintIOS'),
    'site_url' => env('SITE_URL', 'http://localhost:3100'),
    // Essai gratuit à l'inscription (jours) — doit correspondre à site.config.ts
    'trial_days' => (int) env('TRIAL_DAYS', 7),

    // Forfaits proposés (miroir de UI/src/content/*/plans.ts)
    'plans' => [
        'starter' => ['name' => 'Starter', 'monthly' => 300, 'yearly' => 250],
        'pro' => ['name' => 'Pro', 'monthly' => 690, 'yearly' => 575],
        'business' => ['name' => 'Business', 'monthly' => 1490, 'yearly' => 1240],
    ],

    // Où envoyer les notifications (leads, nouvelles inscriptions, échecs)
    'notify_email' => env('NOTIFY_EMAIL', 'commercial@printios.ma'),
];
