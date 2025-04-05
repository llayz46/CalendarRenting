import { createContext, useContext, ReactNode } from 'react';
import { useRental } from '@/hooks/use-rental';
import { type Rental } from '@/types';

type RentalContextType = {
    selectedRental: Rental;
    rentalChange: (value: string) => void;
};

const RentalContext = createContext<RentalContextType | undefined>(undefined);

type RentalProviderProps = {
    children: ReactNode;
    rentals: Rental[];
};

export function RentalProvider({ children, rentals }: RentalProviderProps) {
    const rentalData = useRental(rentals);

    return (
        <RentalContext.Provider value={rentalData}>
            {children}
        </RentalContext.Provider>
    );
}

export function useRentalContext() {
    const context = useContext(RentalContext);

    if (context === undefined) {
        throw new Error('useRentalContext doit être utilisé à l\'intérieur d\'un RentalProvider');
    }

    return context;
}
