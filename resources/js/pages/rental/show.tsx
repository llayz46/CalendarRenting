import { type BreadcrumbItem, Rental } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CalendarEvent, EventCalendar } from '@/components/event-calendar';
import { useState } from 'react';

export default function Show({ rental, reservations }: { rental: Rental, reservations: CalendarEvent[] }) {
    reservations.forEach(reservation => {
        reservation.start = new Date(reservation.start)
        reservation.end = new Date(reservation.end)
    })

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: rental.name,
            href: rental.href,
        },
    ];

    const [events, setEvents] = useState<CalendarEvent[]>(reservations)

    const handleEventAdd = (event: CalendarEvent) => {
        setEvents([...events, event])
    }

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))

        // post(route('rentals.store'), {
        //     onSuccess: () => reset('name'),
        // });
    }

    const handleEventDelete = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={rental.name} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <EventCalendar
                    events={events}
                    onEventAdd={handleEventAdd}
                    onEventUpdate={handleEventUpdate}
                    onEventDelete={handleEventDelete}
                />
            </div>
        </AppLayout>
    );
}
