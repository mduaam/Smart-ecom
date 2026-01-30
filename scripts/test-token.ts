
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

async function run() {
    console.log('Testing with token:', process.env.SANITY_API_TOKEN ? 'Present' : 'Missing');
    try {
        const plans = await client.fetch('*[_type == "plan"]{_id, name, slug}');
        console.log('Success! Found', plans.length, 'plans');
    } catch (e: any) {
        console.error('Fetch failed with token:');
        console.error(e.message);
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Body:', await e.response.text());
        }
    }
}

run();
