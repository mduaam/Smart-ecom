import React from 'react';

import NewTicketForm from '@/components/account/NewTicketForm';
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function NewTicketPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/account/tickets"
                            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Tickets
                        </Link>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">Create New Ticket</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Please provide as much detail as possible so we can help you faster.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <NewTicketForm />
                    </div>
                </div>
            </main>
        </div>

    );
}
