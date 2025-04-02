import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LoaderCircle } from 'lucide-react';
import { useYearContext } from '@/context/year-context';

export function YearSelect() {
    const { years, selectedYear, isLoading, error, changeYear } = useYearContext();

    if (error) {
        return <span className="text-sm text-red-500">Erreur: {error}</span>;
    }

    return (
        <Select value={selectedYear?.toString()} onValueChange={changeYear}>
            <SelectTrigger className="w-fit">
                {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                    <SelectValue placeholder={selectedYear} />
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
