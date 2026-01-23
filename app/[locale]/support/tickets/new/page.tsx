"use client";

import { Send } from 'lucide-react';
import { useState } from 'react';
import { createTicket } from '@/app/actions/shop/tickets';

export default function NewTicketPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would submit to the backend
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Open a Support Ticket</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Describe your issue and we'll get back to you within 2 hours.</p>
                    </div>

                    {submitted ? (
                        <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl border border-green-200 dark:border-green-900 text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                                <Send className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Ticket Submitted!</h3>
                            <p className="text-green-700 dark:text-green-300">Thank you for contacting us. We will respond shortly to your email.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-bold text-green-600 hover:underline">Submit another ticket</button>
                        </div>
                    ) : (
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <form className="space-y-6" action={async (formData) => {
                                const res = await createTicket(formData);
                                if (res.error) {
                                    alert(res.error); // Simple alert for now, could be toast
                                } else {
                                    setSubmitted(true);
                                }
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Priority</label>
                                        <select name="priority" className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all">
                                            <option value="low">Low - General Question</option>
                                            <option value="medium">Medium - Issue with Service</option>
                                            <option value="high">High - Cannot Access</option>
                                            <option value="urgent">Urgent - Payment/Billing</option>
                                        </select>
                                    </div>
                                    <div>
                                        {/* Name and Email come from Auth Session usually, but can be useful for Guest tickets if we support them 
                                            For now, we enforce auth in action, so these are visual/cosmetic if not pre-filled. */}
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Subject</label>
                                        <input name="subject" type="text" required className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-400" placeholder="Briefly describe your issue" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                                    <textarea name="description" rows={5} required className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-400" placeholder="Please provide more details regarding your issue..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Submit Ticket
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
