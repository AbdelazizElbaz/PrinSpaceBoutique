<?php

namespace App\Http\Controllers;

use App\Models\VisitorSession;
use App\Support\VisitorGeo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * Présence des visiteurs (page courante, IP, ville/pays, pages vues) — routes publiques /visitors/*.
 * Portage de PackSpaceStore VisitorTrackingController ; indépendant du chat (le suivi fonctionne même si
 * le visiteur n'ouvre jamais le widget).
 */
class VisitorController extends Controller
{
    private const GUEST_RULE = 'required|string|min:8|max:64|regex:/^[A-Za-z0-9\-_]+$/';

    /** POST /visitors/heartbeat — toutes les 20 s côté navigateur. */
    public function heartbeat(Request $request)
    {
        $data = $request->validate([
            'guest_token' => self::GUEST_RULE,
            'current_path' => 'nullable|string|max:500',
            'referrer' => 'nullable|string|max:500',
            'locale' => 'nullable|string|max:5',
            'viewed_pages' => 'nullable|array|max:12',
            'viewed_pages.*' => 'string|max:300',
            // Le staff (console admin ouverte dans ce navigateur) n'est pas un visiteur.
            'is_staff_hint' => 'nullable|boolean',
        ]);
        if (!empty($data['is_staff_hint'])) {
            return response()->json(['ok' => true, 'staff' => true]);
        }

        $session = VisitorSession::firstOrNew(['guest_token' => $data['guest_token']]);
        $ip = VisitorGeo::clientIp($request);
        $geo = VisitorGeo::resolve($ip, $request->header('CF-IPCountry'));
        $session->fill([
            'current_path' => $data['current_path'] ?? $session->current_path,
            'referrer' => $session->referrer ?: ($data['referrer'] ?? null),
            'locale' => $data['locale'] ?? $session->locale,
            'user_agent' => substr((string) $request->userAgent(), 0, 250),
            'ip_address' => $ip,
            'xff_header' => substr((string) $request->header('X-Forwarded-For'), 0, 500) ?: null,
            // Une valeur déjà connue n'est jamais écrasée par un échec de géolocalisation.
            'city' => $geo['city'] ?? $session->city,
            'country' => $geo['country'] ?? $session->country,
            'country_code' => $geo['country_code'] ?? $session->country_code,
            'geo_error' => $geo['error'],
            'viewed_pages' => $data['viewed_pages'] ?? ($session->viewed_pages ?? []),
            'last_seen_at' => now(),
        ]);
        if (!$session->exists) {
            $session->first_seen_at = now();
        }
        $session->save();

        // Pas de scheduler dans le conteneur : purge opportuniste des présences de plus de 30 jours
        // (les conversations gardent leur propre instantané géo/IP).
        if (random_int(1, 100) === 1) {
            VisitorSession::where('last_seen_at', '<', now()->subDays(30))->delete();
        }

        return response()->json(['ok' => true, 'country' => $session->country, 'city' => $session->city]);
    }

    /** POST /visitors/offline — navigator.sendBeacon à la fermeture de l'onglet (pas d'en-têtes possibles). */
    public function offline(Request $request)
    {
        $token = (string) $request->input('guest_token', '');
        if ($token !== '' && !$request->boolean('is_staff_hint')) {
            VisitorSession::where('guest_token', $token)->update(['last_seen_at' => now()->subMinutes(VisitorSession::ONLINE_THRESHOLD_MINUTES + 1)]);
        }
        return response()->json(['ok' => true]);
    }
}
