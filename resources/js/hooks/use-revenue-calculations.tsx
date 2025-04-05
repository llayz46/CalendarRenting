import { useMemo } from 'react';
import { type Reservation } from '@/types';

export function useRevenueCalculations({ allReservations, selectedYear }: { allReservations: Reservation[]; selectedYear: number }) {
    const totalRevenuePerYear = useMemo(() => {
        return allReservations.reduce((acc: Record<number, number>, reservation: Reservation) => {
            const year = new Date(reservation.start_date).getFullYear();
            acc[year] = (acc[year] || 0) + reservation.price;
            return acc;
        }, {});
    }, [allReservations]);

    const calculateRevenueChange = (totalRevenuePerYear: Record<number, number>, selectedYear: number) => {
        const currentRevenue = totalRevenuePerYear[selectedYear] || 0;
        const previousRevenue = totalRevenuePerYear[selectedYear - 1] || 0;

        if (previousRevenue === 0) {
            return currentRevenue > 0 ? 100 : 0;
        }

        const percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

        if (percentageChange > 999) return 999;

        return Number(percentageChange.toFixed(2));
    };

    const revenueChange = useMemo(() => {
        return calculateRevenueChange(totalRevenuePerYear, selectedYear);
    }, [totalRevenuePerYear, selectedYear]);

    return {
        totalRevenuePerYear,
        revenueChange
    };
}
