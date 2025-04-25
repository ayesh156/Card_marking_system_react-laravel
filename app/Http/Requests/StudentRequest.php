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
            'sno' => 'required|string|max:20|unique:students,sno,' . $this->route('id'),
            'name' => 'required|string|max:100',
            'address1' => 'nullable|string',
            'address2' => 'nullable|string',
            'school' => 'nullable|string',
            'g_name' => 'nullable|string|max:100',
            'g_mobile' => 'nullable|string|max:10',
            'g_whatsapp' => 'nullable|string|max:10',
            'gender' => 'nullable|string|max:10',
            'dob' => 'nullable|date_format:Y-m-d',
            'maths' => 'required|boolean',
            'english' => 'required|boolean',
            'scholarship' => 'required|boolean',
            'grade' => 'nullable|string|max:1',
        ];
    }
}
