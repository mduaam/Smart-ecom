import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Headphones, CreditCard, Activity } from 'lucide-react';

const Trust = () => {
    const t = useTranslations('Trust');

    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
            title: t('features.legal.title'),
            desc: t('features.legal.desc')
        },
        {
            icon: <Headphones className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
            title: t('features.support.title'),
            desc: t('features.support.desc')
        },
        {
            icon: <CreditCard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
            title: t('features.guarantee.title'),
            desc: t('features.guarantee.desc')
        },
        {
            icon: <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
            title: t('features.uptime.title'),
            desc: t('features.uptime.desc')
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-600/30 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trust;
