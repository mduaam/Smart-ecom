'use server';

import { getSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createTicket(formData: FormData) {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: 'You must be logged in to submit a ticket.' };

        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;

        const { data: ticket, error } = await supabase.from('tickets').insert({
            user_id: user.id,
            subject,
            description,
            priority,
            status: 'open'
        }).select().single();

        if (error) throw error;

        revalidatePath('/account/tickets');
        return { success: true, ticketId: ticket.id };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getUserTickets() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return { data };
}

export async function sendTicketMessage(ticketId: string, message: string) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('ticket_messages').insert({
        ticket_id: ticketId,
        sender_id: user.id,
        message,
        is_internal: false
    });

    if (error) return { error: error.message };

    // Update ticket updated_at
    await supabase.from('tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticketId);

    revalidatePath(`/support/tickets/${ticketId}`);
    return { success: true };
}

export async function getTicketMessages(ticketId: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .eq('is_internal', false) // Users shouldn't see internal notes
        .order('created_at', { ascending: true });

    if (error) return { error: error.message };
    return { data };
}
