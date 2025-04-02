import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner"
import { CalendarEvent } from '@/components/event-calendar';

const eventsCache = new Map<number, CalendarEvent[]>();

export function useCalendar(initialEvents: CalendarEvent[] = [], rentalId: number) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const cachedEvents = eventsCache.get(rentalId);

            if (cachedEvents) {
                setEvents(cachedEvents);
            } else {
                const formattedEvents = initialEvents.map(event => ({
                    ...event,
                    start: event.start instanceof Date ? event.start : new Date(event.start),
                    end: event.end instanceof Date ? event.end : new Date(event.end)
                }));

                setEvents(formattedEvents);

                eventsCache.set(rentalId, formattedEvents);
            }
        } catch (err) {
            setError("Erreur lors de l'initialisation des événements");
            console.error(err);
        }
    }, [initialEvents, rentalId]);

    const addEvent = useCallback((event: CalendarEvent, rentalId: number) => {
        setIsLoading(true);
        setError(null);

        const newEvents = [...events, event];
        setEvents(newEvents);
        eventsCache.set(rentalId, newEvents);

        router.post('/reservation', {
            rental_id: rentalId,
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
                const newEvent = resp.props.reservations[resp.props.reservations.length - 1];

                const updatedEvents = events.filter(e => e !== event).concat(newEvent);
                setEvents(updatedEvents);
                eventsCache.set(rentalId, updatedEvents);

                toast(`La location de "${event.name}" a été ajoutée.`, {
                    description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                    position: 'bottom-left',
                });

                setIsLoading(false);
            },
            onError: () => {
                const rollbackEvents = events.filter(e => e !== event);
                setEvents(rollbackEvents);
                eventsCache.set(rentalId, rollbackEvents);

                setError("Erreur lors de l'ajout de l'événement");

                toast(`Erreur lors de l'ajout de la réservation.`, {
                    description: 'Veuillez réessayer.',
                    position: 'bottom-left',
                });

                setIsLoading(false);
            }
        });
    }, [events]);

    const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
        setIsLoading(true);
        setError(null);

        const originalEvent = events.find(e => e.id === updatedEvent.id);

        const updatedEvents = events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
        setEvents(updatedEvents);
        eventsCache.set(rentalId, updatedEvents);

        router.put(`/reservation/${updatedEvent.id}`, {
            client_name: updatedEvent.name,
            price: updatedEvent.price,
            description: updatedEvent.description,
            start_date: updatedEvent.start,
            end_date: updatedEvent.end,
            platform: updatedEvent.platform,
            color: updatedEvent.color
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast(`La location de "${updatedEvent.name}" a été modifiée.`, {
                    description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                    position: 'bottom-left',
                });
                setIsLoading(false);
            },
            onError: () => {
                setError("Erreur lors de la mise à jour de l'événement");

                if (originalEvent) {
                    const rollbackEvents = events.map(event =>
                        event.id === updatedEvent.id ? originalEvent : event
                    );
                    setEvents(rollbackEvents);
                    eventsCache.set(rentalId, rollbackEvents);
                }

                toast(`Erreur lors de la modification de la réservation.`, {
                    description: 'Veuillez réessayer.',
                    position: 'bottom-left',
                });

                setIsLoading(false);
            }
        });
    }, [events, rentalId]);

    const deleteEvent = useCallback((eventId: string) => {
        setIsLoading(true);
        setError(null);

        const deletedEvent = events.find(event => event.id === eventId);

        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
        eventsCache.set(rentalId, updatedEvents);

        router.delete(`/reservation/${eventId}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast(`La location a été supprimée avec succès.`, {
                    description: format(new Date(), 'MMM d, yyyy', { locale: fr }),
                    position: 'bottom-left',
                });
                setIsLoading(false);
            },
            onError: () => {
                setError("Erreur lors de la suppression de l'événement");

                if (deletedEvent) {
                    const rollbackEvents = [...events, deletedEvent];
                    setEvents(rollbackEvents);
                    eventsCache.set(rentalId, rollbackEvents);
                }

                toast(`Erreur lors de la suppression de la réservation.`, {
                    description: 'Veuillez réessayer.',
                    position: 'bottom-left',
                });

                setIsLoading(false);
            }
        });
    }, [events, rentalId]);

    const refreshEvents = useCallback(async (rentalId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/rentals/${rentalId}/reservations`);
            if (!response.ok) {
                new Error("Erreur lors du chargement des événements");
            }

            const data = await response.json();

            const formattedEvents = data.map((event: CalendarEvent) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            }));

            setEvents(formattedEvents);
            eventsCache.set(rentalId, formattedEvents);

            setIsLoading(false);
        } catch (err) {
            setError("Erreur lors du rechargement des événements");
            setIsLoading(false);
            console.log(err.message)

            toast(`Erreur de synchronisation`, {
                description: 'Impossible de charger les événements depuis le serveur.',
                position: 'bottom-left',
            });
        }
    }, []);

    const clearCache = useCallback(() => {
        eventsCache.delete(rentalId);
    }, [rentalId]);

    return {
        events,
        setEvents,
        isLoading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        refreshEvents,
        clearCache
    };
}
