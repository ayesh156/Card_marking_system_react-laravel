<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'class_id',
        'year_id', 
        'month_id',
        'week1',
        'week2',
        'week3',
        'week4',
        'week5',
        'paid',
    ];

    /**
     * Define the relationship with the Student model.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Define the relationship with the Classes model.
     */
    public function class()
    {
        return $this->belongsTo(Classes::class);
    }
}
