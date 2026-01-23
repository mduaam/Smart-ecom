'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';

export async function getNotifications() {
    await assertAdmin();
    const supabase = await getSupabase();

    // Fetch Recent Paid Orders (Limit 5)
    // We treat new paid orders as a notification
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, created_at, payment_status')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch Open Tickets (Limit 5) - Manual Join to avoid relation errors
    const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, subject, priority, created_at, status, user_id')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

    if (ordersError) console.error('Error fetching order notifications:', ordersError);
    if (ticketsError) console.error('Error fetching ticket notifications:', ticketsError);

    let ticketsWithProfiles = [];
    if (tickets && tickets.length > 0) {
        // Collect User IDs
        const userIds = Array.from(new Set(tickets.map((t: any) => t.user_id).filter(Boolean)));

        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .in('id', userIds);

            const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]));

            ticketsWithProfiles = tickets.map((ticket: any) => ({
                ...ticket,
                profiles: profilesMap.get(ticket.user_id) || { full_name: 'Unknown', email: 'N/A' }
            }));
        } else {
            ticketsWithProfiles = tickets.map((t: any) => ({ ...t, profiles: { full_name: 'Unknown', email: 'N/A' } }));
        }
    }

    return {
        orders: orders || [],
        tickets: ticketsWithProfiles
    };
}
