import { notFound } from 'next/navigation';
import { Globe, Tv, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Regions' });

    // Simple verification
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
        description: t('desc', { region: regionName })
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
        'france': 'France',
        'spain': 'Spain',
        'netherlands': 'Netherlands',
        'uk': 'UK',
        'usa': 'USA',
        'germany': 'Germany',
        'belgium': 'Belgium',
        'italy': 'Italy',
        'canada': 'Canada',
        'australia': 'Australia'
    };

    const formattedName = regionNames[slug] || slug;

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold mb-6">
                            <Globe className="w-4 h-4" />
                            <span className="uppercase tracking-wider text-sm">{t('badge', { region: formattedName })}</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-zinc-900 dark:text-white">
                            {t('title', { region: formattedName })} <span className="text-indigo-600">{formattedName}</span>
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            {t('desc', { region: formattedName })}
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 aspect-[4/3] flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="text-center z-10">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                                    <Tv className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('channelsTitle')}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">{t('preview')}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">{t('includedTitle')}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                                {t('includedDesc', { region: formattedName })}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'networks',
                                    'sports',
                                    'cinema',
                                    'kids',
                                    'catchup'
                                ].map((key, i) => (
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
                            <div className="mt-10">
                                <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                    {t('cta', { region: formattedName })}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
