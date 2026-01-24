"use client";

import React from 'react';
import { Link, useRouter, usePathname } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe, ShoppingCart, User, ChevronDown, LogOut, Activity, ShoppingBag, Ticket, CreditCard, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { createBrowserClient } from '@supabase/ssr';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { SiteSettings, getLocalizedContent } from '@/lib/sanity-utils';

interface NavbarProps {
    siteSettings?: SiteSettings | null;
}

const Navbar = ({ siteSettings }: NavbarProps) => {
    const t = useTranslations('Nav');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'nl', name: 'Nederlands' },
    ];

    const switchLanguage = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setLangOpen(false);
    };

    // Use Sanity links if available, otherwise use defaults
    const navLinks = siteSettings?.headerNavigation?.map(link => ({
        name: getLocalizedContent(link.label, locale),
        href: link.href
    })) || [
            { name: t('plans'), href: '/plans' },
            { name: t('devices'), href: '/iptv/devices' },
            { name: t('support'), href: '/support' },
            { name: t('about'), href: '/about' },
        ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                    {siteSettings?.siteName?.[0] || 'S'}
                                </span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
                                {siteSettings?.siteName || 'Smarters Pro'}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href as any}
                                className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-xs uppercase font-bold">{locale}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {langOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setLangOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-2">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => switchLanguage(lang.code)}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${locale === lang.code
                                                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                                            }`}
                                                    >
                                                        {lang.name}
                                                        {locale === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        {!user ? (
                            <Link href="/auth/signup" className="text-sm font-bold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                {t('signup')}
                            </Link>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setProfileOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800"
                                            >
                                                <div className="p-4">
                                                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                                        {user.user_metadata?.full_name || 'Member'}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                                        {user.email}
                                                    </p>
                                                </div>



                                                <div className="p-2 space-y-1">
                                                    <Link
                                                        href={`/account/${user.id}/dashboard`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/subscriptions`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                        My Subscriptions
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/orders`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <ShoppingBag className="w-4 h-4" />
                                                        Orders
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/tickets`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Ticket className="w-4 h-4" />
                                                        Support Tickets
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/billing`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                        Billing
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/settings`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </Link>

                                                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                                                    <button
                                                        onClick={async () => {
                                                            await supabase.auth.signOut();
                                                            setProfileOpen(false);
                                                            router.refresh();
                                                            window.location.reload(); // Hard refresh to ensure state clears
                                                        }}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <Link href="/plans" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/20">
                            {t('getStarted')}
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setProfileOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800"
                                            >
                                                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                                                        {user.user_metadata?.full_name || 'Member'}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="p-2 space-y-1">
                                                    <Link
                                                        href={`/account/${user.id}/dashboard`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/subscriptions`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                        My Subscriptions
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/orders`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <ShoppingBag className="w-4 h-4" />
                                                        Orders
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/tickets`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Ticket className="w-4 h-4" />
                                                        Support Tickets
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/billing`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                        Billing
                                                    </Link>
                                                    <Link
                                                        href={`/account/${user.id}/settings`}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                                        onClick={() => setProfileOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </Link>

                                                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                                                    <button
                                                        onClick={async () => {
                                                            await supabase.auth.signOut();
                                                            setProfileOpen(false);
                                                            router.refresh();
                                                            window.location.reload();
                                                        }}
                                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-zinc-600 dark:text-zinc-400"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href as any}
                                    className="block px-3 py-2 text-base font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 mt-2 pt-2">
                                {user && (
                                    <Link
                                        href={`/account/${user.id}/dashboard`}
                                        className="block px-3 py-2 text-base font-medium text-zinc-600 dark:text-zinc-400"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Account
                                    </Link>
                                )}
                                <div className="px-3 py-2 space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => switchLanguage(lang.code)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${locale === lang.code
                                                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
                                                    : 'text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                                                    }`}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                    {!user && (
                                        <Link
                                            href="/auth/signup"
                                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-lg text-center font-semibold block border border-zinc-200 dark:border-zinc-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {t('signup')}
                                        </Link>
                                    )}
                                    <Link
                                        href="/plans"
                                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-center font-semibold block"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {t('getStarted')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};


export default Navbar;
