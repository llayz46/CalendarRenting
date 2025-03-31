<?php

use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::resource('rentals', RentalController::class)->only(['store', 'show']);

Route::resource('reservation', ReservationController::class)->only(['store', 'update', 'destroy']);

Route::get('settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name('appearance');
