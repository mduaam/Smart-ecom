import { Mail, MessageSquare, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations('Footer'); // Fallback to footer translations for now or generic

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main className="flex-grow pt-0 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Contact Us</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            have questions or need assistance? We're here to help!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Email Us</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">For general inquiries</p>
                            <a href="mailto:support@iptvsmarters.pro" className="text-indigo-600 font-medium hover:underline">support@iptvsmarters.pro</a>
                        </div>

                        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Live Chat</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">For instant support</p>
                            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Start Chat</span>
                        </div>

                        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">WhatsApp</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">For quick messages</p>
                            <a href="#" className="text-indigo-600 font-medium hover:underline">+1 234 567 890</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
