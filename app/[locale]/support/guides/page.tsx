import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getGuides, getLocalizedContent } from '@/lib/sanity-utils';
import { Link } from '@/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';
import DirectAnswer from '@/components/seo/DirectAnswer';
import StructuredData from '@/components/seo/StructuredData';

interface GuidesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

// SEO Metadata
export async function generateMetadata({ params }: GuidesPageProps): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        'en': 'IPTV Smarters Installation Guides - Setup on Any Device',
        'es': 'Guías de Instalación IPTV Smarters - Configuración en Cualquier Dispositivo',
        'fr': 'Guides d\'Installation IPTV Smarters - Configuration sur Tout Appareil',
        'nl': 'IPTV Smarters Installatiehandleidingen - Installatie op Elk Apparaat'
    };

    const descriptions: Record<string, string> = {
        'en': 'Complete installation guides for IPTV Smarters Pro on Firestick, Android, Samsung TV, iOS, and more. Step-by-step tutorials with screenshots for easy setup.',
        'es': 'Guías completas de instalación para IPTV Smarters Pro en Firestick, Android, Samsung TV, iOS y más. Tutoriales paso a paso con capturas de pantalla.',
        'fr': 'Guides d\'installation complets pour IPTV Smarters Pro sur Firestick, Android, Samsung TV, iOS et plus. Tutoriels étape par étape avec captures d\'écran.',
        'nl': 'Volledige installatiehandleidingen voor IPTV Smarters Pro op Firestick, Android, Samsung TV, iOS en meer. Stapsgewijze tutorials met screenshots.'
    };

    return {
        title: titles[locale] || titles['en'],
        description: descriptions[locale] || descriptions['en'],
        keywords: [
            'IPTV Smarters installation',
            'IPTV setup guide',
            'Firestick IPTV',
            'Android IPTV tutorial',
            'Samsung TV IPTV'
        ],
        openGraph: {
            title: titles[locale] || titles['en'],
            description: descriptions[locale] || descriptions['en'],
            type: 'website'
        }
    };
}

const GuidesPage = async ({ params }: GuidesPageProps) => {
    const { locale } = await params;
    const t = await getTranslations('Support');

    // Fetch all guides from Sanity
    const guides = await getGuides();

    const difficultyColors = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    // Direct answer text
    const guidesAnswer = "Browse step-by-step installation guides for IPTV Smarters Pro on all major devices. Each guide includes detailed instructions, screenshots, and estimated setup time to help you get started quickly.";

    // CollectionPage Schema for SEO
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "IPTV Smarters Pro Installation Guides",
        "description": "Browse comprehensive installation guides for IPTV Smarters Pro on various devices including Firestick, Android, Samsung TV, and more.",
        "url": `https://yourdomain.com/${locale}/support/guides`,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Support",
                    "item": `https://yourdomain.com/${locale}/support`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Installation Guides"
                }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <StructuredData data={collectionSchema} />
            <main className="pt-20">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/support"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Support
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Installation Guides
                        </h1>
                        <p className="text-xl text-white/90">
                            Step-by-step guides to install Smarters Pro on any device
                        </p>
                    </div>
                </div>

                {/* Direct Answer Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <DirectAnswer answer={guidesAnswer} />
                </div>

                {/* Guides Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
                        Browse All Guides
                    </h2>
                    {guides.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guides.map((guide) => (
                                <Link
                                    key={guide._id}
                                    href={`/support/guides/${guide.slug.current}` as any}
                                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-xs font-bold rounded-full">
                                            {guide.device}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${difficultyColors[guide.difficulty as keyof typeof difficultyColors]}`}>
                                            {guide.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                                        {getLocalizedContent(guide.title, locale)}
                                    </h3>
                                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {guide.estimatedTime} minutes
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-6">
                                No installation guides available yet. Check back soon!
                            </p>
                            <Link
                                href="/support"
                                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Back to Support
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GuidesPage;
