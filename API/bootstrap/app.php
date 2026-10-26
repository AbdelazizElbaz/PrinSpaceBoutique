<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API publique consommée par le site Next.js : CORS géré par config/cors.php
        $middleware->throttleApi();
        // Derrière nginx (conteneur unique) puis le load balancer Lightsail : X-Forwarded-Proto/Host/Port sont fiables
        // → URLs https correctes. X-Forwarded-For est volontairement IGNORÉ : un client peut le forger (il changeait
        // d'IP à chaque requête et contournait tous les limiteurs). nginx place l'IP réelle du visiteur (CF-Connecting-IP)
        // dans REMOTE_ADDR, que $request->ip() lit alors telle quelle — voir docker/nginx.conf.
        $middleware->trustProxies(at: '*', headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO
            | \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST
            | \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT);
        // Console admin du chat (jeton Bearer, voir App\Http\Middleware\AuthenticateAdmin).
        $middleware->alias(['admin.auth' => \App\Http\Middleware\AuthenticateAdmin::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Toute l'API répond en JSON, même sans « Accept: application/json » : une requête de robot sans cet en-tête
        // déclenchait une redirection de validation (302 vers « / » sans session) qui finissait en 500 « Server Error ».
        $exceptions->shouldRenderJsonWhen(fn ($request, \Throwable $e) => $request->is('api/*') || $request->expectsJson());
    })->create();
