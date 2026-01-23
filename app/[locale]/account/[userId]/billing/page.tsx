import React from 'react';
import { getUserOrders } from '@/app/actions/user_orders';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { CreditCard, Download, FileText } from 'lucide-react';

export default async function BillingPage({ params }: { params: Promise<{ locale: string, userId: string }> }) {
    const { locale, userId } = await params;
    const t = await getTranslations({ locale });
    const { data: orders, error } = await getUserOrders();

    if (error) {
        // Handle error
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white mb-2">Billing & Invoices</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">View your payment history and download invoices</p>
                        </div>
                        <Link
                            href={`/account/${userId}/dashboard`}
                            className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold dark:text-white">Payment Method</h3>
                            </div>
                            <p className="text-zinc-500 text-sm mb-4">Secure checkout provided by our payment partners.</p>
                            <button className="text-sm font-bold text-indigo-600 hover:underline">Manage Payment Methods</button>
                        </div>
                        {/* More Billing Stats could go here */}
                    </div>

                    {/* Invoices List (Derived from Orders) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-xl font-bold dark:text-white">Invoice History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Invoice ID</th>
                                        <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                                        <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {orders && orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <td className="py-4 px-6 font-mono text-sm font-bold text-zinc-500 dark:text-zinc-400">
                                                    INV-{order.id.slice(0, 8).toUpperCase()}
                                                </td>
                                                <td className="py-4 px-6 text-sm dark:text-white">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-bold dark:text-white">
                                                    ${order.total_amount.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase
                                                        ${order.status === 'paid'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : order.status === 'refunded'
                                                                ? 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                                                        <FileText className="w-4 h-4" />
                                                        PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-zinc-500">No invoices found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
