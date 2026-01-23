import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

interface FeaturesProps {
    data?: {
        title?: string;
        description?: string;
        features?: string[];
    };
}

const Features = ({ data }: FeaturesProps) => {
    const h = useTranslations('Home');

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block p-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold px-4 mb-6">
                            {h('features.badge')}
                        </div>
                        <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white leading-tight">
                            {data?.title || h('features.title')} <span className="text-indigo-600 italic underline">{h('features.titleHighlight')}</span>
                        </h2>
                        <ul className="space-y-6">
                            {(data?.features || ['0', '1', '2', '3', '4']).map((feature, index) => (
                                <li key={index} className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-lg">
                                        {typeof feature === 'string' && feature.length > 2 ? feature : h(`features.list.${feature}`)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-12">
                            <Link href="/plans" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                {h('features.cta')}
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative z-10 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl group">
                            <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 relative">
                                <img
                                    src="/images/interface-preview.png"
                                    alt="IPTV Smarters Pro interface"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl -z-0"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
