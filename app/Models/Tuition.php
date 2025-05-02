<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tuition extends Model
{
    protected $fillable = [
        'classes_id',
        'category_id',
        'days_id',
    ];

    /**
     * Define the relationship with the Grade model.
     */
    public function grade()
    {
        return $this->belongsTo(Grade::class, 'grade_id');
    }

    /**
     * Define the relationship with the Classes model.
     */
    public function classes()
    {
        return $this->belongsTo(ClassModel::class, 'classes_id');
    }

    /**
     * Define the relationship with the Category model.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Define the relationship with the Days model.
     */
    public function days()
    {
        return $this->belongsTo(Day::class, 'days_id');
    }

    /**
     * Define the relationship with the StudentTuition model.
     */
    public function studentTuitions()
    {
        return $this->hasMany(StudentTuition::class, 'tuition_id');
    }

    /**
     * Define the many-to-many relationship with the Grade model.
     */
    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'tuitions_has_grades', 'tuition_id', 'grade_id');
    }
}
