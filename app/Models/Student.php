<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'sno',
        'name',
        'address1',
        'address2',
        'school',
        'g_name',
        'g_mobile',
        'g_whatsapp',
        'g_whatsapp2',
        'gender',
        'dob',
    ];

    /**
     * Define the relationship with the StudentReport model.
     */
    public function reports()
    {
        return $this->hasMany(StudentReport::class, 'student_id');
    }

    /**
     * Define the relationship with the StudentTuition model.
     */
    public function studentTuitions()
    {
        return $this->hasMany(StudentTuition::class, 'student_id');
    }
}
