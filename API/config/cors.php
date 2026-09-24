<?php

return [
    'paths' => ['api/*', 'up'],
    'allowed_methods' => ['*'],
    // Origine(s) du site Next.js (séparées par des virgules dans SITE_ORIGINS)
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', env('SITE_ORIGINS', 'http://localhost:3100'))))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
