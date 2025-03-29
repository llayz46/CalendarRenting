import Comp542 from '@/components/comp-542';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar test',
        href: '/calendar',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Comp542 />
            </div>
        </AppLayout>
    );
}
