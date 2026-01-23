
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables manually if running standalone
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    const email = 'jasonhomehome@gmail.com';
    const password = 'Med@Rajae#1983';

    console.log(`Checking if user ${email} exists...`);

    // 1. Check if user exists but don't fetch by email directly since 'listUsers' is for managing all users
    // We'll try to just create and handle existing user error or list users filtering by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const existingUser = users.find(u => u.email === email);
    let userId;

    if (existingUser) {
        console.log('User already exists. Updating password and metadata...');
        userId = existingUser.id;
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: password,
            user_metadata: { role: 'admin', full_name: 'Admin User' },
            email_confirm: true // Auto confirm
        });

        if (updateError) {
            console.error('Error updating user:', updateError.message);
            return;
        }
        console.log('User password and metadata updated.');
    } else {
        console.log('Creating new admin user...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin', full_name: 'Admin User' }
        });

        if (createError) {
            console.error('Error creating user:', createError.message);
            return;
        }
        userId = newUser.user.id;
        console.log('User created successfully.');
    }

    // 2. Ensure profile exists and has role
    console.log('Updating/Creating profile entry...');
    const { data: profile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileCheckError.message);
    }

    if (!profile) {
        // Insert profile
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                full_name: 'Admin User',
                role: 'admin' // Ensure your profiles table has a role column, or add it if missing
            });

        if (insertError) {
            console.error('Error creating profile. You might need to add a "role" column to profiles table if it fails:', insertError.message);
            // Fallback: If role column doesn't exist, just insert basic and rely on auth metadata for now
        } else {
            console.log('Profile created.');
        }
    } else {
        // Update profile
        const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);

        if (updateProfileError) {
            console.error('Error updating profile role:', updateProfileError.message);
        } else {
            console.log('Profile role updated to admin.');
        }
    }

    console.log('Done! Admin user is ready.');
}

createAdminUser();
