<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    protected $fillable = [
        'user_id',
        'fight_id',
        'fighter_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}