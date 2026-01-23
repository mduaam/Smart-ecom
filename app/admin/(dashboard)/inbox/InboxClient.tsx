'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getTicketMessages, sendTicketMessage } from '@/app/actions/tickets';
import { Search, Filter, Send, User, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

// Initialize Supabase Client for Realtime (using env vars exposed to client)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InboxClient({ initialTickets }: { initialTickets: any[] }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Subscribe to new tickets
    useEffect(() => {
        const channel = supabase
            .channel('tickets-all')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, (payload) => {
                console.log('New Ticket:', payload);
                // In a real app we should fetch the profile for the new ticket or just prepend with basic data
                // For now, let's just re-fetch or append raw payload (might miss profile name)
                setTickets((prev) => [payload.new, ...prev]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Fetch messages when a ticket is selected
    useEffect(() => {
        if (!selectedTicketId) return;

        setLoadingMessages(true);
        getTicketMessages(selectedTicketId).then((res) => {
            if (res.data) setMessages(res.data);
            setLoadingMessages(false);
        });

        // Subscribe to messages for this ticket
        const channel = supabase
            .channel(`ticket-${selectedTicketId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ticket_messages',
                filter: `ticket_id=eq.${selectedTicketId}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };

    }, [selectedTicketId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicketId) return;

        const msg = newMessage;
        setNewMessage(''); // Optimistic clear

        await sendTicketMessage(selectedTicketId, msg);
        // Message will be added via subscription
    };

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar: Ticket List */}
            <div className="w-full md:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-black/50">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className={`p-4 border-b border-zinc-100 dark:border-zinc-900 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${selectedTicketId === ticket.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-bold text-sm truncate ${selectedTicketId === ticket.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-200'}`}>
                                    {ticket.subject}
                                </h3>
                                <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 truncate mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ticket.status === 'open' ? 'bg-blue-100 text-blue-600' :
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-500'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {ticket.priority}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Pane: Message Thread */}
            <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
                {selectedTicket ? (
                    <>
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{selectedTicket.subject}</h2>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <User className="w-4 h-4" />
                                    <span>{selectedTicket.profiles?.full_name || selectedTicket.profiles?.email || 'Unknown User'}</span>
                                    <span className="text-zinc-300 mx-1">|</span>
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(selectedTicket.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-bold bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-700">Mark Resolved</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Initial Description as first message */}
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl rounded-tl-none shadow-sm">
                                    <p className="text-xs font-bold text-zinc-400 mb-1">{selectedTicket.profiles?.full_name || 'User'}</p>
                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                            </div>

                            {messages.map((msg) => {
                                // Determine alignment based on sender (In real app, compare msg.sender_id with current admin id)
                                // But here we need to know who sent it.
                                // For now, let's assume if it's NOT the ticket creator, it's Admin? 
                                // Or we check `sender_id`.
                                // Let's guess for UI demo:
                                const isAdmin = msg.sender_id !== selectedTicket.user_id;

                                return (
                                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-xl shadow-sm ${isAdmin
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-none'
                                            }`}>
                                            <p className={`text-xs font-bold mb-1 ${isAdmin ? 'text-indigo-200' : 'text-zinc-400'}`}>
                                                {isAdmin ? 'You' : 'User'}
                                            </p>
                                            <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}`}>{msg.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    type="text"
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-950 border border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all dark:text-white"
                                />
                                <button type="submit" disabled={!newMessage.trim()} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    <span>Send</span>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium">Select a ticket to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
