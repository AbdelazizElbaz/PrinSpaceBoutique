<?php

namespace App\Http\Controllers\Admin;

use App\Models\ChatConversation;
use App\Models\VisitorSession;
use Illuminate\Routing\Controller;

/** Visiteurs en ligne (console admin) et ouverture d'une conversation à l'initiative de l'équipe. */
class AdminVisitorController extends Controller
{
    /** GET /admin/visitors — visiteurs vus dans les 2 dernières minutes. */
    public function index()
    {
        $sessions = VisitorSession::online()->with('conversation:id,guest_token,guest_name')->orderByDesc('last_seen_at')->limit(200)->get();
        return response()->json($sessions->map(fn (VisitorSession $s) => [
            'id' => $s->id,
            'display_name' => $s->conversation?->guest_name ?: $s->displayName(),
            'conversation_id' => $s->conversation?->id,
            'current_path' => $s->current_path,
            'referrer' => $s->referrer,
            'locale' => $s->locale,
            'city' => $s->city,
            'country' => $s->country,
            'country_code' => $s->country_code,
            'ip_address' => $s->ip_address,
            'geo_error' => $s->geo_error,
            'viewed_pages' => $s->viewed_pages ?? [],
            'user_agent' => $s->user_agent,
            'first_seen_at' => $s->first_seen_at,
            'last_seen_at' => $s->last_seen_at,
        ])->values());
    }

    /** POST /admin/visitors/{id}/start-chat — crée (ou retrouve) la conversation de ce visiteur. */
    public function startChat(VisitorSession $session)
    {
        $conversation = ChatConversation::findOrCreateForGuest($session->guest_token, $session->locale);
        return response()->json(['conversation_id' => $conversation->id]);
    }
}
