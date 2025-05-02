<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    // Specify the table name
    protected $table = 'classes';
    
    protected $fillable = [
        'class_name',
    ];

    /**
     * Define the relationship with the Days model.
     */
    public function day()
    {
        return $this->belongsTo(Day::class, 'day_id');
    }
}
