<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/** Réglages clé/valeur du site (chat). Lecture mise en cache 60 s, invalidée à l'écriture. */
class SiteSetting extends Model
{
    public const KEY_CHAT_POLL_INTERVAL_MS = 'chat_poll_interval_ms';
    public const KEY_CHAT_WELCOME_MESSAGE = 'chat_welcome_message';
    public const DEFAULT_CHAT_POLL_INTERVAL_MS = 2000;
    public const MIN_CHAT_POLL_INTERVAL_MS = 1000;
    public const MAX_CHAT_POLL_INTERVAL_MS = 60000;

    protected $fillable = ['key', 'value'];

    public static function get(string $key, ?string $default = null): ?string
    {
        $value = Cache::remember("site_setting:{$key}", 60, fn () => static::where('key', $key)->value('value') ?? '__null__');
        return $value === '__null__' ? $default : $value;
    }

    public static function set(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("site_setting:{$key}");
    }

    public static function chatPollIntervalMs(): int
    {
        $v = (int) static::get(self::KEY_CHAT_POLL_INTERVAL_MS, (string) self::DEFAULT_CHAT_POLL_INTERVAL_MS);
        return max(self::MIN_CHAT_POLL_INTERVAL_MS, min(self::MAX_CHAT_POLL_INTERVAL_MS, $v ?: self::DEFAULT_CHAT_POLL_INTERVAL_MS));
    }
}
