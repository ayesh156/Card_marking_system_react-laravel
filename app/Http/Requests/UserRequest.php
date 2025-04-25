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
            'Before_Payment_Template' => 'nullable|string|max:100',
            'After_Payment_Template' => 'nullable|string|max:100',
            'status' => 'nullable',
            'mode' => 'nullable|string|max:1',
            'image' => 'nullable',
        ];
    }
}