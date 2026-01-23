import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getGuides, getGuideBySlug, getLocalizedContent } from '@/lib/sanity-utils';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { ArrowLeft, Clock, Smartphone, Tv, Laptop, Monitor, Shield, CheckCircle, AlertTriangle, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { Metadata } from 'next';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface GuidePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

// Dynamic SEO Metadata
export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const guide = await getGuideBySlug(slug);

    if (!guide) return { title: 'Guide Not Found' };

    const title = getLocalizedContent(guide.title, locale);

    // SEO-rich descriptions based on device
    const deviceSEO: Record<string, string> = {
        'firestick': `Install IPTV Smarters Pro on Firestick`,
        'android-tv': `Install IPTV Smarters Pro on Android TV`,
        'smart-tv': `Install IPTV Smarters Pro on Samsung Smart TV`,
        'ios': `Install IPTV Smarters Pro on iOS (iPhone/iPad)`,
        'windows': `Install IPTV Smarters Pro on Windows PC`
    };

    const description = deviceSEO[guide.device] || `Complete installation guide for ${title}. Simple steps to get started in minutes.`;

    return {
        title: `${title} - Official 2025 Guide`,
        description: description,
        keywords: [
            `install iptv ${guide.device}`,
            `smarters pro ${guide.device}`,
            `setup iptv ${guide.device}`,
            'iptv installation guide',
            'smarters pro tutorial'
        ],
        openGraph: {
            title: `${title} | Easy Setup Tutorial`,
            description: description,
            type: 'article',
            publishedTime: new Date().toISOString(),
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070', // Fallback image if no guide image
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ]
        }
    };
}

