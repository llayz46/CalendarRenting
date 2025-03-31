<?php

use App\Models\Rental;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Rental::class)->constrained()->onDelete('cascade');
            $table->string('client_name');
            $table->string('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('price');
            $table->enum('platform', ['airbnb', 'leboncoin']);
            $table->enum('color', ['sky', 'amber', 'violet', 'rose', 'emerald', 'orange']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
