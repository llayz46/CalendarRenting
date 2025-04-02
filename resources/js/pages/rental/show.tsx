import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CalendarEvent, EventCalendar } from '@/components/event-calendar';
import { useState } from 'react';
import { toast } from "sonner"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Rental {
    id: number;
    name: string;
    href: string;
}

export default function Show({ rental, reservations }: { rental: Rental, reservations: CalendarEvent[] }) {
    reservations.forEach(reservation => {
        reservation.start = new Date(reservation.start)
        reservation.end = new Date(reservation.end)
    })

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

    const [events, setEvents] = useState<CalendarEvent[]>(reservations)

    const handleEventAdd = (event: CalendarEvent) => {
        setEvents([...events, event])

        router.post('/reservation', {
            rental_id: rental.id,
            client_name: event.name,
            price: event.price,
            description: event.description,
            start_date: event.start,
            end_date: event.end,
            platform: event.platform,
            color: event.color
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (resp) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const newEvent = resp.props.reservations[resp.props.reservations.length - 1]
                setEvents([...events, newEvent])

                toast(`La location de "${event.name}" a été ajoutée.`, {
                    description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                    position: 'bottom-left',
                });
            },
        })
    }

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))

        router.put(`/reservation/${updatedEvent.id}`,
            {
                client_name: updatedEvent.name,
                price: updatedEvent.price,
                description: updatedEvent.description,
                start_date: updatedEvent.start,
                end_date: updatedEvent.end,
                platform: updatedEvent.platform,
                color: updatedEvent.color
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();

                    toast(`La location de "${updatedEvent.name}" a était modifiée.`, {
                        description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                        position: 'bottom-left',
                    });
                },
            }
        )
    }

    const handleEventDelete = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId))

        router.delete(`/reservation/${eventId}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload();

                toast(`La location a été supprimée avec succès.`, {
                    description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                    position: 'bottom-left',
                });
            },
        })
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
