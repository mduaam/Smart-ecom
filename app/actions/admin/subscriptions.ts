
'use server';

import { getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getAllSubscriptions() {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            profile:user_id ( id, email, full_name, role )
        `)
        .order('current_period_end', { ascending: false });

    if (error) {
        console.error('[Subscriptions Action] Fetch Error:', error);
        return { error: error.message };
    }

    return { subscriptions: data };
}

export async function getSubscriptionByOrderId(orderId: string) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            profile:user_id ( id, email, full_name )
        `)
        .eq('order_id', orderId)
        .maybeSingle();

    if (error) {
        return { error: error.message };
    }

    return { subscription };
}

export async function updateSubscription(
    subscriptionId: string,
    data: any
) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { error } = await supabase
        .from('subscriptions')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/subscriptions');
    revalidatePath('/admin/orders');
    return { success: true };
}

export async function extendSubscription(subscriptionId: string, days: number) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    // 1. Get current expiry
    const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('current_period_end')
        .eq('id', subscriptionId)
        .single();

    if (fetchError) return { error: fetchError.message };

    const currentExpiry = new Date(data.current_period_end);
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    // 2. Update
    const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
            current_period_end: newExpiry.toISOString(),
            status: 'active', // Ensure it becomes active if it was expired
            updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

    if (updateError) return { error: updateError.message };

    revalidatePath('/admin/subscriptions');
    return { success: true, newExpiry: newExpiry.toISOString() };
}

export async function deleteSubscription(id: string) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/subscriptions');
    return { success: true };
}
