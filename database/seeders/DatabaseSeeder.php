<?php

namespace Database\Seeders;

use App\Models\Rental;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Rental::factory()
            ->has(Reservation::factory(24))
            ->create([
                'name' => 'Dégagnazès',
        ]);

        Rental::factory()
            ->has(Reservation::factory()->count(32))
            ->create([
                'name' => 'Concorès',
        ]);
    }
}
