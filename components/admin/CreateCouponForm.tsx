'use client';

import { useState } from 'react';
import { createCoupon } from '@/app/actions/coupons';
import { X, Loader2, Plus } from 'lucide-react';

export default function CreateCouponForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const res = await createCoupon(formData);
        setLoading(false);

        if (res.error) {
            setError(res.error);
        } else {
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-1 dark:text-white">Create New Coupon</h2>
                <p className="text-sm text-zinc-500 mb-6">Set up a discount code for your customers.</p>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Coupon Code</label>
                        <input name="code" type="text" placeholder="e.g. SUMMER2025" required
                            className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono uppercase" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Discount Type</label>
                            <select name="discount_type" className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Value</label>
                            <input name="discount_value" type="number" step="0.01" placeholder="10" required
                                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Max Uses</label>
                            <input name="max_uses" type="number" placeholder="Unlimited"
                                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Expires At</label>
                            <input name="expires_at" type="date"
                                className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Create Coupon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
