'use client';

import { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Trash2, Megaphone, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import { getAdminNotifications, markNotificationAsRead, deleteNotification, createBroadcastNotification } from '@/app/actions/admin/notifications';
import { useRouter } from 'next/navigation';

export default function NotificationsManagementClient({ initialData }: { initialData: any[] }) {
    const router = useRouter();
    const [notifications, setNotifications] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [broadcastLoading, setBroadcastLoading] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    // Broadcast Form State
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastType, setBroadcastType] = useState('info');

    const handleMarkAsRead = async (id: string) => {
        setLoading(true);
        const res = await markNotificationAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;
        setLoading(true);
        const res = await deleteNotification(id);
        if (res.success) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
        setLoading(false);
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setBroadcastLoading(true);
        const res = await createBroadcastNotification(broadcastTitle, broadcastMessage, broadcastType);
        if (res.success) {
            setBroadcastTitle('');
            setBroadcastMessage('');
            setShowBroadcastModal(false);
            // Refresh list
            const updated = await getAdminNotifications();
            if (updated.data) setNotifications(updated.data);
        } else {
            alert('Failed to send broadcast');
        }
        setBroadcastLoading(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'broadcast': return <Megaphone className="w-5 h-5 text-indigo-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-8 pb-24">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold dark:text-white">Admin Notifications</h2>
                    <p className="text-sm text-zinc-500">History of system alerts and broadcasts.</p>
                </div>
                <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                    <Megaphone className="w-5 h-5" />
                    New Broadcast
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-6 flex gap-6 items-start transition-colors ${notif.is_read ? 'opacity-60' : 'bg-indigo-50/10 dark:bg-indigo-900/5'}`}
                            >
                                <div className={`p-3 rounded-2xl ${notif.is_read ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                                    {getTypeIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold ${notif.is_read ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(notif.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mb-4">{notif.message}</p>
                                    <div className="flex gap-4">
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notif.id)}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                                            >
                                                <Eye className="w-4 h-4" /> Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notif.id)}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center text-zinc-400">
                            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="font-bold">No notifications yet</p>
                            <p className="text-sm">Broadcast alerts will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold dark:text-white mb-6">Create System Broadcast</h2>
                        <form onSubmit={handleBroadcast} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Alert Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['info', 'success', 'warning', 'error'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setBroadcastType(t)}
                                            className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${broadcastType === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                                <input
                                    required
                                    value={broadcastTitle}
                                    onChange={e => setBroadcastTitle(e.target.value)}
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-medium"
                                    placeholder="Maintenance Alert, New Feature..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={broadcastMessage}
                                    onChange={e => setBroadcastMessage(e.target.value)}
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-medium resize-none"
                                    placeholder="Detail about the broadcast..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowBroadcastModal(false)}
                                    className="flex-1 py-4 text-zinc-500 font-bold hover:text-zinc-700 active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={broadcastLoading}
                                    className="flex-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {broadcastLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Broadcast'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
