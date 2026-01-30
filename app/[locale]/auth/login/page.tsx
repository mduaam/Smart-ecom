
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

interface Props {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });

    return {
        title: `${t('title')} | IPTV Smarters Pro`,
        description: t('subtitle'),
    };
}

export default async function LoginPage({ params }: Props) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
            <main className="flex-grow flex items-center justify-center p-4 pt-20">
                <div className="w-full flex justify-center">
                    <LoginForm locale={locale} />
                </div>
            </main>
        </div>

    );
}
