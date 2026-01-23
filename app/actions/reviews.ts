'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Helper to get Supabase client
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

// Helper for Admin Client (Service Role)
function getAdminSupabase() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) throw new Error('Missing Service Role Key');

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            cookies: {
                getAll() { return []; },
                setAll() { },
            },
        }
    );
}

// --- Public Actions ---

export async function getReviews(productId: string) {
    const supabase = await getSupabase();

    // Public read policy ensures only published reviews are visible (if policy is correct)
    // Or we can explicitly filter: .eq('status', 'published')
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            member:user_id ( full_name )
        `)
        .eq('product_id', productId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

// --- Customer/Member Actions ---

export async function submitReview(formData: FormData) {
    const supabase = await getSupabase();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to review.' };

    const productId = formData.get('productId') as string;
    const rating = parseInt(formData.get('rating') as string);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!rating || rating < 1 || rating > 5) return { error: 'Invalid rating' };

    // Insert Review
    // Note: RLS will check if user is a member (registered)
    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            title,
            content,
            status: 'pending' // Default
        });

    if (error) {
        console.error('Submit Review Error:', error);
        return { error: error.message };
    }

    revalidatePath(`/products/${productId}`); // Or where reviews are shown
    return { success: true, message: 'Review submitted for approval.' };
}

// --- Admin Actions ---

export async function getAdminReviews(status?: 'pending' | 'published' | 'rejected') {
    const supabase = await getSupabase(); // Use regular client, RLS handles admin check

    let query = supabase
        .from('reviews')
        .select(`
            *,
            member:user_id ( full_name, email ) 
            -- Note: user_id now links to members
        `)
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    return { data };
}

export async function updateReviewStatus(reviewId: string, status: 'published' | 'rejected') {
    const supabase = await getSupabase();
    // Admin check is implicit via RLS "Admins manage reviews"

    const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId);

    if (error) return { error: error.message };

    revalidatePath('/admin/reviews');
    return { success: true };
}

export async function replyToReview(reviewId: string, reply: string) {
    const supabase = await getSupabase();

    const { error } = await supabase
        .from('reviews')
        .update({
            admin_reply: reply,
            reply_at: new Date().toISOString()
        })
        .eq('id', reviewId);

    if (error) return { error: error.message };

    revalidatePath('/admin/reviews');
    return { success: true };
}
