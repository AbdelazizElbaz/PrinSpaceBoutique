<?php

namespace App\Http\Controllers\Admin;

use App\Models\AdminToken;
use App\Support\VisitorGeo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

/**
 * Connexion à la console admin du site (page /admin/messages) : un seul mot de passe, ADMIN_PASSWORD
 * (secret GitHub → variable du conteneur, lu via config('boutique.admin_password')). En échange, un jeton
 * Bearer (admin_tokens) valable 30 jours, conservé par le navigateur. Route limitée à 5 essais/min par IP.
 */
class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate(['password' => 'required|string|max:200', 'label' => 'nullable|string|max:100']);
        $expected = (string) config('boutique.admin_password', '');
        if ($expected === '' || !hash_equals($expected, $data['password'])) {
            throw ValidationException::withMessages(['password' => $expected === '' ? 'Console admin non configurée (ADMIN_PASSWORD absent).' : 'Mot de passe incorrect.']);
        }
        [$model, $plain] = AdminToken::issue($data['label'] ?? substr((string) $request->userAgent(), 0, 100), VisitorGeo::clientIp($request));
        return response()->json(['token' => $plain, 'expires_at' => $model->expires_at]);
    }

    public function me(Request $request)
    {
        $token = $request->attributes->get('admin_token');
        return response()->json(['ok' => true, 'label' => $token?->label, 'expires_at' => $token?->expires_at]);
    }

    public function logout(Request $request)
    {
        $request->attributes->get('admin_token')?->delete();
        return response()->json(['ok' => true]);
    }
}
