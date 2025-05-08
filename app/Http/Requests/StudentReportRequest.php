<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentReportRequest extends FormRequest
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
            'student_id' => 'required|exists:students,id', // Ensure student_id exists in students table
            'tuition_id' => 'required|exists:classes,id', // Ensure class_id exists in classes table
            'year_id' => 'required|exists:years,id', // Ensure year_id exists in years table
            'month_id' => 'required|exists:months,id', // Ensure month_id exists in months table
            'week1' => 'required|boolean', // Validate week1 as a boolean
            'week2' => 'required|boolean', // Validate week2 as a boolean
            'week3' => 'required|boolean', // Validate week3 as a boolean
            'week4' => 'required|boolean', // Validate week4 as a boolean
            'week5' => 'required|boolean', // Validate week5 as a boolean
            'paid' => 'required|boolean', // Validate paid as a boolean
            'reminder_week3' => 'required|boolean',
            'reminder_week4' => 'required|boolean',
        ];
    }
}
