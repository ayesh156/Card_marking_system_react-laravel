<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'category_name', // Make category_name fillable
    ];

    /**
     * Define the relationship with the Tuitions model.
     */
    public function tuitions()
    {
        return $this->hasMany(Tuition::class, 'category_id');
    }
}