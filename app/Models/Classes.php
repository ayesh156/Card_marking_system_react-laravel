<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    protected $fillable = [
        'class_name',
        'grade',
        'day_id',
    ];

    /**
     * Define the relationship with the Days model.
     */
    public function day()
    {
        return $this->belongsTo(Days::class, 'day_id');
    }
}
