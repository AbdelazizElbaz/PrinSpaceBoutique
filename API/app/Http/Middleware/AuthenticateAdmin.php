<?php

namespace App\Http\Middleware;

use App\Models\AdminToken;
use App\Support\VisitorGeo;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Console admin du site : jeton Bearer émis par Admin\AdminAuthController::login (table admin_tokens). */
class AuthenticateAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = AdminToken::findValid($request->bearerToken());
        if (!$token) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }
        // Rafraîchi au plus une fois par minute (évite une écriture à chaque polling).
        if (!$token->last_used_at || $token->last_used_at->lt(now()->subMinute())) {
            $token->forceFill(['last_used_at' => now(), 'last_ip' => VisitorGeo::clientIp($request)])->save();
        }
        $request->attributes->set('admin_token', $token);
        return $next($request);
    }
}
