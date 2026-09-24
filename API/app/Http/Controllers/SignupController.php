<?php

namespace App\Http\Controllers;

use App\Mail\NewSignupMail;
use App\Mail\SignupReceivedMail;
use App\Models\Signup;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

/**
 * Demande d'essai gratuit depuis le site. PAS de création automatique
 * d'espace : la demande est enregistrée, l'équipe est notifiée par e-mail
 * et crée le client dans Packspace à la main, puis lui envoie ses accès.
 */
class SignupController extends Controller
{
    /** POST /signup */
    public function store(Request $request)
    {
        $data = $request->validate([
            'plan' => ['required', 'string', 'in:'.implode(',', array_keys(config('boutique.plans')))],
            'billing' => 'nullable|string|in:monthly,yearly',
            'company' => 'required|string|min:2|max:120',
            'admin_name' => 'required|string|min:2|max:120',
            'email' => 'required|email:rfc|max:190',
            'phone' => 'required|string|min:8|max:40',
            'city' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:2000',
            'locale' => 'nullable|string|in:fr,ar,en',
            'accept_terms' => 'accepted',
        ], [
            'accept_terms.accepted' => 'Merci d\'accepter les conditions générales.',
            'email.email' => 'Adresse e-mail invalide.',
        ]);

        // Anti-doublon : une demande par e-mail et par 24 h
        $recent = Signup::where('email', Str::lower($data['email']))->where('created_at', '>', now()->subDay())->first();
        if ($recent) {
            return response()->json(['message' => 'Une demande a déjà été envoyée avec cet e-mail.', 'errors' => ['email' => ['Une demande a déjà été envoyée récemment avec cet e-mail. Nous vous recontactons très vite.']]], 422);
        }

        $signup = Signup::create([
            'plan' => $data['plan'],
            'billing' => $data['billing'] ?? 'monthly',
            'company' => trim($data['company']),
            'admin_name' => trim($data['admin_name']),
            'email' => Str::lower(trim($data['email'])),
            'phone' => trim($data['phone']),
            'city' => isset($data['city']) ? trim($data['city']) : null,
            'message' => isset($data['message']) ? trim($data['message']) : null,
            'locale' => $data['locale'] ?? 'fr',
            'accept_terms' => true,
            'ip' => $request->ip(),
            'status' => 'new',
        ]);

        try {
            Mail::to(config('boutique.notify_email'))->queue(new NewSignupMail($signup));
            Mail::to($signup->email)->queue(new SignupReceivedMail($signup));
        } catch (Throwable $e) {
            Log::warning('Signup mails', ['error' => $e->getMessage()]);
        }

        return response()->json(['ok' => true, 'signup_id' => $signup->public_id], 201);
    }
}
