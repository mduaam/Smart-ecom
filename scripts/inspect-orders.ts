
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectOrders() {
    console.log('Fetching recent orders...');
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
    }

    console.log('Recent Orders:', JSON.stringify(orders, null, 2));

    if (orders && orders.length > 0) {
        const orderIds = orders.map(o => o.id);
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);

        if (itemsError) {
            console.error('Error fetching items:', itemsError);
        } else {
            console.log('Order Items:', JSON.stringify(items, null, 2));
        }
    }
}

inspectOrders();
