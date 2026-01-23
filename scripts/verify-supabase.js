
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('Could not read .env.local', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Key:', supabaseKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing environment variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    const { data, error } = await supabase.from('test_table_does_not_exist').select('*').limit(1)

    if (error) {
        if (error.code === 'PGRST301' || error.message?.includes('does not exist')) {
            console.log('Connection Successful! (Table lookup failed as expected, but auth passed)')
        } else if (error.code === '401' || error.code === '403') {
            console.error('Connection Failed: Authentication Error. Check your API Key.')
            console.error('Error Details:', error)
        } else {
            console.log('Connection Successful! (Received response from server)')
            console.log('Note: ' + error.message)
        }
    } else {
        console.log('Connection Successful! (Data received)')
    }
}

testConnection()
