import { useState, useEffect, useCallback } from 'react';
import { type Reservation } from '@/types'

export function useYears(rentalId: number, initialYear: number) {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(initialYear);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);

    // Chargement des réservations
    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/rentals/${rentalId}/reservations`);

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
    }, [reservations]);

    useEffect(() => {
        fetchReservations();
    }, [rentalId, fetchReservations]);

    // Changer l'année sélectionnée dans selectedYear
    const changeYear = useCallback((year: string | number) => {
        const yearValue = typeof year === 'string' ? parseInt(year) : year;
        setSelectedYear(yearValue);
        filterReservationsByYear(yearValue);
    }, [filterReservationsByYear]);

    return {
        years,
        selectedYear,
        isLoading,
        error,
        changeYear,
        reservations: filteredReservations,
        allReservations: reservations,
        refreshData: fetchReservations
    };
}
