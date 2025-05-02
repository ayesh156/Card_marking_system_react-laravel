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
            'sno' => 'required|string|max:255',
        'name' => 'required|string|max:255',
        'address1' => 'nullable|string|max:255',
        'address2' => 'nullable|string|max:255',
        'school' => 'nullable|string|max:255',
        'g_name' => 'nullable|string|max:255',
        'g_mobile' => 'nullable|string|max:15',
        'g_whatsapp' => 'nullable|string|max:15',
        'gender' => 'required|string|in:male,female',
        'dob' => 'nullable|date',
        'tuitionId' => 'required|exists:tuitions,id', // Ensure tuitionId exists in the tuitions table
        ];
    }
}
