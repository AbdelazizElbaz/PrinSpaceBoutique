<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewLeadMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Lead $lead)
    {
    }

    public function envelope(): Envelope
    {
        $label = ['demo' => 'Demande de démo', 'business' => 'Demande Business', 'contact' => 'Contact'][$this->lead->type] ?? 'Contact';
        return new Envelope(subject: "[Site] {$label} — {$this->lead->name}".($this->lead->company ? " ({$this->lead->company})" : ''), replyTo: [$this->lead->email]);
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.new-lead');
    }
}
