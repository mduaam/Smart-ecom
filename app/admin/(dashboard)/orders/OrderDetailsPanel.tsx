'use client';

import { useState, useEffect } from 'react';
import {
    X, User, Mail, Phone, MapPin,
    CreditCard, Truck, Calendar, FileText,
    Trash2, Save, Printer, ExternalLink,
    CheckCircle, AlertCircle, Edit2, Tv, Plus, Trash
} from 'lucide-react';
import { updateOrder, deleteOrder, addOrderNote, getOrderNotes } from '@/app/actions/admin/orders';
import { getSubscriptionByOrderId, updateSubscription } from '@/app/actions/admin/subscriptions';
import { useRouter } from 'next/navigation';

interface OrderDetailsPanelProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailsPanel({ order, isOpen, onClose }: OrderDetailsPanelProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Editable Fields State
    const [formData, setFormData] = useState({
        final_amount: 0,
        internal_notes: '',
        payment_status: '',
        fulfillment_status: ''
    });

    // Subscription State
    const [subscription, setSubscription] = useState<any>(null);
    const [subLoading, setSubLoading] = useState(false);
    const [subFormData, setSubFormData] = useState({
        iptv_username: '',
        iptv_password: '',
        iptv_url: '',
        m3u_link: '',
        activation_code: '',
        alternative_urls: [] as string[],
        status: '',
        max_connections: 1
    });

    // Notes History State
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [notesLoading, setNotesLoading] = useState(false);

    useEffect(() => {
        if (order) {
            setFormData({
                final_amount: order.final_amount,
                internal_notes: order.internal_notes || '',
                payment_status: order.payment_status,
                fulfillment_status: order.fulfillment_status
            });

            // Fetch Notes History
            setNotesLoading(true);
            getOrderNotes(order.id).then(res => {
                if (res?.notes) setNotes(res.notes);
                setNotesLoading(false);
            });

            // Fetch linked subscription
            if (order.payment_status === 'paid') {
                setSubLoading(true);
                getSubscriptionByOrderId(order.id).then(res => {
                    if (res.subscription) {
                        setSubscription(res.subscription);
                        setSubFormData({
                            iptv_username: res.subscription.iptv_username || '',
                            iptv_password: res.subscription.iptv_password || '',
                            iptv_url: res.subscription.iptv_url || '',
                            m3u_link: res.subscription.m3u_link || '',
                            activation_code: res.subscription.activation_code || '',
                            alternative_urls: res.subscription.alternative_urls || [],
                            status: res.subscription.status || 'active',
                            max_connections: res.subscription.max_connections || 1
                        });
                    }
                    setSubLoading(false);
                });
            } else {
                setSubscription(null);
            }
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateOrder(order.id, formData as any);
        if (res?.success) {
            setIsEditing(false);
            router.refresh();
        } else {
            alert('Failed to update order');
        }
        setIsSaving(false);
    };

    const handleSaveSubscription = async () => {
        if (!subscription) return;
        setIsSaving(true);
        const res = await updateSubscription(subscription.id, subFormData);
        if (res?.success) {
            alert('Subscription Updated Successfully');
            // Refresh local state
            setSubscription({ ...subscription, ...subFormData });
        } else {
            alert('Failed to update subscription');
        }
        setIsSaving(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
        const res = await deleteOrder(order.id);
        if (res?.success) {
            onClose();
            router.refresh();
        } else {
            alert('Failed to delete');
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        const res = await addOrderNote(order.id, newNote);
        if (res?.success) {
            // Refresh notes
            const updated = await getOrderNotes(order.id);
            if (updated?.notes) setNotes(updated.notes);
            setNewNote('');
        } else {
            alert('Failed to add note');
        }
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 h-full shadow-2xl p-8 overflow-y-auto border-l border-zinc-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold dark:text-white">Order #{order.order_number}</h2>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-mono text-zinc-500">
                                {new Date(order.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-zinc-500 mt-1">
                            Placed by {order.customer?.name}
                            <span className="block text-xs text-zinc-400">{order.customer?.email}</span>
                            {order.customer?.phone && (
                                <span className="block text-xs text-zinc-400">{order.customer.phone}</span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500">
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Status Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                            <div className="text-xs font-bold text-zinc-400 uppercase mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                    value={formData.payment_status}
                                    onChange={e => setFormData({ ...formData, payment_status: e.target.value })}
                                >
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            ) : (
                                <div className="text-lg font-bold capitalize">{formData.payment_status}</div>
                            )}
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <div className="text-xs font-bold text-zinc-400 uppercase mb-2 flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Fulfillment
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                                    value={formData.fulfillment_status}
                                    onChange={e => setFormData({ ...formData, fulfillment_status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            ) : (
                                <div className="text-lg font-bold capitalize">{formData.fulfillment_status}</div>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                <Mail className="w-4 h-4 opacity-50" />
                                <a href={`mailto:${order.customer?.email}`} className="hover:text-indigo-600 underline decoration-dotted">
                                    {order.customer?.email}
                                </a>
                            </div>
                            {order.customer?.phone && (
                                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                    <Phone className="w-4 h-4 opacity-50" />
                                    <span>{order.customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subscription Management */}
                    {(subscription || subLoading) && (
                        <div className="p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10">
                            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Tv className="w-4 h-4" /> Subscription Management</span>
                                {subscription && (
                                    <span className="text-xs uppercase tracking-wider px-2 py-1 bg-white dark:bg-zinc-800 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                                        {subscription.plan_name || subscription.plan_id}
                                    </span>
                                )}
                            </h3>

                            {subLoading ? (
                                <div className="text-sm text-zinc-500 animate-pulse">Loading subscription details...</div>
                            ) : subscription ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Username</label>
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono"
                                                    value={subFormData.iptv_username}
                                                    onChange={e => setSubFormData({ ...subFormData, iptv_username: e.target.value })}
                                                />
                                            ) : (
                                                <div className="font-mono text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{subscription.iptv_username}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Password</label>
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono"
                                                    value={subFormData.iptv_password}
                                                    onChange={e => setSubFormData({ ...subFormData, iptv_password: e.target.value })}
                                                />
                                            ) : (
                                                <div className="font-mono text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{subscription.iptv_password}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">M3U Link</label>
                                        {isEditing ? (
                                            <input
                                                className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                                                value={subFormData.m3u_link}
                                                onChange={e => setSubFormData({ ...subFormData, m3u_link: e.target.value })}
                                            />
                                        ) : (
                                            <div className="font-mono text-xs bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent break-all">{subscription.m3u_link}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Activation Code</label>
                                        {isEditing ? (
                                            <input
                                                className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono"
                                                value={subFormData.activation_code}
                                                onChange={e => setSubFormData({ ...subFormData, activation_code: e.target.value })}
                                                placeholder="e.g. ACT-123456"
                                            />
                                        ) : (
                                            <div className="font-mono text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{subscription.activation_code || 'N/A'}</div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-zinc-400 uppercase block">Alternative URLs</label>
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSubFormData({ ...subFormData, alternative_urls: [...subFormData.alternative_urls, ''] })}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" /> Add
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {subFormData.alternative_urls && subFormData.alternative_urls.length > 0 ? (
                                                subFormData.alternative_urls.map((url, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <input
                                                                    className="flex-1 p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-mono"
                                                                    value={url}
                                                                    onChange={e => {
                                                                        const newUrls = [...subFormData.alternative_urls];
                                                                        newUrls[index] = e.target.value;
                                                                        setSubFormData({ ...subFormData, alternative_urls: newUrls });
                                                                    }}
                                                                    placeholder="http://..."
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newUrls = subFormData.alternative_urls.filter((_, i) => i !== index);
                                                                        setSubFormData({ ...subFormData, alternative_urls: newUrls });
                                                                    }}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="w-full font-mono text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{url}</div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                !isEditing && <div className="text-sm text-zinc-400 italic">No alternative URLs</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Portal URL</label>
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm"
                                                    value={subFormData.iptv_url}
                                                    onChange={e => setSubFormData({ ...subFormData, iptv_url: e.target.value })}
                                                />
                                            ) : (
                                                <div className="text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{subscription.iptv_url}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Max Connections</label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    className="w-full p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm"
                                                    value={subFormData.max_connections}
                                                    onChange={e => setSubFormData({ ...subFormData, max_connections: parseInt(e.target.value) })}
                                                />
                                            ) : (
                                                <div className="text-sm bg-white dark:bg-zinc-900 p-2 rounded-lg border border-transparent">{subscription.max_connections}</div>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleSaveSubscription}
                                                disabled={isSaving}
                                                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors"
                                            >
                                                Update Subscription Only
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-zinc-500 italic">
                                    No subscription linked to this order. Ensure payment is "Paid".
                                </div>
                            )}
                        </div>
                    )}

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Items & Financials</h3>
                        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 space-y-4">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                                    <div>
                                        <div className="font-bold">{item.name}</div>
                                        <div className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.price}</div>
                                    </div>
                                    <div className="font-mono">${item.total}</div>
                                </div>
                            ))}

                            <div className="pt-4 flex justify-between items-center text-xl font-black">
                                <span>Total</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-32 p-1 text-right bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded"
                                        value={formData.final_amount}
                                        onChange={e => setFormData({ ...formData, final_amount: parseFloat(e.target.value) })}
                                    />
                                ) : (
                                    <span>${formData.final_amount?.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}


                    {/* Notes History */}
                    <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Internal Notes & Timeline</h3>

                        {/* Add Note Input */}
                        <div className="flex gap-2 mb-6">
                            <input
                                className="flex-1 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                placeholder="Type a note (e.g. 'Customer called about refund')..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={isSaving || !newNote.trim()}
                                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Add
                            </button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-4">
                            {notesLoading ? (
                                <div className="text-center text-zinc-400 text-sm py-4">Loading history...</div>
                            ) : notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase border border-indigo-100 dark:border-indigo-900/30">
                                            {note.admin?.full_name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-zinc-900 dark:text-white">{note.admin?.full_name || 'Admin'}</span>
                                                <span className="text-xs text-zinc-400">{new Date(note.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                {note.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                    <p className="text-sm text-zinc-400 italic">No notes yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-between items-center pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Order
                        </button>

                        <div className="flex gap-3">
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                <Printer className="w-4 h-4" /> Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

