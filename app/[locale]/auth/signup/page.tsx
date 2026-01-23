import Navbar from '@/components/Navbar';
import SignupForm from '@/components/auth/SignupForm';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });

    return {
        title: t('signupTitle'),
        description: t('signupDesc')
    };
}

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <Navbar />

            <div className="min-h-screen flex flex-col lg:flex-row pt-20">
                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <SignupForm locale={locale} />
                </div>

                {/* Banner Section */}
                <div className="hidden lg:flex flex-1 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614064641938-3bcee52942c9?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 text-white max-w-lg">
                        <h2 className="text-5xl font-bold mb-6">Join Smarters Pro Today</h2>
                        <ul className="space-y-4 text-xl text-indigo-100">
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-white/20 rounded-full">✓</span>
                                Instant Activation
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-white/20 rounded-full">✓</span>
                                Access to 15,000+ Channels
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="p-1 bg-white/20 rounded-full">✓</span>
                                24/7 Premium Support
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
