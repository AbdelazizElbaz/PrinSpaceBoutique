<?php

namespace App\Http\Controllers\Admin;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\SiteSetting;
use App\Models\VisitorSession;
use App\Support\ChatAi;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/** Console admin du chat (routes /admin/chat/*, jeton Bearer). Portage de PackSpaceStore AdminChatController. */
class AdminChatController extends Controller
{
    /** GET /admin/chat/conversations?archived=0|1 */
    public function index(Request $request)
    {
        $archived = $request->boolean('archived');
        $rows = ChatConversation::query()
            ->when($archived, fn ($q) => $q->archived(), fn ($q) => $q->active())
            ->withCount(['messages as unread_count' => fn ($q) => $q->where('sender', ChatMessage::SENDER_VISITOR)->whereNull('read_at')])
            ->with(['session:id,guest_token,last_seen_at,current_path,country,city'])
            ->orderByDesc('last_message_at')->orderByDesc('created_at')
            ->limit(200)
            ->get();
        $lastMessages = ChatMessage::whereIn('conversation_id', $rows->pluck('id'))
            ->whereIn('id', fn ($q) => $q->selectRaw('max(id)')->from('chat_messages')->groupBy('conversation_id'))
            ->get()->keyBy('conversation_id');

        return response()->json($rows->map(function (ChatConversation $c) use ($lastMessages) {
            $last = $lastMessages->get($c->id);
            return [
                'id' => $c->id,
                'display_name' => $c->displayName(),
                'guest_phone' => $c->guest_phone,
                'locale' => $c->locale,
                'country' => $c->country ?? $c->session?->country,
                'city' => $c->city ?? $c->session?->city,
                'online' => (bool) $c->session?->isOnline(),
                'current_path' => $c->session?->current_path,
                'last_message' => $last ? mb_substr($last->body, 0, 120) : null,
                'last_message_sender' => $last?->sender,
                'last_message_at' => $c->last_message_at,
                'unread_count' => (int) $c->unread_count,
                'visitor_typing' => $c->isVisitorTyping(),
                'archived_at' => $c->archived_at,
            ];
        })->values());
    }

