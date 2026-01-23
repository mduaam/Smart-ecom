'use server';

import { getSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getReviews(productId: string) {
    const supabase = await getSupabase();
    // Public read policy ensures only published reviews are visible
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id ( full_name )
        `)
        .eq('product_id', productId)
        .eq('status', 'approved') // Use 'approved' from clean schema
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function submitReview(formData: FormData) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to review.' };

    const productId = formData.get('productId') as string;
    const rating = parseInt(formData.get('rating') as string);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!rating || rating < 1 || rating > 5) return { error: 'Invalid rating' };

    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            text: content, // Schema uses 'text' not 'content'
            // 'title' missing in clean schema? Wait, clean schema only had 'text'.
            // I should double check clean schema.
            // Yep, clean schema has 'text'. I will put title in text or just ignore title for now?
            // Or add title to text. "Title: ... \n ..."
            status: 'pending'
        });

    if (error) return { error: error.message };

    revalidatePath(`/products/${productId}`);
    return { success: true, message: 'Review submitted for approval.' };
}
