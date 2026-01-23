'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    );
}

export async function getDashboardData(locale: string) {
    const supabase = await getSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated', user: null };
    }

    // 1. Fetch Profile
    // 1. Fetch Profile or Member
    let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // If not in profiles, check members
    if (!profile) {
        const { data: member } = await supabase
            .from('members')
            .select('*')
            .eq('id', user.id)
            .single();

        if (member) {
            profile = { ...member, role: 'user' }; // Normalize Structure
        }
    }

    // 2. Fetch Active Subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // 3. Fetch Recent Orders (limit 5)
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // 4. Fetch Recent Tickets (limit 5)
    const { data: tickets } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    return {
        user,
        profile,
        subscription,
        orders: orders || [],
        tickets: tickets || [],
    };
}
