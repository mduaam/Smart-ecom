import { getAdminSupabase } from '@/lib/supabase-server';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'system' | 'order' | 'ticket' | 'subscription' | 'security';

interface SendNotificationParams {
    userId: string;
    title: string;
    message?: string;
    type?: NotificationType;
    category?: NotificationCategory;
    link?: string;
}

/**
 * Sends a single notification to a specific user.
 * Uses Service Role to bypass RLS (so system can always notify).
 */
export async function sendNotification(params: SendNotificationParams) {
    const supabaseAdmin = await getAdminSupabase();

    const { error } = await supabaseAdmin
        .from('admin_notifications')
        .insert({
            user_id: params.userId,
            title: params.title,
            message: params.message,
            type: params.type || 'info',
            category: params.category || 'system',
            link: params.link
        });

    if (error) {
        console.error('[NotificationService] Failed to send:', error);
    }
}

/**
 * Broadcasts a notification to all users with a specific role (or multiple roles).
 * e.g. Notify all 'admin' and 'support' about a new ticket.
 */
export async function broadcastNotification(
    roles: string[],
    title: string,
    message?: string,
    data?: Partial<SendNotificationParams>
) {
    const supabaseAdmin = await getAdminSupabase();

    // 1. Get all users with these roles
    const { data: users, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .in('role', roles);

    if (userError || !users?.length) {
        return; // No one to notify
    }

    // 2. Prepare bulk insert
    const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        type: data?.type || 'info',
        category: data?.category || 'system',
        link: data?.link
    }));

    // 3. Bulk Insert
    const { error } = await supabaseAdmin
        .from('admin_notifications')
        .insert(notifications);

    if (error) {
        console.error('[NotificationService] Broadcast failed:', error);
    }
}
