import { getTranslations } from 'next-intl/server';
import { getGuides, getLocalizedContent } from '@/lib/sanity-utils';
import { Link } from '@/navigation';
import { ArrowLeft, Clock, Download, Laptop, Smartphone, Tv, Monitor, ChevronRight, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';
import DirectAnswer from '@/components/seo/DirectAnswer';
import StructuredData from '@/components/seo/StructuredData';

interface InstallationPageProps {
    params: Promise<{
        locale: string;
    }>;
}

// SEO Metadata
export async function generateMetadata({ params }: InstallationPageProps): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        'en': 'Install IPTV Smarters Pro - Step-by-Step Guides for All Devices',
        'es': 'Instalar IPTV Smarters Pro - Guías Paso a Paso para Dispositivos',
        'fr': 'Installer IPTV Smarters Pro - Guides Étape par Étape',
        'nl': 'Installeer IPTV Smarters Pro - Stap-voor-stap Gidsen'
    };

    const descriptions: Record<string, string> = {
        'en': 'Learn how to install Smarters Pro on Firestick, Android, iOS, Smart TV, and PC. Easy to follow tutorials for quick setup.',
        'es': 'Aprende a instalar Smarters Pro en Firestick, Android, iOS, Smart TV y PC. Tutoriales fáciles de seguir.',
        'fr': 'Apprenez à installer Smarters Pro sur Firestick, Android, iOS, Smart TV et PC. Tutoriels faciles à suivre.',
        'nl': 'Leer hoe je Smarters Pro installeert op Firestick, Android, iOS, Smart TV en PC. Makkelijk te volgen tutorials.'
    };

    return {
        title: titles[locale] || titles['en'],
        description: descriptions[locale] || descriptions['en'],
        keywords: ['install iptv', 'smarters pro setup', 'firestick install', 'smart tv iptv', 'android tv setup'],
        openGraph: {
            title: titles[locale] || titles['en'],
            description: descriptions[locale] || descriptions['en'],
            type: 'article'
        }
    };
}

