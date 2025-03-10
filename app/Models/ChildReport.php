<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildReport extends Model
{
    use HasFactory;

    protected $fillable = ['child_id', 'week1', 'week2', 'week3', 'week4', 'week5', 'paid', 'year_id', 'month_id'];

    // Relationship with the Child model
    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    // Relationship with the Year model
    public function year()
    {
        return $this->belongsTo(Year::class, 'year_id');
    }

    // Relationship with the Month model
    public function month()
    {
        return $this->belongsTo(Month::class, 'month_id');
    }
}
