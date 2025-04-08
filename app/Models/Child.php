<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;
    
    // Enable timestamps (default behavior)
    public $timestamps = true;

    protected $table = 'child';

    protected $fillable = [
        'sno',
        'name',
        'address1',
        'address2',
        'school',
        'gName',
        'gMobile',
        'gWhatsapp',
        'gender',
        'dob',
    ];

    public function reports()
    {
        return $this->hasMany(ChildReport::class, 'child_id');
    }
}
