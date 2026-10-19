<?php

namespace App\Support;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Assistant IA du chat du site — demande utilisateur du 19/10/2026 : « pouvoir brancher le chat avec un agent
 * IA, exemple DeepSeek ». Tout fournisseur compatible avec l'API « Chat Completions » d'OpenAI (DeepSeek,
 * OpenAI, Mistral, Groq, Ollama…) : URL de base + modèle + clé, réglés dans la console (/admin/messages →
 * Réglages). La clé est chiffrée en base (Crypt, APP_KEY).
 *
 * Fonctionnement : à chaque message d'un visiteur, un job en file d'attente (ChatAiReplyJob) attend
 * `delay_seconds`, puis répond SI personne de l'équipe n'a répondu entre-temps et si aucun humain n'est intervenu
 * dans la conversation depuis `handoff_minutes` (l'IA s'efface dès qu'un conseiller prend la main). Les réponses
 * sont enregistrées comme messages de l'équipe avec `source = ai` (étiquette « Assistant » côté visiteur, « IA »
 * dans la console).
 */
class ChatAi
{
    public const KEY_ENABLED = 'chat_ai_enabled';
    public const KEY_BASE_URL = 'chat_ai_base_url';
    public const KEY_MODEL = 'chat_ai_model';
    public const KEY_API_KEY = 'chat_ai_api_key';          // chiffrée
    public const KEY_SYSTEM_PROMPT = 'chat_ai_system_prompt';
    public const KEY_DELAY_SECONDS = 'chat_ai_delay_seconds';
    public const KEY_HANDOFF_MINUTES = 'chat_ai_handoff_minutes';
    public const KEY_USE_SITE_KNOWLEDGE = 'chat_ai_use_site_knowledge'; // '0' pour désactiver (actif par défaut)
    public const KNOWLEDGE_CACHE_KEY = 'chat_ai_knowledge_v1';
    public const KNOWLEDGE_TTL_SECONDS = 86400;
    public const KNOWLEDGE_MAX_CHARS = 40000; // ~12 000 tokens : le contenu complet du site (~28 000 caractères) tient sans troncature

    public const DEFAULT_BASE_URL = 'https://api.deepseek.com';
    public const DEFAULT_MODEL = 'deepseek-chat';
    public const DEFAULT_DELAY_SECONDS = 20;
    public const DEFAULT_HANDOFF_MINUTES = 30;
    public const MAX_HISTORY = 20;

    public const DEFAULT_SYSTEM_PROMPT = <<<'TXT'
Tu es l'assistant commercial de PrintIOS, un logiciel de gestion pour les imprimeries au Maroc (site printios.ma). Tu discutes avec un visiteur du site dans le chat.

Ce que fait PrintIOS : un seul dossier de commande du devis à l'encaissement — commandes et devis, fichiers d'impression envoyés automatiquement sur les machines de l'atelier (agent PrintiosSync), suivi de production, livraison multi-transporteurs intégrée nativement (Ameex, Olivraison, Ozone Express, Sendit) et livreurs internes, contre-remboursement (COD) rapproché automatiquement, clients et fidélité, boutique en ligne, tableau de bord. Hébergé et sécurisé, données isolées par client, support en français et en arabe.

Tarifs (HT par mois, facturés au Maroc) : Starter 290 DH, Pro 590 DH, Business 990 DH. Essai gratuit 7 jours, sans carte bancaire, espace remis en quelques minutes. Démo en ligne sans inscription : https://sendbox01.printios.ma/demo. Contact et WhatsApp : +212 661-327865.

Règles : réponds dans la langue du visiteur (français, arabe ou anglais), de façon courte et concrète (3 à 5 phrases maximum), sans inventer de fonctionnalité ni de prix. Si tu ne sais pas, dis-le et propose qu'un conseiller prenne le relais. Propose l'essai gratuit ou la démo quand c'est pertinent. Si le visiteur veut être rappelé ou pose une question commerciale précise (remise, contrat, intégration spécifique), invite-le à laisser son nom et son téléphone dans le chat : un conseiller le contactera. Ne demande jamais de mot de passe ni de données bancaires.
TXT;

