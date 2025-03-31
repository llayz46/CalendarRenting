<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'client_name',
        'price',
        'description',
        'start_date',
        'end_date',
        'color',
        'platform',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function setStartDateAttribute($value): void
    {
        $this->attributes['start_date'] = Carbon::parse($value)->setTimezone('Europe/Paris');
    }

    public function setEndDateAttribute($value): void
    {
        $this->attributes['end_date'] = Carbon::parse($value)->setTimezone('Europe/Paris');
    }

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }
}
