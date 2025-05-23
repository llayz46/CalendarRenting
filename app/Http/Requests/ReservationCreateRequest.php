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
            'description' => ['nullable', 'string', 'max:500', 'min:2'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'price' => ['required', 'integer', 'min:0'],
            'platform' => ['required', Rule::in(['airbnb', 'leboncoin'])],
            'color' => ['required', Rule::in(['sky', 'amber', 'violet', 'rose', 'emerald', 'orange'])],
        ];
    }

    public function messages(): array
    {
        return [
            'rental_id.required' => 'La réservation doit être liée à une location.',
            'rental_id.exists' => 'La location spécifiée n\'existe pas.',

            'client_name.required' => 'Le nom du client est obligatoire.',
            'client_name.string' => 'Le nom du client doit être une chaîne de caractères.',
            'client_name.max' => 'Le nom du client ne peut pas dépasser 255 caractères.',
            'client_name.min' => 'Le nom du client doit contenir au moins 2 caractères.',

            'description.required' => 'La description est obligatoire.',
            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 500 caractères.',
            'description.min' => 'La description doit contenir au moins 2 caractères.',

            'start_date.required' => 'La date de début est obligatoire.',
            'start_date.date' => 'La date de début doit être une date valide.',
            'start_date.after_or_equal' => "La date de début doit être égale ou postérieure à aujourd'hui.",

            'end_date.required' => 'La date de fin est obligatoire.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after_or_equal' => "La date de fin doit être égale ou postérieure à la date de début.",

            'price.required' => 'Le prix est obligatoire.',
            'price.integer' => 'Le prix doit être un nombre entier.',
            'price.min' => "Le prix doit être supérieur ou égal à 0.",

            'platform.required' => "La plateforme est obligatoire.",
            'platform.in' => "La plateforme doit être soit airbnb, soit leboncoin.",

            'color.required' => "La couleur est obligatoire.",
            'color.in' => "La couleur doit être l'une des suivantes : sky, amber, violet, rose, emerald, orange.",
        ];
    }
}
