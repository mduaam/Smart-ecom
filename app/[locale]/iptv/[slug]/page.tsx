import { notFound } from 'next/navigation';
import { Globe, Tv, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import Pricing from '@/components/Pricing';
import Trust from '@/components/Trust';
import StructuredData from '@/components/seo/StructuredData';

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

// ... Metadata generation remains same ...
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Regions' });

    const validRegions = [
        'france', 'spain', 'netherlands', 'uk', 'usa',
        'germany', 'belgium', 'italy', 'canada', 'australia'
    ];
    if (!validRegions.includes(slug)) return { title: 'Not Found' };

    const regionNames: Record<string, string> = {
        'france': 'France', 'spain': 'Spain', 'netherlands': 'Netherlands',
        'uk': 'UK', 'usa': 'USA', 'germany': 'Germany',
        'belgium': 'Belgium', 'italy': 'Italy', 'canada': 'Canada',
        'australia': 'Australia'
    };
    const regionName = regionNames[slug] || slug;

    return {
        title: `${t('title', { region: regionName })} ${regionName} | Smarters Pro`,
        description: t('desc', { region: regionName }),
        alternates: {
            canonical: `https://iptvsmarters.pro/${locale}/iptv/${slug}`
        },
        openGraph: {
            title: `Best IPTV in ${regionName} | 4K Channels & Sports`,
            description: t('desc', { region: regionName }),
            type: 'website',
            locale: locale,
        }
    };
}

export default async function RegionPage({ params }: Props) {
    const { slug } = await params;
    const t = await getTranslations('Regions');

    const validRegions = [
        'france', 'spain', 'netherlands', 'uk', 'usa',
        'germany', 'belgium', 'italy', 'canada', 'australia'
    ];

    if (!validRegions.includes(slug)) {
        notFound();
    }

    const regionNames: Record<string, string> = {
        'france': 'France', 'spain': 'Spain', 'netherlands': 'Netherlands',
        'uk': 'UK', 'usa': 'USA', 'germany': 'Germany',
        'belgium': 'Belgium', 'italy': 'Italy', 'canada': 'Canada',
        'australia': 'Australia'
    };

    const formattedName = regionNames[slug] || slug;

    // Fetch plans
    const plans = await client.fetch(`*[_type == "plan"] | order(price asc) {
        _id, name, price, currency, duration, isPopular, screens, slug
    }`);

    // Dynamic Service Schema (Local SEO)
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `IPTV Smarters Pro ${formattedName}`,
        "serviceType": "IPTV Streaming Service",
        "provider": {
            "@type": "Organization",
            "name": "IPTV Smarters Pro"
        },
        "areaServed": {
            "@type": "Country",
            "name": formattedName
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "IPTV Subscriptions",
            "itemListElement": plans.map((plan: any) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": plan.name
                },
                "price": plan.price,
                "priceCurrency": plan.currency
            }))
        },
        "description": t('desc', { region: formattedName })
    };

    // FAQ Data
    const faqs = ['legal', 'vpn', 'channels'] as const;

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(key => ({
            "@type": "Question",
            "name": t(`faq.${key}.question`, { region: formattedName }),
            "acceptedAnswer": {
                "@type": "Answer",
                "text": t(`faq.${key}.answer`, { region: formattedName })
            }
        }))
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <StructuredData data={serviceSchema} />
            <StructuredData data={faqSchema} />

            <main className="pt-20">
                {/* Hero */}
                <div className="relative overflow-hidden bg-zinc-900 py-24 lg:py-32">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold mb-6 border border-indigo-500/30 backdrop-blur-sm">
                            <Globe className="w-4 h-4" />
                            <span className="uppercase tracking-wider text-sm">{t('badge', { region: formattedName })}</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-bold mb-6 text-white tracking-tight">
                            {t('title', { region: formattedName })} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{formattedName}</span>
                        </h1>
                        <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                            {t('desc', { region: formattedName })}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24 relative z-20">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative overflow-hidden rounded-2xl group">
                                <div className="aspect-video bg-zinc-100 dark:bg-black rounded-2xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-center z-10">
                                        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                                            <Tv className="w-10 h-10 text-indigo-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('channelsTitle')}</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400">{t('preview')}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">{t('includedTitle')}</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                                    {t('includedDesc', { region: formattedName })}
                                </p>
                                <ul className="space-y-4">
                                    {['networks', 'sports', 'cinema', 'kids', 'catchup'].map((key, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                {t(`features.${key}`, { region: formattedName })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <Pricing plans={plans} title="Best Value Plans for Your Region" />


                {/* Trust/Why Choose Us */}
                <Trust />

                {/* FAQ Section */}
                <div className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
                                {t('faq.title', { region: formattedName })}
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">Common questions from our users in {formattedName}</p>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((key, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 flex items-start gap-3">
                                        <HelpCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                                        {t(`faq.${key}.question`, { region: formattedName })}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed ml-9">
                                        {t(`faq.${key}.answer`, { region: formattedName })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}


