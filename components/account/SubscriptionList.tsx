'use client';

import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, AlertTriangle, Copy, Check } from 'lucide-react';
import { Link } from '@/navigation';

interface SubscriptionListProps {
    subscriptions: any[];
    translations: {
        title: string;
        code: string;
        copy: string;
        credentials: string;
        service: string;
        username: string;
        password: string;
        portal: string;
        deviceUsage: string;
        connected: string;
        limit: string;
        stats: {
            daysLeft: string;
        };
    };
}

export default function SubscriptionList({ subscriptions, translations: t }: SubscriptionListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    if (!subscriptions || subscriptions.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-12 text-center mb-12">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold dark:text-white mb-2">No Active Subscription</h3>
                <p className="text-zinc-500 mb-6">You don't have an active subscription plan at the moment.</p>
                <Link href="/plans" className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all">
                    Browse Plans
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-12">
            {subscriptions.map((sub) => {
                const isExpanded = expandedId === sub.id;

                // Calculate days remaining
                let daysRemaining = 0;
                if (sub.current_period_end) {
                    const end = new Date(sub.current_period_end).getTime();
                    const now = new Date().getTime();
                    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
                }

                return (
                    <div key={sub.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-all duration-300">
                        {/* Header / Summary Row */}
                        <div
                            onClick={() => toggleExpand(sub.id)}
                            className={`p-8 flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors ${isExpanded ? 'bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
                        >
                            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isExpanded ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'}`}>
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold dark:text-white">{sub.plan_name || sub.plan_id || 'Premium Subscription'}</h3>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        {/* Status is usually just 'active' but we can format it */}
                                        <span className="uppercase tracking-wider font-bold text-xs">{sub.status}</span>
                                        <span>•</span>
                                        <span>Expires in {daysRemaining} days</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs font-bold text-zinc-400 uppercase">Renewal</p>
                                    <p className="text-sm font-bold dark:text-white">{new Date(sub.current_period_end).toLocaleDateString()}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isExpanded ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rotate-180' : 'bg-transparent border-transparent'}`}>
                                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <div className="p-8 animate-in slide-in-from-top-4 duration-300 space-y-8">


                                {/* Credentials Card */}
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t.credentials}</p>
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl space-y-4">
                                        {/* Activation Code */}
                                        {sub.activation_code && (
                                            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                                <span className="text-sm text-zinc-500">Activation Code</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold dark:text-white font-mono">
                                                        {sub.activation_code}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCopy(sub.activation_code, `act-${sub.id}`); }}
                                                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-indigo-600"
                                                    >
                                                        {copied === `act-${sub.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <span className="text-sm text-zinc-500">{t.service || 'Service'}</span>
                                            <span className="text-sm font-bold dark:text-white font-mono">
                                                LXTREAM
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <span className="text-sm text-zinc-500">{t.username}</span>
                                            <span className="text-sm font-bold dark:text-white font-mono">
                                                {sub.iptv_username || 'Pending...'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <span className="text-sm text-zinc-500">{t.password}</span>
                                            <span className="text-sm font-bold dark:text-white font-mono">
                                                {sub.iptv_password || 'Pending...'}
                                            </span>
                                        </div>



                                        <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <span className="text-sm text-zinc-500">{t.portal}</span>
                                            <Link href={sub.iptv_url || "http://vod4k.cc"} target="_blank" className="text-sm font-bold text-indigo-600 underline hover:text-indigo-500 truncate max-w-[200px]">
                                                {sub.iptv_url || "http://vod4k.cc"}
                                            </Link>
                                        </div>

                                        {/* Alternative URLs */}
                                        {sub.alternative_urls && sub.alternative_urls.length > 0 && (
                                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                                <span className="text-xs font-bold text-zinc-400 uppercase mb-2 block">Alternative URLs</span>
                                                <div className="space-y-2">
                                                    {sub.alternative_urls.map((url: string, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center">
                                                            <Link href={url} target="_blank" className="text-sm font-bold text-indigo-600 underline hover:text-indigo-500 truncate max-w-[200px]">
                                                                {url}
                                                            </Link>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleCopy(url, `alt-${sub.id}-${idx}`); }}
                                                                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-indigo-600"
                                                            >
                                                                {copied === `alt-${sub.id}-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning */}
                                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">Attention</p>
                                                <p className="text-xs text-yellow-800 dark:text-yellow-400 leading-relaxed">
                                                    Pour Smarters Pro sur Smart TV, utilisez l’URL suivante : <span className="font-bold select-all">http://sub-tv.site</span> ou bien : <span className="font-bold select-all">http://vod4k.cc</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* M3U Link */}
                                {sub.m3u_link && (
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">M3U Liens</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 font-mono text-xs dark:text-white break-all">
                                                {sub.m3u_link}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleCopy(sub.m3u_link, `m3u-${sub.id}`); }}
                                                className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 transition-all text-indigo-600"
                                            >
                                                {copied === `m3u-${sub.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Device Usage */}
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-zinc-400 uppercase">{t.deviceUsage}</p>

                                    <div className="flex items-center justify-between text-sm font-bold dark:text-white bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-xl">
                                        <span>1 {t.connected}</span>
                                        <span>{t.limit}: {sub.max_connections || 1}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-indigo-600"></div>
                                    </div>
                                </div>

                                {/* Stats & Plan */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl">
                                        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t.stats.daysLeft}</p>
                                        <p className="text-3xl font-black dark:text-white">{daysRemaining}</p>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl">
                                        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">Plan</p>
                                        <p className="text-lg font-bold dark:text-white leading-tight">{sub.plan_name || sub.plan_id}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/plans" className="py-4 bg-indigo-600 text-white rounded-2xl text-center font-bold text-sm hover:bg-indigo-700 transition-all">
                                        Extend Plan
                                    </Link>
                                    <Link href="/support/installation" className="py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-center font-bold text-sm hover:bg-zinc-50 transition-all dark:text-white">
                                        Install Guide
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

