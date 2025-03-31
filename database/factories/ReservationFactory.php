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
        return [
            'client_name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addDays(7),
            'price' => $this->faker->numberBetween(700, 2600),
            'platform' => $this->faker->randomElement(['leboncoin', 'airbnb']),
            'color' => $this->faker->randomElement(['sky', 'amber', 'violet', 'rose', 'emerald', 'orange']),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
