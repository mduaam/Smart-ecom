'use client';

import { useState } from 'react';
import { saveNotificationConfig, deleteNotificationConfig } from '@/app/actions/admin/notifications';
import { Mail, Plus, Trash2, Bell, Check, X, ShieldAlert, BadgeInfo } from 'lucide-react';

export default function NotificationManagementClient({ initialConfigs }: { initialConfigs: any[] }) {
    const [configs, setConfigs] = useState(initialConfigs);
    const [isAdding, setIsAdding] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleToggle(id: string, field: string, value: boolean) {
        const res = await saveNotificationConfig(id, { [field]: value });
        if (res.success) {
            setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c));
        }
    }

    async function handleAdd() {
        if (!newEmail.trim()) return;
        setIsSubmitting(true);
        const res = await saveNotificationConfig(null, { email: newEmail });
        if (res.success) {
            setConfigs([res.data, ...configs]);
            setNewEmail('');
            setIsAdding(false);
        } else {
            alert(res.error || 'Failed to add recipient');
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Remove this email from notifications?')) return;
        const res = await deleteNotificationConfig(id);
        if (res.success) {
            setConfigs(configs.filter(c => c.id !== id));
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 italic">
                        <Bell className="text-indigo-500" /> Alert Recipients
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">Manage who receives automated email alerts for system events.</p>
                </div>

                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus size={16} /> Add Recipient
                    </button>
                ) : (
                    <div className="flex gap-2 w-full md:w-auto animate-in zoom-in duration-300">
                        <input
                            type="email"
                            placeholder="enter.admin@email.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64"
                        />
                        <button
                            disabled={isSubmitting}
                            onClick={handleAdd}
                            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Check size={20} />
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="p-3 bg-white/5 text-zinc-400 rounded-2xl hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Recipients Table/Grid */}
            <div className="grid gap-4">
                {configs.map((config: any) => (
                    <div key={config.id} className="group bg-zinc-900/30 border border-white/5 p-6 rounded-[1.5rem] hover:border-white/10 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-center lg:text-left">
                            <div className="flex items-center gap-4 mx-auto lg:mx-0">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{config.email}</h4>
                                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">Notification Email</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center items-center gap-4">
                                <Toggle
                                    label="Orders"
                                    active={config.notify_on_orders}
                                    onToggle={(v) => handleToggle(config.id, 'notify_on_orders', v)}
                                />
                                <Toggle
                                    label="Tickets"
                                    active={config.notify_on_tickets}
                                    onToggle={(v) => handleToggle(config.id, 'notify_on_tickets', v)}
                                />
                                <Toggle
                                    label="Reviews"
                                    active={config.notify_on_reviews}
                                    onToggle={(v) => handleToggle(config.id, 'notify_on_reviews', v)}
                                />
                            </div>

                            <button
                                onClick={() => handleDelete(config.id)}
                                className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 mx-auto lg:mx-0"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {configs.length === 0 && (
                    <div className="py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                        <BadgeInfo className="mx-auto text-zinc-700 mb-4" size={48} />
                        <h3 className="text-white font-bold">No Alert Recipients</h3>
                        <p className="text-zinc-600 text-sm mt-1">Add an email above to start receiving notifications.</p>
                    </div>
                )}
            </div>

            {/* Warning Box */}
            <div className="flex gap-4 p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                <ShieldAlert className="text-amber-500 shrink-0" />
                <div className="space-y-1">
                    <h5 className="text-amber-500 font-bold text-sm">Resend Configuration</h5>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                        Ensure your domain is verified in your <a href="https://resend.com" target="_blank" className="underline text-amber-500/80 hover:text-amber-500">Resend Dashboard</a>.
                        If using the free tier, you may only be able to send emails to your verified account email until you verify your domain.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Toggle({ label, active, onToggle }: { label: string, active: boolean, onToggle: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onToggle(!active)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${active
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                    : 'bg-white/5 text-zinc-600 border-white/5 grayscale'
                }`}
        >
            {label}: {active ? 'ON' : 'OFF'}
        </button>
    );
}
