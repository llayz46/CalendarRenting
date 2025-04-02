import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Rental {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    reservations: Reservation[];
    reservations_count: number;
    total_price: number;
    next_reservation: Date;
    last_reservation: Date;
}

export interface Reservation {
    id: number;
    rental_id: number;
    client_name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    price: number;
    platform: 'airbnb' | 'leboncoin';
    color: 'violet' | 'rose' | 'orange' | 'emerald' | string;
    created_at: string;
    updated_at: string;
}
