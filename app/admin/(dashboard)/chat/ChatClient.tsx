'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Send, User, Loader2, MessageSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { getChatConvo, getConversations, sendChatMessage } from '@/app/actions/admin/chat';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChatClient() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getConversations();
            if (res.users) setUsers(res.users);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            const res = await getChatConvo(selectedUser.id);
            if (res.messages) setMessages(res.messages);
        };
        fetchMessages();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`chat:${selectedUser.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `or(sender_id.eq.${selectedUser.id},receiver_id.eq.${selectedUser.id})`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setSending(true);
        const res = await sendChatMessage(selectedUser.id, newMessage);
        if (res.success) {
            setNewMessage('');
        } else {
            alert('Failed to send message');
        }
        setSending(false);
    };

    if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Sidebar: User List */}
            <div className="w-80 border-r border-zinc-100 dark:border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-600 border border-transparent transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {users.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-4 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : user.full_name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-left overflow-hidden">
                                <div className="font-bold text-sm truncate dark:text-white">{user.full_name || 'Anonymous'}</div>
                                <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/30">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold flex-shrink-0">
                                {selectedUser.full_name?.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold dark:text-white">{selectedUser.full_name}</div>
                                <div className="text-xs text-green-500 flex items-center gap-1 font-bold">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" /> Online
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender_id !== selectedUser.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className={`max-w-[70%] p-4 rounded-3xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700 rounded-tl-none'} shadow-sm`}>
                                            <p className="text-sm leading-relaxed">{msg.message}</p>
                                            <div className={`text-[10px] mt-2 opacity-50 ${isMe ? 'text-white' : 'text-zinc-500'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-6 pr-16 py-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="font-bold">Select a user to start chatting</p>
                        <p className="text-sm mt-1">Real-time support and customer engagement</p>
                    </div>
                )}
            </div>
        </div>
    );
}
