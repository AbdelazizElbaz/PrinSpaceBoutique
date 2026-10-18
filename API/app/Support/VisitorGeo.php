<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * IP réelle du visiteur et géolocalisation (ville / pays) — portage de
 * PackSpaceStore VisitorTrackingController::resolveClientIp() / resolveGeo().
 *
 * IP : premier saut de X-Forwarded-For (load balancer Lightsail puis nginx du conteneur ; trustProxies('*')
 * ne suffisait pas en production côté Store), sinon $request->ip(). Si Cloudflare est devant le site, ses
 * en-têtes CF-Connecting-IP / CF-IPCountry sont privilégiés (pas d'appel externe pour le pays).
 *
 * Géo : https://ipwho.is/{ip} (gratuit, sans clé, ~1000 requêtes/jour) avec cache 12 h par IP (5 min après un
 * échec) ; jamais bloquant, l'erreur est renvoyée pour affichage dans la console admin.
 */
class VisitorGeo
{
    public static function clientIp(Request $request): ?string
    {
        $cf = trim((string) $request->header('CF-Connecting-IP'));
        if ($cf !== '' && filter_var($cf, FILTER_VALIDATE_IP)) {
            return $cf;
        }
        $forwardedFor = (string) $request->header('X-Forwarded-For');
        if ($forwardedFor !== '') {
            $firstHop = trim(explode(',', $forwardedFor)[0]);
            if (filter_var($firstHop, FILTER_VALIDATE_IP)) {
                return $firstHop;
            }
        }
        return $request->ip();
    }

    /** @return array{city:?string,country:?string,country_code:?string,error:?string} */
    public static function resolve(?string $ip, ?string $cfCountry = null): array
    {
        if (!$ip) {
            return ['city' => null, 'country' => null, 'country_code' => null, 'error' => "Adresse IP absente de la requête."];
        }
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return ['city' => null, 'country' => null, 'country_code' => null, 'error' => "IP privée ou locale ({$ip}) : non géolocalisable."];
        }
        $cacheKey = "visitor-geo:{$ip}";
        $cached = Cache::get($cacheKey);
        if (is_array($cached)) {
            return $cached;
        }

        $result = ['city' => null, 'country' => null, 'country_code' => $cfCountry ? strtoupper($cfCountry) : null, 'error' => "Réponse inattendue du service de géolocalisation."];
        $ttl = now()->addMinutes(5);
        try {
            $response = Http::timeout(2)->get("https://ipwho.is/{$ip}");
            $body = $response->ok() ? $response->json() : null;
            if (is_array($body) && ($body['success'] ?? false)) {
                $result = [
                    'city' => $body['city'] ?? null,
                    'country' => $body['country'] ?? null,
                    'country_code' => $body['country_code'] ?? $result['country_code'],
                    'error' => null,
                ];
                $ttl = now()->addHours(12);
            } elseif (!$response->ok()) {
                $result['error'] = "Le service de géolocalisation a répondu avec le code HTTP {$response->status()}.";
            } elseif (is_array($body) && !empty($body['message'])) {
                $result['error'] = "Le service de géolocalisation a refusé la requête : {$body['message']}";
            }
        } catch (\Throwable $e) {
            Log::info('Géolocalisation visiteur échouée (non bloquant)', ['ip' => $ip, 'error' => $e->getMessage()]);
            $result['error'] = "Le service de géolocalisation est injoignable ({$e->getMessage()}).";
        }
        Cache::put($cacheKey, $result, $ttl);
        return $result;
    }
}
