import { useState, useEffect, useCallback } from 'react';
import { type Reservation } from '@/types'

type UseYearType = {
    rentalId?: number;
    initialYear: number;
};

export function useYears({ rentalId, initialYear }: UseYearType) {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(initialYear);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Chargement des réservations
    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let response: Response;

            if (rentalId) {
                response = await fetch(`/api/rentals/${rentalId}/reservations`);
            } else {
                response = await fetch(`/api/rentals/reservations`);
            }

            if (!response.ok) {
                new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setReservations(data);

            const uniqueYears = Array.from(new Set(
                data.map((res: Reservation) => new Date(res.start_date).getFullYear())
            )) as number[];

            uniqueYears.sort((a, b) => b - a);

            if (uniqueYears.length === 0) {
                setYears([new Date().getFullYear()]);
            } else {
                setYears(uniqueYears as number[]);
            }

            filterReservationsByYear(initialYear, data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réservations');
            console.error('Error fetching reservations (catch):', err);
        } finally {
            setIsLoading(false);
        }
    }, [rentalId]);

    // Filtrage des réservations par année
    const filterReservationsByYear = useCallback((year: number, data = reservations) => {
        const filtered = data.filter((res: Reservation) => {
            const startDate = new Date(res.start_date);
            const targetYear = typeof year === 'string' ? parseInt(year) : year;
            return startDate.getFullYear() === targetYear;
        });

        setFilteredReservations(filtered);

        if(!rentalId) calculateTotalPrice(filtered)
    }, [reservations]);

    useEffect(() => {
        fetchReservations();
    }, [rentalId, fetchReservations]);

    useEffect(() => {
        if (initialYear !== selectedYear && !years.includes(selectedYear)) {
            setSelectedYear(initialYear);
        }
    }, [years]);

    const changeYear = useCallback((year: string | number) => {
        const yearValue = typeof year === 'string' ? parseInt(year) : year;
        setSelectedYear(yearValue);
        filterReservationsByYear(yearValue);
    }, [filterReservationsByYear]);

    const calculateTotalPrice = (data: Reservation[]) => {
        const total = data.reduce((acc, reservation) => {
            return acc + reservation.price;
        }, 0);

        setTotalPrice(total);
    };

    return {
        years,
        selectedYear,
        isLoading,
        error,
        changeYear,
        reservations: filteredReservations,
        allReservations: reservations,
        refreshData: fetchReservations,
        totalPrice,
    };
}
