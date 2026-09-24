<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = ['type', 'name', 'company', 'email', 'phone', 'city', 'size', 'message', 'plan', 'ip', 'user_agent', 'status'];
}
