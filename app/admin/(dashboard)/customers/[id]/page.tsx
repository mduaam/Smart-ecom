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
                {/* Orders List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-xl font-bold dark:text-white">Order History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="py-4 px-6">Order</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {customer.orders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group relative">
                                            <td className="py-4 px-6 font-bold text-indigo-600">
                                                <Link href={`/admin/orders?orderId=${order.id}`} className="hover:underline">
                                                    #{order.order_number || order.id.slice(0, 8)}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-zinc-500">
                                                <Link href={`/admin/orders?orderId=${order.id}`} className="block w-full h-full">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Link href={`/admin/orders?orderId=${order.id}`} className="block w-full h-full">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.payment_status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-zinc-100 text-zinc-700'
                                                        }`}>
                                                        {order.payment_status}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                                                <Link href={`/admin/orders?orderId=${order.id}`} className="block w-full h-full">
                                                    ${order.total_amount.toFixed(2)}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {customer.orders.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-zinc-500">No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Addresses & Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-zinc-400" />
                            Default Address
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">Billing Address</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{customer.billing_address}</p>
                            </div>
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1">Shipping Address</p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{customer.shipping_address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
