
'use client';

import { useState } from 'react';
import {
    Search, Filter, Eye, Edit3, Key, Calendar,
    MoreVertical, CheckCircle, XCircle, Clock,
    ExternalLink, Trash2, Mail, Shield, Zap
} from 'lucide-react';
import { updateSubscription, extendSubscription, deleteSubscription } from '@/app/actions/admin/subscriptions';
import { sendIPTVCredentials } from '@/app/actions/admin/emails';
import { toast } from 'sonner';

export default function SubscriptionManagementClient({ initialSubscriptions }: { initialSubscriptions: any[] }) {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [editingSub, setEditingSub] = useState<any | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Filtering logic
    const filteredSubs = subscriptions.filter(sub => {
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        const matchesSearch =
            sub.iptv_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.id.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    const handleExtend = async (id: string, days: number) => {
        if (!confirm(`Extend this subscription by ${days} days?`)) return;

        const res = await extendSubscription(id, days);
        if (res.success) {
            setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, current_period_end: res.newExpiry, status: 'active' } : s));
            toast.success(`Extended by ${days} days`);
        } else {
            toast.error(res.error || 'Failed to extend');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSub) return;

        setIsUpdating(true);
        const res = await updateSubscription(editingSub.id, {
            iptv_username: editingSub.iptv_username,
            iptv_password: editingSub.iptv_password,
            iptv_url: editingSub.iptv_url,
            m3u_link: editingSub.m3u_link,
            status: editingSub.status
        });

        if (res.success) {
            setSubscriptions(prev => prev.map(s => s.id === editingSub.id ? editingSub : s));
            setEditingSub(null);
            toast.success('Subscription updated successfully');
        } else {
            toast.error(res.error || 'Update failed');
        }
        setIsUpdating(false);
    };

    const handleResendEmail = async (sub: any) => {
        if (!confirm(`Resend credentials to ${sub.profile?.email}?`)) return;

        const res = await sendIPTVCredentials({
            to: sub.profile?.email,
            customerName: sub.profile?.full_name || 'Customer',
            planName: sub.plan_id,
            username: sub.iptv_username,
            password: sub.iptv_password,
            portalUrl: sub.iptv_url || 'http://vod4k.cc',
            m3uLink: sub.m3u_link || ''
        });

        if (res.success) {
            toast.success('Credentials sent successfully');
        } else {
            toast.error(res.error || 'Failed to send email');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you SURE you want to delete this subscription? The user will lose access immediately.')) return;

        const res = await deleteSubscription(id);
        if (res.success) {
            setSubscriptions(prev => prev.filter(s => s.id !== id));
            toast.success('Subscription deleted');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Filters & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by username, email, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-transparent text-white border-0 focus:ring-0 placeholder:text-zinc-600 font-bold"
                        />
                    </div>
                    <div className="flex gap-2 pr-2">
                        {['all', 'active', 'expired'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s as any)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === s
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-[2rem] p-6 flex items-center justify-between shadow-lg shadow-indigo-600/30">
                    <div>
                        <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">Active Lines</p>
                        <h3 className="text-3xl font-black text-white mt-1">
                            {subscriptions.filter(s => s.status === 'active').length}
                        </h3>
                    </div>
                    <Zap className="text-indigo-300 w-10 h-10 animate-pulse" />
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Customer</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">IPTV Credentials</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status & Expiry</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredSubs.map((sub) => {
                            const isExpired = new Date(sub.current_period_end) < new Date();
                            const daysLeft = Math.ceil((new Date(sub.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <tr key={sub.id} className="group hover:bg-white/[0.03] transition-all duration-500">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center font-black text-indigo-400 capitalize">
                                                    {sub.profile?.full_name?.[0] || sub.profile?.email?.[0] || '?'}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-white font-black tracking-tight">{sub.profile?.full_name || 'Guest Customer'}</p>
                                                <p className="text-zinc-500 text-xs mt-0.5">{sub.profile?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Key size={12} className="text-zinc-600" />
                                                <code className="bg-white/5 px-2 py-1 rounded-lg text-indigo-400 text-xs font-mono font-bold border border-white/5">
                                                    {sub.iptv_username || 'PENDING'}
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Shield size={12} className="text-zinc-600" />
                                                <p className="text-zinc-400 text-[10px] font-mono opacity-50">
                                                    {sub.iptv_password || '********'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-3">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isExpired || sub.status !== 'active'
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {isExpired ? <XCircle size={10} /> : <CheckCircle size={10} />}
                                                {isExpired ? 'Expired' : sub.status}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Calendar size={12} />
                                                <span className="text-xs font-bold font-mono">
                                                    {new Date(sub.current_period_end).toLocaleDateString()}
                                                </span>
                                                {!isExpired && (
                                                    <span className={`text-[10px] font-black uppercase ${daysLeft < 7 ? 'text-orange-500 animate-pulse' : 'text-zinc-600'}`}>
                                                        ({daysLeft} Days Left)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                                            <button
                                                onClick={() => setEditingSub(sub)}
                                                className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-all"
                                                title="Edit Credentials"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleResendEmail(sub)}
                                                className="p-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl border border-blue-600/20 transition-all"
                                                title="Resend Credentials"
                                            >
                                                <Mail size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleExtend(sub.id, 30)}
                                                className="p-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl border border-indigo-600/20 transition-all"
                                                title="Extend 30 Days"
                                            >
                                                <Clock size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all"
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredSubs.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-dashed border-white/20">
                            <Search className="text-zinc-700 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-500">No Subscriptions Found</h3>
                        <p className="text-zinc-600 mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingSub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" onClick={() => setEditingSub(null)} />
                    <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">MANAGE LINE</h2>
                                    <p className="text-zinc-500 text-sm mt-1">Deep management for {editingSub.profile?.email}</p>
                                </div>
                                <button onClick={() => setEditingSub(null)} className="text-zinc-600 hover:text-white transition-colors">
                                    <XCircle size={32} strokeWidth={1.5} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">IPTV Username</label>
                                        <input
                                            type="text"
                                            value={editingSub.iptv_username || ''}
                                            onChange={(e) => setEditingSub({ ...editingSub, iptv_username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">IPTV Password</label>
                                        <input
                                            type="text"
                                            value={editingSub.iptv_password || ''}
                                            onChange={(e) => setEditingSub({ ...editingSub, iptv_password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Portal URL / IPTV Host</label>
                                    <input
                                        type="text"
                                        value={editingSub.iptv_url || ''}
                                        onChange={(e) => setEditingSub({ ...editingSub, iptv_url: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">M3U List Link</label>
                                    <textarea
                                        value={editingSub.m3u_link || ''}
                                        onChange={(e) => setEditingSub({ ...editingSub, m3u_link: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-colors h-32 resize-none"
                                    />
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingSub(null)}
                                        className="flex-1 py-5 rounded-3xl text-zinc-500 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs py-5 rounded-3xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                                    >
                                        {isUpdating ? 'SAVING CHANGES...' : 'SAVE LINE DETAILS'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
