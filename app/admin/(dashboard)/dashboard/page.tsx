import Link from 'next/link';
import React from 'react';
import {
    Users,
    ShoppingBag,
    Activity,
    MessageSquare,
    DollarSign,
    Search,
} from 'lucide-react';

import AnalyticsChart from '@/components/admin/AnalyticsChart';
import { getAdminDashboardStats } from '@/app/actions/admin/dashboard';

function getStatusStyle(status: string) {
    const styles: Record<string, string> = {
        paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        unpaid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        refunded: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
        active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        pending: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
    };
    return styles[status] || styles.pending;
}

interface AdminDashboardProps {
    searchParams: {
        period?: string;
    };
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
    // Await searchParams before accessing properties
    const resolvedSearchParams = await searchParams;
    const period = (resolvedSearchParams.period as 'daily' | 'monthly' | 'yearly') || 'monthly';
    const { stats, recentOrders, chartData, user, error } = await getAdminDashboardStats(period);

    if (error) {
        return (
            <main className="p-4 md:p-8 lg:p-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-3xl text-red-600 dark:text-red-400">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5" />
                        <h2 className="font-bold">Dashboard Error</h2>
                    </div>
                    <p className="text-sm">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-zinc-500">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            {/* Analytics Chart Section */}
            <div className="mb-12 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Revenue Analytics</h3>
                        <p className="text-sm text-zinc-500">Revenue over the last {period === 'daily' ? '30 days' : period === 'yearly' ? '5 years' : '12 months'}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="?period=daily"
                            scroll={false}
                            className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${period === 'daily'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            Daily
                        </Link>
                        <Link
                            href="?period=monthly"
                            scroll={false}
                            className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${period === 'monthly'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            Monthly
                        </Link>
                        <Link
                            href="?period=yearly"
                            scroll={false}
                            className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${period === 'yearly'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            Yearly
                        </Link>
                    </div>
                </div>
                <AnalyticsChart data={chartData} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, change: stats.trends?.revenue || '+0%', icon: <DollarSign className="w-6 h-6" />, color: 'indigo', href: '/admin/orders' },
                    { label: 'Total Orders', value: stats.orders.toString(), change: stats.trends?.orders || '+0%', icon: <ShoppingBag className="w-6 h-6" />, color: 'purple', href: '/admin/orders' },
                    { label: 'Active Users', value: stats.users.toString(), change: stats.trends?.users || '+0%', icon: <Users className="w-6 h-6" />, color: 'green', href: '/admin/customers' },
                    { label: 'Open Tickets', value: stats.openTickets.toString(), change: '0', icon: <MessageSquare className="w-6 h-6" />, color: 'orange', href: '/admin/tickets' },
                ].map((stat, i) => (
                    <Link href={stat.href} key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 block">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-950/30 text-${stat.color}-600`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-500 mb-1 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-extrabold dark:text-white">{stat.value}</p>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 -translate-y-1/2 translate-x-1/2 rounded-full -z-0 opacity-20 group-hover:scale-150 transition-all"></div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="text-xl font-bold dark:text-white">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-indigo-600 font-bold text-sm hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-950/50 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    <th className="py-4 px-8">Customer</th>
                                    <th className="py-4 px-8">Plan</th>
                                    <th className="py-4 px-8">Amount</th>
                                    <th className="py-4 px-8">Status</th>
                                    <th className="py-4 px-8">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-sm group cursor-pointer relative">
                                        <td className="py-4 px-8 relative">
                                            <div className="font-bold dark:text-white">{order.customer_name || 'Unknown'}</div>
                                            <div className="text-xs text-zinc-400">{order.customer_email || 'No Email'}</div>
                                            <Link href="/admin/orders" className="absolute inset-0 z-10" aria-label="View Order" />
                                        </td>
                                        <td className="py-4 px-8 text-zinc-600 dark:text-zinc-400 font-medium">{order.plan_name || 'N/A'}</td>
                                        <td className="py-4 px-8 font-bold dark:text-white">${order.final_amount.toFixed(2)}</td>
                                        <td className="py-4 px-8">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(order.fulfillment_status)}`}>
                                                    {order.fulfillment_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-8 text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-zinc-500">No recent orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity & Tickets */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all h-full">
                        <h3 className="text-xl font-bold dark:text-white mb-8">Active Subscriptions</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold">~</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white">Premium (1 Year)</p>
                                    <p className="text-xs text-zinc-400 text-zinc-500">{stats.subscriptions?.premium || 0} active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-bold">~</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white">Standard (6 Months)</p>
                                    <p className="text-xs text-zinc-500">{stats.subscriptions?.standard || 0} active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center font-bold">~</div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white">Basic (1 Month)</p>
                                    <p className="text-xs text-zinc-500">{stats.subscriptions?.basic || 0} active</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/admin/orders" className="w-full mt-10 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-bold text-sm dark:text-white hover:shadow-lg transition-all block text-center hover:bg-zinc-200 dark:hover:bg-zinc-700">
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};
