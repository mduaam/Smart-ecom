
import React from 'react';
import { getUserSubscriptions } from '@/app/actions/subscriptions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Activity, Clock, ShieldCheck, CreditCard, ChevronRight, AlertTriangle } from 'lucide-react';
import SubscriptionList from '@/components/account/SubscriptionList';

export default async function SubscriptionsPage({ params }: { params: Promise<{ locale: string, userId: string }> }) {
    const { locale, userId } = await params;
    const t = await getTranslations({ locale, namespace: 'Account' });
    const { active, history, error } = await getUserSubscriptions();

    if (error) {
        // Handle error gracefully, maybe show empty state
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white mb-2">{t('sidebar.subscriptions')}</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage your active plan and view history</p>
                        </div>
                        <Link
                            href={`/account/${userId}/dashboard`}
                            className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Active Subscriptions List */}
                    <SubscriptionList
                        subscriptions={active || []}
                        translations={{
                            title: t('subscription.title'),
                            code: t('subscription.code'),
                            copy: t('subscription.copy'),
                            credentials: t('subscription.credentials'),
                            service: t('subscription.service') || 'Nom',
                            username: t('subscription.username'),
                            password: t('subscription.password'),
                            portal: t('subscription.portal'),
                            deviceUsage: t('subscription.deviceUsage'),
                            connected: t('subscription.connected'),
                            limit: t('subscription.limit'),
                            stats: {
                                daysLeft: t('stats.daysLeft')
                            }
                        }}
                    />

                    {/* Subscription History */}
                    {history && history.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-zinc-400" />
                                Subscription History
                            </h3>
                            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                            <tr>
                                                <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Plan</th>
                                                <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Start Date</th>
                                                <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">End Date</th>
                                                <th className="py-4 px-6 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {history.map((sub: any) => (
                                                <tr key={sub.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                                    <td className="py-4 px-6 font-bold dark:text-white">{sub.plan_id}</td>
                                                    <td className="py-4 px-6 text-sm text-zinc-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                                                    <td className="py-4 px-6 text-sm text-zinc-500">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-2 py-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-xs font-bold rounded-full uppercase">
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