    /** @return array{enabled:bool,base_url:string,model:string,api_key_set:bool,system_prompt:string,delay_seconds:int,handoff_minutes:int} */
    public static function settings(): array
    {
        return [
            'enabled' => SiteSetting::get(self::KEY_ENABLED) === '1',
            'base_url' => rtrim((string) (SiteSetting::get(self::KEY_BASE_URL) ?: self::DEFAULT_BASE_URL), '/'),
            'model' => (string) (SiteSetting::get(self::KEY_MODEL) ?: self::DEFAULT_MODEL),
            'api_key_set' => self::apiKey() !== null,
            'system_prompt' => (string) (SiteSetting::get(self::KEY_SYSTEM_PROMPT) ?: self::DEFAULT_SYSTEM_PROMPT),
            'delay_seconds' => max(0, min(600, (int) (SiteSetting::get(self::KEY_DELAY_SECONDS) ?? self::DEFAULT_DELAY_SECONDS))),
            'handoff_minutes' => max(0, min(1440, (int) (SiteSetting::get(self::KEY_HANDOFF_MINUTES) ?? self::DEFAULT_HANDOFF_MINUTES))),
            'use_site_knowledge' => SiteSetting::get(self::KEY_USE_SITE_KNOWLEDGE) !== '0',
        ];
    }

    public static function enabled(): bool
    {
        return SiteSetting::get(self::KEY_ENABLED) === '1' && self::apiKey() !== null;
    }

    public static function apiKey(): ?string
    {
        $stored = SiteSetting::get(self::KEY_API_KEY);
        if (!$stored) {
            return null;
        }
        try {
            $plain = Crypt::decryptString($stored);
            return $plain !== '' ? $plain : null;
        } catch (\Throwable) {
            return null;
        }
    }

    public static function storeApiKey(?string $plain): void
    {
        $plain = trim((string) $plain);
        SiteSetting::set(self::KEY_API_KEY, $plain === '' ? null : Crypt::encryptString($plain));
    }

    /** Vrai si un conseiller humain a écrit dans ce fil depuis `handoff_minutes` (l'IA s'efface alors). */
    public static function humanActive(ChatConversation $conversation, ?int $minutes = null): bool
    {
        $minutes ??= self::settings()['handoff_minutes'];
        if ($minutes <= 0) {
            return false;
        }
        return $conversation->messages()
            ->where('sender', ChatMessage::SENDER_ADMIN)->where('source', 'human')
            ->where('created_at', '>=', now()->subMinutes($minutes))
            ->exists();
    }

    /**
     * Réponse de l'assistant au fil donné (historique récent + message courant). Null si non configuré, si le
     * fournisseur échoue ou renvoie du vide — jamais d'exception vers l'appelant.
     */
    public static function reply(ChatConversation $conversation): ?string
    {
        $key = self::apiKey();
        if ($key === null) {
            return null;
        }
        $s = self::settings();
        $history = $conversation->messages()->orderByDesc('id')->limit(self::MAX_HISTORY)->get()->reverse();
        $messages = [['role' => 'system', 'content' => self::systemPrompt($conversation, $s['system_prompt'])]];
        foreach ($history as $m) {
            $messages[] = ['role' => $m->sender === ChatMessage::SENDER_VISITOR ? 'user' : 'assistant', 'content' => mb_substr((string) $m->body, 0, 4000)];
        }
        if (($messages[count($messages) - 1]['role'] ?? null) !== 'user') {
            return null; // rien à répondre
        }
        return self::complete($s['base_url'], $s['model'], $key, $messages);
    }

