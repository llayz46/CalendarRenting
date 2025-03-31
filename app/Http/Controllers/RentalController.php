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

    public function show(Rental $rental)
    {
        $rental->load(['reservations' => function ($query) {
            $query->orderBy('start_date', 'asc');
        }]);
        dd($rental);

        return inertia('rental/show', [
            'rental' => $rental,
        ]);
    }
}
