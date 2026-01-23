'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sendTicketMessage, getTicketMessages } from '@/app/actions/tickets';
import { Send, User, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TicketDetailClient({ ticket, initialMessages, user, isAdmin = false }: { ticket: any, initialMessages: any[], user: any, isAdmin?: boolean }) {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`ticket-customer-${ticket.id}`)
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
        const msg = newMessage;
        setNewMessage(''); // Optimistic clear

        // Send via server action
        const res = await sendTicketMessage(ticket.id, msg);

        if (res.error) {
            // Revert on error (could add toast)
            alert('Failed to send message');
            setNewMessage(msg);
        }

        setSending(false);
    };

    return (
        <div className="flex flex-col h-[600px] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white mb-2">{ticket.subject}</h1>
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(ticket.created_at).toLocaleString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full uppercase ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {ticket.status}
                            </span>
                            <span className="uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                {ticket.priority}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-black">
                {/* Original Description */}
                <div className="flex justify-end">
                    <div className="max-w-[85%] bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-xs font-bold text-indigo-200 mb-1">You</p>
                        <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>
                    </div>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${isMe
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
                                }`}>
                                <p className={`text-xs font-bold mb-1 ${isMe ? 'text-indigo-200' : 'text-zinc-500'}`}>
                                    {isMe ? 'You' : (isAdmin ? 'Customer' : 'Support Team')}
                                </p>
                                <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a reply..."
                        disabled={sending}
                        className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
