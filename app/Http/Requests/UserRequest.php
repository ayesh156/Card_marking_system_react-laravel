<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Allow all users to make this request
    }

    public function rules()
    {
        $useremail = $this->route('email');

        return [
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:100|unique:users,email,' . $useremail . ',email', // Exclude the current email
            'password' => 'nullable|string|max:20',
            'beforePaymentWeek4' => 'nullable|string|max:100',
            'beforePaymentWeek4' => 'nullable|string|max:100',
            'afterPaymentTemplate' => 'nullable|string|max:100',
            'after_payment_nursery_template' => 'nullable|string|max:100',
            'after_payment_grade1_template' => 'nullable|string|max:100',
            'after_payment_grade2_template' => 'nullable|string|max:100',
            'after_payment_grade3_template' => 'nullable|string|max:100',
            'after_payment_grade4_template' => 'nullable|string|max:100',
            'after_payment_grade5_template' => 'nullable|string|max:100',
            'after_payment_grade6_template' => 'nullable|string|max:100',
            'after_payment_grade7_template' => 'nullable|string|max:100',
            'after_payment_grade8_template' => 'nullable|string|max:100',
            'after_payment_grade9_template' => 'nullable|string|max:100',
            'after_payment_grade10_template' => 'nullable|string|max:100',
            'after_payment_grade11_template' => 'nullable|string|max:100',
            'after_payment_spoken_template' => 'nullable|string|max:100',
            'status' => 'nullable',
            'mode' => 'nullable|string|max:1',
            'image' => 'nullable',
        ];
    }
}