<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Demande d'essai gratuit (forfait + coordonnées), traitée à la main :
 * statut new → contacted → activated | lost.
 */
class Signup extends Model
{
    protected $fillable = [
        'public_id', 'plan', 'billing', 'company', 'admin_name', 'email', 'phone', 'city', 'message', 'locale',
        'status', 'ip', 'accept_terms', 'notes',
    ];

    protected $casts = ['accept_terms' => 'boolean'];

    protected static function booted(): void
    {
        static::creating(function (Signup $s) {
            $s->public_id = $s->public_id ?: (string) Str::uuid();
        });
    }
}
