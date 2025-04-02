import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CalendarEvent, EventCalendar } from '@/components/event-calendar';
import { CalendarProvider, useCalendarContext } from '@/context/calendar-context';

interface Rental {
    id: number;
    name: string;
    href: string;
}

export default function Show({ rental, reservations }: { rental: Rental, reservations: CalendarEvent[] }) {
    const formattedReservations = reservations.map(reservation => ({
        ...reservation,
        start: new Date(reservation.start),
        end: new Date(reservation.end)
    }));

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Accueil',
            href: '/',
        },
        {
            title: rental.name,
            href: rental.href,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={rental.name} />

            <CalendarProvider initialEvents={formattedReservations} rentalId={rental.id}>
                <CalendarContainer rental={rental} />
            </CalendarProvider>
        </AppLayout>
    );
}

function CalendarContainer({ rental }: { rental: Rental }) {
    const { events, addEvent, updateEvent, deleteEvent } = useCalendarContext();

    const handleEventAdd = (event: CalendarEvent) => {
        addEvent(event, rental.id);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <EventCalendar
                events={events}
                onEventAdd={handleEventAdd}
                onEventUpdate={updateEvent}
                onEventDelete={deleteEvent}
            />
        </div>
    );
}
