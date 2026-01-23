'use client';

import { useState } from 'react';
import { Tag, Plus, Trash2, Calendar, Users, Power, Copy } from 'lucide-react';
import CreateCouponForm from '@/components/admin/CreateCouponForm';
import { toggleCouponStatus, deleteCoupon } from '@/app/actions/coupons';

export default function CouponsClient({ initialCoupons }: { initialCoupons: any[] }) {
    const [isCreateOpen, setCreateOpen] = useState(false);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        // Could show a toast here
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Summary Cards could go here if we had metrics */}
                <button onClick={() => setCreateOpen(true)} className="group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white">Create New Campaign</span>
                </button>
            </div>

            <div className="grid gap-4">
                {initialCoupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-lg ${coupon.is_active ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                <span className="text-[10px] uppercase tracking-wider font-normal opacity-75">OFF</span>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold font-mono tracking-wide text-zinc-900 dark:text-white">{coupon.code}</h3>
                                    <button onClick={() => handleCopy(coupon.code)} className="text-zinc-400 hover:text-indigo-500 transition-colors"><Copy className="w-4 h-4" /></button>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {coupon.used_count} uses</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'No Expiry'}</span>
                                    {coupon.max_uses && <span className="text-indigo-500 font-medium">Limit: {coupon.max_uses}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <form action={async () => { await toggleCouponStatus(coupon.id, coupon.is_active); }}>
                                <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${coupon.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800'}`}>
                                    {coupon.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </form>

                            <form action={async () => { if (confirm('Delete this coupon?')) await deleteCoupon(coupon.id) }}>
                                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {initialCoupons.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        No coupons found. Create your first campaign above.
                    </div>
                )}
            </div>

            {isCreateOpen && <CreateCouponForm onClose={() => setCreateOpen(false)} />}
        </>
    );
}
