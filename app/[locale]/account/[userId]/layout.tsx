import React from 'react';
import Navbar from '@/components/Navbar';
import AccountSidebar from '@/components/account/AccountSidebar';
import { getDashboardData } from '@/app/actions/dashboard';
import { logout } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function UserAccountLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string, userId: string }>;
}) {
    const { locale, userId } = await params;

    const { user, profile, subscription, error } = await getDashboardData(locale);

    if (error || !user) {
        redirect(`/${locale}/auth/login`);
    }

    if (user.id !== userId) {
        redirect(`/${locale}/account/${user.id}/dashboard`);
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const isPremium = !!subscription;
    const logoutAction = logout.bind(null, locale);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <AccountSidebar displayName={displayName} isPremium={isPremium} logoutAction={logoutAction} />
                        <div className="flex-1 space-y-8">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
