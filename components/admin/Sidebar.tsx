'use client';

import {
    Activity, ShoppingBag, Package, Users, MessageSquare,
    Tag, Mail, Bell, Star, Layout, ShieldCheck, BarChart3,
    Zap, Headphones
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
    className?: string;
    onLinkClick?: () => void;
}

export default function Sidebar({ className = "hidden lg:flex", onLinkClick }: SidebarProps) {
    const pathname = usePathname();
    const menuItems = [
        { name: 'Dashboard', icon: <Activity className="w-5 h-5" />, href: '/admin/dashboard' },
        { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/analytics' },
        { name: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, href: '/admin/orders' },
        { name: 'Subscriptions', icon: <Zap className="w-5 h-5" />, href: '/admin/subscriptions' },
        { name: 'Products', icon: <Package className="w-5 h-5" />, href: '/admin/products' },
        { name: 'Customers', icon: <Users className="w-5 h-5" />, href: '/admin/customers' },
        { name: 'Tickets', icon: <Headphones className="w-5 h-5" />, href: '/admin/tickets' },
        { name: 'Coupons', icon: <Tag className="w-5 h-5" />, href: '/admin/coupons' },
        { name: 'Marketing', icon: <Mail className="w-5 h-5" />, href: '/admin/marketing' },
        { name: 'Reviews', icon: <Star className="w-5 h-5" />, href: '/admin/reviews' },
        { name: 'Notifications', icon: <Bell className="w-5 h-5" />, href: '/admin/notifications' },
        { name: 'Audit Logs', icon: <ShieldCheck className="w-5 h-5" />, href: '/admin/logs' },
        { name: 'Team', icon: <Users className="w-5 h-5" />, href: '/admin/team' },
        { name: 'CMS', icon: <Layout className="w-5 h-5" />, href: '/admin/cms' },
    ];

    return (
        <aside className={`w-64 bg-zinc-900 text-zinc-400 p-8 flex flex-col h-screen sticky top-0 ${className}`}>
            <div className="flex items-center gap-3 mb-12 text-white">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold">A</div>
                <span className="text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="space-y-2 flex-1 overflow-y-auto pr-2 admin-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onLinkClick}
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
