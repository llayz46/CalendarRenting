<?php

use App\Models\Rental;

it('can create a rental', function () {
    $rental = Rental::factory()->create();

    expect($rental)->toBeInstanceOf(Rental::class)
        ->and($rental->exists)->toBeTrue();
});

it('can delete a rental', function () {
    $rental = Rental::factory()->create();

    $rental->delete();

    expect($rental->exists)->toBeFalse();
});
