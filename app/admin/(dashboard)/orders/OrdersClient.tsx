'use client';

import { useState, useEffect } from 'react';
import {
    Search, Filter, MoreVertical, Plus, Download,
    CheckCircle, XCircle, Clock, Truck, CreditCard,
    Package, X, Loader2, Save, ShoppingBag, Layers, Box, Tag, UploadCloud, Image as ImageIcon,
    ArrowUpDown, Eye, Trash2
} from 'lucide-react';
import { updateOrder, createOrder, deleteOrder } from '@/app/actions/admin/orders'; // We will update this to accept product details
import { getProductsForDropdown } from '@/app/actions/admin/products';
import { useRouter, useSearchParams } from 'next/navigation';
// import { client } from '@/sanity/lib/client'; // Removed client-side sanity client

interface Product {
    _id: string;
    name: { en: string };
    variants?: { name: string; value: string; sku: string; price: number; stock?: number }[];
    price: number;
}
import OrderDetailsPanel from './OrderDetailsPanel';

interface Order {
    id: string;
    order_number: number;
    final_amount: number;
    currency: string;
    status: string;
    payment_status: 'paid' | 'unpaid' | 'refunded';
    fulfillment_status: 'pending' | 'active' | 'shipped' | 'cancelled';
    created_at: string;
    customer?: {
        name: string;
        email: string;
    };
    order_items?: {
        name: string;
        total: number;
    }[];
    internal_notes?: string;
}

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>(initialOrders || []);

    // Sync state with server data on refresh
    useEffect(() => {
        setOrders(initialOrders || []);
    }, [initialOrders]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    // Fetch products for the dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            const result = await getProductsForDropdown();
            setProducts(result);
        };
        fetchProducts();
    }, []);

    // Open order from URL param
    useEffect(() => {
        const orderId = searchParams.get('orderId');
        if (orderId && initialOrders) {
            const targetOrder = initialOrders.find(o => o.id === orderId);
            if (targetOrder) {
                setSelectedOrder(targetOrder);
            }
        }
    }, [searchParams, initialOrders]);

    // Form State
    const [basePrice, setBasePrice] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

    // Sort State
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredOrders = orders
        .filter(order => {
            const customerName = order.customer?.name || '';
            const customerEmail = order.customer?.email || '';
            const orderNumber = order.order_number?.toString() || '';
            const orderId = order.id || '';

            const matchesSearch =
                customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orderNumber.includes(searchTerm) ||
                orderId.includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
                case 'amount':
                    comparison = a.final_amount - b.final_amount;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleSort = (key: 'date' | 'amount') => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        const res = await deleteOrder(id);
        if (res?.success) {
            setOrders(prev => prev.filter(o => o.id !== id));
        } else {
            alert('Failed to delete order');
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const res = await createOrder(formData);
        if (res?.success) {
            setIsModalOpen(false);
            setBasePrice(0);
            setDiscount(0);
            router.refresh();
        } else {
            alert(`Error: ${res?.error}`);
        }
        setIsSubmitting(false);
    };

    const StatusBadge = ({ status, type }: { status: string, type: 'payment' | 'fulfillment' }) => {
        const styles = {
            paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            unpaid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            refunded: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
            active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            pending: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        };

        // @ts-ignore
        const style = styles[status] || styles.pending;

        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="w-full xl:w-96 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search orders (ID, Name, Email)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                    <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        {(['all', 'paid', 'unpaid'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${statusFilter === tab
                                    ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white'
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Create Order
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Create New Order</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Customer Name</label>
                                <input required name="customerName" type="text" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Customer Email</label>
                                <input required name="customerEmail" type="email" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Plan / Item</label>
                                <select name="plan" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <option value="Premium 12 Months">Premium 12 Months</option>
                                    <option value="Standard 6 Months">Standard 6 Months</option>
                                    <option value="Basic 1 Month">Basic 1 Month</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Price</label>
                                    <input
                                        name="basePrice"
                                        type="number"
                                        step="0.01"
                                        required
                                        onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Discount</label>
                                    <input
                                        name="discount"
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-green-600"
                                    />
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Payment Status</label>
                                <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    {['paid', 'unpaid'].map(s => (
                                        <label key={s} className="flex-1 cursor-pointer">
                                            <input type="radio" name="paymentStatus" value={s} defaultChecked={s === 'paid'} className="peer sr-only" />
                                            <div className="text-center py-2 text-xs font-bold capitalize rounded-lg text-zinc-500 peer-checked:bg-white peer-checked:dark:bg-zinc-800 peer-checked:text-black peer-checked:dark:text-white peer-checked:shadow-sm transition-all">{s}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fulfillment Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Fulfillment Status</label>
                                <select name="fulfillmentStatus" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 capitalize">
                                    {['pending', 'active', 'shipped', 'cancelled'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Select Product (Optional)</label>
                                        <div className="space-y-2">
                                            <select
                                                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800"
                                                onChange={(e) => {
                                                    const pid = e.target.value;
                                                    setSelectedProductId(pid);

                                                    const prod = products.find(p => p._id === pid);
                                                    if (prod) {
                                                        const nameInput = document.querySelector('input[name="plan"]') as HTMLInputElement;
                                                        const priceInput = document.querySelector('input[name="basePrice"]') as HTMLInputElement;
                                                        const idInput = document.querySelector('input[name="productId"]') as HTMLInputElement;

                                                        if (nameInput) nameInput.value = prod.name.en;
                                                        if (priceInput) priceInput.value = prod.price.toString();
                                                        if (idInput) idInput.value = prod._id;
                                                    } else {
                                                        const idInput = document.querySelector('input[name="productId"]') as HTMLInputElement;
                                                        if (idInput) idInput.value = '';
                                                    }
                                                }}
                                            >
                                                <option value="">-- Manual Entry --</option>
                                                {products.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name.en}</option>
                                                ))}
                                            </select>

                                            {selectedProductId && products.find(p => p._id === selectedProductId)?.variants && (
                                                <select
                                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800"
                                                    name="variantKey"
                                                >
                                                    <option value="">-- Select Variant --</option>
                                                    {products.find(p => p._id === selectedProductId)?.variants?.map((v, idx) => (
                                                        <option key={idx} value={v.sku || v.value}>{v.name}: {v.value} (Stock: {v.stock ?? 'N/A'})</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <input type="hidden" name="productId" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Product / Plan Name</label>
                                        <input name="plan" type="text" placeholder="e.g. Gold Subscription" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 font-medium" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Notes</label>
                                <textarea name="internalNotes" placeholder="Private notes..." className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                            </div>

                            <div className="bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white p-6 rounded-2xl space-y-2 mt-4">
                                <div className="flex justify-between items-center text-xs opacity-70 font-bold uppercase tracking-widest">
                                    <span>Summary</span>
                                    <span>USD</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm font-medium">Final Amount</div>
                                    <div className="text-3xl font-black">${(basePrice - discount).toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-6 h-6" /> Confirm & Create Order</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest min-w-[100px]">Order #</th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest min-w-[200px]">Customer</th>
                                <th
                                    className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 group min-w-[120px]"
                                    onClick={() => toggleSort('amount')}
                                >
                                    <div className="flex items-center gap-1">
                                        Total
                                        <ArrowUpDown className={`w-3 h-3 ${sortBy === 'amount' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </div>
                                </th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest min-w-[140px]">Status</th>
                                <th
                                    className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 group min-w-[140px]"
                                    onClick={() => toggleSort('date')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        <ArrowUpDown className={`w-3 h-3 ${sortBy === 'date' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </div>
                                </th>
                                <th className="py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-zinc-900 dark:text-white">
                                                    #{order.order_number}
                                                </span>
                                                <span className="font-mono text-[10px] text-zinc-400 opacity-50 truncate w-24">
                                                    {order.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div>
                                                <div className="font-bold text-zinc-900 dark:text-white">
                                                    {order.customer?.name}
                                                </div>
                                                <div className="text-xs text-zinc-500">
                                                    {order.customer?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 font-bold text-zinc-900 dark:text-white">
                                            ${order.final_amount.toFixed(2)}
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <StatusBadge status={order.payment_status} type="payment" />
                                                <StatusBadge status={order.fulfillment_status} type="fulfillment" />
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <Clock className="w-4 h-4" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-zinc-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <OrderDetailsPanel
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}
