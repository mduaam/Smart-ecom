import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ArrowLeft, Plus, Search } from 'lucide-react';

interface TicketsPageProps {
    params: {
        locale: string;
    };
}

const TicketsPage = async ({ params }: TicketsPageProps) => {
    const { locale } = params;
    const t = await getTranslations('Support');

    // Mock tickets data (will be replaced with Supabase in Phase 3)
    const tickets = [
        {
            id: 'TKT-001',
            subject: 'Activation code not working',
            status: 'open',
            priority: 'high',
            created: '2 hours ago',
            lastReply: '1 hour ago'
        },
        {
            id: 'TKT-002',
            subject: 'Buffering issues on Firestick',
            status: 'in-progress',
            priority: 'medium',
            created: '1 day ago',
            lastReply: '3 hours ago'
        },
        {
            id: 'TKT-003',
            subject: 'Question about multi-room subscription',
            status: 'resolved',
            priority: 'low',
            created: '3 days ago',
            lastReply: '2 days ago'
        },
    ];

    const statusColors = {
        open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    const priorityColors = {
        low: 'text-zinc-500',
        medium: 'text-yellow-600',
        high: 'text-red-600',
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <main className="pt-20">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/support"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Support
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                    Support Tickets
                                </h1>
                                <p className="text-xl text-white/90">
                                    Manage your support requests
                                </p>
                            </div>
                            <Link
                                href="/support/tickets/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                New Ticket
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Search and Filter */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Tickets */}
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/support/tickets/${ticket.id}` as any}
                                className="block bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-mono text-zinc-500">
                                                {ticket.id}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                                                {ticket.status.replace('-', ' ')}
                                            </span>
                                            <span className={`text-xs font-semibold ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                                                {ticket.priority} priority
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                                            {ticket.subject}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                                            <span>Created {ticket.created}</span>
                                            <span>•</span>
                                            <span>Last reply {ticket.lastReply}</span>
                                        </div>
                                    </div>
                                    <div className="text-indigo-600 font-semibold text-sm">
                                        View Details →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State (if no tickets) */}
                    {tickets.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-6">
                                You don't have any support tickets yet.
                            </p>
                            <Link
                                href="/support/tickets/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Your First Ticket
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TicketsPage;
