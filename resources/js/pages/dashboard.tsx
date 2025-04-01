import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { RentalCreate } from '@/components/RentalCreate';
import { YearSelect } from '@/components/year-select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/',
    },
];

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

interface DashboardProps {
    rentals: Rental[];
    year: number;
}

export default function Dashboard({ rentals, year }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accueil" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <RentalCreate />
                    </div>

                    {rentals.length > 0 ? (
                        rentals.map((rental) => (
                            <div
                                key={rental.id}
                                className="border-sidebar-border/70 dark:border-sidebar-border relative flex aspect-video flex-col gap-5 overflow-hidden rounded-xl border p-8"
                            >
                                <h2 className="flex justify-between text-xl font-medium">
                                    <Link href={`/rentals/${rental.id}`} prefetch>{rental.name}</Link>
                                    <YearSelect rentalId={rental.id} currentYear={year} />
                                </h2>

                                <ul className="space-y-1 *:flex *:items-baseline *:gap-1">
                                    <li>
                                        <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{rental.reservations_count}</span>
                                        <span>Réservations</span>
                                    </li>
                                    <li>
                                        <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{rental.total_price?.toLocaleString('fr-FR')} €</span>
                                        <span>Revenu total</span>
                                    </li>
                                    {String(year) === String(new Date().getFullYear()) ? (
                                        <li>
                                            <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{new Date(rental.next_reservation).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                            <span>Prochaine location</span>
                                        </li>
                                    ) : (
                                        <li>
                                            <span className="text-xl font-medium text-indigo-600 dark:text-indigo-200">{new Date(rental.last_reservation).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                            <span>Dernière location</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex aspect-video flex-col gap-5 overflow-hidden rounded-xl border p-8">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex aspect-video flex-col gap-5 overflow-hidden rounded-xl border p-8">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </>
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
