<?php

namespace App\Http\Controllers\Admin;

use App\Models\ChatConversation;
use App\Models\VisitorSession;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/** Visiteurs en ligne (console admin) et ouverture d'une conversation à l'initiative de l'équipe. */
class AdminVisitorController extends Controller
{
    /** GET /admin/visitors — visiteurs vus dans les 2 dernières minutes. */
    public function index()
    {
        $sessions = VisitorSession::online()->with('conversation:id,guest_token,guest_name')->orderByDesc('last_seen_at')->limit(200)->get();
        return response()->json($sessions->map(fn (VisitorSession $s) => $this->mapSession($s))->values());
    }

    /**
     * GET /admin/visitors/all?days=30&q=&page=1 — tous les visiteurs des N derniers jours (en ligne ou non), les
     * plus récents d'abord, avec IP, ville, pays, pages vues, appareil — demande utilisateur du 20/10/2026 « la
     * liste des visiteurs, IP et ville comme dans le chat ». Les sessions sont conservées 30 jours (VisitorController).
     */
    public function all(Request $request)
    {
        $days = max(1, min(30, (int) $request->query('days', 30)));
        $q = trim((string) $request->query('q', ''));
        $query = VisitorSession::query()->with('conversation:id,guest_token,guest_name')
            ->where('last_seen_at', '>=', now()->subDays($days))
            ->orderByDesc('last_seen_at');
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $like = '%'.$q.'%';
                $w->where('ip_address', 'like', $like)->orWhere('city', 'like', $like)->orWhere('country', 'like', $like)
                    ->orWhere('current_path', 'like', $like)->orWhere('referrer', 'like', $like)->orWhere('user_agent', 'like', $like);
            });
        }
        $page = $query->paginate(50);

        return response()->json([
            'data' => collect($page->items())->map(fn (VisitorSession $s) => $this->mapSession($s))->values(),
            'total' => $page->total(),
            'page' => $page->currentPage(),
            'last_page' => $page->lastPage(),
            'days' => $days,
        ]);
    }

    /**
     * GET /admin/visitors/stats?days=7 — statistiques de fréquentation (sessions des N derniers jours) : en ligne,
     * aujourd'hui, nouveaux, pages vues, par jour, villes, pays, pages, sources, langues.
     */
    public function stats(Request $request)
    {
        $days = max(1, min(30, (int) $request->query('days', 7)));
        $since = now()->subDays($days - 1)->startOfDay();
        $sessions = VisitorSession::query()->where('last_seen_at', '>=', $since)->get(['id', 'first_seen_at', 'last_seen_at', 'city', 'country', 'country_code', 'referrer', 'locale', 'viewed_pages', 'page_views', 'current_path', 'user_agent']);
        $todayStart = now()->startOfDay();

        $byDay = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = now()->subDays($i)->toDateString();
            $byDay[$d] = ['date' => $d, 'visitors' => 0, 'new' => 0, 'page_views' => 0];
        }
        $cities = [];
        $countries = [];
        $pages = [];
        $referrers = [];
        $locales = [];
        $devices = ['mobile' => 0, 'desktop' => 0];
        $pageViews = 0;
        foreach ($sessions as $s) {
            $last = $s->last_seen_at?->toDateString();
            $first = $s->first_seen_at?->toDateString();
            if ($last && isset($byDay[$last])) {
                $byDay[$last]['visitors']++;
                $byDay[$last]['page_views'] += (int) $s->page_views;
            }
            if ($first && isset($byDay[$first])) {
                $byDay[$first]['new']++;
            }
            $pageViews += (int) $s->page_views;
            if ($s->city) {
                $k = $s->city.'|'.($s->country ?? '');
                $cities[$k] = ($cities[$k] ?? ['city' => $s->city, 'country' => $s->country, 'country_code' => $s->country_code, 'count' => 0]);
                $cities[$k]['count']++;
            }
            if ($s->country) {
                $countries[$s->country] = ($countries[$s->country] ?? ['country' => $s->country, 'country_code' => $s->country_code, 'count' => 0]);
                $countries[$s->country]['count']++;
            }
            foreach (array_unique((array) ($s->viewed_pages ?: [$s->current_path])) as $path) {
                if (!$path) {
                    continue;
                }
                $pages[$path] = ($pages[$path] ?? 0) + 1;
            }
            $src = self::referrerSource($s->referrer);
            $referrers[$src] = ($referrers[$src] ?? 0) + 1;
            $loc = strtoupper((string) ($s->locale ?: '?'));
            $locales[$loc] = ($locales[$loc] ?? 0) + 1;
            $devices[self::isMobile($s->user_agent) ? 'mobile' : 'desktop']++;
        }
        $top = function (array $items, int $n, ?callable $map = null) {
            $list = array_values($items);
            usort($list, fn ($a, $b) => (is_array($b) ? $b['count'] : $b) <=> (is_array($a) ? $a['count'] : $a));
            $list = array_slice($list, 0, $n);
            return $map ? array_map($map, $list) : $list;
        };
        $sortedCounts = fn (array $counts, int $n, string $key) => array_slice(array_map(fn ($k, $v) => [$key => $k, 'count' => $v], array_keys($counts), $counts), 0, $n);
        arsort($pages);
        arsort($referrers);
        arsort($locales);

        return response()->json([
            'days' => $days,
            'online' => VisitorSession::online()->count(),
            'today' => [
                'visitors' => $sessions->filter(fn ($s) => $s->last_seen_at && $s->last_seen_at->gte($todayStart))->count(),
                'new' => $sessions->filter(fn ($s) => $s->first_seen_at && $s->first_seen_at->gte($todayStart))->count(),
            ],
            'period' => [
                'visitors' => $sessions->count(),
                'new' => $sessions->filter(fn ($s) => $s->first_seen_at && $s->first_seen_at->gte($since))->count(),
                'page_views' => $pageViews,
                'returning' => $sessions->filter(fn ($s) => $s->first_seen_at && $s->first_seen_at->lt($since))->count(),
            ],
            'by_day' => array_values($byDay),
            'top_cities' => $top($cities, 10),
            'top_countries' => $top($countries, 10),
            'top_pages' => $sortedCounts($pages, 10, 'path'),
            'sources' => $sortedCounts($referrers, 8, 'source'),
            'locales' => $sortedCounts($locales, 5, 'locale'),
            'devices' => $devices,
        ]);
    }

    private function mapSession(VisitorSession $s): array
    {
        return [
            'id' => $s->id,
            'display_name' => $s->conversation?->guest_name ?: $s->displayName(),
            'conversation_id' => $s->conversation?->id,
            'current_path' => $s->current_path,
            'referrer' => $s->referrer,
            'source' => self::referrerSource($s->referrer),
            'locale' => $s->locale,
            'city' => $s->city,
            'country' => $s->country,
            'country_code' => $s->country_code,
            'ip_address' => $s->ip_address,
            'geo_error' => $s->geo_error,
            'viewed_pages' => $s->viewed_pages ?? [],
            'page_views' => (int) ($s->page_views ?? 1),
            'user_agent' => $s->user_agent,
            'device' => self::deviceLabel($s->user_agent),
            'online' => $s->last_seen_at ? $s->last_seen_at->gte(now()->subMinutes(VisitorSession::ONLINE_THRESHOLD_MINUTES)) : false,
            'first_seen_at' => $s->first_seen_at,
            'last_seen_at' => $s->last_seen_at,
        ];
    }

    /** « google.com », « facebook.com », « direct »… à partir du référent (hôte sans www). */
    private static function referrerSource(?string $referrer): string
    {
        if (!$referrer) {
            return 'direct';
        }
        $host = strtolower((string) parse_url($referrer, PHP_URL_HOST));
        if ($host === '') {
            return 'direct';
        }
        $host = preg_replace('/^(www|m|l|lm)\./', '', $host);
        if (str_contains($host, 'google.')) return 'google';
        if (str_contains($host, 'facebook.') || $host === 'fb.com') return 'facebook';
        if (str_contains($host, 'instagram.')) return 'instagram';
        if (str_contains($host, 'linkedin.')) return 'linkedin';
        if (str_contains($host, 'whatsapp.')) return 'whatsapp';
        if (str_contains($host, 'bing.')) return 'bing';
        if (str_contains($host, 'tiktok.')) return 'tiktok';
        if (str_contains($host, 'youtube.')) return 'youtube';

        return $host;
    }

    private static function isMobile(?string $ua): bool
    {
        return (bool) preg_match('/Mobile|Android|iPhone|iPad/i', (string) $ua);
    }

    /** « Mobile · Chrome », « Ordinateur · Safari »… */
    private static function deviceLabel(?string $ua): string
    {
        $ua = (string) $ua;
        $browser = preg_match('/Edg\//', $ua) ? 'Edge' : (preg_match('/OPR\//', $ua) ? 'Opera' : (preg_match('/Chrome\//', $ua) ? 'Chrome' : (preg_match('/Safari\//', $ua) ? 'Safari' : (preg_match('/Firefox\//', $ua) ? 'Firefox' : ''))));
        $os = preg_match('/Android/i', $ua) ? 'Android' : (preg_match('/iPhone|iPad/i', $ua) ? 'iOS' : (preg_match('/Windows/i', $ua) ? 'Windows' : (preg_match('/Mac OS/i', $ua) ? 'macOS' : (preg_match('/Linux/i', $ua) ? 'Linux' : ''))));
        $kind = self::isMobile($ua) ? 'Mobile' : 'Ordinateur';

        return trim($kind.' · '.trim($os.' '.$browser));
    }

    /** POST /admin/visitors/{id}/start-chat — crée (ou retrouve) la conversation de ce visiteur. */
    public function startChat(VisitorSession $session)
    {
        $conversation = ChatConversation::findOrCreateForGuest($session->guest_token, $session->locale);
        return response()->json(['conversation_id' => $conversation->id]);
    }
}
