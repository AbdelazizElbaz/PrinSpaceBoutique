<?php

namespace App\Mail;

use App\Models\Signup;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Signup $signup)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Votre espace '.config('boutique.brand').' est prêt');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.welcome', with: [
            'brand' => config('boutique.brand'),
            'siteUrl' => config('boutique.site_url'),
            'appUrl' => $this->signup->appUrl(),
            'trialDays' => config('boutique.trial_days'),
        ]);
    }
}
