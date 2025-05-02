<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'grade_name', // Make grade_name fillable
    ];

    /**
     * Define the many-to-many relationship with the Tuition model.
     */
    public function tuitions()
    {
        return $this->belongsToMany(Tuition::class, 'tuitions_has_grades', 'grade_id', 'tuition_id');
    }
}