    /** Appel direct (bouton « Tester » de la console) avec les réglages fournis, avant enregistrement. */
    public static function test(string $baseUrl, string $model, string $apiKey, string $systemPrompt, string $question): ?string
    {
        return self::complete(rtrim($baseUrl, '/'), $model, $apiKey, [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $question],
        ]);
    }

    /**
     * Contenu public du site (fonctionnalités, tarifs, FAQ, formation, PrintiosSync, coordonnées) exporté par le site
     * lui-même (/ai-knowledge.json, voir UI src/app/ai-knowledge.json/route.ts), aplati en texte et mis en cache 24 h.
     * @return array{text:string,chars:int,sections:int,fetched_at:?string,source:?string,error:?string}
     */
    public static function knowledge(bool $refresh = false): array
    {
        if ($refresh) {
            Cache::forget(self::KNOWLEDGE_CACHE_KEY);
        }
        return Cache::remember(self::KNOWLEDGE_CACHE_KEY, self::KNOWLEDGE_TTL_SECONDS, function () {
            $candidates = array_values(array_unique(array_filter([
                rtrim((string) config('boutique.site_internal_url'), '/'),
                rtrim((string) config('boutique.site_url'), '/'),
            ])));
            $lastError = null;
            foreach ($candidates as $baseUrl) {
                try {
                    $response = Http::timeout(10)->acceptJson()->get($baseUrl . '/ai-knowledge.json');
                    if (!$response->ok()) {
                        $lastError = "HTTP {$response->status()} sur {$baseUrl}";
                        continue;
                    }
                    $sections = $response->json('sections');
                    if (!is_array($sections) || !$sections) {
                        $lastError = "Réponse sans sections sur {$baseUrl}";
                        continue;
                    }
                    $text = '';
                    foreach ($sections as $sec) {
                        $title = trim((string) ($sec['title'] ?? ''));
                        $body = trim((string) ($sec['text'] ?? ''));
                        if ($body === '') {
                            continue;
                        }
                        $text .= "## {$title}\n{$body}\n\n";
                    }
                    $text = mb_substr(trim($text), 0, self::KNOWLEDGE_MAX_CHARS);
                    return ['text' => $text, 'chars' => mb_strlen($text), 'sections' => count($sections), 'fetched_at' => now()->toIso8601String(), 'source' => $baseUrl, 'error' => null];
                } catch (\Throwable $e) {
                    $lastError = $e->getMessage();
                }
            }
            Log::warning('ChatAi: base de connaissances du site indisponible', ['error' => $lastError]);
            return ['text' => '', 'chars' => 0, 'sections' => 0, 'fetched_at' => now()->toIso8601String(), 'source' => null, 'error' => $lastError];
        });
    }

    private static function systemPrompt(ChatConversation $conversation, string $base): string
    {
        if (self::settings()['use_site_knowledge']) {
            $kb = self::knowledge();
            if ($kb['text'] !== '') {
                $base .= "\n\nBase de connaissances (contenu officiel du site, source de vérité pour les fonctionnalités, tarifs et réponses aux questions fréquentes ; ne rien affirmer qui la contredise) :\n" . $kb['text'];
            }
        }
        $ctx = [];
        if ($conversation->locale) {
            $ctx[] = 'Langue de navigation du visiteur : ' . strtoupper($conversation->locale) . '.';
        }
        if ($conversation->city || $conversation->country) {
            $ctx[] = 'Localisation estimée : ' . trim(($conversation->city ?: '') . ', ' . ($conversation->country ?: ''), ', ') . '.';
        }
        if ($conversation->guest_name) {
            $ctx[] = 'Le visiteur se présente comme : ' . $conversation->guest_name . '.';
        }
        return $base . ($ctx ? "\n\nContexte : " . implode(' ', $ctx) : '');
    }

    private static function complete(string $baseUrl, string $model, string $apiKey, array $messages): ?string
    {
        try {
            $response = Http::withToken($apiKey)->timeout(45)->acceptJson()
                ->post($baseUrl . '/chat/completions', [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.4,
                    'max_tokens' => 400,
                    'stream' => false,
                ]);
            if (!$response->ok()) {
                Log::warning('ChatAi: réponse fournisseur non OK', ['status' => $response->status(), 'body' => mb_substr($response->body(), 0, 500)]);
                return null;
            }
            $text = trim((string) data_get($response->json(), 'choices.0.message.content', ''));
            return $text !== '' ? mb_substr($text, 0, 2000) : null;
        } catch (\Throwable $e) {
            Log::warning('ChatAi: appel fournisseur échoué', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
