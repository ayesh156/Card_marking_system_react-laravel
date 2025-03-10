<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;

    protected $table = 'child';

    protected $fillable = ['id','name', 'number'];

    public function reports()
    {
        return $this->hasMany(ChildReport::class, 'child_id');
    }
}
