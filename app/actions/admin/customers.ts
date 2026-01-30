'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';

export async function getCustomers() {
    try {
        await assertAdmin();
        const supabase = await getAdminSupabase();

        // 1. Fetch All Unified Profiles with 'member' role
        const { data: members, error: membersError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'member')
            .order('created_at', { ascending: false });

        if (membersError) {
            console.error('Error fetching customers:', membersError.message);
            return { error: membersError.message };
        }

        if (!members) return { data: [] };

        // 2. Fetch Orders for stats aggregation
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('user_id, final_amount, created_at');

        if (ordersError) {
            console.error('Error fetching orders for stats:', ordersError.message);
            // Continue without stats if orders fail? or return error?
            // Let's just log and continue with 0 stats
        }

        // 3. Aggregate Stats
        const statsMap = new Map();
        orders?.forEach((order: any) => {
            if (!order.user_id) return;

            if (!statsMap.has(order.user_id)) {
                statsMap.set(order.user_id, { total_spent: 0, orders_count: 0, last_order_at: null });
            }

            const stats = statsMap.get(order.user_id);
            stats.total_spent += (order.final_amount || 0);
            stats.orders_count += 1;

            // Track latest order
            if (!stats.last_order_at || new Date(order.created_at) > new Date(stats.last_order_at)) {
                stats.last_order_at = order.created_at;
            }
        });

        // 4. Merge
        const customers = members.map((member: any) => {
            const stats = statsMap.get(member.id) || { total_spent: 0, orders_count: 0, last_order_at: null };
            return {
                id: member.id,
                email: member.email,
                full_name: member.full_name,
                total_spent: stats.total_spent,
                orders_count: stats.orders_count,
                last_order_at: stats.last_order_at, // Use real last order or null
                created_at: member.created_at
            };
        });

        return { data: customers };
    } catch (err: any) {
        console.error('[Customers Action] Internal Error:', err.message);
        return { error: 'Failed to fetch customers. Please check your connection.' };
    }
}

export async function getCustomerDetails(userId: string) {
    try {
        await assertAdmin();
        const supabase = await getAdminSupabase();

        // 1. Fetch Unified Profile
        const { data: member, error: memberError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (memberError && memberError.code !== 'PGRST116') { // Ignore not found, might be purely order-based in future
            return { error: memberError.message };
        }

        // 2. Fetch Orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // 3. Fetch Tickets
        const { data: tickets } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // 4. Fetch Reviews
        const { data: reviews } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // 5. Fetch Subscriptions
        const { data: subscriptions } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (ordersError) {
            return { error: ordersError.message };
        }

        // 6. Aggregate Stats
        const totalSpent = orders?.reduce((sum: any, order: any) => sum + (order.final_amount || 0), 0) || 0;
        const orderCount = orders?.length || 0;
        // Extract address from latest order if available
        const latestOrder = orders?.[0];

        return {
            data: {
                id: userId,
                full_name: member?.full_name || latestOrder?.customer_name || 'Guest User',
                email: member?.email || latestOrder?.customer_email || 'No Email',
                phone: member?.phone || latestOrder?.customer_phone || 'N/A',
                join_date: member?.created_at || latestOrder?.created_at,
                total_spent: totalSpent,
                orders_count: orderCount,
                orders: orders || [],
                tickets: tickets || [],
                reviews: reviews || [],
                subscriptions: subscriptions || [],
                billing_address: member?.billing_address || latestOrder?.billing_address || 'N/A',
                shipping_address: member?.shipping_address || latestOrder?.shipping_address || 'N/A'
            }
        };
    } catch (err: any) {
        console.error('[Customers Action] Details Error:', err.message);
        return { error: 'Failed to fetch customer details. Please check your connection.' };
    }
}

export async function updateCustomer(id: string, data: any) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    // 1. Update Unified Profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            billing_address: data.billing_address,
            shipping_address: data.shipping_address
        })
        .eq('id', id);

    if (profileError) {
        if (profileError.code === 'PGRST116') {
            return { error: 'Customer profile not found (might be a guest).' };
        }
        return { error: profileError.message };
    }

    // 2. Optionally update snapshot on recent orders?
    // Good practice: Update most recent order so "Guest" fallback looks correct if they are guest.
    // But since we are editing "Member", the dashboard prefers Member data.

    // However, if we want to be thorough, update all orders for this user?
    // That's expensive. Let's just update the member profile for now.

    return { success: true };
}

export async function deleteCustomer(id: string) {
    await assertAdmin();
    const supabase = await getSupabase();

    // 1. Delete Member (Cascade should handle profile if linked, but `members` is the user data)
    // Wait, `members.id` references `auth.users`. We cannot delete `auth.users` via client SDK usually unless using Service Role.
    // `assertAdmin` uses authenticated client.
    // Admin CAN delete from `members` table if RLS allows.
    // BUT `auth.users` remains.

    // To fully delete a user, we need `supabase.auth.admin.deleteUser(id)` which requires SERVICE_ROLE_KEY.
    // We cannot do that with just `getSupabase()` (which uses headers/cookies).
    // So we will just delete the `members` record.
    // AND unlink orders (set user_id = null).


    // 2. Unlink Subscriptions (Optional but good practice)
    const { error: subError } = await supabase
        .from('subscriptions')
        .update({ user_id: null })
        .eq('user_id', id);

    if (subError) console.error('Subscription unlink warning:', subError.message);

    const { error: unlinkError } = await supabase
        .from('orders')
        .update({ user_id: null })
        .eq('user_id', id);

    if (unlinkError) return { error: 'Failed to unlink orders: ' + unlinkError.message };

    // 3. Delete Member (Cascade should handle profile if linked)
    const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (deleteError) return { error: deleteError.message };

    return { success: true };
}

export async function createCustomer(data: any) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    // Generate a new UUID for the customer (pseudo-user)
    // Since we aren't creating an Auth User, we just need a unique ID for the members table.
    // We can let Postgres generate it if we omit ID, BUT members usually expects ID to match Auth.
    // If we just insert into members with a generated UUID, it works as a "Guest Profile".

    // Check if email already exists in profiles
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existing) {
        return { error: 'Customer with this email already exists.' };
    }

    // Insert new profile with 'member' role
    const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
            id: crypto.randomUUID(), // For guest-like profiles without auth
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            billing_address: data.billing_address,
            shipping_address: data.shipping_address,
            role: 'member'
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    return { success: true, data: newProfile };
}