const GuidePage = async ({ params }: GuidePageProps) => {
    const { locale, slug } = await params;
    const t = await getTranslations('Support');
    const g = await getTranslations('Guide');

    // Fetch the guide from Sanity or Fallback
    const guide = await getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const difficultyColors: Record<DifficultyLevel, string> = {
        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const deviceIcon = {
        'firestick': <Tv className="w-5 h-5" />,
        'android-tv': <Tv className="w-5 h-5" />,
        'smart-tv': <Monitor className="w-5 h-5" />,
        'ios': <Smartphone className="w-5 h-5" />,
        'windows': <Laptop className="w-5 h-5" />
    }[guide.device] || <Tv className="w-5 h-5" />;

    // JSON-LD Structured Data for "HowTo" Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: getLocalizedContent(guide.title, locale),
        description: `Learn how to install IPTV Smarters on ${guide.device}.`,
        step: guide.steps?.map((step: any, index: number) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: getLocalizedContent(step.title, locale),
            itemListElement: {
                '@type': 'HowToDirection',
                text: getLocalizedContent(step.description, locale),
            },
            ...(step.image && { image: urlFor(step.image).url() })
        }))
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="pt-0">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 lg:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Link
                            href="/support/installation"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Installation Guides
                        </Link>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-white text-sm font-semibold backdrop-blur-md">
                                {deviceIcon}
                                {guide.device.toUpperCase()}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md ${guide.difficulty === 'easy' ? 'bg-green-500/20 text-green-100 border border-green-500/30' :
                                guide.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-100 border border-red-500/30'
                                }`}>
                                {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)} Difficulty
                            </span>
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-white text-sm font-semibold backdrop-blur-md">
                                <Clock className="w-4 h-4" />
                                {guide.estimatedTime} Minutes
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {getLocalizedContent(guide.title, locale)}
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed">
                            Follow this complete step-by-step tutorial to get up and running instantly.
                        </p>
                    </div>
                </div>

                {/* Guide Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                    {/* Safety & Legal Disclaimer */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">{g('safety.title')}</h3>
                                <p className="text-blue-800 dark:text-blue-200/80 text-sm leading-relaxed mb-3">
                                    {g('safety.paragraph1')}
                                </p>
                                <p className="text-blue-800 dark:text-blue-200/80 text-sm">
                                    {g.raw('safety.paragraph2')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Prerequisites */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-12">
                        <div className="flex gap-4">
                            <div className="shrink-0">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-3">{g('prerequisites.title')}</h3>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-2 text-amber-800 dark:text-amber-200/80 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{g.raw('prerequisites.subscription')}</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-amber-800 dark:text-amber-200/80 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{g.raw('prerequisites.internet')}</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-amber-800 dark:text-amber-200/80 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{g.raw('prerequisites.credentials')}</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-amber-800 dark:text-amber-200/80 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>{g.raw('prerequisites.storage')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Video Tutorial (if available) */}
                    {guide.videoUrl && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                                Video Tutorial
                            </h2>
                            <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-900/5">
                                <iframe
                                    src={guide.videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Installation Steps */}
                    <div className="space-y-12">
                        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                                Installation Steps
                            </h2>
                            <p className="text-zinc-500 mt-2">Follow these steps exactly as shown.</p>
                        </div>

                        {guide.steps && guide.steps.map((step: any, index: number) => (
                            <div key={index} className="group relative pl-0 md:pl-16">
                                {/* Connector Line (Desktop) */}
                                {index !== guide.steps!.length - 1 && (
                                    <div className="hidden md:block absolute left-[27px] top-16 bottom-[-48px] w-0.5 bg-zinc-200 dark:bg-zinc-800 group-last:hidden"></div>
                                )}

                                {/* Step Number */}
                                <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-white dark:bg-zinc-900 border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl items-center justify-center font-bold text-xl shadow-sm z-10 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    {step.stepNumber}
                                </div>

                                {/* Mobile Step Badge */}
                                <div className="md:hidden inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-sm mb-4">
                                    Step {step.stepNumber}
                                </div>

                                {/* Step Card */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:border-indigo-600/30 transition-all duration-300">
                                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                                        {getLocalizedContent(step.title, locale)}
                                    </h3>
                                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {getLocalizedContent(step.description, locale)}
                                    </p>

                                    {/* Step Image */}
                                    {step.image && (
                                        <div className="mt-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                                            <img
                                                src={urlFor(step.image).width(1200).url()}
                                                alt={getLocalizedContent(step.title, locale)}
                                                className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* How to Use IPTV Smarters */}
                    <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">{g('howToUse.title')}</h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                                    {g('howToUse.step1.title')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {g('howToUse.step1.description')}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                                    {g('howToUse.step2.title')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="pl-10">
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">{g('howToUse.step2.optionA.title')}</h4>
                                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                            <li>• {g('howToUse.step2.optionA.step1')}</li>
                                            <li>• {g('howToUse.step2.optionA.step2')}</li>
                                            <li>• {g('howToUse.step2.optionA.step3')}</li>
                                        </ul>
                                    </div>
                                    <div className="pl-10">
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">{g('howToUse.step2.optionB.title')}</h4>
                                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                            <li>• {g('howToUse.step2.optionB.step1')}</li>
                                            <li>• {g('howToUse.step2.optionB.step2')}</li>
                                            <li>• {g('howToUse.step2.optionB.step3')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                                    {g('howToUse.step3.title')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {g('howToUse.step3.description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Troubleshooting Tips */}
                    <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">{g('troubleshooting.title')}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{g('troubleshooting.appWontInstall.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('troubleshooting.appWontInstall.solution')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{g('troubleshooting.playlistWontLoad.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('troubleshooting.playlistWontLoad.solution')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{g('troubleshooting.buffering.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('troubleshooting.buffering.solution')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{g('troubleshooting.appCrashes.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Clear app cache in Settings {'>'} Apps {'>'} IPTV Smarters {'>'} Clear Cache</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">{g('faq.title')}</h2>
                        <div className="space-y-4">
                            <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-zinc-900 dark:text-white">{g('faq.isFree.question')}</span>
                                    <HelpCircle className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400">
                                    {g('faq.isFree.answer')}
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-zinc-900 dark:text-white">{g('faq.needVpn.question')}</span>
                                    <HelpCircle className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400">
                                    {g('faq.needVpn.answer')}
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-zinc-900 dark:text-white">{g('faq.multipleServices.question')}</span>
                                    <HelpCircle className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400">
                                    {g('faq.multipleServices.answer')}
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-zinc-900 dark:text-white">{g('faq.formats.question')}</span>
                                    <HelpCircle className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400">
                                    {g('faq.formats.answer')}
                                </div>
                            </details>

                            <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-zinc-900 dark:text-white">{g('faq.otherDevices.question')}</span>
                                    <HelpCircle className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400">
                                    {g('faq.otherDevices.answer')}
                                </div>
                            </details>
                        </div>
                    </div>

                    {/* Related Guides */}
                    <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">{g('relatedGuides.title')}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link
                                href="/support/troubleshooting"
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{g('relatedGuides.troubleshootingGuide.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('relatedGuides.troubleshootingGuide.description')}</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </Link>

                            <Link
                                href="/support/faq"
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{g('relatedGuides.faqCenter.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('relatedGuides.faqCenter.description')}</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </Link>

                            <Link
                                href="/support/installation"
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Tv className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{g('relatedGuides.otherDevices.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('relatedGuides.otherDevices.description')}</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </Link>

                            <Link
                                href="/support"
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{g('relatedGuides.supportCenter.title')}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{g('relatedGuides.supportCenter.description')}</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Completion / CTA */}
                    <div className="mt-20 text-center bg-zinc-900 dark:bg-indigo-900/20 rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">You're All Set! 🎉</h3>
                            <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">
                                Now that you've installed the app, you need an active subscription to start watching.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/plans"
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                                >
                                    Get Subscription
                                </Link>
                                <Link
                                    href="/support"
                                    className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                                >
                                    View Other Guides
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GuidePage;
