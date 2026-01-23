import React, { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import SupportSearch from '@/components/SupportSearch';
import { ArrowLeft } from 'lucide-react';
import SearchResultsList from '@/components/SearchResultsList';

export default async function SearchResultsPage({
    params,
    searchParams
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ q: string }>;
}) {
    const { locale } = await params;
    const { q } = await searchParams;
    const t = await getTranslations('Support');

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <Link href="/support" className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-indigo-600 mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('backToSupport')}
                        </Link>
                        <h1 className="text-3xl font-bold dark:text-white mb-6">
                            {t('searchResultsFor')} <span className="text-indigo-600">"{q}"</span>
                        </h1>
                        <SupportSearch />
                    </div>

                    {/* Results with Suspense */}
                    <Suspense fallback={
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    }>
                        <SearchResultsList q={q} locale={locale} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
