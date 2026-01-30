"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import VideoModal from './VideoModal';
import Image from 'next/image';


const Hero = ({ data }: { data?: any }) => {
    const t = useTranslations('Hero');
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // Use data from Sanity if available, otherwise fallback to translations
    const title = data?.title || t('title');
    const description = data?.description || t('desc');
    const badge = data?.badge || t('badge');

    return (
        <div className="relative pt-0 pb-20 lg:pt-0 lg:pb-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-100 dark:border-indigo-900/50">
                            <Zap className="w-4 h-4" />
                            {badge}
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
                            {data?.title ? (
                                data.title // Sanity title might need parsing if it has split logic, but let's assume simple string for now or we handle the highlight separately in schema
                            ) : (
                                <>
                                    {t('title')} <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                        {t('titleHighlight')}
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                            {description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/plans"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            {t('ctaStart')}
                            <Play className="w-5 h-5 fill-current" />
                        </Link>
                        <Link
                            href="/support/faq"
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            {t('ctaDemo')}
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-indigo-600" />
                            <span className="text-sm font-semibold text-zinc-500">Secure Payment</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="w-8 h-8 text-indigo-600" />
                            <span className="text-sm font-semibold text-zinc-500">Instant Delivery</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Play className="w-8 h-8 text-indigo-600" />
                            <span className="text-sm font-semibold text-zinc-500">20k+ Channels</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Globe className="w-8 h-8 text-indigo-600" />
                            <span className="text-sm font-semibold text-zinc-500">Worldwide Access</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Hero Visual - Keeping usage of video modal and image same for now, implies hardcoded or we extend schema later */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-20 max-w-5xl mx-auto px-4 relative"
            >
                <div
                    onClick={() => setIsVideoOpen(true)}
                    className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl group cursor-pointer"
                >
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                        <Image
                            src="/images/hero-thumbnail.png"
                            alt="Watch IPTV in Action"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                                </div>
                            </div>
                            <p className="font-bold text-white text-lg drop-shadow-md">Watch IPTV in Action</p>
                        </div>
                    </div>
                </div>

                {/* Floating cards for "Premium Demo" effect */}
                <div className="absolute -top-10 -right-10 hidden lg:block">
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-zinc-500">LIVE NOW</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-white">Champions League Final</p>
                        <p className="text-xs text-zinc-400">4K Ultra HD Streaming</p>
                    </div>
                </div>

                <div className="absolute -bottom-10 -left-10 hidden lg:block">
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-w-[200px]">
                        <p className="text-xs font-bold text-zinc-500 mb-2">SUBSCRIPTION STATUS</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                <div className="w-3/4 h-full bg-indigo-600 rounded-full"></div>
                            </div>
                            <span className="text-xs font-bold text-indigo-600">Active</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Video Modal */}
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoId="5xq43D0w7ls"
            />
        </div>
    );
};

export default Hero;
