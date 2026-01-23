import { getSupabase } from '@/lib/supabase-server';
import { getTicketMessages } from '@/app/actions/tickets';
import TicketDetailClient from '@/components/account/TicketDetailClient';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = await params;
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .eq('user_id', user.id)
        .single();

    console.log('[TicketDetail] Check:', {
        ticketId: ticketId,
        userId: user.id,
        found: !!ticket,
        error: error?.message
    });

    if (error || !ticket) {
        console.error('[TicketDetail] Not found or error:', error);
        notFound();
    }

    // Fetch Messages
    const { data: messages } = await getTicketMessages(ticketId);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/account/tickets" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Tickets
            </Link>

            <TicketDetailClient
                ticket={ticket}
                initialMessages={messages || []}
                user={user}
            />
        </div>
    );
}
