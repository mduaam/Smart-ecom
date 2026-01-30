'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin, assertSuperAdmin } from '../auth'; // Updated import
import { logAdminAction } from './logs';
import { revalidatePath } from 'next/cache';

// REMOVED HARDCODED EMAIL CHECK
// Logic is now effectively delegated to `assertSuperAdmin` which checks DB role.

export async function getUsers() {
    await assertSuperAdmin();
    const supabase = await getSupabase();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function getCustomers() {
    await assertAdmin();
    const supabaseAdmin = await getAdminSupabase();

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function getTeamMembers() {
    await assertSuperAdmin();
    const supabaseAdmin = await getAdminSupabase();

    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'super_admin', 'support'])
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function inviteUser(email: string, role: string) {
    await assertSuperAdmin();
    const supabaseAdmin = await getAdminSupabase();

    try {
        const { data: userData, error: inviteError } = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { full_name: 'New Team Member' }
        });

        if (inviteError) throw inviteError;
        if (!userData.user) throw new Error('Failed to create user');

        // Update profile role
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: role })
            .eq('id', userData.user.id);

        if (profileError) {
            console.error('Profile update error', profileError);
        }

        // AUDIT LOG
        await logAdminAction('invite_team_member', email, { role, userId: userData.user.id });

        revalidatePath('/admin/team');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateRole(userId: string, role: string) {
    await assertSuperAdmin();
    const supabaseAdmin = await getAdminSupabase();

    // Fetch target email for logging
    const { data: target } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role })
        .eq('id', userId);

    if (error) return { error: error.message };

    // AUDIT LOG
    await logAdminAction('update_role', target?.email, { oldRole: '?', newRole: role, userId });

    revalidatePath('/admin/team');
    return { success: true };
}

export async function deleteUser(userId: string) {
    await assertSuperAdmin();
    const supabaseAdmin = await getAdminSupabase();

    // Fetch target email for logging
    const { data: target } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) return { error: error.message };

    // AUDIT LOG
    await logAdminAction('delete_team_member', target?.email, { userId });

    revalidatePath('/admin/team');
    return { success: true };
}
