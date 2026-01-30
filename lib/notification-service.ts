import { getAdminSupabase } from '@/lib/supabase-server';
import { Resend } from 'resend';

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
 * ALSO sends an email to relevant admins.
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
        .select('id, email')
        .in('role', roles);

    if (userError || !users?.length) {
        console.error('[NotificationService] No users found for roles:', roles);
        // We continue to strictly send to hardcoded emails if no role-based users found?
        // Let's continue to ensure hardcoded admins get it even if DB is empty of admins.
    }

    const safeUsers = users || [];

    // 2. Prepare bulk insert for In-App Notifications
    if (safeUsers.length > 0) {
        const notifications = safeUsers.map(user => ({
            user_id: user.id,
            title,
            message,
            type: data?.type || 'info',
            category: data?.category || 'system',
            link: data?.link
        }));

        const { error } = await supabaseAdmin
            .from('admin_notifications')
            .insert(notifications);

        if (error) {
            console.error('[NotificationService] Broadcast in-app failed:', error);
        }
    }

    // 3. Send Emails via Resend
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.warn('[NotificationService] Missing RESEND_API_KEY. Skipping emails.');
            return;
        }
        const resend = new Resend(resendApiKey);

        // Collect Emails
        const emailSet = new Set<string>();

        // Add role-based emails
        safeUsers.forEach(u => {
            if (u.email) emailSet.add(u.email);
        });

        // Add Hardcoded Admins
        emailSet.add('jasonhomehome@gmail.com');
        emailSet.add('proatlas12@gmail.com');

        const recipients = Array.from(emailSet);

        if (recipients.length === 0) return;

        console.log('[NotificationService] Sending emails to:', recipients);

        // Send individually to hide other recipients (or use BCC)
        // Using loop for safety and individual delivery reporting
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Admin Notifications <notifications@resend.dev>';

        await Promise.all(recipients.map(async (email) => {
            const { error: emailError } = await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: `[Admin Alert] ${title}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>${title}</h2>
                        <p style="font-size: 16px;">${message || ''}</p>
                        ${data?.link ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}${data.link}" style="display:inline-block; padding:10px 20px; background:#000; color:#fff; text-decoration:none; border-radius:5px;">View in Admin</a>` : ''}
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eaeaea;" />
                        <p style="color: #666; font-size: 12px;">Automated Alert System</p>
                    </div>
                `
            });

            if (emailError) {
                console.error(`[NotificationService] Failed to email ${email}:`, emailError);
            }
        }));

    } catch (err) {
        console.error('[NotificationService] Email dispatch error:', err);
    }
}
