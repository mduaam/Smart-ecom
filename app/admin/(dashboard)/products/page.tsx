import { client } from '@/sanity/lib/client';
import ProductsClient from './ProductsClient';
import { Package } from 'lucide-react';
import UserMenu from '@/components/admin/UserMenuServer';
import NotificationsMenu from '@/components/admin/NotificationsMenuServer';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    let items = await client.fetch(`*[_type in ["plan", "product"]]{
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
        screens
    }`);

    if (!items || items.length === 0) {
        // Fallback for demo if no Sanity data
        items = [
            { _id: '1-month-default', _type: 'plan', name: { en: '1 Month Starter' }, price: 14.99, currency: 'usd', duration: '1-month', isPopular: false },
        ];
    }

    return (
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-600" />
                        Products & Plans
                    </h1>
                    <p className="text-zinc-500 mt-2">Manage your subscription plans and products.</p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationsMenu />
                    <UserMenu />
                </div>
            </header>

            <ProductsClient initialItems={items || []} />
        </main>
    );
}
