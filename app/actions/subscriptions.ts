'use server';

import { getSupabase } from '@/lib/supabase-server';

export async function getUserSubscriptions() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Fetch all subscriptions, order by newest first
    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return { error: error.message };
    }

    const activeSubs = subscriptions.filter(s => ['active', 'trialing'].includes(s.status));
    const historySubs = subscriptions.filter(s => !['active', 'trialing'].includes(s.status));

    return {
        active: activeSubs,
        history: historySubs
    };
}
