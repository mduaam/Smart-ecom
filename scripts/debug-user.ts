import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email: string) {
    console.log(`Checking user: ${email}`);

    // 1. Check Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.log('User NOT FOUND in auth.users');
        return;
    }
    console.log(`User found in Auth. ID: ${user.id}`);
    console.log('Metadata:', user.user_metadata);

    // 2. Check Profiles (Team)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) console.log('Found in PROFILES (Team):', profile);
    else console.log('Not in PROFILES (Team)');

    // 3. Check Members
    const { data: member } = await supabase.from('members').select('*').eq('id', user.id).single();
    if (member) console.log('Found in MEMBERS:', member);
    else console.log('Not in MEMBERS');

    // 4. Check Customers
    const { data: customer } = await supabase.from('customers').select('*').eq('id', user.id).single();
    if (customer) console.log('Found in CUSTOMERS:', customer);
    else console.log('Not in CUSTOMERS');
}

checkUser('jasonhomehome@gmail.com');
