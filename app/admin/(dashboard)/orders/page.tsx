import React from 'react';
import OrdersClient from './OrdersClient';
import { getOrders } from '@/app/actions/admin/orders';

export const dynamic = 'force-dynamic';

export default async function OrdersPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const limit = 20;
    const { data: orders } = await getOrders(page, limit);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">Orders</h1>
                    <p className="text-zinc-500 mt-2">Manage and track store orders.</p>
                </div>

                <OrdersClient initialOrders={orders || []} />
            </main>
        </div>
    );
}
