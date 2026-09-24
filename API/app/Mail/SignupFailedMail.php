<?php

namespace App\Mail;

use App\Models\Signup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SignupFailedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Signup $signup)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "[Site] ÉCHEC de création d'espace : {$this->signup->company} ({$this->signup->slug})");
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.signup-failed');
    }
}
