<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Month extends Model
{
    use HasFactory;


    protected $fillable = ['name']; // Specify the fillable fields

    // Define the relationship with the ChildReport model
    public function childReports()
    {
        return $this->hasMany(ChildReport::class);
    }
}
