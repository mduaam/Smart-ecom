import { getCoupons, toggleCouponStatus, deleteCoupon } from '@/app/actions/admin/coupons';
import CreateCouponForm from '@/components/admin/CreateCouponForm';
import { Tag, Plus, Trash2, Calendar, Users, Power } from 'lucide-react';
import CouponsClient from './CouponsClient';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
    const { data: coupons, error } = await getCoupons();

    return (
        <main className="p-4 md:p-8 lg:p-12 overflow-y-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Tag className="w-8 h-8 text-indigo-500" />
                        Coupons & Discounts
                    </h1>
                    <p className="text-zinc-500 mt-2">Manage marketing campaigns and discount codes.</p>
                </div>
            </header>

            {/* We use a client component wrapper for interactivity (Modal, Delete, Toggle) */}
            <CouponsClient initialCoupons={coupons || []} />
        </main>
    );
}
