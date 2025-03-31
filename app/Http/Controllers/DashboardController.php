<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $year = (string) now()->year;

        $rentals = Rental::with('reservations')
            ->withCount(['reservations as reservations_count' => function ($query) use ($year) {
                $query->whereYear('start_date', $year);
            }])
            ->withSum('reservations as total_price', 'price', function ($query) use ($year) {
                $query->whereYear('start_date', $year);
            })
            ->latest()
            ->get();

        $rentals->each(function ($rental) {
            $rental->next_reservation = $rental->reservations()
                ->where('start_date', '>=', now())
                ->orderBy('start_date')
                ->value('start_date');
        });

        return inertia('dashboard', [
            'rentals' => $rentals,
        ]);
    }
}
