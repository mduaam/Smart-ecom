
import { getDeepAnalytics } from '@/app/actions/admin/analytics';
import AnalyticsManagementClient from './AnalyticsManagementClient';
import { BarChart3, TrendingUp } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const data = await getDeepAnalytics();

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                        <BarChart3 className="w-10 h-10 text-indigo-600" />
                        BUSINESS INTELLIGENCE
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Deep insights into revenue, support, and product performance.</p>
                </div>
            </div>

            <AnalyticsManagementClient data={data} />
        </main>
    );
}
