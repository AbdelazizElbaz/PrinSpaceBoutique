<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Limiteur "api" requis par $middleware->throttleApi() (bootstrap/app.php) :
        // 60 requêtes/minute par IP sur toutes les routes de l'API.
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
        // Chat + présence (voir routes/api.php) : le widget interroge l'API toutes les 2 s (réglable) et envoie un
        // heartbeat toutes les 20 s → limite par jeton visiteur, large, l'IP en repli.
        RateLimiter::for('chat', fn (Request $request) => Limit::perMinute(300)->by('chat:' . ((string) $request->input('guest_token', $request->query('guest_token', '')) ?: $request->ip())));
        // Console admin : polling de la liste + du fil ouvert + des badges.
        RateLimiter::for('admin', fn (Request $request) => Limit::perMinute(600)->by('admin:' . $request->ip()));
        RateLimiter::for('admin-login', fn (Request $request) => Limit::perMinute(5)->by('admin-login:' . $request->ip()));
    }
}
