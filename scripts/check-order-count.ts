
import { getAdminSupabase } from '../lib/supabase-server';

async function checkCount() {
    const supabase = await getAdminSupabase();
    const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking count:', error);
    } else {
        console.log('Total orders in database:', count);
    }
}

checkCount();
