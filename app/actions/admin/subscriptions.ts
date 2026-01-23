
'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getSubscriptionByOrderId(orderId: string) {
    await assertAdmin();
    const supabase = await getSupabase();

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('order_id', orderId)
        .single();

    if (error) {
        return { error: error.message };
    }

    return { subscription };
}

export async function updateSubscriptionCredentials(
    subscriptionId: string,
    data: {
        iptv_username?: string;
        iptv_password?: string;
        iptv_url?: string;
        m3u_link?: string;
        activation_code?: string;
        alternative_urls?: string[];
        status?: string;
        max_connections?: number;
    }
) {
    await assertAdmin();
    const supabase = await getSupabase();



    // Verify Update
    const { data: updated, error } = await supabase
        .from('subscriptions')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/orders');
    return { success: true };
}
