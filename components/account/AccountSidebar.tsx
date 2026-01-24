'use client';

import { LayoutDashboard, ShoppingBag, CreditCard, Ticket, Settings, Activity, LogOut } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function AccountSidebar({
    displayName,
    isPremium,
    logoutAction
}: {
    displayName: string,
    isPremium: boolean,
    logoutAction: () => void
}) {
    const t = useTranslations('Account');
    const params = useParams();
    const userId = params.userId as string;

    const navItems = [
        { name: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, href: `/account/${userId}/dashboard` },
        { name: t('sidebar.subscriptions'), icon: <Activity className="w-5 h-5" />, href: `/account/${userId}/subscriptions` },
        { name: t('sidebar.orders'), icon: <ShoppingBag className="w-5 h-5" />, href: `/account/${userId}/orders` },
        { name: t('sidebar.tickets'), icon: <Ticket className="w-5 h-5" />, href: `/account/${userId}/tickets` },
        { name: t('sidebar.billing'), icon: <CreditCard className="w-5 h-5" />, href: `/account/${userId}/billing` },
        { name: t('sidebar.settings'), icon: <Settings className="w-5 h-5" />, href: `/account/${userId}/settings` },
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="flex items-center gap-4 p-4 mb-6 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase">
                        {displayName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold dark:text-white truncate" title={displayName}>{displayName}</p>
                        <p className="text-xs text-indigo-600 font-bold uppercase truncate">{isPremium ? 'PREMIUM USER' : 'FREE USER'}</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <SidebarLink key={item.href} item={item} />
                    ))}
                </nav>

                <div className="mt-10 p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <form action={logoutAction}>
                        <button className="w-full py-4 flex items-center justify-center gap-2 font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-all">
                            <LogOut className="w-4 h-4" />
                            {t('sidebar.logout')}
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}

import { usePathname } from '@/navigation';

function SidebarLink({ item }: { item: any }) {
    const pathname = usePathname();
    // Check if pathname ends with the route part. 
    // item.href is like /account/[userId]/dashboard. 
    // pathname might be /en/account/123/dashboard.
    // We can check if pathname includes the non-localized part?
    // Simplest: if (pathname === item.href) or if (pathname.endsWith(item.href))
    // But item.href has userId.

    const isActive = pathname === item.href || pathname.endsWith(item.href);

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
        >
            {item.icon}
            {item.name}
        </Link>
    );
}
