
import { getOrders } from '../app/actions/admin/orders';

async function diagnose() {
    console.log('--- Starting Orders Diagnosis ---');
    const result = await getOrders(1, 10);

    if (result.error) {
        console.error('Error fetching orders:', result.error);
    } else {
        console.log('Orders found:', result.data?.length || 0);
        console.log('Total count:', result.total_count);
        if (result.data && result.data.length > 0) {
            console.log('Sample Order Columns:', Object.keys(result.data[0]));
        }
    }
    console.log('--- Diagnosis Complete ---');
}

diagnose();
