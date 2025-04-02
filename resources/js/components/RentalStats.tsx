import { YearSelect } from '@/components/YearSelect';
import { Button } from '@/components/ui/button';
import { YearProvider } from '@/context/year-context';
import { Link, router } from '@inertiajs/react';
import { RiDeleteBinLine } from '@remixicon/react';

interface Reservation {
    id: number;
    rental_id: number;
    client_name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    price: number;
    platform: 'airbnb' | 'leboncoin';
    color: 'violet' | 'rose' | 'orange' | 'emerald' | string;
    created_at: string;
    updated_at: string;
}

interface Rental {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    reservations: Reservation[];
    reservations_count: number;
    total_price: number;
    next_reservation: Date;
    last_reservation: Date;
}

export function RentalStats({ rental, year }: { rental: Rental; year: number }) {
    const handleRentalDelete = (rentalId: number) => {
        router.delete(`/rentals/${rentalId}`)
    }

    return (
        <div
            key={rental.id}
            className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-5 overflow-hidden rounded-xl border p-8"
        >
            <h2 className="flex justify-between text-xl font-medium">
                <Link href={`/rentals/${rental.id}`} prefetch>
                    {rental.name}
                </Link>
                <YearProvider rentalId={rental.id} initialYear={year}>
                    <YearSelect />
                </YearProvider>
            </h2>

            <ul className="space-y-2 *:flex *:items-baseline *:max-lg:flex-col-reverse lg:space-y-1 *:lg:gap-1">
                <li>
                    <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{rental.reservations_count}</span>
                    <span>Réservations</span>
                </li>
                <li>
                    <span className="text-xl font-medium text-nowrap text-indigo-600 dark:text-indigo-200">
                        {rental.total_price?.toLocaleString('fr-FR')} €
                    </span>
                    <span>Revenu total</span>
                </li>
                {String(year) === String(new Date().getFullYear()) && rental.next_reservation ? (
                    <li>
                        <span className="text-xl font-medium text-nowrap text-indigo-600 dark:text-indigo-200">
                            {new Date(rental.next_reservation).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </span>
                        <span className="truncate text-wrap">Prochaine location</span>
                    </li>
                ) : rental.last_reservation ? (
                    <li>
                        <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">
                            {new Date(rental.last_reservation).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </span>
                        <span>Dernière location</span>
                    </li>
                ) : null}
            </ul>

            <Button
                variant="outline"
                size="icon"
                aria-label="Delete rental"
                className="absolute right-8 bottom-8 cursor-pointer"
                onClick={() => handleRentalDelete(rental.id)}
            >
                <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
        </div>
    );
}
