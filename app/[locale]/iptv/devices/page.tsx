import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { Smartphone, Tv, Monitor, Cpu, Tablet, Box, Zap } from 'lucide-react';

import { Metadata } from 'next';

interface DevicesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: DevicesPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Devices' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en/iptv/devices',
                'es': '/es/iptv/devices',
                'fr': '/fr/iptv/devices',
                'nl': '/nl/iptv/devices',
            }
        }
    };
}

const DevicesPage = async ({ params }: DevicesPageProps) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'DevicesPage' });

    const devices = [
        {
            name: t('list.firestick.name'),
            slug: 'firestick',
            description: t('list.firestick.description'),
            icon: <Zap className="w-10 h-10" />,
            color: 'from-orange-500 to-red-500',
        },
        {
            name: t('list.android-tv.name'),
            slug: 'android-tv',
            description: t('list.android-tv.description'),
            icon: <Tv className="w-10 h-10" />,
            color: 'from-green-500 to-emerald-500',
        },
        {
            name: t('list.android-mobile.name'),
            slug: 'android-mobile',
            description: t('list.android-mobile.description'),
            icon: <Smartphone className="w-10 h-10" />,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            name: t('list.ios.name'),
            slug: 'ios',
            description: t('list.ios.description'),
            icon: <Tablet className="w-10 h-10" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            name: t('list.smart-tv.name'),
            slug: 'smart-tv',
            description: t('list.smart-tv.description'),
            icon: <Monitor className="w-10 h-10" />,
            color: 'from-indigo-500 to-purple-500',
        },
        {
            name: t('list.mag.name'),
            slug: 'mag',
            description: t('list.mag.description'),
            icon: <Box className="w-10 h-10" />,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            name: t('list.windows.name'),
            slug: 'windows',
            description: t('list.windows.description'),
            icon: <Monitor className="w-10 h-10" />,
            color: 'from-blue-600 to-indigo-600',
        },
        {
            name: t('list.macos.name'),
            slug: 'macos',
            description: t('list.macos.description'),
            icon: <Monitor className="w-10 h-10" />,
            color: 'from-gray-600 to-gray-800',
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <main className="pt-20">
                {/* Header */}
                <section className="bg-zinc-50 dark:bg-zinc-950 py-24 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-8 text-zinc-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* Devices Grid */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {devices.map((device) => (
                                <Link
                                    key={device.slug}
                                    href={`/iptv/devices/${device.slug}` as any}
                                    className="group p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all text-center"
                                >
                                    <div className="mb-6 mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {device.icon}
                                    </div>
                                    <h3 className="text-lg font-bold dark:text-white mb-2">
                                        {device.name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                        {device.description}
                                    </p>
                                    <span className="text-sm text-indigo-600 font-medium">
                                        {t('viewGuide')}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-zinc-50 dark:bg-zinc-900/50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
                            {t('features.title')}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Cpu className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                    {t('features.universal.title')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {t('features.universal.desc')}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Monitor className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                    {t('features.setup.title')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {t('features.setup.desc')}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="w-8 h-8 text-pink-600" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                                    {t('features.multiScreen.title')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {t('features.multiScreen.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DevicesPage;
