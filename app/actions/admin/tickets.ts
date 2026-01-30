'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getAllTicketsAdmin() {
    await assertAdmin();
    const supabase = await getSupabase();

    const { data, error } = await supabase
        .from('tickets')
        .select('*, profiles ( email, full_name )')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function adminAddTicketMessage(ticketId: string, content: string) {
    await assertAdmin();
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticketId,
            sender_id: user?.id,
            content,
            is_admin: true
        });

    if (error) return { error: error.message };

    // Update ticket last_updated
    await supabase.from('tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

    revalidatePath(`/admin/tickets/${ticketId}`);
    return { success: true };
}

export async function adminUpdateTicketStatus(ticketId: string, status: 'open' | 'closed') {
    await assertAdmin();
    const supabase = await getSupabase();

    const { error } = await supabase
        .from('tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

    if (error) return { error: error.message };
    revalidatePath(`/admin/tickets/${ticketId}`);
    return { success: true };
}
