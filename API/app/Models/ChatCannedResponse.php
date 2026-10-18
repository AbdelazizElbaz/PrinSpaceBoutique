<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Réponse prédéfinie insérable d'un clic dans la console admin. */
class ChatCannedResponse extends Model
{
    protected $fillable = ['title', 'body'];
}
