'use client';

import { RiCalendarCheckLine } from '@remixicon/react';
import { addDays, addMonths, addWeeks, endOfWeek, format, isSameMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
    AgendaDaysToShow,
    AgendaView,
    CalendarDndProvider,
    CalendarEvent,
    CalendarView,
    DayView,
    EventDialog,
    EventGap,
    EventHeight,
    MonthView,
    WeekCellsHeight,
    WeekView,
} from '@/components/event-calendar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface EventCalendarProps {
    events?: CalendarEvent[];
    onEventAdd?: (event: CalendarEvent) => void;
    onEventUpdate?: (event: CalendarEvent) => void;
    onEventDelete?: (eventId: string) => void;
    className?: string;
    initialView?: CalendarView;
}

export function EventCalendar({ events = [], onEventAdd, onEventUpdate, onEventDelete, className, initialView = 'month' }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>(initialView);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Add keyboard shortcuts for view switching
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if user is typing in an input, textarea or contentEditable element
            // or if the event dialog is open
            if (
                isEventDialogOpen ||
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target instanceof HTMLElement && e.target.isContentEditable)
            ) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'm':
                    setView('month');
                    break;
                case 'w':
                    setView('week');
                    break;
                case 'd':
                    setView('day');
                    break;
                case 'a':
                    setView('agenda');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEventDialogOpen]);

    const handlePrevious = () => {
        if (view === 'month') {
            setCurrentDate(subMonths(currentDate, 1));
        } else if (view === 'week') {
            setCurrentDate(subWeeks(currentDate, 1));
        } else if (view === 'day') {
            setCurrentDate(addDays(currentDate, -1));
        } else if (view === 'agenda') {
            // For agenda view, go back 30 days (a full month)
            setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(addMonths(currentDate, 1));
        } else if (view === 'week') {
            setCurrentDate(addWeeks(currentDate, 1));
        } else if (view === 'day') {
            setCurrentDate(addDays(currentDate, 1));
        } else if (view === 'agenda') {
            // For agenda view, go forward 30 days (a full month)
            setCurrentDate(addDays(currentDate, AgendaDaysToShow));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleEventSelect = (event: CalendarEvent) => {
        console.log('handleEventSelect:', event);
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
    };

    const handleEventCreate = (startTime: Date) => {
        const newEvent: CalendarEvent = {
            id: '',
            name: '',
            description: '',
            price: 0,
            platform: 'airbnb',
            start: startTime,
            end: addDays(startTime, 7),
        };
        setSelectedEvent(newEvent);
        setIsEventDialogOpen(true);
    };

    const handleEventSave = (event: CalendarEvent) => {
        if (event.id) {
            onEventUpdate?.(event);
        } else {
            onEventAdd?.(event);
        }
        setIsEventDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleEventDelete = (eventId: string) => {
        onEventDelete?.(eventId);
        setIsEventDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        onEventUpdate?.(updatedEvent);
    };

    const viewNames: Record<string, string> = {
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        agenda: 'Agenda',
    };

    const viewTitle = useMemo(() => {
        if (view === 'month') {
            return format(currentDate, 'MMMM yyyy', { locale: fr });
        } else if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 0, locale: fr });
            const end = endOfWeek(currentDate, { weekStartsOn: 0, locale: fr });
            if (isSameMonth(start, end)) {
                return format(start, 'MMMM yyyy', { locale: fr });
            } else {
                return `${format(start, 'MMM', { locale: fr })} - ${format(end, 'MMM yyyy', { locale: fr })}`;
            }
        } else if (view === 'day') {
            return (
                <>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                        {format(currentDate, 'MMM d, yyyy')}
                    </span>
                    <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
                        {format(currentDate, 'MMMM d, yyyy')}
                    </span>
                    <span className="max-md:hidden">{format(currentDate, 'EEE MMMM d, yyyy')}</span>
                </>
            );
        } else if (view === 'agenda') {
            // Show the month range for agenda view
            const start = currentDate;
            const end = addDays(currentDate, AgendaDaysToShow - 1);

            if (isSameMonth(start, end)) {
                return format(start, 'MMMM yyyy', { locale: fr });
            } else {
                return `${format(start, 'MMM', { locale: fr })} - ${format(end, 'MMM yyyy', { locale: fr })}`;
            }
        } else {
            return format(currentDate, 'MMMM yyyy', { locale: fr });
        }
    }, [currentDate, view]);

    return (
        <div
            className="flex flex-1 flex-col rounded-lg border"
            style={
                {
                    '--event-height': `${EventHeight}px`,
                    '--event-gap': `${EventGap}px`,
                    '--week-cells-height': `${WeekCellsHeight}px`,
                } as React.CSSProperties
            }
        >
            <CalendarDndProvider onEventUpdate={handleEventUpdate}>
                <div className={cn('flex items-center justify-between p-2 sm:p-4', className)}>
                    <div className="flex items-center gap-1 sm:gap-4">
                        <Button variant="outline" className="max-[479px]:p-0! cursor-pointer" onClick={handleToday}>
                            <RiCalendarCheckLine className="min-[480px]:hidden" size={16} aria-hidden="true" />
                            <span className="max-[479px]:sr-only">Aujourd'hui</span>
                        </Button>
                        <div className="flex items-center sm:gap-2">
                            <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label="Previous">
                                <ChevronLeftIcon size={16} aria-hidden="true" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next">
                                <ChevronRightIcon size={16} aria-hidden="true" />
                            </Button>
                        </div>
                        <h2 className="text-sm font-semibold sm:text-lg md:text-xl capitalize">{viewTitle}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                                    <span>
                                        <span className="min-[480px]:hidden" aria-hidden="true">
                                            {view.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="max-[479px]:sr-only">{viewNames[view]?.charAt(0).toUpperCase() + viewNames[view]?.slice(1)}</span>
                                    </span>
                                    <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-32">
                                <DropdownMenuItem onClick={() => setView('month')}>
                                    Mois <DropdownMenuShortcut>M</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setView('week')}>
                                    Semaine <DropdownMenuShortcut>W</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setView('day')}>
                                    Jour <DropdownMenuShortcut>D</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setView('agenda')}>
                                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            className="max-[479px]:p-0! cursor-pointer"
                            onClick={() => {
                                setSelectedEvent(null); // Ensure we're creating a new event
                                setIsEventDialogOpen(true);
                            }}
                        >
                            <PlusIcon className="opacity-60 sm:-ms-1" size={16} aria-hidden="true" />
                            <span className="max-sm:sr-only">Ajouter une réservation</span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col">
                    {view === 'month' && (
                        <MonthView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
                    )}
                    {view === 'week' && (
                        <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
                    )}
                    {view === 'day' && (
                        <DayView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} onEventCreate={handleEventCreate} />
                    )}
                    {view === 'agenda' && <AgendaView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />}
                </div>

                <EventDialog
                    event={selectedEvent}
                    isOpen={isEventDialogOpen}
                    onClose={() => {
                        setIsEventDialogOpen(false);
                        setSelectedEvent(null);
                    }}
                    onSave={handleEventSave}
                    onDelete={handleEventDelete}
                />
            </CalendarDndProvider>
        </div>
    );
}
