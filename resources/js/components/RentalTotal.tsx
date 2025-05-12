import { useYearContext } from '@/context/year-context';
import { YearSelect } from '@/components/YearSelect';

export function RentalTotal() {
    const { totalPrice, selectedYear } = useYearContext();

    return (
        <div className="flex justify-between items-center">
            <span className="text-xl">
                Revenu total en {selectedYear} :
                <span className="font-medium text-indigo-600 dark:text-indigo-200"> {totalPrice?.toLocaleString('fr-FR')} €</span>
            </span>

            <YearSelect />
        </div>
    )
}
