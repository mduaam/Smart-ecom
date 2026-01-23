import React from 'react';
import { getUserProfile } from '@/app/actions/user_orders';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { User, Lock, Save } from 'lucide-react';
import SettingsForm from '@/components/account/SettingsForm';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string, userId: string }> }) {
    const { locale, userId } = await params;
    const t = await getTranslations({ locale });
    const { data: profile, user, error } = await getUserProfile();

    if (error || !user) {
        // Handle error
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || '';

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white mb-2">Account Settings</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Manage your profile and security preferences</p>
                        </div>
                        <Link
                            href={`/account/${userId}/dashboard`}
                            className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">Personal Information</h2>
                            </div>

                            <SettingsForm displayName={displayName} email={user?.email || ''} />
                        </div>

                        {/* Security Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold dark:text-white">Security</h2>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
