'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { updateTicketStatus, deleteTicket } from '@/app/actions/tickets';
import { useRouter } from 'next/navigation';

export default function TicketList({ initialTickets }: { initialTickets: any[] }) {
    const router = useRouter();
    const [tickets, setTickets] = useState(initialTickets);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        const matchesSearch =
            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.includes(searchQuery) ||
            t.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusUpdate = async (ticketId: string, newStatus: 'open' | 'closed') => {
        const result = await updateTicketStatus(ticketId, newStatus);
        if (result.success) {
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
            router.refresh();
        }
    };

    const handleDelete = async (ticketId: string) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return;
        const result = await deleteTicket(ticketId);
        if (result.success) {
            setTickets(prev => prev.filter(t => t.id !== ticketId));
            router.refresh();
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white">Support Tickets</h2>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search tickets, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-950/50">
                        <tr>
                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase">User</th>
                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase">Subject</th>
                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase">Status</th>
                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase">Priority</th>
                            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase">Date</th>
                            <th className="py-4 px-6 text-right text-xs font-bold text-zinc-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {ticket.profiles?.full_name?.[0] || ticket.profiles?.email?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold dark:text-white">{ticket.profiles?.full_name || 'Unknown'}</p>
                                            <p className="text-xs text-zinc-500">{ticket.profiles?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-sm font-bold dark:text-white truncate max-w-[200px]">{ticket.subject}</p>
                                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">#{ticket.id.slice(0, 8)}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase
                                        ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`text-xs font-bold uppercase
                                        ${ticket.priority === 'urgent' ? 'text-red-600' :
                                            ticket.priority === 'high' ? 'text-orange-600' :
                                                'text-blue-600'}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-zinc-500">
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/tickets/${ticket.id}`} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-600 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => handleStatusUpdate(ticket.id, 'closed')}
                                                className="p-2 hover:bg-green-50 text-zinc-400 hover:text-green-600 rounded-lg transition-colors"
                                                title="Close Ticket"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
