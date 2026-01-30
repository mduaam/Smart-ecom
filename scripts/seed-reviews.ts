
import { createClient } from '@sanity/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sanity = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
    console.log('Fetching plans from Sanity...');
    const plans = await sanity.fetch('*[_type == "plan"]{_id, "slug": slug.current}');
    console.log(`Found ${plans.length} plans.`);

    console.log('Fetching a test user from Supabase...');
    const { data: users, error: userError } = await supabase.from('members').select('id').limit(1);

    if (userError || !users || users.length === 0) {
        console.error('No members found in database. Please register a user first.');
        return;
    }
    const userId = users[0].id;

    const reviewsToSeed = [
        {
            title: 'Amazing service!',
            content: 'I have been using this for 3 months now and it is rock solid. No buffering even on 4K.',
            rating: 5,
        },
        {
            title: 'Great value',
            content: 'The price is very competitive and the support team is very responsive.',
            rating: 4,
        }
    ];

    for (const plan of plans) {
        console.log(`Seeding reviews for plan: ${plan.slug}`);
        for (const r of reviewsToSeed) {
            const { error } = await supabase.from('reviews').insert({
                user_id: userId,
                product_id: plan.slug,
                rating: r.rating,
                title: r.title,
                content: r.content,
                status: 'published' // Auto-publish test data
            });
            if (error) console.error(`Failed to seed review for ${plan.slug}:`, error.message);
        }
    }

    console.log('Seeding finished!');
}

seed();
