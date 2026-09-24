<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Inscription depuis le site → tenant Packspace.
 * Cycle : pending → provisioning → active | failed.
 */
class Signup extends Model
{
    protected $fillable = [
        'public_id', 'plan', 'billing', 'company', 'slug', 'admin_name', 'email', 'phone', 'admin_password',
        'status', 'tenant_id', 'provisioning_id', 'progress', 'current_step', 'steps', 'error', 'app_url',
        'welcome_sent_at', 'ip', 'accept_terms',
    ];

    protected $casts = [
        'admin_password' => 'encrypted',
        'steps' => 'array',
        'accept_terms' => 'boolean',
        'welcome_sent_at' => 'datetime',
    ];

    protected $hidden = ['admin_password'];

    protected static function booted(): void
    {
        static::creating(function (Signup $s) {
            $s->public_id = $s->public_id ?: (string) Str::uuid();
        });
    }

    public function appUrl(): string
    {
        return $this->app_url ?: config('boutique.app_scheme').'://'.$this->slug.'.'.config('boutique.app_domain');
    }

    /** Étapes vues par le site (libellés FR, clés stables). */
    public static function defaultSteps(): array
    {
        return [
            ['key' => 'database', 'label' => 'Création de la base de données', 'status' => 'pending'],
            ['key' => 'migrate', 'label' => 'Installation de la structure', 'status' => 'pending'],
            ['key' => 'seed', 'label' => 'Données de départ', 'status' => 'pending'],
            ['key' => 'admin', 'label' => 'Compte administrateur', 'status' => 'pending'],
            ['key' => 'storage', 'label' => 'Espace de stockage des fichiers', 'status' => 'pending'],
            ['key' => 'verify', 'label' => 'Vérification finale', 'status' => 'pending'],
        ];
    }
}
