<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReservationController;
use App\Models\Rental;
use App\Models\Reservation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', DashboardController::class)->name('home');

Route::resource('rentals', RentalController::class)->only(['store', 'show', 'destroy']);

Route::resource('reservation', ReservationController::class)->only(['store', 'update', 'destroy']);

Route::get('/api/rentals/{rentalId}/reservations', function ($rentalId) {
    $reservations = Reservation::where('rental_id', $rentalId)->orderBy('start_date', 'desc')->get();

    return response()->json($reservations);
});

Route::get('/api/rentals/reservations', function () {
    $reservations = Reservation::orderBy('start_date', 'desc')->get();

    return response()->json($reservations);
});

Route::get('settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name('appearance');
