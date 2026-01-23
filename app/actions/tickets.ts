'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );
}

export async function createTicket(formData: FormData) {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: 'You must be logged in to submit a ticket.' };

        // Bot Protection Checks
        const honeypot = formData.get('website_url') as string; // Hidden field
        const mathAnswer = formData.get('math_answer') as string;
        const mathChallenge = formData.get('math_challenge') as string; // "num1,num2"

        // 1. Honeypot check
        if (honeypot) {
            // Silently fail for bots
            return { success: true };
        }

        // 2. Math Challenge check
        if (!mathAnswer || !mathChallenge) {
            return { error: 'Please solve the math question.' };
        }
        const [num1, num2] = mathChallenge.split(',').map(Number);
        if (parseInt(mathAnswer) !== num1 + num2) {
            return { error: 'Incorrect answer to the math question.' };
        }

        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as string;

        if (!subject || !description || !priority) {
            return { error: 'Please fill in all required fields.' };
        }

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

    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Assuming supabase query returns { data, error }
    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

export async function getAllTicketsAdmin() {
    const supabase = await getSupabase();

    // 1. Fetch tickets without join
    const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

    if (ticketsError) return { error: ticketsError.message };

    // 2. Fetch User Details from all_users_view
    const userIds = Array.from(new Set(tickets.map(t => t.user_id)));

    // Check if userIds is empty
    // Check if userIds is empty
    let usersMap = new Map();
    if (userIds.length > 0) {
        // Fetch from Profiles (Admins/Staff)
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds);

        if (profilesError) return { error: profilesError.message };

        profiles?.forEach(u => usersMap.set(u.id, { ...u, role: 'admin' })); // Assume admin/staff from profiles

        // Fetch from Members (Regular Users) - filtered to only those not yet found (optimization)
        const missingUserIds = userIds.filter(id => !usersMap.has(id));

        if (missingUserIds.length > 0) {
            const { data: members, error: membersError } = await supabase
                .from('members')
                .select('id, email, full_name')
                .in('id', missingUserIds);

            if (membersError) return { error: membersError.message };

            members?.forEach(u => usersMap.set(u.id, { ...u, role: 'user' }));
        }
    }

    // 3. Merge Data
    const ticketsWithProfiles = tickets.map(ticket => {
        const user = usersMap.get(ticket.user_id);
        return {
            ...ticket,
            profiles: user ? { email: user.email, full_name: user.full_name } : null
        };
    });

    return { data: ticketsWithProfiles };
}

export async function sendTicketMessage(ticketId: string, message: string) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // Check role to determine if internal or staff
    // We can rely on RLS, but for 'is_internal', we might need to set it explicitly if Admin
    // For now, simple message.

    // We need to fetch role to know if IS_STAFF logic (optional for UI coloring)
    // But for database, sender_id is enough.

    const { error } = await supabase.from('ticket_messages').insert({
        ticket_id: ticketId,
        sender_id: user.id,
        message
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
        .order('created_at', { ascending: true }); // Oldest first for chat view

    if (error) return { error: error.message };
    return { data };
}

export async function deleteTicket(ticketId: string) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)
        .eq('user_id', user.id); // Ensure user owns the ticket

    if (error) return { error: error.message };

    revalidatePath('/account/tickets');
    return { success: true };
}

export async function updateTicketStatus(ticketId: string, status: 'open' | 'closed') {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', ticketId)
        .eq('user_id', user.id); // Ensure user owns the ticket

    if (error) return { error: error.message };

    revalidatePath('/account/tickets');
    return { success: true };
}
