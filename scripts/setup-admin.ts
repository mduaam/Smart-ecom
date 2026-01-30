import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const targetEmail = 'jasonhomehome@gmail.com';
const targetPassword = 'Med@Rajae#1983';

async function setupAdmin() {
    console.log(`Setting up super admin for ${targetEmail}...`);

    try {
        console.log('Attempting to create user...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: targetEmail,
            password: targetPassword,
            email_confirm: true,
            user_metadata: { full_name: 'Super Admin' }
        });

        let userId: string | undefined;

        if (createError) {
            console.log(`Create error: ${createError.message}`);

            // Try to find the user ID from the profiles table instead of listUsers
            console.log('Attempting to find user ID from profiles table...');
            const { data: profile, error: profileFetchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', targetEmail)
                .single();

            if (profileFetchError) {
                console.log(`Profile fetch error: ${profileFetchError.message}`);
                // If profiles fails, try listUsers as a last resort (even though it failed before)
                console.log('Attempting listUsers as last resort...');
                const { data: users, error: listError } = await supabase.auth.admin.listUsers();
                if (listError) throw listError;

                const existingUser = users.users.find(u => u.email === targetEmail);
                if (!existingUser) throw new Error('Could not find user anywhere');
                userId = existingUser.id;
            } else {
                userId = profile.id;
            }

            if (!userId) throw new Error('Found no user ID');

            console.log(`Found user ID: ${userId}. Updating password...`);
            const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                password: targetPassword,
                email_confirm: true
            });
            if (updateError) throw updateError;
        } else {
            if (!newUser.user) throw new Error('Create user succeeded but returned no user data');
            userId = newUser.user.id;
            console.log(`Successfully created new user with ID: ${userId}`);
        }

        // 3. Upsert into profiles table
        console.log(`Setting role to super_admin in profiles table for ID: ${userId}...`);
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: targetEmail,
                role: 'super_admin',
                updated_at: new Date().toISOString()
            });

        if (profileError) {
            console.error('Error updating profiles:', profileError.message);
        }

        // 4. Try updating members table as well
        console.log('Ensuring user exists in members table...');
        const { error: memberError } = await supabase
            .from('members')
            .upsert({
                id: userId,
                email: targetEmail,
                full_name: 'Super Admin',
                updated_at: new Date().toISOString()
            });

        if (memberError) {
            console.log('Members update error (non-critical):', memberError.message);
        }

        console.log('Successfully setup super admin!');
    } catch (error: any) {
        console.error('Failed to setup admin:', error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
}

setupAdmin();
