<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    public const SENDER_VISITOR = 'visitor';
    public const SENDER_ADMIN = 'admin';

    protected $fillable = ['conversation_id', 'sender', 'body', 'read_at'];

    protected $casts = ['read_at' => 'datetime'];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ChatConversation::class, 'conversation_id');
    }
}
