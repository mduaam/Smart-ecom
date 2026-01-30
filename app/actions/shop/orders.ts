'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { broadcastNotification } from '@/lib/notification-service';

export async function getOrders(page: number = 1, limit: number = 10) {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'Unauthorized' };

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const { data, count, error } = await supabase
            .from('orders')
            .select('*, order_items(*)', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(start, end);

        if (error) throw error;
        return { data, total_count: count };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function createOrder(formData: FormData) {
    try {
        const supabase = await getSupabase();
        const supabaseAdmin = await getAdminSupabase();

        // 1. Extract Data
        const customerEmail = formData.get('customerEmail') as string;
        const { data: { user } } = await supabase.auth.getUser();

        const totalAmount = parseFloat(formData.get('final') as string);

        // Self-Healing: Ensure profile exists if user is logged in
        // (In case of schema reset where auth.users exist but profiles are gone)
        if (user) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (!profile) {
                // Create missing profile
                await supabaseAdmin.from('profiles').insert({
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || '',
                    role: 'user'
                });
            }
        }

        // 2. Create Order Record (Use Admin Client to bypass RLS)
        const planName = formData.get('plan') as string;
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user?.id || null,
                customer_email: customerEmail,
                guest_email: user ? null : customerEmail, // Keeping for compatibility if col exists
                total_amount: totalAmount,
                amount: totalAmount,
                final_amount: totalAmount, // Added to fix NOT NULL constraint error
                currency: 'USD',
                status: 'pending',
                plan_name: planName, // Add top-level plan_name
                customer_name: formData.get('customerName') as string,
                customer_phone: formData.get('customerPhone') as string,
                coupon_code: formData.get('coupon') as string || null,
                metadata: {
                    plan_name: planName // Store in metadata too just in case
                }
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Order Item
        const productId = formData.get('productId') as string || 'plan-unknown-id';

        const { error: itemError } = await supabaseAdmin
            .from('order_items')
            .insert({
                order_id: order.id,
                product_id: productId,
                product_name: planName,
                quantity: 1,
                unit_price: totalAmount,
                total_price: totalAmount
            });

        if (itemError) {
            console.error("Failed to create order item:", itemError);
        }

        // 4. Admin Notification
        // 4. Admin Notification
        await broadcastNotification(
            ['admin', 'super_admin'],
            'New Order: ' + planName,
            `$${totalAmount} from ${formData.get('customerName')}. Email: ${customerEmail}`,
            {
                type: 'success',
                category: 'order',
                link: '/admin/orders'
            }
        );

        revalidatePath('/admin/orders'); // Verify if this path still valid for user?
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
