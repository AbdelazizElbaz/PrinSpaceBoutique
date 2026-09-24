<?php

namespace App\Mail;

use App\Models\Signup;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewSignupMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Signup $signup)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "[Site] Demande d'essai : {$this->signup->company} ({$this->signup->plan})", replyTo: [$this->signup->email]);
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.new-signup');
    }
}
