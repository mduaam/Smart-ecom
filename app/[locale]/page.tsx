import { useTranslations } from 'next-intl';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import { Link } from '@/navigation';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import DirectAnswer from '@/components/seo/DirectAnswer';
import { generateSoftwareApplicationSchema } from '@/lib/seo-schemas';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    'en': 'IPTV Smarters Pro - The Ultimate IPTV Streaming App',
    'fr': 'IPTV Smarters Pro - Application IPTV Ultime',
    'es': 'IPTV Smarters Pro - La Mejor Aplicación IPTV',
    'nl': 'IPTV Smarters Pro - De Ultieme IPTV App'
  };

  const descriptions: Record<string, string> = {
    'en': 'IPTV Smarters Pro is a powerful IPTV player for Firestick, Android, Samsung TV & more. Easy setup, multi-screen support, and exceptional streaming quality.',
    'fr': 'IPTV Smarters Pro est un lecteur IPTV puissant pour Firestick, Android, Samsung TV et plus. Configuration facile, support multi-écrans et qualité exceptionnelle.',
    'es': 'IPTV Smarters Pro es un potente reproductor IPTV para Firestick, Android, Samsung TV y más. Configuración fácil, soporte multi-pantalla y calidad excepcional.',
    'nl': 'IPTV Smarters Pro is een krachtige IPTV-speler voor Firestick, Android, Samsung TV en meer. Eenvoudige installatie, multi-screen ondersteuning en uitzonderlijke kwaliteit.'
  };

  return {
    title: titles[locale] || titles['en'],
    description: descriptions[locale] || descriptions['en'],
    keywords: [
      'IPTV Smarters Pro',
      'IPTV player',
      'IPTV app',
      'Firestick IPTV',
      'Android IPTV',
      'Smart TV IPTV',
      'IPTV streaming',
      'M3U player',
      'Xtream Codes'
    ],
    alternates: {
      languages: {
        'en': '/en',
        'fr': '/fr',
        'es': '/es',
        'nl': '/nl',
      },
    },
    openGraph: {
      title: titles[locale] || titles['en'],
      description: descriptions[locale] || descriptions['en'],
      type: 'website',
      siteName: 'IPTV Smarters Pro',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles['en'],
      description: descriptions[locale] || descriptions['en'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

import { getTranslations } from 'next-intl/server';
import { client } from '@/sanity/lib/client';

export default async function Index() {
  const t = await getTranslations('Index');
  const h = await getTranslations('Home');
  const seo = await getTranslations('SEO.DirectAnswers');

  // Fetch plans from Sanity (Dynamic Data)
  const plans = await client.fetch(`*[_type == "plan"] | order(price asc) {
    _id,
    name,
    price,
    currency,
    duration,
    isPopular,
    screens
  }`);

  // Generate SoftwareApplication Schema
  const softwareSchema = generateSoftwareApplicationSchema({
    name: "IPTV Smarters Pro",
    operatingSystems: ["Android", "iOS", "Fire OS", "Windows", "macOS"],
    price: "0",
    priceCurrency: "USD",
    ratingValue: "4.5",
    reviewCount: "15000",
    description: "IPTV Smarters Pro is a free IPTV player application that allows users to watch live TV, movies, and series on multiple devices including Firestick, Android, iOS, and Smart TVs.",
    version: "3.0.9",
    features: [
      "Multi-device support",
      "EPG (Electronic Program Guide)",
      "Parental controls",
      "Multiple playlist support",
      "Catch-up TV",
      "Multi-screen viewing",
      "4K/HD streaming support",
      "Xtream Codes API support",
      "M3U playlist support"
    ]
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      <StructuredData data={softwareSchema} />

      <main>
        <Hero />

        {/* Direct Answer Section - For AI Search Visibility */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
          <DirectAnswer answer={seo('homepage')} />
        </section>

        <Pricing plans={plans} />

        {/* Quality Section */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-zinc-900 dark:text-white">
              {h('quality.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{h('quality.ultraFast')}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{h('quality.ultraFastDesc')}</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all group lg:scale-110 lg:z-10 bg-gradient-to-b from-white to-indigo-50/30 dark:from-zinc-900 dark:to-indigo-950/10">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-indigo-600/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{h('quality.stable')}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{h('quality.stableDesc')}</p>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{h('quality.multiDevice')}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{h('quality.multiDeviceDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="inline-block p-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold px-4 mb-6">
                  {h('features.badge')}
                </div>
                <h2 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white leading-tight">
                  {h('features.title')} <span className="text-indigo-600 italic underline">{h('features.titleHighlight')}</span>
                </h2>
                <ul className="space-y-6">
                  {['0', '1', '2', '3', '4'].map((index) => (
                    <li key={index} className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${parseInt(index) * 100}ms` }}>
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-lg">{h(`features.list.${index}`)}</span>
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
                      alt="IPTV Smarters Pro interface displaying live TV channels on Firestick with EPG guide visible"
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

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 lg:px-0">
            <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 relative z-10">
                {h('cta.title')}
              </h2>
              <p className="text-indigo-100 mb-12 text-lg lg:text-xl relative z-10 max-w-2xl mx-auto">
                {h('cta.desc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <Link href="/plans" className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-105">
                  {h('cta.plansBtn')}
                </Link>
                <Link href="/contact" className="w-full sm:w-auto px-10 py-5 bg-indigo-500 text-white rounded-2xl font-bold text-xl hover:bg-indigo-400 transition-all border border-indigo-400">
                  {h('cta.supportBtn')}
                </Link>
              </div>
              <p className="mt-8 text-indigo-200 text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {h('cta.guarantee')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
