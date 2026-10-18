<?php

namespace App\Http\Controllers\Admin;

use App\Models\ChatCannedResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/** Réponses prédéfinies de la console admin (/admin/canned-responses). */
class AdminCannedResponseController extends Controller
{
    public function index()
    {
        return response()->json(ChatCannedResponse::orderBy('title')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string|max:100', 'body' => 'required|string|max:2000']);
        return response()->json(ChatCannedResponse::create($data), 201);
    }

    public function update(Request $request, ChatCannedResponse $cannedResponse)
    {
        $data = $request->validate(['title' => 'required|string|max:100', 'body' => 'required|string|max:2000']);
        $cannedResponse->update($data);
        return response()->json($cannedResponse);
    }

    public function destroy(ChatCannedResponse $cannedResponse)
    {
        $cannedResponse->delete();
        return response()->json(['ok' => true]);
    }
}
