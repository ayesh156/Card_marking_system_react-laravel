<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'tuition_id',
        'month_id',
        'year_id',
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
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Define the relationship with the Month model.
     */
    public function month()
    {
        return $this->belongsTo(Month::class, 'month_id');
    }

    /**
     * Define the relationship with the Tuition model.
     */
    public function tuition()
    {
        return $this->belongsTo(Tuition::class, 'tuition_id');
    }

    /**
     * Define the relationship with the Year model.
     */
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }
}