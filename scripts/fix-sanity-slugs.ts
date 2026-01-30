
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function fixSlugs() {
    console.log('Fetching plans to check slugs...');
    try {
        const plans = await client.fetch('*[_type == "plan"]{_id, slug}');
        console.log(`Found ${plans.length} plans.`);

        for (const plan of plans) {
            const currentSlug = plan.slug?.current;
            if (currentSlug && currentSlug !== currentSlug.trim()) {
                const newSlug = currentSlug.trim();
                console.log(`Fixing plan ${plan._id}: "${currentSlug}" -> "${newSlug}"`);

                await client
                    .patch(plan._id)
                    .set({ 'slug.current': newSlug })
                    .commit();

                console.log(`Fixed ${plan._id}`);
            } else {
                console.log(`Plan ${plan._id} slug is already clean or missing.`);
            }
        }
        console.log('Finished checking slugs.');
    } catch (e: any) {
        console.error('Error fixing slugs:', e.message);
    }
}

fixSlugs();
