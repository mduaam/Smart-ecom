import MarketingClient from './MarketingClient';
import { Mail } from 'lucide-react';

import { getCampaigns, getTemplates, getMarketingStats } from '@/app/actions/admin/marketing';

export const metadata = {
    title: 'Email Marketing | Admin Dashboard',
    description: 'Send broadcast emails and manage campaigns.'
};

export default async function MarketingPage() {
    const campaignsData = await getCampaigns();
    const templatesData = await getTemplates();
    const statsData = await getMarketingStats();

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Mail className="w-8 h-8 text-indigo-600" />
                        Email Marketing
                    </h1>
                    <p className="text-zinc-500 mt-2">Engage your customers with personalized email broadcasts.</p>
                </div>
            </div>

            <MarketingClient
                initialCampaigns={campaignsData.data || []}
                initialTemplates={templatesData.data || []}
                initialStats={statsData}
            />
        </main>
    );
}
