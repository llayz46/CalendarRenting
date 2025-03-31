<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationCreateRequest;
use App\Http\Requests\ReservationUpdateRequest;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function store(ReservationCreateRequest $request)
    {
        $validated = $request->validated();

        Reservation::create($validated);
    }

    public function update(ReservationUpdateRequest $request, Reservation $reservation)
    {
        $validated = $request->validated();

        $reservation->update($validated);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
    }
}
