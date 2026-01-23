'use server';

import { getSupabase } from '@/lib/supabase-server';

export async function logAdminAction(action: string, targetEmail: string | undefined, details: any = {}) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return; // Should allow logging even if auth check failed? No, only authenticated actions.

    await supabase.from('admin_logs').insert({
        admin_id: user.id,
        action,
        target_email: targetEmail,
        details
    });
}

export async function getAdminLogs() {
    const supabase = await getSupabase();
    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    // Fetch logs with admin details
    const { data, error } = await supabase
        .from('admin_logs')
        .select(`
            *,
            profiles:admin_id (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) return { error: error.message };
    return { data };
}
