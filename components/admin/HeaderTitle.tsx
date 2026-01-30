'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const PAGE_TITLES: Record<string, string> = {
    '/admin/dashboard': 'Dashboard Overview',
    '/admin/orders': 'Orders',
    '/admin/customers': 'Customers',
    '/admin/products': 'Products & Plans',
    '/admin/subscriptions': 'IPTV Subscriptions',
    '/admin/tickets': 'Support Tickets',
    '/admin/chat': 'Support Chat',
    '/admin/inbox': 'Support Inbox',
    '/admin/team': 'Team Management',
    '/admin/analytics': 'Business Intelligence',
    '/admin/logs': 'Audit Trail',
    '/admin/marketing': 'Email Marketing',
    '/admin/notifications': 'Notifications',
    '/admin/settings': 'Settings',
    '/admin/coupons': 'Coupons & Discounts'
};

export default function HeaderTitle() {
    const pathname = usePathname();

    const title = useMemo(() => {
        if (!pathname) return 'Admin Panel';

        // Exact match
        if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

        // Fallback for dynamic routes like /admin/customers/123
        if (pathname.startsWith('/admin/customers/')) return 'Customer Profile';
        if (pathname.startsWith('/admin/orders/')) return 'Order Details';
        if (pathname.startsWith('/admin/tickets/')) return 'Ticket Detais';

        // Generic fallback: capitalize last segment
        const segments = pathname.split('/').filter(Boolean);
        const lastLength = segments.length;
        if (lastLength > 0) {
            const last = segments[lastLength - 1];
            return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
        }

        return 'Admin Panel';
    }, [pathname]);

    return (
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mr-4 min-w-[200px] truncate hidden md:block">
            {title}
        </h1>
    );
}
