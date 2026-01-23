'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    );
}

export async function getUserOrders() {
    const supabase = await getSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return { error: error.message };
    }

    return { data };
}

export async function getUserProfile() {
    const supabase = await getSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // 1. Try fetching from profiles (admin/staff)
    let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. If not found, fetch from members (regular users)
    if (!data) {
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('id', user.id)
            .single();

        if (member) {
            data = { ...member, role: 'user' };
            error = null; // Clear profile lookup error
        } else if (memberError) {
            // If really not found in either, return error (or could let it be null)
            error = memberError;
        }
    }

    if (error) {
        // It's possible to be authenticated but not in DB yet (if strict auth failed/bypassed?)
        // But with strict auth, we expect member to exist.
        return { data: null, user, error: error.message };
    }

    return { data, user };
}

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated', success: false };

    const fullName = formData.get('fullName') as string;

    // Try updating members first (most likely)
    let { error } = await supabase
        .from('members')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id);

    // If error (e.g. not found), try profiles
    if (error) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: fullName }) // Profiles might trigger other things?
            .eq('id', user.id);

        if (profileError) return { error: profileError.message, success: false };
    }

    revalidatePath('/[locale]/account/[userId]/settings', 'page');
    return { success: true, error: undefined, message: 'Profile updated' };
}
