import { YearSelect } from '@/components/YearSelect';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { RiDeleteBinLine } from '@remixicon/react';
import { type Rental } from '@/types';
import { useYearContext } from '@/context/year-context';
import { LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';

export function RentalStats({ rental }: { rental: Rental }) {
    const { reservations, isLoading, selectedYear } = useYearContext();

    const totalPrice = useMemo(() => {
        return reservations.reduce((sum, reservation) => sum + (reservation.price ?? 0), 0);
    }, [reservations]);

    const nextReservation = useMemo(() => {
        return reservations
            .filter(reservation => new Date(reservation.start_date) > new Date())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .at(0)?.start_date;
    }, [reservations]);

    const lastReservation = useMemo(() => {
        return reservations
            .filter(reservation => new Date(reservation.start_date) < new Date())
            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
            .at(0)?.start_date;
    }, [reservations]);

    const handleRentalDelete = (rentalId: number) => {
        router.delete(`/rentals/${rentalId}`)
    }

    return (
        <div
            className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col gap-5 overflow-hidden rounded-xl border p-6"
        >
            <h2 className="flex justify-between text-xl font-medium">
                <Link href={`/rentals/${rental.id}`} prefetch>
                    {rental.name}
                </Link>

                <YearSelect />
            </h2>

            <ul className="space-y-2 *:flex *:items-baseline *:max-lg:flex-col-reverse lg:space-y-1 *:lg:gap-1">
                <li>
                    <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : reservations.length}</span>
                    <span>Réservations</span>
                </li>
                <li>
                    <span className="text-xl font-medium text-nowrap text-indigo-600 dark:text-indigo-200">
                        {isLoading ? <LoaderCircle className="inline-flex h-4 w-4 animate-spin" /> : totalPrice?.toLocaleString('fr-FR')} €
                    </span>
                    <span>Revenu total</span>
                </li>
                {String(selectedYear) >= String(new Date().getFullYear()) ? (
                    <li>
                        <span className="text-xl font-medium text-nowrap text-indigo-600 dark:text-indigo-200">
                            {isLoading ?
                                <LoaderCircle className="inline-flex h-4 w-4 animate-spin" /> :
                                nextReservation ? new Date(nextReservation).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                }) : (
                                    <span>Aucune</span>
                                )
                            }
                        </span>
                        <span className="truncate text-wrap">{nextReservation ? 'Prochaine location' : 'location prévu'}</span>
                    </li>
                ) : (
                    <li>
                        <span className="text-xl font-medium text-nowrap text-indigo-600 dark:text-indigo-200">
                            {lastReservation ? new Date(lastReservation).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            }) : (<LoaderCircle className="inline-flex h-4 w-4 animate-spin" />)}
                        </span>
                        <span className="truncate text-wrap">Dernière location</span>
                    </li>
                )}
            </ul>

            <Button
                variant="outline"
                size="icon"
                aria-label="Delete rental"
                className="absolute right-6 bottom-6 cursor-pointer"
                onClick={() => handleRentalDelete(rental.id)}
            >
                <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
        </div>
    );
}
