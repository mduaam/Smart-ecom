import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    const email = 'jasonhomehome@gmail.com';
    console.log(`Verifying profile for ${email}...`);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error('Error fetching profile with Service Role:', error.message);
    } else {
        console.log('Profile found with Service Role:', {
            id: profile.id,
            email: profile.email,
            role: profile.role
        });

        // Check if there are multiple records
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('email', email);
        console.log(`Total profiles with this email: ${count}`);
    }
}

verify();
