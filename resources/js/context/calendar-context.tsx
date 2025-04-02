import { createContext, useContext, ReactNode, SetStateAction, Dispatch } from 'react';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarEvent } from '@/components/event-calendar';

type CalendarContextType = {
    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
    isLoading: boolean;
    error: string | null;
    addEvent: (event: CalendarEvent, rentalId: number) => void;
    updateEvent: (updatedEvent: CalendarEvent) => void;
    deleteEvent: (eventId: string) => void;
    refreshEvents: (rentalId: number) => Promise<void>;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

type CalendarProviderProps = {
    children: ReactNode;
    initialEvents: CalendarEvent[];
    rentalId: number;
};

export function CalendarProvider({ children, initialEvents, rentalId }: CalendarProviderProps) {
    const calendarData = useCalendar(initialEvents, rentalId);

    return (
        <CalendarContext.Provider value={{ ...calendarData }}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendarContext() {
    const context = useContext(CalendarContext);

    if (context === undefined) {
        throw new Error('useCalendarContext doit être utilisé à l\'intérieur d\'un CalendarProvider');
    }

    return context;
}
