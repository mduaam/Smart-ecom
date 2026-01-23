import InboxClient from './InboxClient';
import { getAllTicketsAdmin } from '@/app/actions/tickets';
import { MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
    const { data: tickets, error } = await getAllTicketsAdmin();

    return (
        <main className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <header className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        Support Inbox
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage user tickets and live chats.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Real-time Active
                    </span>
                </div>
            </header>

            {/* Client Component for the main 2-pane interface */}
            <InboxClient initialTickets={tickets || []} />
        </main>
    );
}
