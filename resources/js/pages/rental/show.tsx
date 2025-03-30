import { type BreadcrumbItem, Rental } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CalendarEvent, EventCalendar } from '@/components/event-calendar';
import { useState } from 'react';
import { addDays, subDays, setHours, setMinutes } from "date-fns"

export default function Show({ rental }: { rental: Rental }) {
    const sampleEvents: CalendarEvent[] = [
        {
            id: "1",
            name: "Annual Planning",
            description: "Strategic planning for next year",
            start: subDays(new Date(), 24), // 24 days before today
            end: subDays(new Date(), 23), // 23 days before today
            color: "sky",
            platform: "leboncoin",
        },
        {
            id: "2",
            name: "Project Deadline",
            description: "Submit final deliverables",
            start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
            end: setMinutes(setHours(subDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days before
            color: "amber",
            platform: "leboncoin",
        },
        {
            id: "3",
            name: "Quarterly Budget Review",
            description: "Strategic planning for next year",
            start: subDays(new Date(), 13), // 13 days before today
            end: subDays(new Date(), 13), // 13 days before today
            color: "orange",
            platform: "leboncoin",
        },
        {
            id: "4",
            name: "Team Meeting",
            description: "Weekly team sync",
            start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
            end: setMinutes(setHours(new Date(), 11), 0), // 11:00 AM today
            color: "sky",
            platform: "airbnb",
        },
        {
            id: "5",
            name: "Lunch with Client",
            description: "Discuss new project requirements",
            start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM tomorrow
            end: setMinutes(setHours(addDays(new Date(), 1), 13), 15), // 1:15 PM tomorrow
            color: "emerald",
            platform: "leboncoin",
        },
        {
            id: "6",
            name: "Product Launch",
            description: "New product release",
            start: addDays(new Date(), 3),
            end: addDays(new Date(), 6),
            color: "violet",
            platform: "airbnb",
        },
        {
            id: "7",
            name: "Sales Conference",
            description: "Discuss about new clients",
            start: setMinutes(setHours(addDays(new Date(), 4), 14), 30), // 2:30 PM
            end: setMinutes(setHours(addDays(new Date(), 5), 14), 45), // 2:45 PM
            color: "rose",
            platform: "leboncoin",
        },
        {
            id: "8",
            name: "Team Meeting",
            description: "Weekly team sync",
            start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM
            end: setMinutes(setHours(addDays(new Date(), 5), 10), 30), // 10:30 AM
            color: "orange",
            platform: "airbnb",
        },
        {
            id: "9",
            name: "Review contracts",
            description: "Weekly team sync",
            start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM
            end: setMinutes(setHours(addDays(new Date(), 5), 15), 30), // 3:30 PM
            color: "sky",
            platform: "airbnb",
        },
        {
            id: "10",
            name: "Team Meeting",
            description: "Weekly team sync",
            start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM
            end: setMinutes(setHours(addDays(new Date(), 5), 11), 0), // 11:00 AM
            color: "amber",
            platform: "airbnb",
        },
        {
            id: "11",
            name: "Marketing Strategy Session",
            description: "Quarterly marketing planning",
            start: new Date(2025, 3, 5, 10, 0), // April 5, 2025, 10:00 AM
            end: new Date(2025, 3, 5, 15, 30), // April 5, 2025, 3:30 PM
            color: "emerald",
            platform: "leboncoin",
        },
        {
            id: "12",
            name: "Annual Shareholders Meeting",
            description: "Presentation of yearly results",
            start: new Date(2025, 3, 13), // April 13, 2025
            end: new Date(2025, 3, 13),
            color: "sky",
            platform: "airbnb",
        },
        {
            id: "13",
            name: "Product Development Workshop",
            description: "Brainstorming for new features",
            start: new Date(2025, 3, 22, 9, 0), // April 22, 2025, 9:00 AM
            end: new Date(2025, 3, 23, 17, 0), // April 23, 2025, 5:00 PM
            color: "rose",
            platform: "leboncoin",
        },
    ]

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: rental.name,
            href: rental.href,
        },
    ];

    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)

    const handleEventAdd = (event: CalendarEvent) => {
        setEvents([...events, event])
    }

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
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
