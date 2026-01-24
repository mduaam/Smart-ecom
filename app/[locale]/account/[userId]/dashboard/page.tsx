import React from 'react';
import { Activity, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { getDashboardData } from '@/app/actions/dashboard';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';

const DashboardPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Account' });
    const { user, profile, subscription, tickets, error } = await getDashboardData(locale);

    if (error || !user) {
        // Redirect to login handled by middleware mostly, but just in case
        redirect(`/${locale}/auth/login`);
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const displayEmail = user?.email || '';
    const isPremium = !!subscription;


    const logoutAction = logout.bind(null, locale);

    // Calculate days remaining if subscription exists
    let daysRemaining = 0;
    if (subscription?.current_period_end) {
        const end = new Date(subscription.current_period_end).getTime();
        const now = new Date().getTime();
        daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    }

    return (
        <>

            {/* Content */}
            <div className="flex-1 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold dark:text-white">{t('welcome')}, {displayName}!</h1>
                    <Link href="/plans" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:shadow-xl transition-all text-center md:text-left">
                        {t('renew')}
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <div className={`w-12 h-12 ${isPremium ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'} rounded-xl flex items-center justify-center mb-6`}>
                            <Activity className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wide">{t('stats.status')}</p>
                        <p className={`text-3xl font-extrabold ${isPremium ? 'text-green-600' : 'text-yellow-600'}`}>
                            {isPremium ? t('stats.active') : 'Inactive'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wide">{t('stats.daysLeft')}</p>
                        <p className="text-3xl font-extrabold dark:text-white">{isPremium ? `${daysRemaining} ${t('stats.daysLeft').split(' ')[0]}` : '0'}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wide">{t('stats.security')}</p>
                        <p className="text-3xl font-extrabold dark:text-white">{t('stats.solid')}</p>
                    </div>
                </div>

                {/* Active Subscription Details or Empty State */}
                {subscription ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold dark:text-white mb-1">{subscription.plan_id || 'Premium Plan'}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <p className="text-sm font-bold text-zinc-500">{t('stats.active')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Link
                                    href={`/account/${user.id}/subscriptions`}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-sm text-center hover:bg-zinc-50 transition-all dark:text-white"
                                >
                                    {t('subscription.details') || 'View Details'}
                                </Link>
                                <Link
                                    href="/plans"
                                    className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm text-center hover:bg-indigo-700 transition-all"
                                >
                                    {t('renew')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden p-8 text-center">
                        <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">No Active Subscription</h3>
                        <p className="text-zinc-500 mb-6">You don't have an active subscription plan yet.</p>
                        <Link href="/plans" className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all">
                            Browse Plans
                        </Link>
                    </div>
                )}

                {/* Recent Tickets */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                        <h3 className="text-xl font-bold dark:text-white">{t('sidebar.tickets')}</h3>
                        <Link href={`/account/${user.id}/tickets`} className="text-indigo-600 font-bold text-sm hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {tickets && tickets.length > 0 ? (
                            tickets.map((ticket: any) => (
                                <div key={ticket.id} className="p-8 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold dark:text-white mb-1">{ticket.subject}</p>
                                        <p className="text-xs text-zinc-400">
                                            {ticket.id.substring(0, 8).toUpperCase()} • Created {new Date(ticket.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} text-[10px] font-bold rounded-full uppercase tracking-widest`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                No recent tickets found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
