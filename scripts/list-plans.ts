
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function run() {
    try {
        const plans = await client.fetch('*[_type == "plan"]{_id, name, slug}');
        console.log(JSON.stringify(plans, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
