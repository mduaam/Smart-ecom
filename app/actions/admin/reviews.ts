'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getReviews(status?: 'pending' | 'approved' | 'rejected') {
    await assertAdmin();
    const supabase = await getSupabase();

    let query = supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id ( full_name, email ) 
        `)
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    return { data };
}

export async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
    await assertAdmin();
    const supabase = await getSupabase();

    const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

    if (error) return { error: error.message };

    revalidatePath('/admin/reviews');
    return { success: true };
}
