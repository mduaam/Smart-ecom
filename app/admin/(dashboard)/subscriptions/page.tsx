
import { getAllSubscriptions } from '@/app/actions/admin/subscriptions';
import SubscriptionManagementClient from './SubscriptionManagementClient';
import { Activity, ShieldCheck } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage() {
    const { subscriptions, error } = await getAllSubscriptions();

    if (error) {
        return (
            <main className="flex-1 p-8 md:p-12 bg-zinc-950 min-h-screen">
                <div className="bg-red-900/20 border border-red-800 p-8 rounded-3xl text-red-500">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <Activity className="w-6 h-6" /> Data Fetch Error
                    </h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                        <ShieldCheck className="w-10 h-10 text-indigo-600" />
                        IPTV SUBSCRIPTIONS
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Global management of active lines and customer access.</p>
                </div>
            </div>

            <SubscriptionManagementClient initialSubscriptions={subscriptions || []} />
        </main>
    );
}
