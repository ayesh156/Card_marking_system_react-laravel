<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentTuition extends Model
{
    use HasFactory;

    protected $table = 'students_has_tuitions'; // Specify the table name

    protected $fillable = [
        'student_id',
        'tuition_id',
        'status', // Include the new column
    ];

    /**
     * Define the relationship with the Student model.
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Define the relationship with the Tuition model.
     */
    public function tuition()
    {
        return $this->belongsTo(Tuition::class, 'tuition_id');
    }
}