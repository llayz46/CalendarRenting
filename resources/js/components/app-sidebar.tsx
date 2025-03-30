import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type Rental } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Paramètres',
        href: '/settings/appearance',
        icon: Settings,
    }
];

export function AppSidebar() {
    const { rentalNavMenu } = usePage<{ rentalNavMenu: Rental[] }>().props;

    const staticNavItems: NavItem[] = [
        { title: 'Calendrier Test', href: '/calendar', icon: Calendar }
    ];

    const rentalNavItems: NavItem[] = rentalNavMenu.map((rental: Rental) => ({
        title: rental.name || `Rental #${rental.id}`,
        // href: `/rentals/${rental.id}`,
        href: `/`,
        icon: Calendar,
    }));

    const mainNavItems = [...staticNavItems, ...rentalNavItems];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
