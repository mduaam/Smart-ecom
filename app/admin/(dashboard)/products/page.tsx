import { client } from '@/sanity/lib/client';
import ProductsClient from './ProductsClient';
import { Package } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    let items = [];
    let error = null;

    try {
        items = await client.fetch(`*[_type in ["plan", "product"]]{
            _id,
            _type,
            name,
            price,
            currency,
            duration,
            description,
            stock,
            variants,
            stripeProductId,
            isPopular,
            screens,
            features,
            image
        }`);
    } catch (err: any) {
        console.error('Sanity Fetch Error:', err);
        error = err.message || 'Failed to fetch products from CMS.';
    }

    if (error) {
        return (
            <main className="flex-1 p-4 md:p-8 lg:p-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-[2rem] text-red-600 dark:text-red-400">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-8 h-8 opacity-50" />
                        <h2 className="text-xl font-bold italic">Products Page Error</h2>
                    </div>
                    <p className="font-medium">{error}</p>
                    <p className="text-sm mt-2 opacity-70">Please check your Sanity token and connectivity.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-600" />
                        Products & Plans
                    </h1>
                    <p className="text-zinc-500 mt-2">Manage your subscription plans and products.</p>
                </div>
            </div>

            <ProductsClient initialItems={items || []} />
        </main>
    );
}
