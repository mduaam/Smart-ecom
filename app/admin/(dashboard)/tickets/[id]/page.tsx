import { getSupabase } from '@/lib/supabase-server';
import { getTicketMessages } from '@/app/actions/tickets';
import AdminTicketDetailClient from '@/components/admin/AdminTicketDetailClient';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    // 1. Fetch ticket (raw, no join)
    const { data: ticketData, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !ticketData) {
        notFound();
    }

    // 2. Fetch User Details
    let userData = null;
    const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, role')
        .eq('id', ticketData.user_id)
        .single();

    if (profile) {
        userData = profile;
    } else {
        const { data: member } = await supabase
            .from('members')
            .select('email, full_name')
            .eq('id', ticketData.user_id)
            .single();
        if (member) userData = { ...member, role: 'user' };
    }

    const ticket = {
        ...ticketData,
        profiles: userData ? { email: userData.email, full_name: userData.full_name } : null
    };

    const { data: messages } = await getTicketMessages(id);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 lg:p-12 font-sans">
            <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-600 mb-8 font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Return to Help Desk
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <AdminTicketDetailClient
                        ticket={ticket}
                        initialMessages={messages || []}
                        user={user}
                    />
                </div>

                {/* Sidebar Info for Admin */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="font-bold mb-4 dark:text-white">Customer Info</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">Name</p>
                                <p className="dark:text-white">{ticket.profiles?.full_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">Email</p>
                                <p className="dark:text-white break-all">{ticket.profiles?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">User ID</p>
                                <p className="font-mono text-xs text-zinc-500 break-all">{ticket.user_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
