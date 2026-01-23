'use client';

import React, { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function SupportSearch() {
    const t = useTranslations('Support');
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/support/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-8 py-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:text-white outline-none focus:border-indigo-600 transition-all"
            />
            <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
                {t('searchBtn')}
            </button>
        </form>
    );
}
