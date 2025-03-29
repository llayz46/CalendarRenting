<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::get('settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name('appearance');
