import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTickets() {
    console.log('Seeding tickets...');

    // 1. Get a random user (or create one if none)
    const { data: profiles } = await supabase.from('profiles').select('id, email').limit(1);

    let userId;
    if (!profiles || profiles.length === 0) {
        console.log('No users found. Please sign up a user first.');
        return;
    }
    userId = profiles[0].id;
    console.log('Using user:', profiles[0].email);

    // 2. Create Tickets
    const tickets = [
        {
            user_id: userId,
            subject: 'Login issues on mobile app',
            description: 'Hello, I cannot login to the IPTV app on my Android phone. It says invalid credentials but works on web.',
            priority: 'high',
            status: 'open',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
            user_id: userId,
            subject: 'Channel list not updating',
            description: 'My playlist seems stuck. I added new channels but they are not showing up.',
            priority: 'normal',
            status: 'open',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        },
        {
            user_id: userId,
            subject: 'Refund request for duplicate charge',
            description: 'I was charged twice for the monthly subscription. Please refund one.',
            priority: 'urgent',
            status: 'open',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
        }
    ];

    for (const t of tickets) {
        const { data, error } = await supabase.from('tickets').insert(t).select().single();
        if (error) {
            console.error('Error creating ticket:', error);
        } else {
            console.log(`Created ticket: ${t.subject} (${data.id})`);

            // Add a message
            await supabase.from('ticket_messages').insert({
                ticket_id: data.id,
                sender_id: userId,
                message: t.description,
                created_at: t.created_at
            });
        }
    }

    console.log('Seeding complete.');
}

seedTickets();
