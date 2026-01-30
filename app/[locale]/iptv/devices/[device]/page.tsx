import React from 'react';
import { getTranslations } from 'next-intl/server';

import { getGuides, getLocalizedContent } from '@/lib/sanity-utils';
import { Link } from '@/navigation';
import { ArrowLeft, Clock, Tv, Download, PlayCircle, ShieldCheck, Check } from 'lucide-react';
import { Metadata } from 'next';

interface DevicePageProps {
    params: Promise<{
        locale: string;
        device: string;
    }>;
}

// Generate SEO Metadata
export async function generateMetadata({ params }: DevicePageProps): Promise<Metadata> {
    const { device, locale } = await params;

    // Normalize device name for display
    const formatName = (str: string) => {
        const names: Record<string, string> = {
            'firestick': 'Amazon Firestick',
            'firetv': 'Amazon Fire TV',
            'android-tv': 'Android TV',
        };
        return names[str] || str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const deviceName = formatName(device);

    // Localized descriptions for SEO
    const descriptions: Record<string, string> = {
        'en': `Best IPTV for ${deviceName} 2025. Download Smarters Pro & Player Lite. Step-by-step installation guide included. Watch 20k+ channels in 4K.`,
        'es': `Mejor IPTV para ${deviceName} 2025. Descargar Smarters Pro y Player Lite. Guía de instalación paso a paso. Ver más de 20k canales en 4K.`,
        'fr': `Meilleur IPTV pour ${deviceName} 2025. Téléchargez Smarters Pro & Player Lite. Guide d'installation inclus. Regardez +20k chaînes en 4K.`,
        'nl': `Beste IPTV voor ${deviceName} 2025. Download Smarters Pro & Player Lite. Stap-voor-stap installatiegids. Kijk 20k+ kanalen in 4K.`
    };

    return {
        title: `IPTV Smarters Pro for ${deviceName} - Download & Install Guide 2025`,
        description: descriptions[locale] || descriptions['en'],
        keywords: [
            `iptv ${device}`,
            `smarters pro ${device}`,
            `${device} iptv player`,
            'install iptv',
            'best iptv app',
            '4k streaming'
        ],
        openGraph: {
            title: `Install IPTV Smarters on ${deviceName} | Premium 4K Service`,
            description: descriptions[locale] || descriptions['en'],
            type: 'article',
        }
    };
}

const DevicePage = async ({ params }: DevicePageProps) => {
    const { locale, device } = await params;
    const t = await getTranslations('Support');

    // Fetch all guides and filter
    const allGuides = await getGuides();
    const deviceGuides = allGuides.filter(guide => guide.device === device);

    // Enhanced Device Info with Rich Content for SEO
    const deviceInfo: Record<string, any> = {
        'firestick': {
            name: 'Amazon Firestick',
            title: 'Ultimate IPTV Experience on Firestick',
            intro: 'Transform your Amazon Firestick into a powerful entertainment hub. Our IPTV service is fully optimized for Fire TV devices, ensuring smooth 4K streaming with zero buffering.',
            features: [
                'Native Firestick App (Smarters Pro)',
                'Auto-Launch Feature',
                'Remote Control Friendly Interface',
                'Low Data Usage Mode',
                'Support for 4K Ultra HD'
            ],
            stepsTitle: 'How to Install on Firestick',
            steps: [
                'Go to Settings > My Fire TV > Developer Options',
                'Turn on "Apps from Unknown Sources"',
                'Install "Downloader" app from Amazon Store',
                'Open Downloader and enter our APK URL'
            ],
            appLinks: [
                { platform: 'Direct APK Download', url: 'https://www.iptvsmarters.com/smarters.apk', icon: <Download className="w-5 h-5" /> }
            ]
        },
        // Fallback for other devices to keep them working
        'default': {
            name: device.charAt(0).toUpperCase() + device.slice(1),
            title: `IPTV for ${device.charAt(0).toUpperCase() + device.slice(1)}`,
            intro: `Get the best streaming experience on your ${device}. Our service is compatible and optimized for high performance.`,
            features: ['4K Streaming', 'EPG Guide', 'VOD Library', 'Catch-up TV'],
            stepsTitle: 'Quick Installation',
            steps: ['Download the App', 'Enter Login Details', 'Start Watching'],
            appLinks: []
        }
    };

    const currentDevice = deviceInfo[device] || deviceInfo['default'];

    const difficultyColors: Record<string, string> = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main className="pt-20">

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-zinc-900 py-24 lg:py-32">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Link
                            href="/iptv/devices"
                            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Devices
                        </Link>
                        <h1 className="text-4xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                            {currentDevice.name} IPTV Player
                        </h1>
                        <p className="text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                            {currentDevice.intro}
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            {currentDevice.appLinks.map((link: any, index: number) => (
                                <a key={index} href={link.url} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20">
                                    {link.icon || <Download className="w-5 h-5" />}
                                    {link.platform}
                                </a>
                            ))}
                            <Link href="/plans" className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                                <PlayCircle className="w-5 h-5" />
                                Get Subscription
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid - Good for SEO structure */}
                <div className="py-24 bg-zinc-50 dark:bg-zinc-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Why use Smarters Pro on {currentDevice.name}?</h2>
                            <p className="text-zinc-600 dark:text-zinc-400">Optimized features specifically for your device</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentDevice.features.map((feature: string, idx: number) => (
                                <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 hover:shadow-xl transition-all">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">{feature}</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Full {feature} support enabled.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Installation Steps - Article Schema Candidate */}
                <div className="py-24 bg-white dark:bg-black">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="bg-indigo-600 rounded-[2.5rem] p-10 lg:p-16 text-white relative overflow-hidden">
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                            <h2 className="text-3xl font-bold mb-10 relative z-10">{currentDevice.stepsTitle}</h2>

                            <div className="space-y-6 relative z-10">
                                {currentDevice.steps.map((step: string, i: number) => (
                                    <div key={i} className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-lg font-medium border-b border-indigo-500/30 pb-4 w-full text-indigo-50">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 bg-indigo-700/50 rounded-2xl border border-indigo-500/50">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-5 h-5" />
                                    Pro Tip
                                </h4>
                                <p className="text-indigo-200 text-sm">
                                    For detailed screenshots and more complex setups, check our specific guide below.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Guides Links */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10">
                        Detailed {currentDevice.name} Tutorials
                    </h2>

                    {deviceGuides.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {deviceGuides.map((guide) => (
                                <Link
                                    key={guide._id}
                                    href={`/support/guides/${guide.slug.current}` as any}
                                    className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-2xl transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Tv className="w-24 h-24" />
                                    </div>
                                    <div className="flex items-start justify-between mb-6 relative z-10">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${difficultyColors[guide.difficulty]}`}>
                                            {guide.difficulty}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                                            <Clock className="w-4 h-4" />
                                            {guide.estimatedTime} min
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors relative z-10">
                                        {getLocalizedContent(guide.title, locale)}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 relative z-10">
                                        Read full guide →
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-6">
                                More detailed guides for {currentDevice.name} are coming soon.
                            </p>
                            <Link
                                href="/support"
                                className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Browse All Support Topics
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );

};

export default DevicePage;
