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
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold dark:text-white">{t('welcome')}, {displayName}!</h1>
                    <Link href="/plans" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:shadow-xl transition-all">
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
                        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
                            <h3 className="text-xl font-bold dark:text-white">{t('subscription.title')}</h3>
                            <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                {subscription.plan_id || 'Premium'}
                            </span>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t('subscription.code')}</p>
                                        <div className="flex items-center gap-4">
                                            <input readOnly value={subscription.stripe_subscription_id || 'N/A'} className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 font-mono text-sm dark:text-white" />
                                            <button className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 transition-all font-bold text-xs uppercase dark:text-white">{t('subscription.copy')}</button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t('subscription.credentials')}</p>
                                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">{t('subscription.service') || 'Nom'}:</span>
                                                <span className="text-sm font-bold dark:text-white font-mono bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                                                    LXTREAM
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">{t('subscription.username')}:</span>
                                                <span className="text-sm font-bold dark:text-white font-mono bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                                                    {subscription.iptv_username || 'Pending...'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">{t('subscription.password')}:</span>
                                                <span className="text-sm font-bold dark:text-white font-mono bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                                                    {subscription.iptv_password || 'Pending...'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">{t('subscription.portal')}:</span>
                                                <Link href={subscription.iptv_url || "http://vod4k.cc"} target="_blank" className="text-sm font-bold text-indigo-600 underline hover:text-indigo-500">
                                                    {subscription.iptv_url || "http://vod4k.cc"}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                                            <div className="flex gap-3">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">Attention</p>
                                                    <p className="text-xs text-yellow-800 dark:text-yellow-400 leading-relaxed">
                                                        Pour Smarters Pro sur Smart TV, utilisez l’URL suivante : <span className="font-bold select-all">http://sub-tv.site</span> ou bien : <span className="font-bold select-all">http://vod4k.cc</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {subscription.m3u_link && (
                                            <div className="mt-4">
                                                <p className="text-xs font-bold text-zinc-400 uppercase mb-2">M3U Liens</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 font-mono text-xs dark:text-white break-all">
                                                        {subscription.m3u_link}
                                                    </div>
                                                    <button
                                                        className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 transition-all text-indigo-600"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold dark:text-white">{t('subscription.deviceUsage')}</p>
                                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-indigo-600"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-zinc-500">
                                            <span>1 {t('subscription.connected')}</span>
                                            <span>{t('subscription.limit')}: {subscription.max_connections || 1}</span>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <Link href="/support/installation" className="w-full block py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-center font-bold text-sm hover:shadow-lg transition-all dark:text-white">
                                            {t('subscription.installGuide')}
                                        </Link>
                                    </div>
                                </div>
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
