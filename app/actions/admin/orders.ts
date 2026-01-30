'use server';

import { getSupabase, getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

// Types matching the new schema
type OrderItem = {
    id: string;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
};

type Order = {
    id: string;
    order_number: number;
    user_id: string | null;
    guest_email: string | null;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    final_amount: number;
    currency: string;
    status: string;
    payment_status: 'paid' | 'unpaid' | 'refunded';
    fulfillment_status: 'pending' | 'active' | 'shipped' | 'cancelled';
    coupon_code: string | null;
    internal_notes: string | null;
    created_at: string;
    order_items: OrderItem[];
    customer?: {
        name: string;
        email: string;
        phone?: string | null;
        id?: string;
    };
};

export async function getOrders(page: number = 1, limit: number = 20) {
    try {
        await assertAdmin();
        const supabase = await getAdminSupabase(); // Admin client for all dashboard ops

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        // 1. Fetch Orders with Items
        const { data: rawOrders, count, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items ( * )
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(start, end);

        if (error) {
            console.error('Error fetching orders:', error);
            return { error: error.message };
        }

        if (!rawOrders) return { data: [], total_count: 0 };

        // 2. Extract User IDs for Member Lookup
        const userIds = Array.from(new Set(rawOrders.map(o => o.user_id).filter(Boolean))) as string[];

        // 3. Fetch Profiles (linked users)
        const membersMap = new Map();
        if (userIds.length > 0) {
            const { data: members } = await supabase
                .from('profiles')
                .select('id, email, full_name')
                .in('id', userIds);

            members?.forEach((m: any) => membersMap.set(m.id, m));
        }

        // 4. Merge Data
        const orders: Order[] = rawOrders.map(order => {
            const member = order.user_id ? membersMap.get(order.user_id) : null;

            // Determine Customer Info
            // Priority: Order Columns (Snapshot) > Member/Auth User
            const customerName = order.customer_name || member?.full_name || 'Guest User';
            const customerEmail = order.customer_email || member?.email || order.guest_email || 'No Email';
            const customerPhone = order.customer_phone || null;

            return {
                ...order,
                customer: {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    id: member?.id
                }
            };
        });

        return { data: orders, total_count: count };
    } catch (err: any) {
        console.error('[Orders Action] Internal Error:', err.message);
        return { error: 'Failed to fetch orders. Please check your connection.' };
    }
}

export async function updateOrder(id: string, updates: Partial<Order>) {
    try {
        await assertAdmin();
        const supabase = await getAdminSupabase();

        const { error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id);

        if (error) return { error: error.message };
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (err: any) {
        console.error('[Orders Action] Update Error:', err.message);
        return { error: 'Failed to update order. Connection error.' };
    }
}

export async function deleteOrder(id: string) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) return { error: error.message };
    revalidatePath('/admin/orders');
    return { success: true };
}

export async function createOrder(formData: FormData) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const billingAddress = formData.get('billingAddress') as string;
    const shippingAddress = formData.get('shippingAddress') as string;
    const planName = formData.get('plan') as string;
    const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
    const discount = parseFloat(formData.get('discount') as string) || 0;
    const finalAmount = Math.max(0, basePrice - discount);

    const paymentStatus = formData.get('paymentStatus') as string;
    const fulfillmentStatus = formData.get('fulfillmentStatus') as string;
    const internalNotes = formData.get('internalNotes') as string;

    // 1. Find or Create Profile?
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: existingUser?.id || null,
            guest_email: existingUser ? null : customerEmail,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            billing_address: billingAddress,
            shipping_address: shippingAddress,
            final_amount: finalAmount,
            payment_status: paymentStatus,
            fulfillment_status: fulfillmentStatus,
            internal_notes: internalNotes,
            status: 'pending'
        })
        .select()
        .single();

    if (orderError) return { error: orderError.message };

    // 3. Create Order Item
    const productId = formData.get('productId') as string;

    const { error: itemError } = await supabase
        .from('order_items')
        .insert({
            order_id: order.id,
            product_id: productId || 'manual-entry',
            product_type: 'plan',
            name: planName,
            price: finalAmount,
            quantity: 1,
            total: finalAmount
        });

    if (itemError) return { error: itemError.message };

    revalidatePath('/admin/orders');
    return { success: true };
}

export async function addOrderNote(orderId: string, content: string) {
    await assertAdmin();
    const supabase = await getAdminSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('order_notes')
        .insert({
            order_id: orderId,
            admin_id: user?.id,
            content
        });

    if (error) return { error: error.message };
    return { success: true };
}

export async function getOrderNotes(orderId: string) {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    const { data: notes, error } = await supabase
        .from('order_notes')
        .select(`
            *,
            admin:profiles ( full_name, email )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { notes };
}
