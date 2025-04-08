<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildRequest extends FormRequest
{
   /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Set to true to allow all users to use this request
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'sno' => 'required|string|max:20|unique:child,sno,' . $id, // Allow the same `sno` for the current record
            'name' => 'required|string|max:100',
            'address1' => 'nullable|string',
            'address2' => 'nullable|string',
            'school' => 'nullable|string',
            'gName' => 'nullable|string|max:100',
            'gMobile' => 'nullable|string|max:10',
            'gWhatsapp' => 'required|string|max:10',
            'gender' => 'nullable|string|max:10',
            'dob' => 'nullable|date_format:Y-m-d',
        ];
    }
}
