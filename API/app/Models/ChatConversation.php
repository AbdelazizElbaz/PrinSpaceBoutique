<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/** Fil de discussion d'un visiteur avec l'équipe PrintIOS. */
class ChatConversation extends Model
{
    public const TYPING_THRESHOLD_SECONDS = 5;

    protected $fillable = [
        'guest_token', 'guest_name', 'guest_phone', 'locale', 'city', 'country', 'ip_address',
        'last_message_at', 'visitor_typing_at', 'admin_typing_at', 'archived_at', 'notified_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime', 'visitor_typing_at' => 'datetime', 'admin_typing_at' => 'datetime',
        'archived_at' => 'datetime', 'notified_at' => 'datetime',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'conversation_id')->orderBy('id');
    }

    public function session(): HasOne
    {
        return $this->hasOne(VisitorSession::class, 'guest_token', 'guest_token');
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->whereNull('archived_at');
    }

    public function scopeArchived(Builder $q): Builder
    {
        return $q->whereNotNull('archived_at');
    }

    public function isVisitorTyping(): bool
    {
        return $this->visitor_typing_at && $this->visitor_typing_at->gt(now()->subSeconds(self::TYPING_THRESHOLD_SECONDS));
    }

    public function isAdminTyping(): bool
    {
        return $this->admin_typing_at && $this->admin_typing_at->gt(now()->subSeconds(self::TYPING_THRESHOLD_SECONDS));
    }

    public function displayName(): string
    {
        return trim((string) $this->guest_name) !== '' ? $this->guest_name : "Visiteur #{$this->id}";
    }

    /** Conversation d'un visiteur, créée au besoin avec l'instantané géo/IP de sa session de présence. */
    public static function findOrCreateForGuest(string $guestToken, ?string $locale = null): self
    {
        $existing = static::where('guest_token', $guestToken)->first();
        if ($existing) {
            return $existing;
        }
        $session = VisitorSession::where('guest_token', $guestToken)->first();
        return static::create([
            'guest_token' => $guestToken,
            'locale' => $locale ?: $session?->locale,
            'city' => $session?->city,
            'country' => $session?->country,
            'ip_address' => $session?->ip_address,
        ]);
    }
}
