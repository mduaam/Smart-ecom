'use server';

import { getSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '../auth';

// Standardized check
async function assertAdmin() {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized: Admin access required');
    }
}

export async function getCoupons() {
    try {
        await assertAdmin();
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
    try {
        await assertAdmin();
        const supabase = await getSupabase();

        const code = formData.get('code') as string;
        const discount_value = parseFloat(formData.get('discount_value') as string);
        const discount_type = formData.get('discount_type') as string;
        const max_uses = formData.get('max_uses') ? parseInt(formData.get('max_uses') as string) : null;

        const expires_at_str = formData.get('expires_at') as string;
        const expires_at = expires_at_str ? new Date(expires_at_str).toISOString() : null;

        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('coupons').insert({
            code: code.toUpperCase(),
            discount_value,
            discount_type,
            max_uses,
            expires_at,
            created_by: user?.id
        });

        if (error) throw error;
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteCoupon(id: string) {
    try {
        await assertAdmin();
        const supabase = await getSupabase();
        const { error } = await supabase.from('coupons').delete().eq('id', id);

        if (error) throw error;
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    try {
        await assertAdmin();
        const supabase = await getSupabase();
        const { error } = await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);

        if (error) throw error;
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
