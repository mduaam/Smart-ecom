import React from 'react';
import { Link } from '@/navigation';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SiteSettings, getLocalizedContent } from '@/lib/sanity-utils';
import { useLocale } from 'next-intl';

interface FooterProps {
    siteSettings?: SiteSettings | null;
}

const Footer = ({ siteSettings }: FooterProps) => {
    const t = useTranslations('Footer');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();

    // Use Sanity links if available, otherwise use defaults for the bottom links
    const footerLinks = siteSettings?.footer?.footerLinks?.map(link => ({
        label: getLocalizedContent(link.label, locale),
        href: link.href
    })) || [
            { label: t('terms'), href: '/terms' },
            { label: t('privacy'), href: '/privacy' },
            { label: t('refund'), href: '/refund-policy' },
        ];

    const copyrightText = siteSettings?.footer?.copyright
        ? getLocalizedContent(siteSettings.footer.copyright, locale)
        : `Smarters Pro Subscription. ${t('rights')}`;

    return (
        <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {siteSettings?.siteName?.[0] || 'S'}
                                </span>
                            </div>
                            <span className="text-xl font-bold dark:text-white">
                                {siteSettings?.siteName || 'Smarters Pro'}
                            </span>
                        </Link>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                            {t('desc')}
                        </p>
                        <div className="flex items-center gap-4">
                            {/* Social placeholders */}
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all text-zinc-500">
                                F
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all text-zinc-500">
                                X
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all text-zinc-500">
                                I
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{t('product')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/plans" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.pricing')}</Link></li>
                            <li><Link href="/iptv/devices" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.devices')}</Link></li>
                            <li><Link href="/iptv/regions" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.regional')}</Link></li>
                            <li><Link href="/features" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.features')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{t('support')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/support/installation" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.installation')}</Link></li>
                            <li><Link href="/support/troubleshooting" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.troubleshooting')}</Link></li>
                            <li><Link href="/support/faq" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.faq')}</Link></li>
                            <li><Link href="/support/tickets/new" className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors">{t('links.ticket')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-6">{t('contact')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-zinc-500 dark:text-zinc-400">
                                <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>support@iptvsmarters.pro</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-500 dark:text-zinc-400">
                                <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>WhatsApp: +1 234 567 890</span>
                            </li>
                            <li className="flex items-start gap-3 text-zinc-500 dark:text-zinc-400">
                                <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>Available 24/7 Worldwide</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        © {currentYear} {copyrightText}
                    </p>
                    <div className="flex gap-8">
                        {footerLinks.map((link) => (
                            <Link key={link.label} href={link.href as any} className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-indigo-600 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
