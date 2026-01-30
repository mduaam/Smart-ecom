'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase-server';

// Fetch current user's notifications
export async function getMyNotifications(limit = 20) {
    const supabase = await getSupabase();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], count: 0, unreadCount: 0 };

    // 2. Fetch Notifications
    const { data, error, count } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) return { error: error.message };

    // 3. Get unread count specifically
    const { count: unreadCount } = await supabase
        .from('admin_notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    return {
        data,
        count: count || 0,
        unreadCount: unreadCount || 0
    };
}

export async function markAsRead(notificationId: string) {
    const supabase = await getSupabase();
    // Auth check implicit in RLS, but user check needed for robust action
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id); // Extra safety

    if (error) return { error: error.message };
    revalidatePath('/admin/notifications');
    return { success: true };
}

export async function markAllAsRead() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) return { error: error.message };
    revalidatePath('/admin/notifications');
    return { success: true };
}

export async function deleteNotification(notificationId: string) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

    if (error) return { error: error.message };
    revalidatePath('/admin/notifications');
    return { success: true };
}
