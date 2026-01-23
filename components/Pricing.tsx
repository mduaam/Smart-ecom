"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Tv, Smartphone, Monitor, Info } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

interface PricingProps {
    plans?: Plan[];
    title?: string;
    subtitle?: string;
}

const Pricing = ({ plans = [], title, subtitle }: PricingProps) => {
    const t = useTranslations('Pricing');
    const [selectedPlan, setSelectedPlan] = useState('12-months');

    // Use passed plans if available, otherwise use empty (or formatted to match structure?)
    // Actually, we must map the Sanity plans to the structure expected by the UI.

    // Default features for display if not in DB
    const defaultFeatures = [
        'channels',
        'vod',
        'quality',
        'epg',
        'devices',
        'support',
    ];

    const displayPlans = plans.length > 0 ? plans.map(p => ({
        id: p._id,
        slug: p.slug?.current,
        name: p.name?.en || 'Untitled', // Use raw string from DB
        price: p.price,
        currency: p.currency,
        highlight: p.isPopular,
        duration: p.duration, // 1-month, 6-months, etc.
        features: [
            // Dynamic feature: Screen count
            { key: 'connections', value: { count: p.screens || 1 } },
            ...defaultFeatures
        ]
    })) : [
        // Fallback Static Plans (same as original strict structure but creating objects on fly)
        {
            id: '1-month',
            nameKey: 'plans.1month',
            price: '14.99',
            highlight: false,
            features: ['channels', 'vod', 'quality', { key: 'connections', value: { count: 1 } }, 'epg', 'devices', 'support']
        },
        {
            id: '12-months',
            nameKey: 'plans.12months',
            price: '64.99',
            highlight: true,
            features: ['channels', 'vod', 'quality', { key: 'connectionsMulti', value: { count: 2 } }, 'epg', 'devices', 'supportFast']
        },
        {
            id: '6-months',
            nameKey: 'plans.6months',
            price: '39.99',
            highlight: false,
            features: ['channels', 'vod', 'quality', { key: 'connections', value: { count: 1 } }, 'epg', 'devices', 'support']
        }
    ];

    return (
        <section id="plans" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                        {title || t('title')}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
                        {subtitle || t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {displayPlans.map((plan: any) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -10 }}
                            className={`relative flex flex-col p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border ${plan.highlight
                                ? 'border-indigo-600 shadow-2xl shadow-indigo-600/20 scale-105 z-10'
                                : 'border-zinc-200 dark:border-zinc-800'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                    {t('mostPopular')}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {plan.nameKey ? t(plan.nameKey) : plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                                        {plan.currency === 'eur' ? '€' : '$'}{plan.price}
                                    </span>
                                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                        {/* Helper for duration text */}
                                        {plan.duration === '1-month' ? t('perMonth') :
                                            plan.duration === '12-months' ? t('perYear') :
                                                plan.duration === '6-months' ? t('per6Months') : ` / ${plan.duration}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature: any, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Check className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                            <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                                                {typeof feature === 'string'
                                                    ? t(`features.${feature}`)
                                                    : feature.key ? t(`features.${feature.key}`, feature.value) : feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={`/plans/${plan.slug || plan.id}` as any}
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-center transition-all ${plan.highlight
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {t('cta')}
                            </Link>

                            <p className="mt-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
                                <Shield className="w-3 h-3" />
                                {t('secure')}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-8 lg:p-12 rounded-[3rem] bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{t('compatibilityTitle')}</h4>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                                {t('compatibilityDesc')}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <Tv className="w-6 h-6 text-indigo-600" />
                                    <span className="text-xs font-bold dark:text-white">{t('devicesList.smartTv')}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <Smartphone className="w-6 h-6 text-indigo-600" />
                                    <span className="text-xs font-bold dark:text-white">{t('devicesList.android')}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <Zap className="w-6 h-6 text-indigo-600" />
                                    <span className="text-xs font-bold dark:text-white">{t('devicesList.firestick')}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <Monitor className="w-6 h-6 text-indigo-600" />
                                    <span className="text-xs font-bold dark:text-white">{t('devicesList.pc')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                    <Info className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold dark:text-white">{t('multiRoomTitle')}</h5>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                                {t('multiRoomDesc')}
                            </p>
                            <Link href="/contact" className="inline-block text-indigo-600 font-bold text-sm hover:underline">
                                {t('contactSupport')} →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
