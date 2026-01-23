'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useLocale } from 'next-intl';

const Breadcrumbs = () => {
    const pathname = usePathname();
    const locale = useLocale();

    // Exclusion logic
    const excludedPatterns = [
        '/account',
        '/admin',
        '/support/search'
    ];

    const shouldExclude = excludedPatterns.some(pattern => pathname.includes(pattern));

    // Also exclude home page (just locale)
    if (shouldExclude || pathname === `/${locale}` || pathname === `/${locale}/`) {
        return null;
    }

    const segments = pathname
        .split('/')
        .filter(segment => segment !== '' && segment !== locale);

    return (
        <nav aria-label="Breadcrumb" className="bg-white dark:bg-black py-6 border-b border-zinc-100 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ol className="flex items-center space-x-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <li className="flex items-center">
                        <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center">
                            <Home className="w-3.5 h-3.5 mr-1" />
                            <span>Home</span>
                        </Link>
                    </li>
                    {segments.map((segment, index) => {
                        const href = `/${segments.slice(0, index + 1).join('/')}`;
                        const isLast = index === segments.length - 1;
                        const label = segment
                            .replace(/-/g, ' ')
                            .replace(/^\w/, (c) => c.toUpperCase());

                        return (
                            <li key={segment} className="flex items-center">
                                <ChevronRight className="w-3.5 h-3.5 mx-1 text-zinc-300 dark:text-zinc-700" />
                                {isLast ? (
                                    <span className="text-zinc-900 dark:text-white font-bold">{label}</span>
                                ) : (
                                    <Link href={href as any} className="hover:text-indigo-600 transition-colors">
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumbs;
