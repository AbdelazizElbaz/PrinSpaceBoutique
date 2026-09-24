<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Client vers l'API plateforme Packspace (API2, branche MultiTanant) :
 *   POST /platform/tenants                          → création + déploiement auto
 *   GET  /platform/tenants/{id}/provisioning        → progression
 *   POST /platform/tenants/{id}/subscription        → souscription (essai)
 *   GET  /platform/plans                            → forfaits
 *   GET  /platform/tenants                          → vérification de slug
 * Auth : en-tête X-Platform-Token (PLATFORM_ADMIN_TOKEN côté Packspace, ou
 * jeton d'un super-admin créé avec `platform:admin:create`).
 */
class PlatformClient
{
    protected function http(): PendingRequest
    {
        $cfg = config('boutique.platform');
        if (empty($cfg['token'])) {
            throw new RuntimeException('PLATFORM_API_TOKEN manquant : impossible de contacter la plateforme.');
        }
        return Http::baseUrl($cfg['url'])
            ->acceptJson()
            ->withHeaders(['X-Platform-Token' => $cfg['token']])
            ->timeout($cfg['timeout'])
            ->retry(2, 500, throw: false);
    }

    /** @return array<int, array{id:int, code:string, name:string, price:float, period:string, trial_days:int}> */
    public function plans(): array
    {
        return Cache::remember('platform.plans', 300, function () {
            $res = $this->http()->get('/platform/plans');
            $res->throw();
            $data = $res->json();
            return is_array($data) ? (array_is_list($data) ? $data : ($data['plans'] ?? $data['data'] ?? [])) : [];
        });
    }

    public function findPlanByCode(string $code): ?array
    {
        foreach ($this->plans() as $p) {
            if (($p['code'] ?? null) === $code) {
                return $p;
            }
        }
        return null;
    }

    /** Slug déjà pris côté plateforme ? (liste mise en cache 30 s) */
    public function slugExists(string $slug): bool
    {
        $tenants = Cache::remember('platform.tenants', 30, function () {
            $res = $this->http()->get('/platform/tenants');
            if (!$res->successful()) {
                return null;
            }
            $data = $res->json();
            return is_array($data) ? (array_is_list($data) ? $data : ($data['tenants'] ?? $data['data'] ?? [])) : [];
        });
        if ($tenants === null) {
            return false; // plateforme injoignable : on laisse passer, la création tranchera
        }
        foreach ($tenants as $t) {
            if (($t['slug'] ?? null) === $slug) {
                return true;
            }
        }
        return false;
    }

    /**
     * Crée le tenant et lance le déploiement automatique.
     * @return array{tenant: array, provisioning: array|null}
     */
    public function createTenant(array $payload): array
    {
        $res = $this->http()->post('/platform/tenants', $payload);
        if ($res->status() === 422) {
            $errors = $res->json('errors') ?? [];
            $first = $errors ? (array_values($errors)[0][0] ?? null) : null;
            throw new PlatformValidationException($first ?: ($res->json('message') ?: 'Données refusées par la plateforme.'), $errors);
        }
        $res->throw();
        Cache::forget('platform.tenants');
        return $res->json();
    }

    public function provisioning(int $tenantId): array
    {
        $res = $this->http()->get("/platform/tenants/{$tenantId}/provisioning");
        $res->throw();
        return $res->json();
    }

    public function subscribe(int $tenantId, int $planId, int $trialDays, ?string $notes = null): array
    {
        $res = $this->http()->post("/platform/tenants/{$tenantId}/subscription", array_filter([
            'plan_id' => $planId,
            'trial_days' => $trialDays,
            'notes' => $notes,
        ], fn ($v) => $v !== null));
        $res->throw();
        return $res->json();
    }

    public function ping(): bool
    {
        try {
            return $this->http()->get('/platform/plans')->successful();
        } catch (RequestException) {
            return false;
        }
    }
}
