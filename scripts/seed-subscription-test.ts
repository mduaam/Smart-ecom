
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSubscription() {
    const userId = 'd601a05e-9161-40fd-9707-adf8d6d347c3';
    console.log(`Seeding subscription for user: ${userId}`);

    // Check if subscription exists
    const { data: existing } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

    const payload = {
        user_id: userId,
        plan_id: 'manual-test-plan',
        status: 'active',
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days
        stripe_subscription_id: 'manual-test-' + userId,
        iptv_username: '3170943141217788',
        iptv_password: '6712123928',
        iptv_url: 'http://vod4k.cc',
        m3u_link: 'http://n1.smartvpluseu.com/downloadfile?code=3170943141217788&type=m3u',
        max_connections: 1,
        updated_at: new Date()
    };

    if (existing) {
        console.log('Updating existing subscription...');
        const { error } = await supabase
            .from('subscriptions')
            .update(payload)
            .eq('id', existing.id);

        if (error) console.error('Error updating:', error);
        else console.log('Success!');
    } else {
        console.log('Creating new subscription...');
        const { error } = await supabase
            .from('subscriptions')
            .insert(payload);

        if (error) console.error('Error creating:', error);
        else console.log('Success!');
    }
}

seedSubscription();
