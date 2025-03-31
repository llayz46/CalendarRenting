<?php

namespace Database\Factories;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-3 weeks', '+5 months');

        return [
            'client_name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'start_date' => $startDate,
            'end_date' => (clone $startDate)->modify('+7 days'),
            'price' => $this->faker->numberBetween(700, 2600),
            'platform' => $this->faker->randomElement(['leboncoin', 'airbnb']),
            'color' => $this->faker->randomElement(['sky', 'amber', 'violet', 'rose', 'emerald', 'orange']),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
