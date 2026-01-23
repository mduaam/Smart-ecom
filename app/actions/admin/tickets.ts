'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getTickets() {
    await assertAdmin();
    const supabase = await getSupabase();

    const { data, error } = await supabase
        .from('tickets')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function getTicketDetails(id: string) {
    await assertAdmin();
    const supabase = await getSupabase();

    const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*, profiles(email, full_name)')
        .eq('id', id)
        .single();

    if (error) return { error: error.message };

    // Fetch messages including internal
    const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*, profiles(email, full_name, role)')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

    return { ticket, messages };
}

export async function updateTicketStatus(id: string, status: string) {
    await assertAdmin();
    const supabase = await getSupabase();
    const { error } = await supabase.from('tickets').update({ status }).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/admin/inbox');
    return { success: true };
}

export async function replyTicket(ticketId: string, message: string, isInternal: boolean = false) {
    await assertAdmin();
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser(); // Safe as assertAdmin checked role

    const { error } = await supabase.from('ticket_messages').insert({
        ticket_id: ticketId,
        sender_id: user?.id,
        message,
        is_internal: isInternal
    });

    if (error) return { error: error.message };
    revalidatePath(`/admin/inbox`); // Refresh list
    return { success: true };
}
