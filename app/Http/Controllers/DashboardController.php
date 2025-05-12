<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $rentals = Rental::all();

        return inertia('dashboard', [
            'rentals' => $rentals,
        ]);
    }
}
