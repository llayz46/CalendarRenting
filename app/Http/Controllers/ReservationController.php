<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationCreateRequest;
use App\Http\Requests\ReservationUpdateRequest;
use App\Models\Reservation;
use Illuminate\Support\Carbon;

class ReservationController extends Controller
{
    public function store(ReservationCreateRequest $request)
    {
        $validated = $request->validated();

        $validated['start_date'] = Carbon::parse($validated['start_date'])->setTimezone('Europe/Paris');
        $validated['end_date'] = Carbon::parse($validated['end_date'])->setTimezone('Europe/Paris');

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