    /** GET /admin/chat/conversations/{id}?since= — fil complet (ou nouveaux messages) + contexte visiteur. */
    public function show(Request $request, ChatConversation $conversation)
    {
        $since = (int) $request->query('since', 0);
        $conversation->messages()->where('sender', ChatMessage::SENDER_VISITOR)->whereNull('read_at')->update(['read_at' => now()]);
        $messages = $conversation->messages()->when($since > 0, fn ($q) => $q->where('id', '>', $since))->get(['id', 'sender', 'source', 'body', 'created_at', 'read_at']);
        $session = $conversation->session;

        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'display_name' => $conversation->displayName(),
                'guest_name' => $conversation->guest_name,
                'guest_phone' => $conversation->guest_phone,
                'locale' => $conversation->locale,
                'archived_at' => $conversation->archived_at,
                'created_at' => $conversation->created_at,
            ],
            'messages' => $messages,
            'visitor_typing' => $conversation->isVisitorTyping(),
            'visitor' => [
                'online' => (bool) $session?->isOnline(),
                'last_seen_at' => $session?->last_seen_at,
                'first_seen_at' => $session?->first_seen_at,
                'current_path' => $session?->current_path,
                'referrer' => $session?->referrer,
                'viewed_pages' => $session?->viewed_pages ?? [],
                'user_agent' => $session?->user_agent,
                'city' => $conversation->city ?? $session?->city,
                'country' => $conversation->country ?? $session?->country,
                'country_code' => $session?->country_code,
                'ip_address' => $conversation->ip_address ?? $session?->ip_address,
                'geo_error' => $session?->geo_error,
                'xff_header' => $session?->xff_header,
            ],
        ]);
    }

    /** POST /admin/chat/conversations/{id}/messages */
    public function store(Request $request, ChatConversation $conversation)
    {
        $data = $request->validate(['body' => 'required|string|max:2000']);
        $message = $conversation->messages()->create(['sender' => ChatMessage::SENDER_ADMIN, 'body' => $data['body']]);
        $conversation->forceFill(['last_message_at' => $message->created_at, 'admin_typing_at' => null])->save();
        return response()->json(['message' => $message->only(['id', 'sender', 'source', 'body', 'created_at', 'read_at'])], 201);
    }

    public function typing(ChatConversation $conversation)
    {
        $conversation->forceFill(['admin_typing_at' => now()])->save();
        return response()->json(['ok' => true]);
    }

    public function archive(ChatConversation $conversation)
    {
        $conversation->forceFill(['archived_at' => now()])->save();
        return response()->json(['archived_at' => $conversation->archived_at]);
    }

    public function unarchive(ChatConversation $conversation)
    {
        $conversation->forceFill(['archived_at' => null])->save();
        return response()->json(['archived_at' => null]);
    }

    public function destroy(ChatConversation $conversation)
    {
        $conversation->delete();
        return response()->json(['ok' => true]);
    }

    /** GET /admin/chat/stats — badges (non-lus, visiteurs en ligne), sondé par la console. */
    public function stats()
    {
        return response()->json([
            'unread' => (int) ChatMessage::where('sender', ChatMessage::SENDER_VISITOR)->whereNull('read_at')
                ->whereIn('conversation_id', ChatConversation::active()->select('id'))->count(),
            'online' => VisitorSession::online()->count(),
        ]);
    }

    public function getSettings()
    {
        return response()->json([
            'poll_interval_ms' => SiteSetting::chatPollIntervalMs(),
            'welcome_message' => SiteSetting::get(SiteSetting::KEY_CHAT_WELCOME_MESSAGE),
            // Assistant IA (voir App\Support\ChatAi) ; la clé n'est jamais renvoyée, seulement « définie ou non ».
            'ai' => ChatAi::settings(),
            'ai_default_system_prompt' => ChatAi::DEFAULT_SYSTEM_PROMPT,
            'ai_knowledge' => collect(ChatAi::knowledge())->except('text'),
        ]);
    }

    /** POST /admin/chat/ai-knowledge/refresh — relit le contenu du site (cache vidé) et renvoie son état. */
    public function aiKnowledgeRefresh()
    {
        $kb = ChatAi::knowledge(true);
        return response()->json(['knowledge' => collect($kb)->except('text'), 'preview' => mb_substr($kb['text'], 0, 1500)]);
    }

    /** POST /admin/chat/ai-test — appelle le fournisseur avec les réglages du formulaire (clé saisie ou enregistrée). */
    public function aiTest(Request $request)
    {
        $data = $request->validate([
            'base_url' => 'required|url|max:300',
            'model' => 'required|string|max:100',
            'api_key' => 'nullable|string|max:300',
            'system_prompt' => 'nullable|string|max:8000',
            'question' => 'nullable|string|max:500',
        ]);
        $key = trim((string) ($data['api_key'] ?? '')) ?: ChatAi::apiKey();
        if (!$key) {
            return response()->json(['message' => 'Aucune clé API : saisissez-la ou enregistrez-la d\'abord.'], 422);
        }
        $started = microtime(true);
        $reply = ChatAi::test($data['base_url'], $data['model'], $key, trim((string) ($data['system_prompt'] ?? '')) ?: ChatAi::DEFAULT_SYSTEM_PROMPT, trim((string) ($data['question'] ?? '')) ?: 'Bonjour, combien coûte PrintIOS ?');
        if ($reply === null) {
            return response()->json(['message' => 'Le fournisseur n\'a pas répondu (clé, modèle ou URL incorrects ? voir les logs).'], 502);
        }
        return response()->json(['reply' => $reply, 'ms' => (int) round((microtime(true) - $started) * 1000)]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'poll_interval_ms' => 'sometimes|integer|min:' . SiteSetting::MIN_CHAT_POLL_INTERVAL_MS . '|max:' . SiteSetting::MAX_CHAT_POLL_INTERVAL_MS,
            'welcome_message' => 'sometimes|nullable|string|max:500',
            'ai' => 'sometimes|array',
            'ai.enabled' => 'sometimes|boolean',
            'ai.base_url' => 'sometimes|nullable|url|max:300',
            'ai.model' => 'sometimes|nullable|string|max:100',
            'ai.api_key' => 'sometimes|nullable|string|max:300', // absent = inchangée, vide = effacée
            'ai.system_prompt' => 'sometimes|nullable|string|max:8000',
            'ai.delay_seconds' => 'sometimes|integer|min:0|max:600',
            'ai.handoff_minutes' => 'sometimes|integer|min:0|max:1440',
            'ai.use_site_knowledge' => 'sometimes|boolean',
        ]);
        if (array_key_exists('poll_interval_ms', $data)) {
            SiteSetting::set(SiteSetting::KEY_CHAT_POLL_INTERVAL_MS, (string) $data['poll_interval_ms']);
        }
        if (array_key_exists('welcome_message', $data)) {
            SiteSetting::set(SiteSetting::KEY_CHAT_WELCOME_MESSAGE, trim((string) $data['welcome_message']) ?: null);
        }
        $ai = $data['ai'] ?? null;
        if (is_array($ai)) {
            if (array_key_exists('enabled', $ai)) SiteSetting::set(ChatAi::KEY_ENABLED, $ai['enabled'] ? '1' : '0');
            if (array_key_exists('base_url', $ai)) SiteSetting::set(ChatAi::KEY_BASE_URL, rtrim(trim((string) $ai['base_url']), '/') ?: null);
            if (array_key_exists('model', $ai)) SiteSetting::set(ChatAi::KEY_MODEL, trim((string) $ai['model']) ?: null);
            if (array_key_exists('api_key', $ai)) ChatAi::storeApiKey($ai['api_key']);
            if (array_key_exists('system_prompt', $ai)) SiteSetting::set(ChatAi::KEY_SYSTEM_PROMPT, trim((string) $ai['system_prompt']) ?: null);
            if (array_key_exists('delay_seconds', $ai)) SiteSetting::set(ChatAi::KEY_DELAY_SECONDS, (string) (int) $ai['delay_seconds']);
            if (array_key_exists('handoff_minutes', $ai)) SiteSetting::set(ChatAi::KEY_HANDOFF_MINUTES, (string) (int) $ai['handoff_minutes']);
            if (array_key_exists('use_site_knowledge', $ai)) SiteSetting::set(ChatAi::KEY_USE_SITE_KNOWLEDGE, $ai['use_site_knowledge'] ? '1' : '0');
        }
        return $this->getSettings();
    }
}
