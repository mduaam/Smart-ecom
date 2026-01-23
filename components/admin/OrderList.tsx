'use client';

import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Trash2, X, Search, Filter, Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { createOrder, editOrder, deleteOrder, bulkUpdateOrders, bulkDeleteOrders, getAuditLogs, getAllOrders } from '@/app/actions/orders';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    plan_name: string;
    total_amount: number; // Updated from 'amount' to match DB
    discount_amount: number;
    coupon_code: string | null;
    currency: string;
    status: string; // Aggregate status (can keep this or deprecate)
    payment_status: 'paid' | 'unpaid' | 'refunded';
    fulfillment_status: 'pending' | 'active' | 'shipped' | 'cancelled';
    internal_notes: string | null;
    created_at: string;
}

export default function OrderList(props: { initialOrders: Order[], totalCount?: number, currentPage?: number, limit?: number }) {
    const { initialOrders, totalCount, currentPage, limit } = props;
    const t = useTranslations('Orders');
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>(initialOrders || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // Filter & Sort State
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlan, setFilterPlan] = useState('all'); // New Plan Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterDateStart, setFilterDateStart] = useState('');
    const [filterDateEnd, setFilterDateEnd] = useState('');

    // Form State
    const [basePrice, setBasePrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);

    const filteredOrders = orders
        .filter(order => {
            const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
            const matchesPlan = filterPlan === 'all' || order.plan_name === filterPlan;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                (order.customer_name || '').toLowerCase().includes(term) ||
                (order.customer_email || '').toLowerCase().includes(term) ||
                (order.id || '').toLowerCase().includes(term) ||
                (order.customer_phone?.includes(term) || false);

            // Date Filter Logic
            let matchesDate = true;
            if (filterDateStart) matchesDate = matchesDate && new Date(order.created_at) >= new Date(filterDateStart);
            if (filterDateEnd) matchesDate = matchesDate && new Date(order.created_at) <= new Date(new Date(filterDateEnd).setHours(23, 59, 59, 999));

            return matchesStatus && matchesSearch && matchesPlan && matchesDate;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.customer_name.localeCompare(b.customer_name);
                    break;
                case 'amount':
                    comparison = a.total_amount - b.total_amount;
                    break;
                case 'date':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleSort = (key: 'date' | 'amount' | 'name') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc'); // Default to desc for new sort
        }
    };

    // ... (openCreateModal, openEditModal, handleSubmit, handleDelete same as before) ...

    const openCreateModal = () => {
        setEditingOrder(null);
        setBasePrice(0);
        setDiscount(0);
        setIsModalOpen(true);
    };

    const openEditModal = (order: Order) => {
        setEditingOrder(order);
        setBasePrice(order.total_amount + (order.discount_amount || 0));
        setDiscount(order.discount_amount || 0);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const final = Math.max(0, basePrice - discount);
        formData.append('final', final.toString());
        formData.append('discount', discount.toString());

        if (editingOrder) {
            formData.append('id', editingOrder.id);
            await editOrder(formData);
        } else {
            await createOrder(formData);
        }

        router.refresh();
        setIsModalOpen(false);
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this order?')) {
            const result = await deleteOrder(id);
            if (result?.error) {
                alert(`Failed to delete: ${result.error}`);
            } else {
                router.refresh();
            }
        }
    };

    // Bulk Actions Logic
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    // Toggle Single Selection
    const toggleSelection = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    // Toggle All Selection (Visible only)
    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const handleBulkUpdate = async (updates: any) => {
        if (!confirm(`Update ${selectedOrders.length} orders?`)) return;
        setIsSubmitting(true);
        await bulkUpdateOrders(selectedOrders, updates);
        router.refresh();
        setSelectedOrders([]);
        setIsSubmitting(false);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedOrders.length} orders? THIS CANNOT BE UNDONE.`)) return;
        setIsSubmitting(true);
        await bulkDeleteOrders(selectedOrders);
        router.refresh();
        setSelectedOrders([]);
        setIsSubmitting(false);
    };

    // Pagination props
    const totalPages = Math.ceil((props.totalCount || 0) / (props.limit || 10));

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(window.location.search);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // CSV Export
    const handleExportCSV = async (subset: 'all' | 'selected' = 'all') => {
        let dataToExport: Order[] = [];

        if (subset === 'selected') {
            dataToExport = orders.filter(o => selectedOrders.includes(o.id));
        } else {
            // Fetch all for export if 'all' is requested, or just use current view? 
            // Usually 'Export All' means ALL database records.
            // Let's use the getAllOrdersSDK logic if possible, but we don't have it on client.
            // We need a server action for this or just export current view if simple.
            // Plan said "Implement exportOrders server action".
            // For now, let's export the *current view* (filteredOrders) to keep it simple and safe interactions, 
            // OR fetch all from a new action. 
            // Let's assume user wants to export what they see or selecting? 
            // Better: Export All = Fetch All from server.
            // Let's make a quick server action call if we can, or just export filteredOrders.
            // "Export Full List" implies all. 
            // Let's stick to `filteredOrders` for "Current View" essentially, 
            // OR fetch everything. 
            // Let's try to fetch everything via a specific handler if we had one.
            // Since we didn't add the `exportOrders` action explicitly in previous steps (only `getAllOrders`), 
            // let's import `getAllOrders` if it was a server action? 
            // `getAllOrders` is in `orders.ts` marked `use server`, so we can call it.

            const { data } = await getAllOrders();
            if (data) dataToExport = data as unknown as Order[]; // Type assertion needed if types mismatch
        }

        if (!dataToExport || dataToExport.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Order ID', 'Customer Name', 'Email', 'Plan', 'Amount', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(o => [
                o.id,
                `"${o.customer_name}"`,
                o.customer_email,
                `"${o.plan_name}"`,
                o.total_amount,
                o.payment_status,
                new Date(o.created_at).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 pb-24 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">{t('title')}</h1>
                    <p className="text-zinc-500">{t('subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExportCSV('all')}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-3 rounded-xl font-bold transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        {t('createBtn')}
                    </button>
                </div>
            </div>



            {/* Filters & Search */}
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="relative flex-[2]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search name, email, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                    {/* Status Filter */}
                    <div className="flex bg-white dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
                        {['all', 'paid', 'pending', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-bold capitalize text-sm transition-all ${filterStatus === status
                                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {/* Date Range Filter */}
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
                        <input
                            type="date"
                            className="bg-transparent text-xs font-bold uppercase p-2 outline-none dark:text-zinc-400"
                            onChange={(e) => setFilterDateStart(e.target.value)}
                        />
                        <span className="text-zinc-300">-</span>
                        <input
                            type="date"
                            className="bg-transparent text-xs font-bold uppercase p-2 outline-none dark:text-zinc-400"
                            onChange={(e) => setFilterDateEnd(e.target.value)}
                        />
                    </div>
                    {/* Plan Filter */}
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none font-bold text-sm"
                    >
                        <option value="all">All Plans</option>
                        <option value="Premium 12 Months">Premium 12m</option>
                        <option value="Standard 6 Months">Standard 6m</option>
                        <option value="Basic 1 Month">Basic 1m</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="py-4 px-8 text-left">
                                    <input
                                        type="checkbox"
                                        className="rounded border-zinc-300 w-4 h-4 text-indigo-600 focus:ring-indigo-600"
                                        checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="text-left py-4 px-0 text-xs font-bold text-zinc-400">Order ID</th>
                                <th
                                    className="text-left py-4 px-8 text-xs font-bold text-zinc-400 cursor-pointer hover:text-indigo-600"
                                    onClick={() => toggleSort('name')}
                                >
                                    {t('table.customer')} {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400">{t('table.plan')}</th>
                                <th
                                    className="text-left py-4 px-8 text-xs font-bold text-zinc-400 cursor-pointer hover:text-indigo-600"
                                    onClick={() => toggleSort('amount')}
                                >
                                    {t('table.amount')} {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400">{t('table.status')}</th>
                                <th
                                    className="text-left py-4 px-8 text-xs font-bold text-zinc-400 cursor-pointer hover:text-indigo-600"
                                    onClick={() => toggleSort('date')}
                                >
                                    {t('table.date')} {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-right py-4 px-8 text-xs font-bold text-zinc-400">{t('table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className={`group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${selectedOrders.includes(order.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                    <td className="py-5 px-8">
                                        <input
                                            type="checkbox"
                                            className="rounded border-zinc-300 w-4 h-4 text-indigo-600 focus:ring-indigo-600"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => toggleSelection(order.id)}
                                        />
                                    </td>
                                    <td className="py-5 px-0">
                                        <p className="font-mono text-xs font-bold text-zinc-400">#{order.id.slice(0, 8)}</p>
                                    </td>
                                    <td className="py-5 px-8">
                                        <p className="font-bold dark:text-white">{order.customer_name}</p>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs text-zinc-500">{order.customer_email}</p>
                                            {order.customer_phone && (
                                                <p className="text-xs text-indigo-500 font-medium">{order.customer_phone}</p>
                                            )}
                                        </div>
                                    </td>
                                    {/* ... rest of columns same ... */}
                                    <td className="py-5 px-8 text-sm font-medium dark:text-zinc-300">
                                        {order.plan_name}
                                        {order.coupon_code && (
                                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] rounded uppercase font-bold">
                                                {order.coupon_code}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-5 px-8 font-bold dark:text-white">
                                        ${(order.total_amount || 0).toFixed(2)}
                                        {(order.discount_amount || 0) > 0 && (
                                            <span className="ml-2 text-xs text-green-600 line-through font-normal">
                                                ${((order.total_amount || 0) + (order.discount_amount || 0)).toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                                order.payment_status === 'refunded' ? 'bg-zinc-100 text-zinc-700 border-zinc-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {order.payment_status}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${order.fulfillment_status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                order.fulfillment_status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    'bg-zinc-50 text-zinc-500 border-zinc-200'
                                                }`}>
                                                {order.fulfillment_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-sm text-zinc-500">
                                        {new Date(order.created_at).toISOString().split('T')[0]}
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingOrder(order)}
                                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-600 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {/* Hide delete button for safety if preferred, keeping it for now */}
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Action Bar */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform ${selectedOrders.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
                <div className="bg-zinc-900 text-white dark:bg-white dark:text-black py-3 px-6 rounded-full shadow-2xl flex items-center gap-6 border border-zinc-800 dark:border-zinc-200">
                    <div className="flex items-center gap-3 pr-4 border-r border-zinc-700 dark:border-zinc-200">
                        <span className="font-bold bg-white text-black dark:bg-black dark:text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                            {selectedOrders.length}
                        </span>
                        <span className="text-sm font-bold">Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkUpdate({ payment_status: 'paid' })}
                            className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-green-400 dark:text-green-600"
                        >
                            Mark Paid
                        </button>
                        <button
                            onClick={() => handleBulkUpdate({ payment_status: 'unpaid' })}
                            className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-yellow-400 dark:text-yellow-600"
                        >
                            Mark Unpaid
                        </button>
                        <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-200 mx-1"></div>
                        <button
                            onClick={() => handleBulkUpdate({ fulfillment_status: 'active' })}
                            className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-blue-400 dark:text-blue-600"
                        >
                            Activate
                        </button>
                        <button
                            onClick={() => handleBulkUpdate({ fulfillment_status: 'shipped' })}
                            className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-purple-400 dark:text-purple-600"
                        >
                            Ship
                        </button>
                    </div>

                    <div className="pl-4 border-l border-zinc-700 dark:border-zinc-200 flex items-center gap-2">
                        <button
                            onClick={handleBulkDelete}
                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                            title="Delete Selected"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setSelectedOrders([])}
                            className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-zinc-500 rounded-full transition-colors"
                            title="Cancel"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold dark:text-white">
                                    {editingOrder ? t('modal.editTitle') : t('modal.createTitle')}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.customerName')}</label>
                                    <input required name="customerName" defaultValue={editingOrder?.customer_name} type="text" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.customerEmail')}</label>
                                        <input required name="customerEmail" defaultValue={editingOrder?.customer_email} type="email" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.customerPhone')}</label>
                                        <input name="customerPhone" defaultValue={editingOrder?.customer_phone || ''} type="tel" placeholder="+1..." className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.plan')}</label>
                                    <select required name="plan" defaultValue={editingOrder?.plan_name || 'Premium 12 Months'} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                        <option value="Premium 12 Months">Premium 12 Months</option>
                                        <option value="Standard 6 Months">Standard 6 Months</option>
                                        <option value="Basic 1 Month">Basic 1 Month</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.basePrice')}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.discount')}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={discount}
                                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-green-600 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.coupon')}</label>
                                    <input name="coupon" defaultValue={editingOrder?.coupon_code || ''} type="text" placeholder="Promo Code" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex justify-between items-center">
                                    <span className="font-bold text-zinc-500">{t('modal.finalPrice')}</span>
                                    <span className="text-2xl font-black text-indigo-600">
                                        ${Math.max(0, basePrice - discount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.paymentStatus')}</label>
                                        <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                            {['unpaid', 'paid', 'refunded'].map(s => (
                                                <label key={s} className="flex-1 cursor-pointer">
                                                    <input type="radio" name="paymentStatus" value={s} defaultChecked={editingOrder?.payment_status === s || (!editingOrder && s === 'unpaid')} className="peer sr-only" />
                                                    <div className="text-center py-2 text-xs font-bold capitalize rounded-lg text-zinc-500 peer-checked:bg-white peer-checked:dark:bg-zinc-800 peer-checked:text-black peer-checked:dark:text-white peer-checked:shadow-sm transition-all">{s}</div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.fulfillmentStatus')}</label>
                                        <select name="fulfillmentStatus" defaultValue={editingOrder?.fulfillment_status || 'pending'} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 capitalize font-medium">
                                            {['pending', 'active', 'shipped', 'cancelled'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Deprecated 'status' field kept hidden or auto-synced? Let's just keep it simple and hide it, or default it. 
                                Actually the server requires it. Let's make it a hidden field that defaults to 'active' if paid, or 'pending'.
                                OR just keep exposure for backward compatibility. 
                                Let's keep a simplified aggregate status selector for now to avoid breaking constraints. */}
                                <input type="hidden" name="status" value={editingOrder?.status || 'pending'} />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">{t('modal.internalNotes')}</label>
                                    <textarea
                                        name="internalNotes"
                                        defaultValue={editingOrder?.internal_notes || ''}
                                        placeholder="Add private notes here..."
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[100px]"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                                    >
                                        {t('modal.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingOrder ? t('modal.save') : t('modal.create'))}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Side Sheet Details Panel */}
            {
                editingOrder && !isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                        <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl overflow-y-auto p-8 border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">Order Details</h2>
                                    <p className="font-mono text-zinc-400 text-sm">#{editingOrder!.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsModalOpen(true)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-indigo-600">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Total</p>
                                    <p className="text-xl font-black dark:text-white">${(editingOrder?.total_amount || 0).toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Plan</p>
                                    <p className="text-sm font-bold dark:text-white truncate">{editingOrder!.plan_name}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-4 mb-8">
                                <h3 className="font-bold dark:text-white flex items-center gap-2">
                                    <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                    Customer
                                </h3>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Name</span>
                                        <span className="font-medium dark:text-zinc-200">{editingOrder!.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Email</span>
                                        <span className="font-medium dark:text-zinc-200">{editingOrder!.customer_email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Phone</span>
                                        <span className="font-medium dark:text-zinc-200">{editingOrder!.customer_phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {editingOrder!.internal_notes && (
                                <div className="space-y-4 mb-8">
                                    <h3 className="font-bold dark:text-white flex items-center gap-2">
                                        <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                                        Internal Notes
                                    </h3>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl text-sm text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-900/20">
                                        {editingOrder!.internal_notes}
                                    </div>
                                </div>
                            )}

                            {/* Audit Trail */}
                            <div className="space-y-4">
                                <h3 className="font-bold dark:text-white flex items-center gap-2">
                                    <span className="w-1 h-4 bg-zinc-400 rounded-full"></span>
                                    Timeline
                                </h3>
                                <AuditTimeline orderId={editingOrder!.id} />
                            </div>

                        </div>
                    </div>
                )
            }
        </div >
    );
}



function AuditTimeline({ orderId }: { orderId: string }) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs(orderId).then(({ data }) => {
            if (data) setLogs(data);
            setLoading(false);
        });
    }, [orderId]);

    if (loading) return <div className="text-zinc-400 text-xs">Loading history...</div>;

    if (logs.length === 0) return <div className="text-zinc-400 text-xs">No history recorded.</div>;

    return (
        <div className="pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-6">
            {logs.map((log) => (
                <div key={log.id} className="relative">
                    <span className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${log.action === 'created' ? 'bg-green-500' :
                        log.action === 'updated' ? 'bg-blue-500' :
                            'bg-zinc-300'
                        }`}></span>
                    <p className="text-sm font-medium dark:text-zinc-300 capitalize">{log.action.replace('_', ' ')}</p>
                    <p className="text-xs text-zinc-400">
                        {new Date(log.created_at).toLocaleString()}
                        {/* by {log.performed_by_user?.email} */}
                    </p>
                    {log.metadata?.updates && (
                        <div className="mt-1 text-[10px] text-zinc-500 bg-zinc-50 dark:bg-zinc-950 p-2 rounded">
                            {Object.keys(log.metadata.updates).map(k => (
                                <div key={k} className="truncate">
                                    <span className="font-bold">{k}:</span> {String(log.metadata.updates[k])}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
