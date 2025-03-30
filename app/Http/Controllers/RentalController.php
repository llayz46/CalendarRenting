<?php

namespace App\Http\Controllers;

use App\Http\Requests\RentalCreateRequest;
use App\Models\Rental;

class RentalController extends Controller
{
    public function store(RentalCreateRequest $request)
    {
        $validated = $request->validated();

        Rental::create($validated);

        return redirect()->route('home');
    }
}
