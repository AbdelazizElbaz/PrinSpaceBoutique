<?php

namespace App\Mail;

use App\Models\Signup;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Accusé de réception envoyé au prospect (FR / AR / EN selon la langue du site). */
class SignupReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Signup $signup)
    {
    }

    public function envelope(): Envelope
    {
        $brand = config('boutique.brand');
        $subject = match ($this->signup->locale) {
            'ar' => "طلبك للتجربة المجانية {$brand} تم استلامه",
            'en' => "Your {$brand} free trial request has been received",
            default => "Votre demande d'essai {$brand} est bien reçue",
        };
        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.signup-received', with: [
            'brand' => config('boutique.brand'),
            'siteUrl' => config('boutique.site_url'),
            'trialDays' => config('boutique.trial_days'),
            'lang' => $this->signup->locale ?: 'fr',
        ]);
    }
}
