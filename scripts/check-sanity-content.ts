
import { createClient } from '@sanity/client';

// Re-creating client here to avoid import issues with relative paths/env vars in script context if not fully set up
const client = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function check() {
    console.log('Checking Sanity content...');
    try {
        const total = await client.fetch('count(*[])');
        console.log(`Total documents: ${total}`);

        if (total === 0) {
            console.log('No content found in the dataset.');
        } else {
            const types = await client.fetch('count(*[_type == "guide"])');
            console.log(`Guides found: ${types}`);

            const categories = await client.fetch('count(*[_type == "category"])');
            console.log(`Categories found: ${categories}`);

            const sample = await client.fetch('*[]{_id, _type, title, name}[0...10]');
            console.log('Sample documents:', JSON.stringify(sample, null, 2));
        }
    } catch (e) {
        console.error('Error fetching content:', e);
    }
}

check();
