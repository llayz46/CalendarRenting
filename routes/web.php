<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReservationController;
use App\Http\Middleware\RestrictAccessMiddleware;
use App\Models\Reservation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(RestrictAccessMiddleware::class)->group(function () {
    Route::get('/', DashboardController::class)->name('home');

    Route::resource('rentals', RentalController::class)->only(['store', 'show', 'destroy']);

    Route::resource('reservation', ReservationController::class)->only(['store', 'update', 'destroy']);

    Route::get('/reservations/years/{rentalId}', function ($rentalId) {
        $years = Reservation::where('rental_id', $rentalId)->get()->each(function ($reservation) {
            $reservation->start_date = $reservation->start_date->format('Y-m-d');
            $reservation->end_date = $reservation->end_date->format('Y-m-d');
        })->map(function ($reservation) {
            return [
                'year' => $reservation->start_date->format('Y'),
            ];
        })->unique('year')->sortByDesc('year')->values()->all();

        return response()->json($years);
    });

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
