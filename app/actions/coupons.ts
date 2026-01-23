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
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );
}

// Check if user is Admin
async function checkAdmin() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Use our new secure function if possible, or query profile directly
    // Ideally we use the helper we created in SQL, but for now direct query is fine if RLS allows reading own role
    // OR we just trust RLS to block the actual INSERT/UPDATE if not admin.
    // But for UI feedback, we check:
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return profile?.role === 'admin' || profile?.role === 'super_admin';
}

export async function getCoupons() {
    try {
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function createCoupon(formData: FormData) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const code = formData.get('code') as string;
    const discount_value = parseFloat(formData.get('discount_value') as string);
    const discount_type = formData.get('discount_type') as string;
    const max_uses = formData.get('max_uses') ? parseInt(formData.get('max_uses') as string) : null;

    // expiry is optional
    const expires_at_str = formData.get('expires_at') as string;
    const expires_at = expires_at_str ? new Date(expires_at_str).toISOString() : null;

    const { error } = await supabase.from('coupons').insert({
        code: code.toUpperCase(),
        discount_value,
        discount_type,
        max_uses,
        expires_at,
        created_by: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) return { error: error.message };
    revalidatePath('/admin/coupons');
    return { success: true };
}

export async function deleteCoupon(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/admin/coupons');
    return { success: true };
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: 'Unauthorized' };

    const supabase = await getSupabase();
    const { error } = await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/admin/coupons');
    return { success: true };
}
