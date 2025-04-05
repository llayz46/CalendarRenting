import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRentalContext } from '@/context/rental-context';
import { type Rental } from '@/types';

export function RentalSelect({ rentals }: { rentals: Rental[] }) {
    const { selectedRental, rentalChange } = useRentalContext();

    return (
        <Select value={selectedRental.id.toString()} onValueChange={rentalChange}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="Sélectionner une location" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Location</SelectLabel>
                    {rentals.map((rental) => (
                        <SelectItem key={rental.id} value={String(rental.id)}>
                            {rental.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
