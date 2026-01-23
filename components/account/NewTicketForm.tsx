'use client';

import React, { useState, useEffect } from 'react';
import { createTicket } from '@/app/actions/tickets';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewTicketForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [challenge, setChallenge] = useState({ num1: 0, num2: 0 });
    const router = useRouter();

    useEffect(() => {
        // Generate random math challenge on mount
        setChallenge({
            num1: Math.floor(Math.random() * 10) + 1,
            num2: Math.floor(Math.random() * 10) + 1
        });
    }, []);

    async function handleSubmit(formData: FormData) {
        setStatus('loading');
        setMessage('');

        // Append math challenge numbers so server can verify
        // (In a real high-security app we'd sign this or store session, but for basic bot protection this is fine)
        formData.append('math_challenge', `${challenge.num1},${challenge.num2}`);

        const res = await createTicket(formData);

        if (res.error) {
            setStatus('error');
            setMessage(res.error);
        } else if (res.success) {
            setStatus('success');
            setMessage('Ticket submitted successfully! Redirecting...');
            setTimeout(() => {
                router.push('/account/tickets');
                router.refresh();
            }, 2000);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5" />
                    {message}
                </div>
            )}
            {status === 'success' && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5" />
                    {message}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
                <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Brief summary of the issue"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white transition-all outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Priority</label>
                    <select
                        name="priority"
                        required
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white outline-none appearance-none"
                    >
                        <option value="low">Low - General Question</option>
                        <option value="medium">Medium - Minor Issue</option>
                        <option value="high">High - Critical Issue</option>
                    </select>
                </div>

                {/* Math Challenge */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        Security Check: {challenge.num1} + {challenge.num2} = ?
                    </label>
                    <input
                        type="number"
                        name="math_answer"
                        required
                        placeholder="Enter the sum"
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white outline-none"
                    />
                </div>
            </div>

            {/* Honeypot Field (Hidden) */}
            <input
                type="text"
                name="website_url"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                    name="description"
                    required
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white resize-none outline-none"
                ></textarea>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        'Submitting...'
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Submit Ticket
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
