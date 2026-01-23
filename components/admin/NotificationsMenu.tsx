'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, ShoppingBag, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface NotificationItem {
    id: string;
    created_at: string;
    [key: string]: any;
}

interface NotificationsMenuProps {
    notifications: {
        orders: NotificationItem[];
        tickets: NotificationItem[];
    };
}

export default function NotificationsMenu({ notifications }: NotificationsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'orders' | 'tickets'>('orders');

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalCount = notifications.orders.length + notifications.tickets.length;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
                <Bell className="w-5 h-5" />
                {totalCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50">
                    <div className="flex border-b border-zinc-100 dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'orders'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Orders ({notifications.orders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'tickets'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Tickets ({notifications.tickets.length})
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {activeTab === 'orders' && (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {notifications.orders.length > 0 ? (
                                    notifications.orders.map((order: any) => (
                                        <Link
                                            key={order.id}
                                            href={`/admin/orders/${order.id}`}
                                            className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
                                                    New Order: ${order.total_amount?.toFixed(2)}
                                                </p>
                                                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 truncate mb-1">
                                                By {order.customer_name || 'Guest'}
                                            </p>
                                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                                                {order.payment_status}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-400 text-sm">No recent orders.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'tickets' && (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {notifications.tickets.length > 0 ? (
                                    notifications.tickets.map((ticket: any) => (
                                        <Link
                                            key={ticket.id}
                                            href={`/admin/tickets/${ticket.id}`}
                                            className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`text-sm font-bold ${ticket.priority === 'urgent' ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-200'}`}>
                                                    {ticket.subject}
                                                </p>
                                                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 truncate mb-1">
                                                From: {ticket.profiles?.full_name || ticket.profiles?.email || 'Unknown'}
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                                                    {ticket.status}
                                                </span>
                                                {ticket.priority === 'urgent' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-400 text-sm">No active tickets.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                        <Link href={activeTab === 'orders' ? '/admin/orders' : '/admin/tickets'} className="block w-full text-center py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                            View All {activeTab === 'orders' ? 'Orders' : 'Tickets'}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
