import React from 'react';
import { Globe } from 'lucide-react';
import { Link } from '@/navigation';

const RegionsPage = () => {
    const regions = [
        { name: 'France', code: 'FR', channels: '3000+', slug: 'france' },
        { name: 'Spain', code: 'ES', channels: '2500+', slug: 'spain' },
        { name: 'Netherlands', code: 'NL', channels: '1500+', slug: 'netherlands' },
        { name: 'United Kingdom', code: 'UK', channels: '4000+', slug: 'uk' },
        { name: 'USA', code: 'US', channels: '6000+', slug: 'usa' },
        { name: 'Germany', code: 'DE', channels: '2000+', slug: 'germany' },
        { name: 'Belgium', code: 'BE', channels: '1000+', slug: 'belgium' },
        { name: 'Italy', code: 'IT', channels: '2500+', slug: 'italy' },
        { name: 'Canada', code: 'CA', channels: '3000+', slug: 'canada' },
        { name: 'Australia', code: 'AU', channels: '1500+', slug: 'australia' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <main className="pt-20">
                <section className="bg-zinc-50 dark:bg-zinc-950 py-24 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-8 text-zinc-900 dark:text-white">Worldwide Coverage</h1>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            We provide the most comprehensive channel list worldwide.
                            Our IPTV packages cover all major regions with local channels, sports, and news.
                        </p>
                    </div>
                </section>

                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {regions.map((region, i) => (
                                <Link
                                    key={i}
                                    href={`/iptv/${region.slug}` as any}
                                    className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-xl transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="text-2xl font-bold text-indigo-600">{region.code}</div>
                                        <Globe className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-600 group-hover:rotate-12 transition-all" />
                                    </div>
                                    <h3 className="text-lg font-bold dark:text-white mb-2">{region.name}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{region.channels} Local Channels</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RegionsPage;
