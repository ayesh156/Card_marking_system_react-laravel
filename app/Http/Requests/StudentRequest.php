<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow all users to use this request
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sno' => 'required|string|unique:students,sno', // Ensure sno is unique
            'name' => 'required|string|max:100',
            'address1' => 'nullable|string',
            'address2' => 'nullable|string',
            'school' => 'nullable|string',
            'g_name' => 'nullable|string|max:100',
            'g_mobile' => 'nullable|string|max:10',
            'g_whatsapp' => 'nullable|string|max:10',
            'gender' => 'nullable|string|max:10',
            'dob' => 'nullable|date',
            'tuitionId' => 'required|exists:tuitions,id', // Ensure tuitionId exists in the tuitions table
        ];
    }

    public function messages(): array
    {
        return [
            'sno.unique' => 'This Student No has already been taken.', // Custom error message for duplicate sno
        ];
    }
}
