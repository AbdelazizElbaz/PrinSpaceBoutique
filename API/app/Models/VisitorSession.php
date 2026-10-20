<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/** Présence d'un visiteur du site (une ligne par jeton), alimentée par le heartbeat du navigateur. */
class VisitorSession extends Model
{
    /** Sans heartbeat (toutes les 20 s côté navigateur) depuis ce délai, le visiteur est considéré parti. */
    public const ONLINE_THRESHOLD_MINUTES = 2;

    protected $fillable = [
        'guest_token', 'current_path', 'referrer', 'locale', 'user_agent', 'ip_address', 'xff_header',
        'city', 'country', 'country_code', 'geo_error', 'viewed_pages', 'page_views', 'first_seen_at', 'last_seen_at',
    ];

    protected $casts = ['viewed_pages' => 'array', 'first_seen_at' => 'datetime', 'last_seen_at' => 'datetime'];

    public function conversation(): HasOne
    {
        return $this->hasOne(ChatConversation::class, 'guest_token', 'guest_token');
    }

    public function scopeOnline(Builder $query): Builder
    {
        return $query->where('last_seen_at', '>=', now()->subMinutes(self::ONLINE_THRESHOLD_MINUTES));
    }

    public function isOnline(): bool
    {
        return $this->last_seen_at && $this->last_seen_at->gte(now()->subMinutes(self::ONLINE_THRESHOLD_MINUTES));
    }

    public function displayName(): string
    {
        return "Visiteur #{$this->id}";
    }
}
