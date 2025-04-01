<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $year = $request->input('year', (string) now()->year);

        $rentals = Rental::with('reservations')
            ->withCount(['reservations as reservations_count' => function ($query) use ($year) {
                $query->whereYear('start_date', $year);
            }])
            ->withSum(['reservations as total_price' => function ($query) use ($year) {
                $query->whereYear('start_date', $year);
            }], 'price')
            ->get();

        $rentals->each(function ($rental) use ($year) {
            $rental->total_price = $rental->total_price ?? 0;

            $rental->next_reservation = $rental->reservations()
                ->where('start_date', '>=', now())
                ->whereYear('start_date', now()->year)
                ->orderBy('start_date')
                ->value('start_date');

            if ($year != now()->year) {
                $rental->last_reservation = $rental->reservations()
                    ->whereYear('start_date', $year)
                    ->orderBy('start_date', 'desc')
                    ->value('start_date');
            } else {
                $rental->last_reservation = null;
            }
        });

        return inertia('dashboard', [
            'rentals' => $rentals,
            'year' => $year,
        ]);
    }
}
