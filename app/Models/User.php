<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'before_payment_week3',
        'before_payment_week4',
        'after_payment_template',
        'after_payment_nursery_template',
        'after_payment_grade1_template',
        'after_payment_grade2_template',
        'after_payment_grade3_template',
        'after_payment_grade4_template',
        'after_payment_grade5_template',
        'after_payment_grade6_template',
        'after_payment_grade7_template',
        'after_payment_grade8_template',
        'after_payment_grade9_template',
        'after_payment_grade10_template',
        'after_payment_grade11_template',
        'after_payment_spoken_template',
        'image_path',
        'status',
        'mode',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the JWT subject claim.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}