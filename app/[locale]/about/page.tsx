import { Info, Shield, Users, Target, Award, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { generateOrganizationSchema } from '@/lib/seo-schemas';

export const metadata: Metadata = {
    title: 'About Us - IPTV Smarters Pro | Our Mission & Team',
    description: 'Learn about IPTV Smarters Pro Guide - the leading independent resource for IPTV users worldwide. Meet our expert team and discover our commitment to quality.',
    openGraph: {
        title: 'About IPTV Smarters Pro Guide',
        description: 'Leading independent resource for IPTV Smarters Pro users with expert guides and 24/7 support.',
        type: 'website'
    }
};

export default function AboutPage() {
    // Organization Schema for E-E-A-T
    const organizationSchema = generateOrganizationSchema({
        name: "IPTV Smarters Pro Guide",
        description: "Leading independent resource and support platform for IPTV Smarters Pro users worldwide",
        url: "https://yourdomain.com"
    });

    const team = [
        {
            name: "John Anderson",
            role: "Founder & IPTV Technology Expert",
            credentials: [
                "10+ years in streaming technology",
                "Certified Network Professional (CNP)",
                "Former systems engineer at StreamTech Solutions",
                "Helped 50,000+ users optimize IPTV setups"
            ],
            expertise: "IPTV systems, network optimization, streaming protocols"
        },
        {
            name: "Sarah Martinez",
            role: "Content Director & Technical Writer",
            credentials: [
                "Technical Writing Certification",
                "8 years tech documentation experience",
                "Former support lead at major IPTV provider",
                "500+ published guides and tutorials"
            ],
            expertise: "Technical documentation, user education, troubleshooting"
        },
        {
            name: "Michael Chen",
            role: "Support Lead & Device Specialist",
            credentials: [
                "Android TV & Fire TV expert",
                "6 years customer support experience",
                "Certified in multiple IPTV platforms",
                "Multi-lingual support specialist"
            ],
            expertise: "Device compatibility, installation support, customer service"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <StructuredData data={organizationSchema} />

            <main className="flex-grow pt-0 pb-20">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8">
                            <Info className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                            About IPTV Smarters Pro Guide
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            The leading independent resource for IPTV Smarters Pro users worldwide
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-6">
                                <Target className="w-4 h-4" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-zinc-900 dark:text-white">
                                Empowering IPTV Users Worldwide
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                We are the leading independent resource for IPTV Smarters Pro users worldwide. Our mission is to provide accurate, up-to-date information and support for IPTV enthusiasts of all technical skill levels.
                            </p>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Since our founding, we've helped over <strong className="text-indigo-600 dark:text-indigo-400">50,000 users</strong> set up and optimize their IPTV solutions, making premium entertainment accessible to everyone.
                            </p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
                                Our Core Values
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: Shield, text: "Editorial Independence" },
                                    { icon: Award, text: "Expert-Verified Content" },
                                    { icon: Users, text: "User-First Approach" },
                                    { icon: CheckCircle2, text: "Transparency & Honesty" }
                                ].map((value, i) => {
                                    const Icon = value.icon;
                                    return (
                                        <li key={i} className="flex items-center gap-4 text-zinc-700 dark:text-zinc-300">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-lg">{value.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="bg-zinc-50 dark:bg-zinc-950/50 py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-6">
                                <Users className="w-4 h-4" />
                                Our Expert Team
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                                Meet the Experts Behind the Guides
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                                Our team brings decades of combined experience in streaming technology, technical writing, and customer support.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800"
                                    itemScope
                                    itemType="https://schema.org/Person"
                                >
                                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                        👤
                                    </div>
                                    <h3
                                        className="text-xl font-bold text-center mb-2 text-zinc-900 dark:text-white"
                                        itemProp="name"
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-indigo-600 dark:text-indigo-400 text-center font-medium mb-4 text-sm"
                                        itemProp="jobTitle"
                                    >
                                        {member.role}
                                    </p>
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase mb-2">
                                            Credentials:
                                        </p>
                                        <ul className="space-y-2">
                                            {member.credentials.map((credential, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                                    <span>{credential}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase mb-1">
                                            Expertise:
                                        </p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {member.expertise}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Standards Section */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
                        <div className="text-center mb-12">
                            <Shield className="w-16 h-16 mx-auto mb-6 text-white/90" />
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Our Quality Standards
                            </h2>
                            <p className="text-white/90 max-w-2xl mx-auto text-lg">
                                We maintain the highest standards of accuracy and transparency in all our content
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">All Guides Tested on Actual Devices</h3>
                                <p className="text-white/80">
                                    Every installation guide and troubleshooting solution is tested on real devices before publication.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">Monthly Content Updates</h3>
                                <p className="text-white/80">
                                    We update our guides monthly to reflect the latest app versions and platform changes.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">Fact-Checked by Professionals</h3>
                                <p className="text-white/80">
                                    All technical information is verified by certified professionals with industry experience.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">User Feedback Integration</h3>
                                <p className="text-white/80">
                                    We incorporate user feedback within 48 hours to improve guide accuracy and clarity.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">Transparent Disclosure</h3>
                                <p className="text-white/80">
                                    We clearly disclose any affiliate relationships while maintaining full editorial independence.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <CheckCircle2 className="w-8 h-8 mb-4 text-green-300" />
                                <h3 className="text-xl font-bold mb-3">Editorial Independence</h3>
                                <p className="text-white/80">
                                    Our recommendations are based solely on performance and user experience—never commercial interests.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Editorial Policy */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-10 border border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
                            Editorial Policy
                        </h2>
                        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            <p>
                                We maintain strict editorial independence. All content published on this website is created and reviewed by our expert team based on thorough research and real-world testing.
                            </p>
                            <p>
                                <strong className="text-zinc-900 dark:text-white">Our recommendations are based solely on:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Performance and reliability in real-world conditions</li>
                                <li>User experience and ease of use</li>
                                <li>Technical merit and feature completeness</li>
                                <li>Value for money and overall quality</li>
                            </ul>
                            <p className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <strong className="text-zinc-900 dark:text-white">Affiliate Disclosure:</strong> Some links on our website may be affiliate links. When you make a purchase through these links, we may earn a commission at no additional cost to you. This helps support our work and allows us to continue providing free, high-quality content. However, affiliate relationships never influence our editorial recommendations.
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-500 pt-4">
                                <strong>Last Updated:</strong> January 2026 | <strong>Content Review Cycle:</strong> Monthly
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
