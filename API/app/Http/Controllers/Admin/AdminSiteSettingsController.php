<?php

namespace App\Http\Controllers\Admin;

use App\Support\SiteOverrides;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/** Paramètres du site (prix des forfaits, coordonnées) modifiables depuis la console — voir App\Support\SiteOverrides. */
class AdminSiteSettingsController extends Controller
{
    public function show()
    {
        return response()->json(['overrides' => SiteOverrides::get(), 'defaults' => ['plans' => config('boutique.plans')]]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'contact' => 'sometimes|array',
            'contact.phone' => 'nullable|string|max:40',
            'contact.whatsapp' => ['nullable', 'string', 'max:20', 'regex:/^[0-9 +\-]*$/'],
            'contact.hours' => 'nullable|string|max:120',
            'contact.email' => 'nullable|email|max:190',
            'plans' => 'sometimes|array',
            'plans.*.monthly' => 'nullable|numeric|min:0|max:100000',
            'plans.*.yearly_monthly' => 'nullable|numeric|min:0|max:100000',
            'plans.*.list_monthly' => 'nullable|numeric|min:0|max:100000',
            'plans.*.list_yearly_monthly' => 'nullable|numeric|min:0|max:100000',
            'plans.*.promo_label' => 'nullable|string|max:60',
        ]);
        $saved = SiteOverrides::set($data);
        return response()->json(['overrides' => $saved, 'defaults' => ['plans' => config('boutique.plans')]]);
    }
}
