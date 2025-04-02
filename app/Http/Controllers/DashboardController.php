<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
//        $rentals = Rental::with('reservations')
//            ->withCount(['reservations as reservations_count' => function ($query) {
//                $query->whereYear('start_date', 2025);
//            }])
//            ->withSum(['reservations as total_price' => function ($query){
//                $query->whereYear('start_date', 2025);
//            }], 'price')
//            ->get();
//
//        $rentals->each(function ($rental){
//            $rental->total_price = $rental->total_price ?? 0;
//
//            $rental->next_reservation = $rental->reservations()
//                ->where('start_date', '>=', now())
//                ->whereYear('start_date', now()->year)
//                ->orderBy('start_date')
//                ->value('start_date');
//
//            if (2025 != now()->year) {
//                $rental->last_reservation = $rental->reservations()
//                    ->whereYear('start_date', 2025)
//                    ->orderBy('start_date', 'desc')
//                    ->value('start_date');
//            } else {
//                $rental->last_reservation = null;
//            }
//        });

        return inertia('dashboard', [
//            'rentals' => $rentals
            'rentals' => Rental::all()
        ]);
    }
}
