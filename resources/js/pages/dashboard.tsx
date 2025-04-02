import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Reservation } from '@/types';
import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { RentalCreate } from '@/components/RentalCreate';
import { RentalStats } from '@/components/RentalStats';
import { YearProvider } from '@/context/year-context';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/',
    },
];

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

export default function Dashboard({ rentals }: DashboardProps) {
    const year = new Date().getFullYear();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accueil" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <RentalCreate />
                    </div>

                    {rentals.length > 0 ? (
                        rentals.map((rental) => (
                            <YearProvider key={rental.id} rentalId={rental.id} initialYear={year}>
                                <RentalStats rental={rental} />
                            </YearProvider>
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
