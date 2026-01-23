
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Key:', supabaseKey ? 'Set (Service Role)' : 'Missing (Service Role)')

if (!supabaseKey) {
    console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from .env.local');
    console.error('You must add this key to perform admin actions like promoting users.');
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing environment variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Utility to manually promote a user to customer (simulate purchase)
async function promoteToCustomer(email: string) {
    // 1. Get User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = users.find(u => u.email === email);
    if (!user) {
        console.error(`User ${email} not found.`);
        return;
    }

    console.log(`Found user: ${user.id}`);

    // 2. Ensure Member exists
    await supabase.from('members').upsert({ id: user.id, email: email });

    // 3. Create Customer entry
    const { error: customerError } = await supabase
        .from('customers')
        .upsert({
            id: user.id,
            total_spend: 14.99,
            status: 'active',
            last_purchase_at: new Date().toISOString()
        });

    if (customerError) console.error('Error creating customer:', customerError);
    else console.log(`Success! ${email} is now a customer.`);
}

// To use: uncomment and run
// promoteToCustomer('jasonhomehome@gmail.com');

async function testReviewForeignKey() {
    console.log('Testing Review Schema (Member vs Customer)...');

    // 1. Create a dummy member ID (random UUID)
    // We need a real user ID that exists in auth.users for 'members' FK usually,
    // OR if members.id references auth.users which it does.
    // So we need to pick an EXISTING user.

    // Get the first user
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError || !users.length) {
        console.error('No users found to test with.');
        return;
    }
    const testUser = users[0];
    console.log(`Testing with User: ${testUser.email} (${testUser.id})`);

    // 2. Ensure they are in MEMBERS
    await supabase.from('members').upsert({
        id: testUser.id,
        email: testUser.email
    });

    // 3. Remove them from CUSTOMERS (to prove they don't need to be a customer)
    await supabase.from('customers').delete().eq('id', testUser.id);

    // 4. Try to insert a REVIEW
    const { data, error } = await supabase.from('reviews').insert({
        user_id: testUser.id,
        product_id: 'test-product-id',
        rating: 5,
        title: 'Test Review',
        content: 'Testing FK constraint',
        status: 'pending'
    }).select();

    if (error) {
        if (error.code === '23503') { // Foreign Key Violation
            console.error('FAILED: Foreign Key Violation. Reviews are likely still linked to CUSTOMERS table.');
            console.error('Please run the migration script again.');
        } else {
            console.error('Error inserting review:', error);
        }
    } else {
        console.log('SUCCESS: Review inserted for non-customer Member!');
        console.log('This confirms reviews are now linked to the MEMBERS table.');

        // Cleanup
        await supabase.from('reviews').delete().eq('id', data[0].id);
    }

    // Restore customer status if needed (Optional, user can run promote script)
}

testReviewForeignKey();
