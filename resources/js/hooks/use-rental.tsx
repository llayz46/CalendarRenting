import { useMemo, useState } from 'react';
import { Rental } from '@/types';

export function useRental(rentals: Rental[]) {
    const initialRental = useMemo(() => rentals[0], [rentals]);

    const [selectedRental, setSelectedRental] = useState<Rental>(initialRental);

    const rentalChange = (value: string) => {
        const rental = rentals.find(r => r.id.toString() === value);
        if (rental) setSelectedRental(rental);
    };

    return {
        selectedRental,
        rentalChange,
    }
}
