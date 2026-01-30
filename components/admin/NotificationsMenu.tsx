'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { markAsRead } from '@/app/actions/admin/notifications';

interface Notification {
    id: string;
    title: string;
    message?: string;
    type: 'info' | 'success' | 'warning' | 'error';
    category: string;
    is_read: boolean;
    created_at: string;
    link?: string;
}

interface NotificationsMenuProps {
    notifications: Notification[];
    unreadCount: number;
}

const TYPE_ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
};

const TYPE_COLORS = {
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    success: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    error: 'text-red-500 bg-red-50 dark:bg-red-900/20'
};

export default function NotificationsMenu({ notifications, unreadCount }: NotificationsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [optimisticUnread, setOptimisticUnread] = useState(unreadCount);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setOptimisticUnread(unreadCount);
    }, [unreadCount]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = async (n: Notification) => {
        setIsOpen(false);
        if (!n.is_read) {
            setOptimisticUnread(prev => Math.max(0, prev - 1));
            await markAsRead(n.id);
            router.refresh();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
                <Bell className="w-5 h-5" />
                {optimisticUnread > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950">
                        {optimisticUnread > 9 ? '9+' : optimisticUnread}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                        <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
                        <Link href="/admin/notifications" onClick={() => setIsOpen(false)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                            View All
                        </Link>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {notifications.map((n) => {
                                    const Icon = TYPE_ICONS[n.type] || Info;
                                    const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.info;

                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => handleItemClick(n)}
                                            className={`p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${!n.is_read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${colorClass}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className={`text-sm font-bold ${!n.is_read ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2">
                                                            {new Date(n.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {n.message && (
                                                        <p className="text-xs text-zinc-500 line-clamp-2 mb-2">
                                                            {n.message}
                                                        </p>
                                                    )}
                                                    {n.category && (
                                                        <span className="inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] rounded-md font-bold uppercase tracking-wide">
                                                            {n.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {!n.is_read && (
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Bell className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                                <p className="text-zinc-400 text-sm font-medium">All caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
