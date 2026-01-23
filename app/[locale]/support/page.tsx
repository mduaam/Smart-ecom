import React from 'react';
import { CircleHelp, Book, MessageSquare, Wrench, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { getCategories, getGuides, getLocalizedContent } from '@/lib/sanity-utils';
import { Metadata } from 'next';
import DirectAnswer from '@/components/seo/DirectAnswer';
import StructuredData from '@/components/seo/StructuredData';
import SupportSearch from '@/components/SupportSearch';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata.Support' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            languages: {
                'en': '/en/support',
                'es': '/es/support',
                'fr': '/fr/support',
                'nl': '/nl/support',
            }
        }
    };
}

const SupportPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const t = await getTranslations('Support');
    const seo = await getTranslations('SEO.DirectAnswers');

    // Fetch dynamic content from Sanity
    const sanityCategories = await getCategories();
    const sanityGuides = await getGuides();

    // Icon mapping for categories
    const iconMap: Record<string, React.ReactNode> = {
        'Wrench': <Wrench className="w-8 h-8 text-indigo-600" />,
        'ShieldAlert': <ShieldAlert className="w-8 h-8 text-indigo-600" />,
        'CircleHelp': <CircleHelp className="w-8 h-8 text-indigo-600" />,
        'MessageSquare': <MessageSquare className="w-8 h-8 text-indigo-600" />,
        'Cpu': <Cpu className="w-8 h-8 text-indigo-600" />,
        'Book': <Book className="w-8 h-8 text-indigo-600" />,
    };

    // Fallback categories if Sanity is empty
    const categories = [
        {
            title: t('categories.installation.title'),
            desc: t('categories.installation.desc'),
            icon: <Wrench className="w-8 h-8 text-indigo-600" />,
            link: '/support/installation'
        },
        {
            title: t('categories.troubleshooting.title'),
            desc: t('categories.troubleshooting.desc'),
            icon: <ShieldAlert className="w-8 h-8 text-indigo-600" />,
            link: '/support/troubleshooting'
        },
        {
            title: t('categories.faq.title'),
            desc: t('categories.faq.desc'),
            icon: <CircleHelp className="w-8 h-8 text-indigo-600" />,
            link: '/support/faq'
        },
        {
            title: t('categories.tickets.title'),
            desc: t('categories.tickets.desc'),
            icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
            link: '/support/tickets'
        },
        {
            title: t('categories.devices.title'),
            desc: t('categories.devices.desc'),
            icon: <Cpu className="w-8 h-8 text-indigo-600" />,
            link: '/iptv/devices'
        },
        {
            title: t('categories.kb.title'),
            desc: t('categories.kb.desc'),
            icon: <Book className="w-8 h-8 text-indigo-600" />,
            link: '/support/guides'
        }
    ];

    // Use Sanity categories if available, otherwise use fallback
    const displayCategories = sanityCategories.length > 0 ? sanityCategories : null;

    // Organization Schema for SEO
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "IPTV Smarters Pro Support",
        "description": "Comprehensive support center for IPTV Smarters Pro users. Find guides, troubleshooting tips, FAQs, and get help with installation.",
        "url": `https://yourdomain.com/${locale}/support`,
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "availableLanguage": ["English", "Spanish", "French", "Dutch"]
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <StructuredData data={organizationSchema} />
            <main className="pt-0">
                <section className="bg-zinc-50 dark:bg-zinc-950 pt-8 pb-24 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-8 text-zinc-900 dark:text-white">{t('title')}</h1>
                        <SupportSearch />
                    </div>
                </section>

                {/* Direct Answer Section */}
                < div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20" >
                    <DirectAnswer answer={seo('homepage')} />
                </div >

                {/* Support Categories */}
                < section className="py-24" >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-center">
                            Browse Support Categories
                        </h2>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayCategories ? (
                                // Render Sanity categories
                                displayCategories.map((cat) => (
                                    <Link
                                        key={cat._id}
                                        href={`/support/${cat.slug.current}` as any}
                                        className="p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all group"
                                    >
                                        <div className="mb-6 group-hover:scale-110 transition-transform">
                                            {iconMap[cat.icon] || <Book className="w-8 h-8 text-indigo-600" />}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 dark:text-white">
                                            {getLocalizedContent(cat.name, locale)}
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                                            {getLocalizedContent(cat.description, locale)}
                                        </p>
                                        <span className="text-indigo-600 font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                                            {t('browse')} →
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                // Render fallback categories
                                categories.map((cat, i) => (
                                    <Link
                                        key={i}
                                        href={cat.link as any}
                                        className="p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all group"
                                    >
                                        <div className="mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                        <h3 className="text-2xl font-bold mb-4 dark:text-white">{cat.title}</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">{cat.desc}</p>
                                        <span className="text-indigo-600 font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                                            {t('browse')} →
                                        </span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </section >

                {/* Recent Guides Section - Only show if we have guides from Sanity */}
                {
                    sanityGuides.length > 0 && (
                        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12">
                                    Popular Installation Guides
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sanityGuides.slice(0, 6).map((guide) => (
                                        <Link
                                            key={guide._id}
                                            href={`/support/guides/${guide.slug.current}` as any}
                                            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-xs font-bold rounded-full">
                                                    {guide.device}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-bold rounded ${guide.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                                                    guide.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {guide.difficulty}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">
                                                {getLocalizedContent(guide.title, locale)}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                ⏱️ {guide.estimatedTime} min
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )
                }

                {/* Quick Help CTA */}
                <section className="py-24 bg-indigo-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">{t('ctaTitle')}</h2>
                        <p className="text-indigo-100 mb-10 text-lg">
                            {t('ctaDesc')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/support/tickets/new" className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-xl transition-all">
                                {t('ctaTicket')}
                            </Link>
                            <Link href="/contact" className="px-10 py-4 bg-indigo-500 text-white border border-indigo-400 rounded-2xl font-bold hover:bg-indigo-400 transition-all">
                                {t('ctaWhatsApp')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div >
    );
};

export default SupportPage;
