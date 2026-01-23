'use client';

import { Activity, Clock, User } from 'lucide-react';

interface Log {
    id: string;
    action: string;
    target_email: string;
    created_at: string;
    profiles: {
        full_name: string | null;
        email: string;
    } | null;
    details: any;
}

export default function AuditLogs({ logs }: { logs: Log[] }) {
    if (!logs || logs.length === 0) return null;

    return (
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold dark:text-white">Recent Activity</h2>
                    <p className="text-zinc-500 text-sm">Audit trail of team management actions.</p>
                </div>
            </div>

            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50">
                        <div className="mt-1">
                            <Clock className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        {log.profiles?.full_name || log.profiles?.email || 'Unknown Admin'}
                                    </span>
                                    <span className="text-zinc-500 mx-1">performed</span>
                                    <span className="uppercase text-xs font-bold bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </p>
                                <span className="text-xs text-zinc-400 whitespace-nowrap ml-4">
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                                Target: <span className="font-mono">{log.target_email || 'N/A'}</span>
                                {log.details && (
                                    <span className="ml-2 opacity-75">
                                        ({JSON.stringify(log.details)})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
