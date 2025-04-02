import { createContext, useContext, ReactNode } from 'react';
import { useYears } from '@/hooks/use-year';
import { type Reservation } from '@/types';

type YearContextType = {
    years: number[];
    selectedYear: number;
    isLoading: boolean;
    error: string | null;
    changeYear: (year: string | number) => void;
    reservations: Reservation[];
    allReservations: Reservation[];
    refreshData: () => Promise<void>;
};

const YearContext = createContext<YearContextType | undefined>(undefined);

type YearProviderProps = {
    children: ReactNode;
    rentalId: number;
    initialYear: number;
};

export function YearProvider({ children, rentalId, initialYear }: YearProviderProps) {
    const yearData = useYears(rentalId, initialYear);

    return (
        <YearContext.Provider value={yearData}>
            {children}
        </YearContext.Provider>
    );
}

export function useYearContext() {
    const context = useContext(YearContext);

    if (context === undefined) {
        throw new Error('useYearContext doit être utilisé à l\'intérieur d\'un YearProvider');
    }

    return context;
}
