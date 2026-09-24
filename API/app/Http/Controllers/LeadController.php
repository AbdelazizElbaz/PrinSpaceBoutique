<?php

namespace App\Http\Controllers;

use App\Mail\NewLeadMail;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class LeadController extends Controller
{
    /** POST /leads — formulaire contact / démo */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'nullable|string|in:demo,contact,business',
            'name' => 'required|string|min:2|max:120',
            'company' => 'nullable|string|max:120',
            'email' => 'required|email:rfc|max:190',
            'phone' => 'nullable|string|max:40',
            'city' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:60',
            'message' => 'nullable|string|max:4000',
            'plan' => 'nullable|string|max:30',
        ], [
            'email.email' => 'Adresse e-mail invalide.',
            'name.required' => 'Votre nom est requis.',
        ]);

        $lead = Lead::create($data + [
            'type' => $data['type'] ?? 'contact',
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        try {
            Mail::to(config('boutique.notify_email'))->queue(new NewLeadMail($lead));
        } catch (Throwable $e) {
            Log::warning('NewLeadMail', ['error' => $e->getMessage()]);
        }

        return response()->json(['ok' => true, 'id' => $lead->id], 201);
    }
}
