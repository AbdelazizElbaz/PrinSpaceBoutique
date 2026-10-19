<?php

namespace App\Http\Controllers;

use App\Mail\NewChatMessageMail;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\SiteSetting;
use App\Jobs\ChatAiReplyJob;
use App\Support\ChatAi;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Chat visiteur ↔ équipe PrintIOS, côté visiteur (routes publiques /chat/*, limiteur « chat » par jeton).
 * Portage de PackSpaceStore CustomerChatController sans comptes clients : l'identité est le `guest_token`
 * généré par le navigateur (query pour les GET, corps pour les POST). Mise à jour par polling (`since`).
 */
class ChatController extends Controller
{
    private const GUEST_RULE = 'required|string|min:8|max:64|regex:/^[A-Za-z0-9\-_]+$/';

    /** Réglages lus par le widget au montage. */
    public function settings()
    {
        return response()->json([
            'poll_interval_ms' => SiteSetting::chatPollIntervalMs(),
            'welcome_message' => SiteSetting::get(SiteSetting::KEY_CHAT_WELCOME_MESSAGE),
        ]);
    }

    /** GET /chat/messages?guest_token=&since=&open=1 — nouveaux messages, frappe admin, non-lus. */
    public function index(Request $request)
    {
        $data = $request->validate(['guest_token' => self::GUEST_RULE, 'since' => 'nullable|integer|min:0', 'open' => 'nullable|boolean']);
        $conversation = ChatConversation::where('guest_token', $data['guest_token'])->first();
        if (!$conversation) {
            return response()->json(['conversation_id' => null, 'messages' => [], 'admin_typing' => false, 'unread_count' => 0]);
        }
        $since = (int) ($data['since'] ?? 0);
        $messages = $conversation->messages()->when($since > 0, fn ($q) => $q->where('id', '>', $since))->get(['id', 'sender', 'source', 'body', 'created_at']);
        // Marqués lus seulement quand le widget est réellement déplié (sinon le badge survit au rechargement).
        if ($request->boolean('open')) {
            $conversation->messages()->where('sender', ChatMessage::SENDER_ADMIN)->whereNull('read_at')->update(['read_at' => now()]);
        }
        return response()->json([
            'conversation_id' => $conversation->id,
            'messages' => $messages,
            'admin_typing' => $conversation->isAdminTyping(),
            'unread_count' => $conversation->messages()->where('sender', ChatMessage::SENDER_ADMIN)->whereNull('read_at')->count(),
            'archived' => (bool) $conversation->archived_at,
        ]);
    }

    /** POST /chat/messages — message du visiteur (crée la conversation au premier message). */
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_token' => self::GUEST_RULE,
            'body' => 'required|string|max:2000',
            'guest_name' => 'nullable|string|max:150',
            'guest_phone' => 'nullable|string|max:60',
            'locale' => 'nullable|string|max:5',
            // Pot de miel anti-robots (champ invisible, doit rester vide).
            'website' => 'nullable|string|max:0',
        ]);
        $conversation = ChatConversation::findOrCreateForGuest($data['guest_token'], $data['locale'] ?? null);
        if (!empty($data['guest_name'])) {
            $conversation->guest_name = $data['guest_name'];
        }
        if (!empty($data['guest_phone'])) {
            $conversation->guest_phone = $data['guest_phone'];
        }
        $message = $conversation->messages()->create(['sender' => ChatMessage::SENDER_VISITOR, 'body' => $data['body']]);
        $conversation->last_message_at = $message->created_at;
        // Un visiteur qui réécrit dans un fil archivé le fait réapparaître dans la liste active.
        $conversation->archived_at = null;
        $conversation->visitor_typing_at = null;
        $this->notifyTeam($conversation, $message);
        $conversation->save();
        // Assistant IA (voir App\Support\ChatAi) : répond après un délai si l'équipe n'a pas pris la main.
        if (ChatAi::enabled()) {
            ChatAiReplyJob::dispatch($message->id)->delay(now()->addSeconds(ChatAi::settings()['delay_seconds']));
        }

        return response()->json(['conversation_id' => $conversation->id, 'message' => $message->only(['id', 'sender', 'source', 'body', 'created_at'])], 201);
    }

    /** POST /chat/guest-info — nom / téléphone enregistrés sans envoyer de message (vide = effacer). */
    public function updateGuestInfo(Request $request)
    {
        $data = $request->validate([
            'guest_token' => self::GUEST_RULE,
            'guest_name' => 'nullable|string|max:150',
            'guest_phone' => 'nullable|string|max:60',
            'locale' => 'nullable|string|max:5',
        ]);
        $conversation = ChatConversation::findOrCreateForGuest($data['guest_token'], $data['locale'] ?? null);
        if (array_key_exists('guest_name', $data)) {
            $conversation->guest_name = $data['guest_name'] ?: null;
        }
        if (array_key_exists('guest_phone', $data)) {
            $conversation->guest_phone = $data['guest_phone'] ?: null;
        }
        $conversation->save();
        return response()->json(['ok' => true, 'conversation_id' => $conversation->id]);
    }

    /** POST /chat/typing — le visiteur tape (no-op tant que la conversation n'existe pas). */
    public function typing(Request $request)
    {
        $data = $request->validate(['guest_token' => self::GUEST_RULE]);
        ChatConversation::where('guest_token', $data['guest_token'])->update(['visitor_typing_at' => now()]);
        return response()->json(['ok' => true]);
    }

    /**
     * E-mail à l'équipe (NOTIFY_EMAIL, file d'attente) quand un visiteur écrit — au plus un par conversation
     * toutes les 30 min, et seulement si l'équipe n'a pas répondu depuis (sinon elle est déjà dans le fil).
     */
    private function notifyTeam(ChatConversation $conversation, ChatMessage $message): void
    {
        if ($conversation->notified_at && $conversation->notified_at->gt(now()->subMinutes(30))) {
            return;
        }
        $lastAdminAt = $conversation->messages()->where('sender', ChatMessage::SENDER_ADMIN)->max('created_at');
        if ($lastAdminAt && now()->parse($lastAdminAt)->gt(now()->subMinutes(5))) {
            return;
        }
        $conversation->notified_at = now();
        try {
            Mail::to(config('boutique.notify_email'))->queue(new NewChatMessageMail($conversation, $message));
        } catch (Throwable $e) {
            Log::warning('NewChatMessageMail', ['error' => $e->getMessage()]);
        }
    }
}
