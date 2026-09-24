<?php

namespace App\Http\Controllers;

use App\Jobs\ProvisionSignupJob;
use App\Jobs\SignupSync;
use App\Mail\NewSignupMail;
use App\Models\Signup;
use App\Services\PlatformClient;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class SignupController extends Controller
{
    /** GET /signup/check-slug?slug=… */
    public function checkSlug(Request $request, PlatformClient $platform)
    {
        $slug = Str::lower(trim((string) $request->query('slug', '')));
        if (!preg_match('/^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/', $slug)) {
            return response()->json(['available' => false, 'slug' => $slug, 'reason' => 'Lettres, chiffres et tirets uniquement, 3 à 30 caractères.']);
        }
        if (in_array($slug, config('boutique.reserved_slugs'), true)) {
            return response()->json(['available' => false, 'slug' => $slug, 'reason' => 'Ce nom est réservé.']);
        }
        if (Signup::where('slug', $slug)->whereIn('status', ['pending', 'provisioning', 'active'])->exists() || $platform->slugExists($slug)) {
            return response()->json(['available' => false, 'slug' => $slug, 'reason' => 'Ce nom est déjà utilisé, choisissez-en un autre.']);
        }
        return response()->json(['available' => true, 'slug' => $slug]);
    }

    /** POST /signup */
    public function store(Request $request, PlatformClient $platform)
    {
        $data = $request->validate([
            'plan' => ['required', 'string', 'in:'.implode(',', array_keys(config('boutique.plans')))],
            'billing' => 'nullable|string|in:monthly,yearly',
            'company' => 'required|string|min:2|max:120',
            'slug' => ['required', 'string', 'regex:/^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/'],
            'admin_name' => 'required|string|min:2|max:120',
            'email' => 'required|email:rfc|max:190',
            'phone' => 'required|string|min:8|max:40',
            'password' => 'required|string|min:8|max:100',
            'accept_terms' => 'accepted',
        ], [
            'slug.regex' => 'Adresse invalide : lettres, chiffres et tirets, 3 à 30 caractères.',
            'accept_terms.accepted' => 'Merci d\'accepter les conditions générales.',
            'email.email' => 'Adresse e-mail invalide.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        $slug = Str::lower($data['slug']);
        if (in_array($slug, config('boutique.reserved_slugs'), true)
            || Signup::where('slug', $slug)->whereIn('status', ['pending', 'provisioning', 'active'])->exists()
            || $platform->slugExists($slug)) {
            return response()->json(['message' => 'Cette adresse est déjà utilisée.', 'errors' => ['slug' => ['Cette adresse est déjà utilisée, choisissez-en une autre.']]], 422);
        }

        // Un même e-mail ne peut pas ouvrir plusieurs essais à la chaîne
        $recent = Signup::where('email', $data['email'])->where('created_at', '>', now()->subDay())->whereIn('status', ['pending', 'provisioning', 'active'])->first();
        if ($recent) {
            return response()->json(['message' => 'Un espace est déjà en cours de création avec cet e-mail.', 'errors' => ['email' => ['Un espace a déjà été créé récemment avec cet e-mail. Vérifiez votre boîte de réception ou contactez-nous.']]], 422);
        }

        $signup = Signup::create([
            'plan' => $data['plan'],
            'billing' => $data['billing'] ?? 'monthly',
            'company' => trim($data['company']),
            'slug' => $slug,
            'admin_name' => trim($data['admin_name']),
            'email' => Str::lower(trim($data['email'])),
            'phone' => trim($data['phone']),
            'admin_password' => $data['password'],
            'accept_terms' => true,
            'ip' => $request->ip(),
            'steps' => Signup::defaultSteps(),
        ]);

        ProvisionSignupJob::dispatch($signup->id);

        try {
            Mail::to(config('boutique.notify_email'))->queue(new NewSignupMail($signup));
        } catch (Throwable $e) {
            Log::warning('NewSignupMail', ['error' => $e->getMessage()]);
        }

        return response()->json(['ok' => true, 'signup_id' => $signup->public_id], 201);
    }

    /** GET /signup/{publicId}/status — polling du site (2 s) */
    public function status(string $publicId, PlatformClient $platform)
    {
        $signup = Signup::where('public_id', $publicId)->firstOrFail();

        // Rafraîchissement synchrone, limité à un appel plateforme toutes les 2 s
        if ($signup->status === 'provisioning' && $signup->updated_at->lt(now()->subSeconds(2))) {
            $signup = SignupSync::refresh($signup, $platform);
        }

        return response()->json([
            'status' => $signup->status,
            'progress' => (int) $signup->progress,
            'step' => $signup->current_step,
            'steps' => $signup->steps ?: Signup::defaultSteps(),
            'app_url' => $signup->status === 'active' ? $signup->appUrl() : null,
            'error' => $signup->status === 'failed' ? $signup->error : null,
        ]);
    }
}
