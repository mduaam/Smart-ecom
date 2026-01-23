
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSubscriptions() {
    const userId = 'd601a05e-9161-40fd-9707-adf8d6d347c3';
    console.log(`Fetching subscriptions for user: ${userId}`);

    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
    }

    console.log(`Found ${subscriptions?.length} subscriptions.`);
    console.log(JSON.stringify(subscriptions, null, 2));

    // Also check orders
    console.log('\nFetching paid orders for context...');
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('payment_status', 'paid');

    if (ordersError) {
        console.error('Error fetching orders:', ordersError);
    } else {
        console.log(`Found ${orders?.length} paid orders.`);
        console.log(JSON.stringify(orders, null, 2));
    }
}

inspectSubscriptions();
