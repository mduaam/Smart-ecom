'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';

export async function logAdminAction(action: string, targetEmail: string | undefined, details: any = {}) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Use Admin Client for writing logs to ensure no RLS blocks insertion of audit trails
    // (Optional, but safer if we lock down admin_logs table tightly)
    const adminSupabase = await getAdminSupabase();
    await adminSupabase.from('admin_logs').insert({
        admin_id: user.id,
        action,
        target_email: targetEmail,
        details
    });
}

export async function getAdminLogs() {
    await assertAdmin();
    const supabaseAdmin = await getAdminSupabase();

    // Fetch logs with admin details using Service Role
    const { data, error } = await supabaseAdmin
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
