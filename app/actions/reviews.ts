'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { broadcastNotification } from '@/lib/notification-service';

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

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profile:user_id ( full_name )
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
    const imageFile = formData.get('image') as File | null;

    if (!rating || rating < 1 || rating > 5) return { error: 'Invalid rating' };

    let image_url = null;

    // Handle Image Upload if present
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('reviews')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Image upload failed:', uploadError);
            // We continue without image if it fails, or we could return error
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('reviews')
                .getPublicUrl(filePath);
            image_url = publicUrl;
        }
    }

    // Insert Review
    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            title,
            content,
            image_url,
            status: 'pending'
        });

    if (error) {
        console.error('Submit Review Error:', error);
        return { error: error.message };
    }

    // Admin Notification
    await broadcastNotification(
        ['admin', 'super_admin'],
        'New Review Submitted',
        `A new review titled "${title}" was submitted for ${productId}.`,
        {
            type: 'info',
            category: 'system',
            link: '/admin/reviews'
        }
    );

    revalidatePath(`/plans/${productId}`);
    return { success: true, message: 'Review submitted for approval!' };
}

// --- Admin Actions ---

export async function getAdminReviews(status?: 'pending' | 'published' | 'rejected') {
    const supabase = await getSupabase(); // Use regular client, RLS handles admin check

    let query = supabase
        .from('reviews')
        .select(`
            *,
            profile:user_id ( full_name, email )
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

export async function deleteReview(reviewId: string) {
    const supabase = await getSupabase();

    // Admin check implicit via RLS
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

    if (error) return { error: error.message };

    revalidatePath('/admin/reviews');
    return { success: true };
}
