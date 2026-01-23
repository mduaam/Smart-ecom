import React from 'react';
import Pricing from '@/components/Pricing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Plans' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en/plans',
                'es': '/es/plans',
                'fr': '/fr/plans',
                'nl': '/nl/plans',
            }
        }
    };
}

export default async function PlansPage() {
    const t = await getTranslations('Pricing');

    // Fetch plans from Sanity (Dynamic Data)
    const plans = await client.fetch(`*[_type == "plan"] | order(price asc) {
        _id,
        name,
        price,
        currency,
        duration,
        isPopular,
        screens,
        slug
    }`);

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <main className="pt-0">
                <div className="bg-indigo-600 pt-8 pb-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">{t('title')}</h1>
                    <p className="text-indigo-100 max-w-2xl mx-auto text-lg px-4">
                        {t('subtitle')}
                    </p>
                </div>
                <Pricing plans={plans} />

                {/* Comparison Table or more info */}
                <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">{t('comparison.title')}</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                        <th className="py-6 px-4 font-bold dark:text-white">{t('comparison.colFeatures')}</th>
                                        <th className="py-6 px-4 font-bold text-center dark:text-white">{t('comparison.colStandard')}</th>
                                        <th className="py-6 px-4 font-bold text-center text-indigo-600">{t('comparison.colPremium')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {[
                                        { feature: t('features.channels'), std: t('tableValues.channels'), prm: t('tableValues.channels') },
                                        { feature: t('features.vod'), std: t('tableValues.vod'), prm: t('tableValues.vod') },
                                        { feature: t('features.quality'), std: "✓", prm: "✓" },
                                        { feature: t('features.connections', { count: 1 }).replace('1', '').trim().replace(/^\w/, c => c.toUpperCase()), std: "1", prm: "2" },
                                        { feature: t('features.epg'), std: "✓", prm: "✓" },
                                        { feature: t('features.antiFreeze'), std: "✓", prm: "✓" },
                                        { feature: t('features.support'), std: t('tableValues.supportStd'), prm: t('tableValues.supportPrm') },
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400">{row.feature}</td>
                                            <td className="py-4 px-4 text-center dark:text-white">{row.std}</td>
                                            <td className="py-4 px-4 text-center dark:text-white font-semibold">{row.prm}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
