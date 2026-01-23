'use server';

import { client } from '@/sanity/lib/client';

// Shop products usually come from Sanity now, not Supabase.
// So this action might strictly be for "getting products from Sanity" if not using direct fetch in component.

export async function getShopProducts() {
    // Example wrapper if needed, otherwise Components call Sanity directly.
    return client.fetch(`*[_type == "product"]`);
}
