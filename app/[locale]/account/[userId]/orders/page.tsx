import React from 'react';
import { getUserOrders } from '@/app/actions/user_orders';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Package, ChevronRight, AlertCircle } from 'lucide-react';

export default async function OrderHistoryPage({ params }: { params: Promise<{ locale: string, userId: string }> }) {
    const { locale, userId } = await params;
    const t = await getTranslations({ locale, namespace: 'Orders' });
    const { data: orders, error } = await getUserOrders();

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold dark:text-white mb-2">Error Loading Orders</h1>
                        <p className="text-zinc-500">{error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('title')}</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>
                        </div>
                        <Link
                            href={`/account/${userId}/dashboard`}
                            className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    {!orders || orders.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-8 h-8 text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-2">No orders found</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8">You haven't placed any orders yet.</p>
                            <Link
                                href="/plans"
                                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Browse Plans
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Order #</th>
                                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Plan</th>
                                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="font-mono text-sm font-bold text-zinc-500 dark:text-zinc-400">
                                                        #{order.order_number}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium dark:text-white">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium dark:text-white">
                                                    {order.metadata?.plan_name || 'Order'}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-bold dark:text-white">
                                                    ${order.total_amount.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {(() => {
                                                            let paymentLabel = order.payment_status || 'unpaid';
                                                            let paymentColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';

                                                            if (order.payment_status === 'paid') {
                                                                paymentColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                                                            } else if (order.payment_status === 'refunded') {
                                                                paymentColor = 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400';
                                                            }

                                                            return (
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${paymentColor}`}>
                                                                    {paymentLabel}
                                                                </span>
                                                            );
                                                        })()}

                                                        {(() => {
                                                            let fulfillmentLabel = order.fulfillment_status || 'pending';
                                                            let fulfillmentColor = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400';

                                                            if (order.fulfillment_status === 'active') {
                                                                fulfillmentColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                                                            } else if (order.fulfillment_status === 'shipped') {
                                                                fulfillmentColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
                                                            } else if (order.fulfillment_status === 'cancelled') {
                                                                fulfillmentColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                                                            }

                                                            return (
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${fulfillmentColor}`}>
                                                                    {fulfillmentLabel}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
