import React from 'react';
import { getTranslations } from 'next-intl/server';
import { searchGuides, getLocalizedContent } from '@/lib/sanity-utils';
import { Link } from '@/navigation';
import { Book, Clock } from 'lucide-react';

export default async function SearchResultsList({
    q,
    locale
}: {
    q: string;
    locale: string;
}) {
    const t = await getTranslations('Support');
    const results = await searchGuides(q, locale);

    return (
        <div className="space-y-6">
            {results.length > 0 ? (
                results.map((guide) => (
                    <Link
                        key={guide._id}
                        href={`/support/guides/${guide.slug.current}`}
                        className="block p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-xl transition-all group bg-white dark:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                        {guide.device}
                                    </span>
                                    <span className="flex items-center text-xs font-bold text-zinc-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {guide.estimatedTime} min
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                                    {getLocalizedContent(guide.title, locale)}
                                </h3>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Book className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem]">
                    <p className="text-xl font-bold text-zinc-400 mb-2">{t('noResults')}</p>
                    <p className="text-zinc-500">{t('tryDifferentSearch')}</p>
                </div>
            )}
        </div>
    );
}
