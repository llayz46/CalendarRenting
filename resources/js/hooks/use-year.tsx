import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useYears(rentalId: number, initialYear: number) {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(initialYear);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchYears = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/reservations/years/${rentalId}`);

                if (!response.ok) {
                    new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                const yearValues = data.map((item: { year: string }) => parseInt(item.year));

                if (yearValues.length === 0) {
                    setYears([2025]);
                } else {
                    setYears(yearValues);
                }

                if (!selectedYear && yearValues.length > 0) {
                    setSelectedYear(yearValues[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des années');
                console.error('Error fetching years:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchYears();
    }, [rentalId, selectedYear]);

    const changeYear = (year: string | number) => {
        const yearValue = typeof year === 'string' ? parseInt(year) : year;
        setSelectedYear(yearValue);
        router.get(route('home'), { year: yearValue }, { preserveState: true });
    };

    return {
        years,
        selectedYear,
        isLoading,
        error,
        changeYear
    };
}
