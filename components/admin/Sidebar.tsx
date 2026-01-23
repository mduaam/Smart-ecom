'use client';

import { Activity, ShoppingBag, Package, Users, MessageSquare, DollarSign, Layout } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: <Activity className="w-5 h-5" />, href: '/admin/dashboard' },
        { name: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, href: '/admin/orders' },
        { name: 'Products', icon: <Package className="w-5 h-5" />, href: '/admin/products' },
        { name: 'Customers', icon: <Users className="w-5 h-5" />, href: '/admin/customers' },
        { name: 'Inbox', icon: <MessageSquare className="w-5 h-5" />, href: '/admin/inbox' },
        { name: 'Marketing', icon: <DollarSign className="w-5 h-5" />, href: '/admin/coupons' },
        { name: 'Team', icon: <Users className="w-5 h-5" />, href: '/admin/team' },
        { name: 'CMS', icon: <Layout className="w-5 h-5" />, href: '/admin/cms' },
    ];

    return (
        <aside className="w-64 bg-zinc-900 text-zinc-400 p-8 flex flex-col hidden lg:flex h-screen sticky top-0">
            <div className="flex items-center gap-3 mb-12 text-white">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold">A</div>
                <span className="text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all cursor-pointer ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-8 border-t border-zinc-800 text-sm">
                Logged in as <span className="text-white">Admin</span>
            </div>
        </aside>
    );
}
