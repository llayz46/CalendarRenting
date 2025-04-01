import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

export function YearSelect({ rentalId, currentYear }: { rentalId: number, currentYear: number }) {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
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
                const yearValues = data.map((item: { year: string }) => item.year);

                if (yearValues.length === 0) {
                    setYears([2025]);
                } else {
                    setYears(yearValues);
                }

                if (!selectedYear) {
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

    if (error) {
        return <span className="text-sm text-red-500">Erreur</span>;
    }

    const handleYearChange = (year: string) => {
        setSelectedYear(parseInt(year));

        router.get(route('home'), { year }, { preserveState: true });
    };

    return (
        <Select value={selectedYear?.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-fit">
                {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                    <SelectValue placeholder={currentYear} />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Année</SelectLabel>
                    {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
