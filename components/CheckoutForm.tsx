'use client';

import { useState } from 'react';
import { createOrder } from '@/app/actions/shop/orders';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CheckoutFormProps {
    planName: string;
    amount: number;
    planId?: string; // Add planId optional prop
}

export default function CheckoutForm({ planName, amount, planId }: CheckoutFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setStatus('loading');
        // Start Order Creation
        const res = await createOrder(formData);

        if (res.error) {
            setErrorMessage(res.error);
            setStatus('error');
        } else {
            setStatus('success');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Order Placed Successfully!</h3>
                <p className="text-green-700 dark:text-green-300 mb-4">
                    Thank you for your order. We will contact you shortly with payment instructions.
                </p>
                <div className="text-sm text-zinc-500">
                    Check your email or dashboard for updates.
                </div>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="plan" value={planName} />
            <input type="hidden" name="final" value={amount} />
            <input type="hidden" name="productId" value={planId || ''} />
            <input type="hidden" name="paymentStatus" value="unpaid" />
            <input type="hidden" name="status" value="pending" />

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="customerName"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="customerEmail"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">WhatsApp / Phone (Optional)</label>
                    <input
                        type="tel"
                        name="customerPhone"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Coupon Code (Optional)</label>
                    <input
                        type="text"
                        name="coupon"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                        placeholder="promo2024"
                    />
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-sm text-indigo-900 dark:text-indigo-200">
                    <strong>Note:</strong> You are choosing <u>Offline Payment</u>. After verifying your order, we will send you payment details manually.
                </div>
            </div>

            {status === 'error' && errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Order'}
            </button>
        </form>
    );
}
