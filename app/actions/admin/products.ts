'use server';

import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';
import { client } from '@/sanity/lib/client';

// We need a write token for mutations. 
// Assuming client is configured with token or we create a write client here.
// Usually client in lib is public read-only.
// We need process.env.SANITY_API_TOKEN

import { createClient } from 'next-sanity';

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN, // Helper to ensure this env var exists
    useCdn: false,
});

export async function createPlan(planData: any) {
    await assertAdmin();

    try {
        const doc = {
            _type: 'plan',
            name: { en: planData.name }, // Localize structure
            price: planData.price,
            currency: planData.currency,
            duration: planData.duration,
            screens: planData.screens,
            isPopular: planData.isPopular,
            stripeProductId: planData.stripeProductId // Optional
        };

        const result = await writeClient.create(doc);
        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Create Error:", error);
        return { error: error.message };
    }
}

export async function updatePlan(id: string, updates: any) {
    await assertAdmin();

    try {
        const result = await writeClient
            .patch(id)
            .set({
                'name.en': updates.name,
                price: updates.price,
                currency: updates.currency,
                duration: updates.duration,
                screens: updates.screens,
                isPopular: updates.isPopular
            })
            .commit();

        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Update Error:", error);
        return { error: error.message };
    }
}

export async function createProduct(productData: any) {
    await assertAdmin();

    try {
        const doc = {
            _type: 'product',
            name: { en: productData.name },
            price: productData.price,
            currency: productData.currency,
            description: { en: productData.description },
            stock: productData.stock,
            image: productData.image ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: productData.image
                }
            } : undefined,
            variants: productData.variants
        };

        const result = await writeClient.create(doc);
        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Create Product Error:", error);
        return { error: error.message };
    }
}

export async function updateProduct(id: string, updates: any) {
    await assertAdmin();

    try {
        const result = await writeClient
            .patch(id)
            .set({
                'name.en': updates.name,
                price: updates.price,
                currency: updates.currency,
                'description.en': updates.description,
                stock: updates.stock,
                ...(updates.image && {
                    image: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: updates.image
                        }
                    }
                }),
                variants: updates.variants
            })
            .commit();

        revalidatePath('/admin/products');
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Sanity Update Product Error:", error);
        return { error: error.message };
    }
}

export async function uploadProductImage(formData: FormData) {
    await assertAdmin();

    const file = formData.get('file') as File;
    if (!file) {
        return { error: 'No file provided' };
    }

    try {
        // Convert File to Buffer/Stream
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await writeClient.assets.upload('image', buffer, {
            contentType: file.type,
            filename: file.name,
        });

        return { success: true, assetId: asset._id, url: asset.url };
    } catch (error: any) {
        console.error("Sanity Upload Error:", error);
        return { error: error.message };
    }
}

export async function decrementStock(productId: string, variantKey: string, quantity: number) {
    // Note: We don't necessarily assertAdmin here if this is called from a public order flow?
    // But usually this wraps within a secure server action.

    try {
        // We need to find the product and update it.
        // If it's global stock, we update 'stock'.
        // If it's a variant, we need to find the variant in the array and update its stock.

        const product = await client.fetch(`*[_id == $id][0]`, { id: productId });
        if (!product) return { error: 'Product not found' };

        if (!product.variants || product.variants.length === 0) {
            // Global Stock
            const newStock = (product.stock || 0) - quantity;
            await writeClient.patch(productId).set({ stock: newStock }).commit();
        } else {
            // Variant Stock
            // If variantKey passed is SKU, we find the _key.

            const variant = product.variants.find((v: any) => v.sku === variantKey || v._key === variantKey);
            if (!variant) return { error: 'Variant not found' };

            if (variant._key) {
                const newStock = (variant.stock || 0) - quantity;
                // path: variants[_key=="thekey"].stock
                await writeClient
                    .patch(productId)
                    .set({ [`variants[_key=="${variant._key}"].stock`]: newStock })
                    .commit();
            } else {
                return { error: 'Cannot patch variant without key' };
            }
        }

        return { success: true };

    } catch (error: any) {
        console.error("Stock Decrement Error:", error);
        return { error: error.message };
    }
}

export async function getProductsForDropdown() {
    // Public read is fine for dropdown usually, or assertAdmin if strict.
    // assertAdmin(); // internal tool so maybe yes.
    try {
        const products = await client.fetch(`*[_type == "product"]{_id, name, variants, price, stock}`);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
