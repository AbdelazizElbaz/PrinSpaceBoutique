<?php

namespace App\Jobs;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Support\ChatAi;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Réponse de l'assistant IA à un message de visiteur (voir App\Support\ChatAi). Dispatché avec un délai
 * (`delay_seconds`) pour laisser l'équipe répondre d'abord ; au réveil, il s'abstient si entre-temps un humain a
 * répondu, si un autre message du visiteur est arrivé (un job plus récent s'en chargera), ou si la conversation
 * est archivée.
 */
class ChatAiReplyJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 90;
    public int $tries = 1;

    public function __construct(public int $messageId)
    {
    }

    public function handle(): void
    {
        $message = ChatMessage::find($this->messageId);
        if (!$message || $message->sender !== ChatMessage::SENDER_VISITOR || !ChatAi::enabled()) {
            return;
        }
        $conversation = ChatConversation::find($message->conversation_id);
        if (!$conversation || $conversation->archived_at) {
            return;
        }
        // Quelqu'un (humain ou IA) a déjà répondu après ce message, ou le visiteur a réécrit depuis.
        if ($conversation->messages()->where('id', '>', $message->id)->exists()) {
            return;
        }
        if (ChatAi::humanActive($conversation)) {
            return;
        }

        $conversation->forceFill(['admin_typing_at' => now()])->save();
        $text = ChatAi::reply($conversation);
        if ($text === null) {
            $conversation->forceFill(['admin_typing_at' => null])->save();
            return;
        }
        // Un humain a pu répondre pendant la génération : on ne double pas sa réponse.
        if ($conversation->messages()->where('id', '>', $message->id)->exists()) {
            $conversation->forceFill(['admin_typing_at' => null])->save();
            return;
        }
        $reply = $conversation->messages()->create(['sender' => ChatMessage::SENDER_ADMIN, 'source' => 'ai', 'body' => $text]);
        $conversation->forceFill(['last_message_at' => $reply->created_at, 'admin_typing_at' => null])->save();
    }
}
