const { createClient } = require('@sanity/client');

// Hardcoding envs for debug
const client = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Ensure fresh data
    token: 'skFS9LdA4soADr25GbHWBx9UxhPjstBxAP8tT5lbD5TbJIjgGpIlFYPMXeRAvzD0MGj7Utuxcai7wQQbml2dciTyFNGxXyTtUpaO6XRx6qsqRHVsAUTZVrRrJkCmn81GMaWKmO1q2IagvxY0wwnWUPAcqdhyfGv8rzNUFAAlAyhmrzg07E1w'
});

async function main() {
    console.log('Fetching plans...');
    try {
        const plans = await client.fetch(`*[_type == "plan"]{_id, name, slug, "slugCurrent": slug.current}`);
        console.log('Plans found:');
        plans.forEach(p => {
            console.log(`ID: ${p._id}, Slug: ${p.slugCurrent}`);
        });

        // Test the specific query used in page.tsx
        const testId = plans[0]?._id;
        if (testId) {
            console.log(`Testing Query with ID: ${testId}`);
            const result = await client.fetch(`*[_type == "plan" && (slug.current == $slug || _id == $slug)][0]`, { slug: testId });
            console.log('Query Result:', result ? 'Found' : 'Not Found');
        }

    } catch (err) {
        console.error('Error fetching plans:', err.message);
    }
}

main();
