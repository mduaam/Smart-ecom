'use server';

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";

const client = createClient({
    projectId: "79u0009g",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN, // REQUIRED for write operations
});

export async function updatePlan(planId: string, data: any) {
    if (!process.env.SANITY_API_TOKEN) {
        return { error: "Missing SANITY_API_TOKEN. Cannot update content." };
    }

    try {
        // Handle fallback data: "Lazy Seed" - Create ALL default plans if editing ONE default one
        // This ensures the user doesn't lose the other 2 plans ("Disappearing Data" problem)
        if (planId.endsWith('-default')) {
            const defaultPlans = [
                { id: '1-month-default', name: '1 Month Starter', price: 14.99, duration: '1-month', isPopular: false },
                { id: '6-months-default', name: '6 Months Standard', price: 39.99, duration: '6-months', isPopular: true },
                { id: '12-months-default', name: '12 Months Premium', price: 64.99, duration: '12-months', isPopular: false },
            ];

            const transaction = client.transaction();
            let targetCreatedId = null; // We need to return the ID of the plan we actually edited

            // We create 3 documents. 
            // NOTE: We cannot easily return the specific ID of the edited doc nicely in one go unless we generate IDs.
            // But we don't need the ID immediately for the client state since we refresh.
            // Let's iterate.

            defaultPlans.forEach(def => {
                const isTarget = def.id === planId;

                const doc = {
                    _type: 'plan',
                    name: { en: isTarget ? data.name : def.name },
                    price: parseFloat(isTarget ? data.price : def.price.toString()),
                    currency: isTarget ? data.currency : 'usd',
                    duration: isTarget ? data.duration : def.duration,
                    screens: isTarget ? parseInt(data.screens) : 1,
                    isPopular: isTarget ? data.isPopular : def.isPopular,
                    slug: { current: (isTarget ? data.name : def.name).toLowerCase().replace(/\s+/g, '-') }
                };

                // We use create because we want system-generated IDs for real docs
                transaction.create(doc);
            });

            const result = await transaction.commit();

            revalidatePath('/admin/products');
            return { success: true, data: result };
        }

        const result = await client
            .patch(planId)
            .set({
                name: { en: data.name },
                price: parseFloat(data.price),
                currency: data.currency,
                duration: data.duration,
                screens: parseInt(data.screens),
                isPopular: data.isPopular
            })
            .commit();

        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Update Error:", error);
        return { error: error.message };
    }
}

export async function createPlan(data: any) {
    if (!process.env.SANITY_API_TOKEN) {
        return { error: "Missing SANITY_API_TOKEN. Cannot create content." };
    }

    try {
        const doc = {
            _type: 'plan',
            name: { en: data.name },
            price: parseFloat(data.price),
            currency: data.currency || 'usd',
            duration: data.duration,
            screens: parseInt(data.screens) || 1,
            isPopular: data.isPopular,
            slug: { current: data.name.toLowerCase().replace(/\s+/g, '-') }
        };

        const result = await client.create(doc);

        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Create Error:", error);
        return { error: error.message };
    }
}
