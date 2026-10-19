<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

class PlanController extends Controller
{
    /** GET /plans — forfaits affichés (miroir de config/boutique.php) */
    public function index()
    {
        $out = [];
        // Prix éventuellement surchargés depuis la console (voir App\Support\SiteOverrides).
        foreach (\App\Support\SiteOverrides::plans() as $code => $p) {
            $out[] = ['code' => $code, 'name' => $p['name'], 'monthly' => $p['monthly'], 'yearly' => $p['yearly'], 'currency' => 'MAD'];
        }
        return response()->json(['plans' => $out, 'trial_days' => config('boutique.trial_days')]);
    }
}
