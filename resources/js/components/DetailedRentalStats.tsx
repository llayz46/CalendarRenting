"use client"

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { type Rental, type Reservation } from '@/types';
import { useYearContext } from '@/context/year-context';
import { YearSelect } from '@/components/YearSelect';
import { useRevenueCalculations } from '@/hooks/use-revenue-calculations';
import { useMemo } from 'react';
import { RentalSelect } from '@/components/RentalSelect';

const chartConfig = {
    revenu: {
        label: "Revenu",
        color: "var(--chart-1)",
    },
    airbnb: {
        label: "Airbnb",
        color: "var(--chart-2)",
    },
    leboncoin: {
        label: "Leboncoin",
        color: "var(--chart-3)",
    }
} satisfies ChartConfig

const MAY_OCTOBER_MONTHS = [5, 6, 7, 8, 9, 10];

export function DetailedRentalStats({ rentals }: { rentals: Rental[] }) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
            <div className="border-sidebar-border/70 dark:border-sidebar-border border-b">
                <div className="flex items-center justify-between p-4">
                    <RentalSelect rentals={rentals} />

                    <YearSelect />
                </div>
            </div>

            <div className="grid auto-rows-min gap-4 p-6 md:grid-cols-3 *:h-full">
                <MonthlyRevenue />
                <AnnualRevenue />
                <PlatformRevenue />
            </div>
        </div>
    );
}

function PreviousYear() {
    const { years, selectedYear } = useYearContext();
    const sortedYears = [...years].sort((a, b) => a - b);
    const index = sortedYears.indexOf(selectedYear);

    if (index > 0) {
        return sortedYears[index - 1];
    }

    return null;
}

function RevenueTrend({ change, period }: { change: number, period: string }) {
    const previousYear = PreviousYear();

    return (
        <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {change > 0 ? (
                        <>
                            En hausse de {change}% par rapport à {previousYear ?? "l'année précédente"} <TrendingUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            En baisse de {Math.abs(change)}% par rapport à {previousYear ?? "l'année précédente"} <TrendingDown className="h-4 w-4" />
                        </>
                    )}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">{period}</div>
            </div>
        </div>
    );
}

function MonthlyRevenue() {
    const { allReservations, reservations, selectedYear } = useYearContext();
    const { revenueChange } = useRevenueCalculations({ allReservations, selectedYear, selectedMonths: MAY_OCTOBER_MONTHS });

    const getMonthlyRevenue = (reservations: Reservation[]) => {
        const chartData = Array.from({ length: 6 }, (_, i) => ({
            month: ["Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre"][i],
            revenu: 0
        }));

        reservations.forEach(({ start_date, price }) => {
            const month = new Date(start_date).getMonth();
            if (month >= 4 && month <= 9) {
                chartData[month - 4].revenu += price;
            }
        });

        return chartData;
    }

    const chartData = useMemo(() => getMonthlyRevenue(reservations), [reservations]);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Revenu mensuel</CardTitle>
                <CardDescription>Affichage des revenus générés entre mai et octobre</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area dataKey="revenu" type="natural" fill="var(--color-revenu)" fillOpacity={0.4} stroke="var(--color-revenu)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="mt-auto">
                <RevenueTrend change={revenueChange} period={`Mai - Octobre ${selectedYear}`} />
            </CardFooter>
        </Card>
    )
}

function AnnualRevenue() {
    const { allReservations, selectedYear, years } = useYearContext();
    const { totalRevenuePerYear, revenueChange } = useRevenueCalculations({ allReservations, selectedYear });

    const chartData = useMemo(() => {
        return years.map((year) => ({
            year: year.toString(),
            revenu: totalRevenuePerYear[year] || 0,
        })).reverse();
    }, [years, totalRevenuePerYear]);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Revenu annuel</CardTitle>
                <CardDescription>Affichage des revenus générés entre chaque année</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="year"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                            interval={0}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area dataKey="revenu" type="linear" fill="var(--color-revenu)" fillOpacity={0.4} stroke="var(--color-revenu)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="mt-auto">
                <RevenueTrend change={revenueChange} period={String(selectedYear)} />
            </CardFooter>
        </Card>
    )
}

function PlatformRevenue() {
    const { allReservations, reservations, selectedYear } = useYearContext();
    const { revenueChange } = useRevenueCalculations({ allReservations, selectedYear, selectedMonths: MAY_OCTOBER_MONTHS });

    const getMonthlyRevenue = (reservations: Reservation[]) => {
        const chartData = Array.from({ length: 6 }, (_, i) => ({
            month: ["Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre"][i],
            leboncoin: 0,
            airbnb: 0
        }));

        reservations.forEach(({ start_date, price, platform }) => {
            const month = new Date(start_date).getMonth();

            const index = month - 4;

            if (index >= 0 && index < chartData.length) {
                if (platform === "airbnb") {
                    chartData[index].airbnb += price;
                } else if (platform === "leboncoin") {
                    chartData[index].leboncoin += price;
                }
            }
        });

        return chartData;
    }

    const chartData = useMemo(() => getMonthlyRevenue(reservations), [reservations]);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Revenu par plateforme</CardTitle>
                <CardDescription>Affichage des revenus générés sur leboncoin et airbnb</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="airbnb" fill="var(--color-airbnb)" radius={4} />
                        <Bar dataKey="leboncoin" fill="var(--color-leboncoin)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="mt-auto">
                <RevenueTrend change={revenueChange} period={`Mai - Octobre ${selectedYear}`} />
            </CardFooter>
        </Card>
    )
}
