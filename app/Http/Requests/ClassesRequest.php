<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClassesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'class_name' => 'nullable|string|max:1', // Allow nullable class_name
            'grade' => 'nullable|string|max:1', // Allow nullable grade
            'day_id' => 'required|exists:days,id', // Ensure day_id exists in the days table
        ];
    }
}
