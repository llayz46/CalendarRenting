<?php

namespace App\Http\Controllers;

use App\Http\Requests\RentalCreateRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Rental;

class RentalController extends Controller
{
    public function store(RentalCreateRequest $request)
    {
        $validated = $request->validated();

        Rental::create($validated);
    }

    public function show(Rental $rental)
    {
        return inertia('rental/show', [
            'rental' => $rental,
            'reservations' => ReservationResource::collection($rental->reservations),
        ]);
    }

    public function destroy(Rental $rental)
    {
        $rental->delete();
    }
}
