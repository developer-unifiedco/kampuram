import { LucideIcon } from 'lucide-react';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
}

export interface AdminSharedData {
    name: string;
    auth: {
        admin: AdminUser | null;
        user?: User | null;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
}

export interface AdminListingItem {
    id: number;
    title: string;
    description: string | null;
    service_formats: string | null;
    price: string | number | null;
    status: number;
    status_label: string;
    media_type: number | null;
    media_original_name: string | null;
    media_url: string | null;
    poster_url: string | null;
    sort_order: number;
    can_move_up: boolean;
    can_move_down: boolean;
    created_at?: string;
}

export interface Auth {
    user: User;
    admin?: AdminUser | null;
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
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
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
