<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SignupController;
use Illuminate\Support\Facades\Route;

// API publique du site vitrine (aucune authentification ; débit limité).
Route::get('/ping', fn () => response()->json(['ok' => true, 'app' => config('boutique.brand'), 'time' => now()->toIso8601String()]));

Route::get('/plans', [PlanController::class, 'index']);

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/leads', [LeadController::class, 'store']);
    Route::post('/signup', [SignupController::class, 'store']);
});
