import { ScrollText, Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Legal Disclaimer & Terms - IPTV Smarters Pro Guide',
    description: 'Legal information about IPTV Smarters Pro usage, copyright compliance, user responsibilities, and how to ensure legal IPTV use.',
    openGraph: {
        title: 'Legal Disclaimer - IPTV Smarters Pro',
        description: 'Important legal information about IPTV Smarters Pro and user responsibilities.',
        type: 'website'
    }
};

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">

            <main className="flex-grow pt-0 pb-20">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                            <ScrollText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Legal Disclaimer & IPTV Safety Information
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Important legal information about IPTV Smarters Pro usage and user responsibilities
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                    {/* About IPTV Smarters Pro Application */}
                    <section className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                    About IPTV Smarters Pro Application
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    IPTV Smarters Pro is a <strong>legal media player application</strong>. It is software designed to play video content from IPTV services. The application itself does not host, distribute, or provide any content, channels, or streaming services.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border-l-4 border-indigo-600">
                            <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                                IPTV Smarters Pro is similar to media players like VLC or MX Player. It's a tool that allows you to organize and view content from your IPTV subscription—it does not provide the content itself.
                            </p>
                        </div>
                    </section>

                    {/* User Responsibility */}
                    <section>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center shrink-0">
                                <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                                    User Responsibility
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                    Users are solely responsible for ensuring they have legal authorization to access any content they stream through IPTV Smarters Pro. This means:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-900/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            <h3 className="font-bold text-green-900 dark:text-green-300">
                                                Legal Use
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                                            <li>• Using licensed IPTV services</li>
                                            <li>• Providers with broadcasting rights</li>
                                            <li>• Legitimate subscriptions</li>
                                            <li>• Legal content streaming</li>
                                        </ul>
                                    </div>

                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-900/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                            <h3 className="font-bold text-red-900 dark:text-red-300">
                                                Illegal Use
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-red-800 dark:text-red-300">
                                            <li>• Unauthorized streaming</li>
                                            <li>• Pirated content</li>
                                            <li>• Copyright infringement</li>
                                            <li>• Unlicensed IPTV services</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How to Ensure Legal IPTV Use */}
                    <section className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-900/50">
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-6">
                            How to Ensure Legal IPTV Use
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3">
                                    1. Verify Your Provider Has Licenses
                                </h3>
                                <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                        <span>Ask for proof of broadcasting rights from content owners</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                        <span>Check if they're a registered business with verifiable credentials</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                        <span>Verify they have agreements with content owners and broadcasters</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-indigo-900/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3">
                                    2. Red Flags of Illegal Services
                                </h3>
                                <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <span>Extremely low prices for premium content (e.g., $10/month for thousands of channels)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <span>No official business registration or contact information</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <span>Unclear or evasive about licensing agreements</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <span>Offers "all channels worldwide" for minimal cost</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <span>Uses anonymous payment methods exclusively</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3">
                                    3. Recommended Legal IPTV Providers
                                </h3>
                                <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                        <span>Major telecom providers (Verizon FiOS, AT&T U-verse, etc.)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                        <span>Streaming services with live TV (YouTube TV, Hulu Live, Sling TV)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                        <span>Official broadcaster apps (BBC iPlayer, NBC Sports, ESPN+)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                        <span>Licensed sports streaming platforms (DAZN, fuboTV)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Our Commitment */}
                    <section className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                            Our Commitment to Legal Content
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            This website promotes only <strong>legal and ethical use</strong> of IPTV technology. We:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Do not promote or endorse illegal streaming services",
                                "Provide information about legal IPTV alternatives",
                                "Educate users about copyright law and digital rights",
                                "Encourage support for content creators through legitimate channels",
                                "Report copyright violations and piracy when discovered"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Copyright & DMCA */}
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                            Copyright & DMCA Compliance
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            We respect intellectual property rights. If you believe any content on this website infringes copyright, please contact us immediately at <a href="mailto:legal@yourdomain.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">legal@yourdomain.com</a> with:
                        </p>
                        <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400 ml-6 list-disc">
                            <li>Description of the copyrighted work</li>
                            <li>URL of the infringing content</li>
                            <li>Your contact information</li>
                            <li>Statement of good faith belief</li>
                        </ul>
                    </section>

                    {/* Disclaimer of Warranties */}
                    <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-900/50">
                        <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-300 mb-4">
                            Disclaimer of Warranties
                        </h2>
                        <p className="text-yellow-800 dark:text-yellow-200 leading-relaxed text-sm">
                            The information provided on this website is for educational and informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information. Any reliance you place on such information is strictly at your own risk. We are not responsible for the actions of users or the content provided by third-party IPTV services.
                        </p>
                    </section>

                    {/* Last Updated */}
                    <div className="text-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            <strong>Last Updated:</strong> January 1, 2026
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                            This disclaimer is subject to change. Please review periodically for updates.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
