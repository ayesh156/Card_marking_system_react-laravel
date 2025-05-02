<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    protected $fillable = [
        'day_name',
    ];

    /**
     * Define the relationship with the Classes model.
     */
    public function classes()
    {
        return $this->hasMany(ClassModel::class, 'day_id');
    }
}
