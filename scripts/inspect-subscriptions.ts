
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log('Inspecting columns of subscriptions table...');
    // We can't query information_schema easily via supabase-js unless exposed.
    // But we can try to RPC or just use rpc if available.
    // Alternatively, try to insert a dummy row and see error.

    // Let's try to just select the specific column and see if it errors differently
    const { data, error } = await supabase
        .from('subscriptions')
        .select('current_period_start')
        .limit(1);

    if (error) {
        console.error('Error selecting column:', error);
    } else {
        console.log('Column appears to exist (select succeeded, though might be empty)');
    }
}

inspectSchema();
