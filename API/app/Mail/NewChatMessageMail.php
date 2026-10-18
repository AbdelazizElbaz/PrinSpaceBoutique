<?php

namespace App\Mail;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Un visiteur a écrit dans le chat du site et personne n'a répondu récemment (voir ChatController::notifyTeam). */
class NewChatMessageMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ChatConversation $conversation, public ChatMessage $message)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "[Site] Nouveau message chat — {$this->conversation->displayName()}");
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.new-chat-message', with: [
            'adminUrl' => rtrim((string) config('boutique.site_url'), '/') . '/admin/messages?conversation=' . $this->conversation->id,
        ]);
    }
}
