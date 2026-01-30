'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentProfile, requireRole } from '@/lib/auth-service';
import { ROLES, UserProfile } from '@/types/auth';

export type Profile = UserProfile;

export async function getProfile(): Promise<Profile | null> {
    return getCurrentProfile();
}

export async function isAdmin(): Promise<boolean> {
    const profile = await getCurrentProfile();
    // Using the centralized hasRole logic implicitly via specific checks if needed, 
    // or just direct check for now to match interface.
    // Ideally we use checkRole, but we are keeping this function signature.
    return !!profile && (profile.role === 'admin' || profile.role === 'super_admin');
}

export async function assertAdmin() {
    await requireRole(ROLES.ADMIN);
}

export async function assertSuperAdmin() {
    await requireRole(ROLES.SUPER_ADMIN);
}

// --- Session Actions ---

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const locale = formData.get('locale') as string || 'en';

    const supabase = await getSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    if (data.user) {
        // Enforce Registration: Check if Unified Profile exists
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', data.user.id).single();

        if (!profile) {
            // Authenticated in Auth but NOT in DB -> "Zombie" user / Broken Trigger
            await supabase.auth.signOut();
            return { error: 'Profile not found. Please contact support or try signing up again.' };
        }

        redirect(`/${locale}/account/${data.user.id}/dashboard`);
    } else {
        redirect(`/${locale}`);
    }
}


export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const locale = formData.get('locale') as string || 'en';

    const supabase = await getSupabase();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'user', // Explicitly set role for trigger routing
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Member creation is handled by trigger in new schema usually, but we can double check logic.
    // In strict clean schema, 'handle_new_user' trigger usually inserts into public.profiles or public.members.
    // Let's rely on trigger or add redundancy if trigger is missing. 
    // Ideally we should trust the trigger we set up in schema_clean.sql (if we did).

    if (data.user) {
        // The 'handle_new_user' trigger now creates the profile automatically.
        // We just redirect to the dashboard.
        redirect(`/${locale}/account/${data.user.id}/dashboard`);
    } else {
        redirect(`/${locale}`);
    }
}

export async function logout(locale: string = 'en') {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    redirect(`/${locale}/auth/login`);
}

export async function adminLogout() {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    redirect(`/admin/login`);
}

export async function adminLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await getSupabase();

    console.log('Admin Login Attempt:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Admin Login Error:', error.message);
        return { error: error.message };
    }

    // Role Verification
    if (data.user) {
        const supabaseAdmin = await getAdminSupabase();
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        const allowedRoles = ['admin', 'super_admin']; // Strict allow list

        if (!profile || !allowedRoles.includes(profile.role)) {
            await supabase.auth.signOut();
            return { error: 'Unauthorized: Access restricted to team members.' };
        }
    }

    redirect(`/admin/dashboard`);
}

export async function resetPassword(formData: FormData) {
    const email = formData.get('email') as string;
    const locale = formData.get('locale') as string || 'en';
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/update-password`,
    });
    if (error) return { error: error.message };
    return { success: true };
}
