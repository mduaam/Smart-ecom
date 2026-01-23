
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing environment variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySchema() {
    console.log('Verifying Schema...')

    // Check Coupons
    const { error: couponsError } = await supabase.from('coupons').select('id').limit(1)
    if (couponsError) {
        if (couponsError.code === '42P01') { // undefined_table
            console.log('❌ Table "coupons" does not exist.')
        } else {
            console.log('❌ Error checking "coupons":', couponsError.message)
        }
    } else {
        console.log('✅ Table "coupons" exists.')
    }

    // Check Tickets
    const { error: ticketsError } = await supabase.from('tickets').select('id').limit(1)
    if (ticketsError) {
        if (ticketsError.code === '42P01') {
            console.log('❌ Table "tickets" does not exist.')
        } else {
            console.log('❌ Error checking "tickets":', ticketsError.message)
        }
    } else {
        console.log('✅ Table "tickets" exists.')
    }
}

verifySchema()
