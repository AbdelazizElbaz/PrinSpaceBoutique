<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** Jeton Bearer de la console admin du site (voir Admin\AdminAuthController, middleware AuthenticateAdmin). */
class AdminToken extends Model
{
    public const TTL_DAYS = 30;

    protected $fillable = ['token', 'label', 'last_ip', 'last_used_at', 'expires_at'];

    protected $casts = ['last_used_at' => 'datetime', 'expires_at' => 'datetime'];

    /** Crée un jeton et renvoie [modèle, jeton en clair] — le clair n'est jamais stocké. */
    public static function issue(?string $label, ?string $ip): array
    {
        $plain = Str::random(48);
        $model = static::create([
            'token' => hash('sha256', $plain),
            'label' => $label,
            'last_ip' => $ip,
            'last_used_at' => now(),
            'expires_at' => now()->addDays(self::TTL_DAYS),
        ]);
        return [$model, $plain];
    }

    public static function findValid(?string $plain): ?self
    {
        if (!$plain) {
            return null;
        }
        return static::where('token', hash('sha256', $plain))
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->first();
    }
}
