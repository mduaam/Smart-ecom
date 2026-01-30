import React from 'react';
import Pricing from '@/components/Pricing';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import StructuredData from '@/components/seo/StructuredData';
import { generateProductSchema } from '@/lib/seo-schemas';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
            canonical: `https://smart-ecom12.netlify.app/${locale}/plans`,
            languages: {
                'en': 'https://smart-ecom12.netlify.app/en/plans',
                'es': 'https://smart-ecom12.netlify.app/es/plans',
                'fr': 'https://smart-ecom12.netlify.app/fr/plans',
                'nl': 'https://smart-ecom12.netlify.app/nl/plans',
            }
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            locale: locale,
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

    // Generate Product Schema
    const productSchema = generateProductSchema({
        name: "IPTV Smarters Pro Subscription",
        description: t('subtitle'),
        offers: plans.map((plan: any) => ({
            price: plan.price.toString(),
            priceCurrency: plan.currency || "USD",
            url: `https://iptvsmarters.pro/plans` // Ideally specific plan URL if available
        })),
        aggregateRating: {
            ratingValue: "4.8",
            reviewCount: "1250"
        }
    });

    // FAQs
    const faqs = [
        { q: t('faq.0.question'), a: t('faq.0.answer') },
        { q: t('faq.1.question'), a: t('faq.1.answer') },
        { q: t('faq.2.question'), a: t('faq.2.answer') },
        { q: t('faq.3.question'), a: t('faq.3.answer') },
        { q: t('faq.4.question'), a: t('faq.4.answer') }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <StructuredData data={productSchema} />
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

                {/* FAQ Section */}
                <section className="py-24 bg-white dark:bg-black">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Common questions about our subscription plans
                            </p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <h3 className="font-bold text-zinc-900 dark:text-white pr-8">
                                            {faq.q}
                                        </h3>
                                        <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform group-open:rotate-180" />
                                    </summary>
                                    <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div >
    );
}
