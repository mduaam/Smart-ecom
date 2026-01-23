'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, MoreVertical, Download, User, Calendar, DollarSign, ShoppingBag, ArrowUpDown, Plus, Trash2, Edit } from 'lucide-react';
import { deleteCustomer } from '@/app/actions/admin/customers';
import Link from 'next/link';


interface Customer {
    id: string;
    email: string;
    full_name?: string;
    total_spent: number;
    orders_count: number;
    last_order_at: string;
    created_at: string;
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: any[] }) {
    const router = useRouter();
    // Cast initial data to strict type
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'last_order'>('last_order');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredCustomers = customers
        .filter(c => {
            const term = searchTerm.toLowerCase();
            return (
                (c.full_name?.toLowerCase() || '').includes(term) ||
                (c.email?.toLowerCase() || '').includes(term)
            );
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'spent':
                    comparison = (a.total_spent || 0) - (b.total_spent || 0);
                    break;
                case 'orders':
                    comparison = (a.orders_count || 0) - (b.orders_count || 0);
                    break;
                case 'last_order':
                    comparison = new Date(a.last_order_at || 0).getTime() - new Date(b.last_order_at || 0).getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleSort = (key: 'spent' | 'orders' | 'last_order') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc');
        }
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Total Spent', 'Orders Count', 'Last Order'];
        const csvContent = [
            headers.join(','),
            ...filteredCustomers.map(c => [
                c.id,
                `"${c.full_name || ''}"`,
                c.email,
                c.total_spent,
                c.orders_count,
                c.last_order_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header / Stats - Could add summary cards here later */}

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/admin/customers/new"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Customer
                    </Link>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-3 rounded-xl font-bold transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                                <th
                                    className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 group"
                                    onClick={() => toggleSort('spent')}
                                >
                                    <div className="flex items-center gap-1">
                                        Total Spent
                                        <ArrowUpDown className={`w-3 h-3 ${sortBy === 'spent' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </div>
                                </th>
                                <th
                                    className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 group"
                                    onClick={() => toggleSort('orders')}
                                >
                                    <div className="flex items-center gap-1">
                                        Orders
                                        <ArrowUpDown className={`w-3 h-3 ${sortBy === 'orders' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </div>
                                </th>
                                <th
                                    className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 group"
                                    onClick={() => toggleSort('last_order')}
                                >
                                    <div className="flex items-center gap-1">
                                        Last Order
                                        <ArrowUpDown className={`w-3 h-3 ${sortBy === 'last_order' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </div>
                                </th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => router.push(`/admin/customers/${customer.id}`)}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                                    {customer.full_name ? customer.full_name.substring(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-zinc-900 dark:text-white">
                                                        {customer.full_name || 'Anonymous'}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                                                <DollarSign className="w-4 h-4 text-zinc-400" />
                                                {(customer.total_spent || 0).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium text-sm">
                                                <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                                                {customer.orders_count || 0}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="text-sm text-zinc-500">
                                                {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : 'Never'}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/admin/customers/${customer.id}`);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this customer? This will also unlink their orders.')) {
                                                            const res = await deleteCustomer(customer.id);
                                                            if (res.error) {
                                                                alert(res.error);
                                                            } else {
                                                                setCustomers(prev => prev.filter(c => c.id !== customer.id));
                                                                router.refresh();
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-zinc-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>No customers found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
