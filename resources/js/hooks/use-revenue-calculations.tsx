import { useMemo } from 'react';
import { type Reservation } from '@/types';

type UseRevenueCalculationsProps = {
    allReservations: Reservation[];
    selectedYear: number;
    selectedMonths?: number[];
};

export function useRevenueCalculations({ allReservations, selectedYear, selectedMonths }: UseRevenueCalculationsProps) {
    // const totalRevenuePerYear = useMemo(() => {
    //     return allReservations.reduce((acc: Record<number, number>, reservation: Reservation) => {
    //         const year = new Date(reservation.start_date).getFullYear();
    //         acc[year] = (acc[year] || 0) + reservation.price;
    //         return acc;
    //     }, {});
    // }, [allReservations]);
    //
    // const calculateRevenueChange = (totalRevenuePerYear: Record<number, number>, selectedYear: number) => {
    //     const currentRevenue = totalRevenuePerYear[selectedYear] || 0;
    //     console.log("currentRevenue", currentRevenue);
    //
    //     const previousYears = Object.keys(totalRevenuePerYear)
    //         .map(Number)
    //         .filter(year => year < selectedYear);
    //
    //     if (previousYears.length === 0) {
    //         return currentRevenue > 0 ? 100 : 0;
    //     }
    //
    //     const closestPreviousYear = Math.max(...previousYears);
    //     const previousRevenue = totalRevenuePerYear[closestPreviousYear] || 0;
    //     console.log("previousRevenue", previousRevenue);
    //
    //     if (previousRevenue === 0) {
    //         return currentRevenue > 0 ? 100 : 0;
    //     }
    //
    //     const percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    //     console.log("percentageChange", percentageChange);
    //
    //     if (percentageChange > 999) return 999;
    //
    //     return Number(percentageChange.toFixed(2));
    // };
    //
    // const revenueChange = useMemo(() => {
    //     return calculateRevenueChange(totalRevenuePerYear, selectedYear);
    // }, [totalRevenuePerYear, selectedYear]);
    //
    // return {
    //     totalRevenuePerYear,
    //     revenueChange
    // };

    const totalRevenuePerYear = useMemo(() => {
        return allReservations.reduce((acc: Record<number, number>, reservation: Reservation) => {
            const date = new Date(reservation.start_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JS: janvier = 0 → on ajoute 1

            // Si des mois sont définis, on les filtre
            if (selectedMonths && !selectedMonths.includes(month)) {
                return acc;
            }

            acc[year] = (acc[year] || 0) + reservation.price;
            return acc;
        }, {});
    }, [allReservations, selectedMonths]);

    const calculateRevenueChange = (totalRevenuePerYear: Record<number, number>, selectedYear: number) => {
        const currentRevenue = totalRevenuePerYear[selectedYear] || 0;

        const previousYears = Object.keys(totalRevenuePerYear)
            .map(Number)
            .filter(year => year < selectedYear);

        if (previousYears.length === 0) {
            return currentRevenue > 0 ? 100 : 0;
        }

        const closestPreviousYear = Math.max(...previousYears);
        const previousRevenue = totalRevenuePerYear[closestPreviousYear] || 0;

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
