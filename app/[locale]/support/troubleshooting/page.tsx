import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ArrowLeft, AlertCircle, Wifi, Video, Shield } from 'lucide-react';
import DirectAnswer from '@/components/seo/DirectAnswer';
import StructuredData from '@/components/seo/StructuredData';

import { Metadata } from 'next';

interface TroubleshootingPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: TroubleshootingPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Troubleshooting' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en/support/troubleshooting',
                'es': '/es/support/troubleshooting',
                'fr': '/fr/support/troubleshooting',
                'nl': '/nl/support/troubleshooting',
            }
        }
    };
}

const TroubleshootingPage = async ({ params }: TroubleshootingPageProps) => {
    const { locale } = await params;
    const t = await getTranslations('Troubleshooting');
    const seo = await getTranslations('SEO.DirectAnswers');

    const commonIssues = [
        {
            title: t('issues.buffering.title'),
            icon: <Wifi className="w-6 h-6" />,
            solutions: [
                t('issues.buffering.solutions.0'),
                t('issues.buffering.solutions.1'),
                t('issues.buffering.solutions.2'),
                t('issues.buffering.solutions.3'),
                t('issues.buffering.solutions.4')
            ]
        },
        {
            title: t('issues.video.title'),
            icon: <Video className="w-6 h-6" />,
            solutions: [
                t('issues.video.solutions.0'),
                t('issues.video.solutions.1'),
                t('issues.video.solutions.2'),
                t('issues.video.solutions.3'),
                t('issues.video.solutions.4')
            ]
        },
        {
            title: t('issues.login.title'),
            icon: <Shield className="w-6 h-6" />,
            solutions: [
                t('issues.login.solutions.0'),
                t('issues.login.solutions.1'),
                t('issues.login.solutions.2'),
                t('issues.login.solutions.3'),
                t('issues.login.solutions.4')
            ]
        },
        {
            title: t('issues.crash.title'),
            icon: <AlertCircle className="w-6 h-6" />,
            solutions: [
                t('issues.crash.solutions.0'),
                t('issues.crash.solutions.1'),
                t('issues.crash.solutions.2'),
                t('issues.crash.solutions.3'),
                t('issues.crash.solutions.4')
            ]
        },
    ];

    // HowTo Schema for troubleshooting
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Fix IPTV Smarters Common Issues",
        "description": "Troubleshooting guide for resolving common IPTV Smarters Pro problems including buffering, video playback, login errors, and app crashes.",
        "step": commonIssues.map((issue, index) => ({
            "@type": "HowToStep",
            "name": issue.title,
            "position": index + 1,
            "itemListElement": issue.solutions.map((solution, idx) => ({
                "@type": "HowToDirection",
                "position": idx + 1,
                "text": solution
            }))
        }))
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <StructuredData data={howToSchema} />
            <main className="pt-20">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/support"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('back')}
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-white/90">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                {/* Direct Answer Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <DirectAnswer answer="IPTV Smarters buffering is caused by slow internet connection, server issues from your IPTV provider, or device performance. Solutions include checking your internet speed (minimum 10 Mbps recommended), using Ethernet instead of WiFi, clearing app cache, or changing your IPTV server in the app settings." />
                </div>

                {/* Common Issues */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
                        Common Issues and Solutions
                    </h2>
                    <div className="space-y-6">
                        {commonIssues.map((issue, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                        {issue.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                            {issue.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            {t('trySolutions')}
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-3 ml-16">
                                    {issue.solutions.map((solution, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
                                        >
                                            <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span>{solution}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Still Need Help */}
                    <div className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900 text-center">
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                            {t('stillNeedHelp.title')}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            {t('stillNeedHelp.desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/support/tickets/new"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                {t('stillNeedHelp.ticketBtn')}
                            </Link>
                            <Link
                                href="/support/faq"
                                className="px-6 py-3 bg-white dark:bg-zinc-900 text-indigo-600 border border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                {t('stillNeedHelp.faqBtn')}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TroubleshootingPage;
