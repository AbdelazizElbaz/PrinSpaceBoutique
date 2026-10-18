<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminCannedResponseController;
use App\Http\Controllers\Admin\AdminChatController;
use App\Http\Controllers\Admin\AdminVisitorController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;

// API publique du site vitrine (aucune authentification ; débit limité).
Route::get('/ping', fn () => response()->json(['ok' => true, 'app' => config('boutique.brand'), 'time' => now()->toIso8601String()]));

Route::get('/plans', [PlanController::class, 'index']);

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/leads', [LeadController::class, 'store']);
    Route::post('/signup', [SignupController::class, 'store']);
});

// Chat en direct + présence des visiteurs (voir ChatController / VisitorController). Le polling du widget
// dépasserait le limiteur « api » global (60/min/IP) : limiteur « chat » dédié, par jeton visiteur.
Route::withoutMiddleware('throttle:api')->middleware('throttle:chat')->group(function () {
    Route::get('/chat/settings', [ChatController::class, 'settings']);
    Route::get('/chat/messages', [ChatController::class, 'index']);
    Route::post('/chat/messages', [ChatController::class, 'store']);
    Route::post('/chat/guest-info', [ChatController::class, 'updateGuestInfo']);
    Route::post('/chat/typing', [ChatController::class, 'typing']);
    Route::post('/visitors/heartbeat', [VisitorController::class, 'heartbeat']);
    Route::post('/visitors/offline', [VisitorController::class, 'offline']);
});

// Console admin du site (page /admin/messages) : mot de passe unique → jeton Bearer (voir AdminAuthController).
Route::prefix('admin')->withoutMiddleware('throttle:api')->group(function () {
    Route::post('/auth/login', [AdminAuthController::class, 'login'])->middleware('throttle:admin-login');

    Route::middleware(['admin.auth', 'throttle:admin'])->group(function () {
        Route::get('/auth/me', [AdminAuthController::class, 'me']);
        Route::post('/auth/logout', [AdminAuthController::class, 'logout']);

        Route::get('/chat/stats', [AdminChatController::class, 'stats']);
        Route::get('/chat/settings', [AdminChatController::class, 'getSettings']);
        Route::post('/chat/settings', [AdminChatController::class, 'updateSettings']);
        Route::get('/chat/conversations', [AdminChatController::class, 'index']);
        Route::get('/chat/conversations/{conversation}', [AdminChatController::class, 'show'])->whereNumber('conversation');
        Route::delete('/chat/conversations/{conversation}', [AdminChatController::class, 'destroy'])->whereNumber('conversation');
        Route::post('/chat/conversations/{conversation}/messages', [AdminChatController::class, 'store'])->whereNumber('conversation');
        Route::post('/chat/conversations/{conversation}/typing', [AdminChatController::class, 'typing'])->whereNumber('conversation');
        Route::post('/chat/conversations/{conversation}/archive', [AdminChatController::class, 'archive'])->whereNumber('conversation');
        Route::post('/chat/conversations/{conversation}/unarchive', [AdminChatController::class, 'unarchive'])->whereNumber('conversation');

        Route::get('/visitors', [AdminVisitorController::class, 'index']);
        Route::post('/visitors/{session}/start-chat', [AdminVisitorController::class, 'startChat'])->whereNumber('session');

        Route::get('/canned-responses', [AdminCannedResponseController::class, 'index']);
        Route::post('/canned-responses', [AdminCannedResponseController::class, 'store']);
        Route::put('/canned-responses/{cannedResponse}', [AdminCannedResponseController::class, 'update'])->whereNumber('cannedResponse');
        Route::delete('/canned-responses/{cannedResponse}', [AdminCannedResponseController::class, 'destroy'])->whereNumber('cannedResponse');
    });
});
