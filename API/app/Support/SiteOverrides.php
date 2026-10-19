<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

/**
 * Réglages du site modifiables depuis la console admin (/admin/messages → « Paramètres du site ») — demande
 * utilisateur du 19/10/2026 : « changer les prix et les contacts téléphone via la page administration ».
 *
 * Stockés en JSON dans site_settings (clé site_overrides) et servis par GET /site-settings ; le site Next.js les
 * relit à chaque régénération de page (ISR, 60 s) et les applique par-dessus ses valeurs par défaut
 * (UI src/lib/siteSettings.ts). Seules les valeurs renseignées sont renvoyées : une valeur vide = valeur par
 * défaut du code.
 */
class SiteOverrides
{
    public const KEY = 'site_overrides';
    public const CACHE_KEY = 'site_overrides_v1';
    public const PLAN_CODES = ['starter', 'pro', 'business'];
    public const PLAN_FIELDS = ['monthly', 'yearly_monthly', 'list_monthly', 'list_yearly_monthly', 'promo_label'];
    public const CONTACT_FIELDS = ['phone', 'whatsapp', 'hours', 'email'];

    /** @return array{contact:array<string,string>,plans:array<string,array<string,mixed>>,updated_at:?string} */
    public static function get(): array
    {
        return Cache::remember(self::CACHE_KEY, 60, function () {
            $raw = json_decode((string) SiteSetting::get(self::KEY, ''), true);
            return self::normalize(is_array($raw) ? $raw : []);
        });
    }

    public static function set(array $data): array
    {
        $clean = self::normalize($data);
        $clean['updated_at'] = now()->toIso8601String();
        SiteSetting::set(self::KEY, json_encode($clean, JSON_UNESCAPED_UNICODE));
        Cache::forget(self::CACHE_KEY);
        return $clean;
    }

    /** Forfaits de config/boutique.php avec les prix surchargés (PlanController, validation d'inscription). */
    public static function plans(): array
    {
        $plans = config('boutique.plans', []);
        foreach (self::get()['plans'] as $code => $o) {
            if (!isset($plans[$code])) {
                continue;
            }
            if (isset($o['monthly'])) {
                $plans[$code]['monthly'] = $o['monthly'];
            }
            if (isset($o['yearly_monthly'])) {
                $plans[$code]['yearly'] = $o['yearly_monthly'];
            }
        }
        return $plans;
    }

    /** « +212 661-327865 » / « 0661 32 78 65 » / « 00212… » → « 212661327865 » (format wa.me, indicatif Maroc par défaut). */
    public static function whatsappFromPhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';
        if (str_starts_with($digits, '00')) {
            return substr($digits, 2);
        }
        if (str_starts_with($digits, '0')) {
            return '212'.substr($digits, 1);
        }

        return $digits;
    }

    /** Ne garde que les champs connus, les nombres valides et les chaînes non vides. */
    private static function normalize(array $data): array
    {
        $contact = [];
        foreach (self::CONTACT_FIELDS as $f) {
            $v = trim((string) ($data['contact'][$f] ?? ''));
            if ($v !== '') {
                $contact[$f] = $f === 'whatsapp' ? preg_replace('/\D+/', '', $v) : $v;
            }
        }
        // WhatsApp vide = même numéro que le téléphone (demande utilisateur du 19/10/2026 : « modifier partout le
        // téléphone de contact, inclut WhatsApp ») : un seul champ suffit pour changer les deux.
        if (empty($contact['whatsapp']) && !empty($contact['phone'])) {
            $wa = self::whatsappFromPhone($contact['phone']);
            if ($wa !== '') {
                $contact['whatsapp'] = $wa;
            }
        }
        $plans = [];
        foreach (self::PLAN_CODES as $code) {
            $p = is_array($data['plans'][$code] ?? null) ? $data['plans'][$code] : [];
            $out = [];
            foreach (self::PLAN_FIELDS as $f) {
                if (!array_key_exists($f, $p) || $p[$f] === null || $p[$f] === '') {
                    continue;
                }
                if ($f === 'promo_label') {
                    $out[$f] = mb_substr(trim((string) $p[$f]), 0, 60);
                } elseif (is_numeric($p[$f]) && (float) $p[$f] >= 0) {
                    $out[$f] = (int) round((float) $p[$f]);
                }
            }
            if ($out) {
                $plans[$code] = $out;
            }
        }
        return ['contact' => $contact, 'plans' => $plans, 'updated_at' => $data['updated_at'] ?? null];
    }
}
