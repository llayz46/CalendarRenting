<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationCreateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'rental_id' => ['required', Rule::exists('rentals', 'id')],
            'client_name' => ['required', 'string', 'max:255', 'min:2'],
            'description' => ['required', 'string', 'max:500', 'min:2'],
            'start_date' => ['required', 'date', Rule::date()->afterOrEqual(today()),],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'price' => ['required', 'integer', 'min:0'],
            'platform' => ['required', Rule::in(['airbnb', 'leboncoin'])],
            'color' => ['required', Rule::in(['sky', 'amber', 'violet', 'rose', 'emerald', 'orange'])],
        ];
    }
}
