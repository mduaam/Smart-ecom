import React from 'react';
import Link from 'next/link';
import { getCustomerDetails } from '@/app/actions/admin/customers';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, DollarSign, ShoppingBag, CreditCard } from 'lucide-react';
import CustomerDetailActions from '../_components/CustomerDetailActions';

interface Params {
    params: {
        id: string;
    };
}

export default async function CustomerDetailPage({ params }: Params) {
    const { id } = await params;
    const { data: customer, error } = await getCustomerDetails(id);

    if (error || !customer) {
        return (
            <div className="p-8">
                <div className="text-red-500 mb-4">Error loading customer: {error || 'Customer not found'}</div>
                <Link href="/admin/customers" className="text-indigo-600 hover:underline">
                    &larr; Back to Customers
                </Link>
            </div>
        );
    }

    return (
        <main className="p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/customers" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Customers
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{customer.full_name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {customer.phone}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined {new Date(customer.join_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex gap-3">
                            <CustomerDetailActions id={id} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-zinc-500">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wide">Total Spent</span>
                    </div>
                    <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">${customer.total_spent.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-zinc-500">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wide">Total Orders</span>
                    </div>
                    <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{customer.orders_count}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-zinc-500">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wide">Average Order</span>
                    </div>
                    <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                        ${customer.orders_count > 0 ? (customer.total_spent / customer.orders_count).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Tabs/Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Subscriptions Section */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                            <h3 className="text-xl font-black dark:text-white tracking-tight">Active Subscriptions</h3>
                            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{customer.subscriptions.length} Lines</span>
                        </div>
                        <div className="p-8">
                            <div className="grid gap-4">
                                {customer.subscriptions.map((sub: any) => (
                                    <div key={sub.id} className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center group hover:border-indigo-500/50 transition-all">
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-tight">{sub.plan_id}</p>
                                            <p className="text-xs text-zinc-500 flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> Expires: {new Date(sub.current_period_end).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Link href="/admin/subscriptions" className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CreditCard className="w-4 h-4 text-indigo-600" />
                                        </Link>
                                    </div>
                                ))}
                                {customer.subscriptions.length === 0 && (
                                    <p className="text-center py-8 text-zinc-500 italic">No active subscriptions found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                            <h3 className="text-xl font-black dark:text-white tracking-tight">Order History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="py-6 px-8">Order</th>
                                        <th className="py-6 px-8">Date</th>
                                        <th className="py-6 px-8">Status</th>
                                        <th className="py-6 px-8">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {customer.orders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                                            <td className="py-6 px-8 font-black text-indigo-600">
                                                <Link href={`/admin/orders?orderId=${order.id}`} className="hover:underline">
                                                    #{order.order_number || order.id.slice(0, 8)}
                                                </Link>
                                            </td>
                                            <td className="py-6 px-8 text-sm text-zinc-500 font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                        'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                                                    }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 font-black text-zinc-900 dark:text-white">
                                                ${order.final_amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Support & Reviews Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tickets */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl p-8">
                            <h3 className="text-lg font-black dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-indigo-600" /> Support Tickets
                            </h3>
                            <div className="space-y-4">
                                {customer.tickets.map((ticket: any) => (
                                    <div key={ticket.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                        <p className="text-sm font-bold dark:text-white truncate">{ticket.subject}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${ticket.status === 'open' ? 'text-blue-500' : 'text-zinc-500'}`}>
                                                {ticket.status}
                                            </span>
                                            <Link href={`/admin/tickets/${ticket.id}`} className="text-xs text-indigo-600 font-bold hover:underline">View</Link>
                                        </div>
                                    </div>
                                ))}
                                {customer.tickets.length === 0 && <p className="text-xs text-zinc-500 italic">No tickets found.</p>}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl p-8">
                            <h3 className="text-lg font-black dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600" /> Reviews
                            </h3>
                            <div className="space-y-4">
                                {customer.reviews.map((review: any) => (
                                    <div key={review.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(review.rating)].map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />)}
                                        </div>
                                        <p className="text-sm font-bold dark:text-white truncate">{review.title}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase font-black">{review.status}</p>
                                    </div>
                                ))}
                                {customer.reviews.length === 0 && <p className="text-xs text-zinc-500 italic">No reviews found.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Addresses & Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="text-lg font-black dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                            <MapPin className="w-6 h-6 text-indigo-600" />
                            Default Address
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Billing Address</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium whitespace-pre-line leading-relaxed">{customer.billing_address}</p>
                            </div>
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Shipping Address</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium whitespace-pre-line leading-relaxed">{customer.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">VIP Status</h3>
                        <p className="text-zinc-500 text-xs font-medium mb-6">Internal operational notes and scoring.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-xs text-zinc-400 font-bold uppercase">Loyalty Score</span>
                                <span className="text-indigo-400 font-black">9.8/10</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-xs text-zinc-400 font-bold uppercase">Risk Level</span>
                                <span className="text-green-500 font-black">Low</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