const InstallationPage = async ({ params }: InstallationPageProps) => {
    const { locale } = await params;

    // Fetch and group guides
    const guides = await getGuides();
    const guidesByDevice = guides.reduce((acc, guide) => {
        if (!acc[guide.device]) acc[guide.device] = [];
        acc[guide.device].push(guide);
        return acc;
    }, {} as Record<string, typeof guides>);

    const difficultyColors: Record<string, string> = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const deviceIcons: Record<string, React.ReactNode> = {
        'firestick': <Tv className="w-6 h-6" />,
        'android-tv': <Tv className="w-6 h-6" />,
        'smart-tv': <Tv className="w-6 h-6" />,
        'mag': <Tv className="w-6 h-6" />,
        'android-mobile': <Smartphone className="w-6 h-6" />,
        'ios': <Smartphone className="w-6 h-6" />,
        'windows': <Laptop className="w-6 h-6" />,
        'macos': <Monitor className="w-6 h-6" />,
    };

    const deviceNames: Record<string, string> = {
        'firestick': 'Amazon Firestick',
        'android-tv': 'Android TV Box',
        'android-mobile': 'Android Mobile/Tablet',
        'ios': 'Apple iOS (iPhone/iPad)',
        'smart-tv': 'Smart TV (Samsung/LG)',
        'mag': 'MAG Box',
        'windows': 'Windows PC',
        'macos': 'Apple Mac',
    };

    // CollectionPage Schema for SEO
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "IPTV Smarters Pro Installation Center",
        "description": "Complete installation guides for IPTV Smarters Pro on all devices including Firestick, Android TV, Smart TV, iOS, and more.",
        "url": `https://yourdomain.com/${locale}/support/installation`,
        "numberOfItems": guides.length
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <StructuredData data={collectionSchema} />
            <main className="pt-20">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-zinc-900 px-6 py-24 sm:py-32 lg:px-8">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center opacity-10 blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900/90"></div>

                    <div className="relative max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-6 backdrop-blur-md">
                            <Download className="w-4 h-4" />
                            Setup Center
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            Installation Guides
                        </h1>
                        <p className="text-lg leading-8 text-zinc-300">
                            Get Smarters Pro running on your device in minutes. Choose your platform below for easy, step-by-step instructions.
                        </p>
                    </div>
                </div>

                {/* Direct Answer Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <DirectAnswer answer="Install IPTV Smarters Pro on any device with our step-by-step guides. We provide detailed installation tutorials for Firestick, Android TV, Smart TV, iOS, and Windows. Each guide includes screenshots and takes about 5-10 minutes to complete." />
                </div>

                {/* Quick Navigation Pills */}
                <div className="sticky top-16 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-4 overflow-x-auto no-scrollbar">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3 whitespace-nowrap">
                        {Object.keys(guidesByDevice).map((device) => (
                            <a
                                key={device}
                                href={`#${device}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                {deviceIcons[device] || <Tv className="w-4 h-4" />}
                                {deviceNames[device] || device}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
                    {Object.keys(guidesByDevice).length > 0 ? (
                        Object.entries(guidesByDevice).map(([device, deviceGuides]) => (
                            <section key={device} id={device} className="scroll-mt-32">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                            {deviceIcons[device]}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{deviceNames[device]}</h2>
                                            <p className="text-sm text-zinc-500">{deviceGuides.length} Guides Available</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/iptv/devices/${device}` as any}
                                        className="group flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-semibold text-sm transition-colors"
                                    >
                                        View compatible apps
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {deviceGuides.map((guide) => (
                                        <Link
                                            key={guide._id}
                                            href={`/support/guides/${guide.slug.current}` as any}
                                            className="group flex flex-col bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-2xl transition-all overflow-hidden"
                                        >
                                            <div className="p-6 flex-1">
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${difficultyColors[guide.difficulty as keyof typeof difficultyColors]}`}>
                                                        {guide.difficulty}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {guide.estimatedTime}m
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                    {getLocalizedContent(guide.title, locale)}
                                                </h3>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                                                    Complete step-by-step tutorial with screenshots. Learn how to configure your {deviceNames[device]} for the best streaming experience.
                                                </p>
                                            </div>
                                            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm font-semibold">
                                                <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                    Start Setup <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
                            <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-10 h-10 text-zinc-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No guides found</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                                We are currently updating our installation database. Please check back shortly or contact support for manual assistance.
                            </p>
                            <Link href="/support/tickets/new" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                Contact Support Team
                            </Link>
                        </div>
                    )}
                </div>

                {/* FAQ Teaser */}
                <div className="bg-indigo-50 dark:bg-indigo-950/20 py-24 mb-20 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Common Installation Questions</h2>
                            <p className="text-zinc-600 dark:text-zinc-400">Quick answers to help you get started</p>
                        </div>

                        <div className="grid gap-4 max-w-2xl mx-auto">
                            {[
                                {
                                    q: "Do I need a VPN to use Smarters Pro?",
                                    a: "While our service works without a VPN, we highly recommend using one to prevent ISP throttling and ensure maximum privacy. This helps maintain buffer-free streaming quality."
                                },
                                {
                                    q: "Can I use one subscription on multiple devices?",
                                    a: "Yes, you can install the app on as many devices as you want. However, simultaneous viewing is limited to the number of connections in your plan (default is 1). You can add more connections at checkout."
                                },
                                {
                                    q: "What if the app doesn't load the playlist?",
                                    a: "First, ensure you are typing the credentials exactly as shown in your email (case-sensitive). If it still fails, try clearing the app cache or restarting your internet router. Contact support if issues persist."
                                }
                            ].map((item, i) => (
                                <details key={i} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-600 transition-colors">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-lg">{item.q}</span>
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-600 transition-colors">
                                            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                                        </div>
                                    </summary>
                                    <div className="px-6 pb-6 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link href="/support/faq" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                                View all FAQs →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InstallationPage;
