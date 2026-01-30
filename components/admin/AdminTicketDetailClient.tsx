'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { adminAddTicketMessage, adminUpdateTicketStatus } from '@/app/actions/admin/tickets';
import { Send, User, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminTicketDetailClient({ ticket, initialMessages, user }: { ticket: any, initialMessages: any[], user: any }) {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [updating, setUpdating] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const channel = supabase
            .channel(`ticket-admin-${ticket.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ticket_messages',
                filter: `ticket_id=eq.${ticket.id}`
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [ticket.id]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        const res = await adminAddTicketMessage(ticket.id, newMessage);
        if (res.success) {
            setNewMessage('');
        } else {
            alert('Failed to send: ' + res.error);
        }
        setSending(false);
    };

    const toggleStatus = async () => {
        setUpdating(true);
        const newStatus = ticket.status === 'open' ? 'closed' : 'open';
        const res = await adminUpdateTicketStatus(ticket.id, newStatus);
        if (res.success) {
            router.refresh();
        } else {
            alert('Failed to update status');
        }
        setUpdating(false);
    };

    return (
        <div className="flex flex-col h-[700px] bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white mb-2">{ticket.subject}</h1>
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {new Date(ticket.created_at).toLocaleString()}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>
                <button
                    onClick={toggleStatus}
                    disabled={updating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${ticket.status === 'open' ? 'bg-zinc-900 text-white hover:bg-black' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : (ticket.status === 'open' ? <><XCircle className="w-5 h-5" /> Close Ticket</> : <><CheckCircle className="w-5 h-5" /> Reopen Ticket</>)}
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white dark:bg-zinc-900">
                {/* Original Description */}
                <div className="flex justify-start">
                    <div className="max-w-[80%] bg-zinc-100 dark:bg-zinc-800 p-6 rounded-3xl rounded-tl-none border border-zinc-200 dark:border-zinc-700">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Original Request</p>
                        <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200 leading-relaxed">{ticket.description}</p>
                    </div>
                </div>

                {messages.map((msg) => {
                    const fromAdmin = msg.is_admin || msg.sender_id === user.id;
                    return (
                        <div key={msg.id} className={`flex ${fromAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[75%] p-5 rounded-3xl shadow-sm ${fromAdmin
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700 rounded-tl-none'
                                }`}>
                                <p className={`text-[10px] font-black mb-2 uppercase tracking-widest ${fromAdmin ? 'text-indigo-200' : 'text-zinc-400'}`}>
                                    {fromAdmin ? 'Admin Response' : 'Customer Message'}
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content || msg.message}</p>
                                <div className={`text-[10px] mt-3 opacity-50 font-bold ${fromAdmin ? 'text-white' : 'text-zinc-500'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                {ticket.status === 'closed' ? (
                    <div className="text-center py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-500 font-bold text-sm italic">
                        This ticket is closed. Reopen it to send more messages.
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="relative">
                        <textarea
                            rows={3}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your official response..."
                            className="w-full p-4 pl-6 pr-16 bg-white dark:bg-black rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-sm resize-none"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="absolute right-4 bottom-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                        >
                            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
