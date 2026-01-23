import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { Check, Shield } from 'lucide-react';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import CheckoutForm from '@/components/CheckoutForm';
import { client } from '@/sanity/lib/client';

// Define Interface for Plan
// Define Interface for Plan
interface Plan {
    _id: string;
    name: { en: string;[key: string]: string };
    price: number;
    currency: string;
    duration: string;
    screens: number;
    description?: string; // If added later
    slug?: { current: string };
}

export default async function PlanDetails({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch plan from Sanity (Try by slug first, then ID backward compatibility if needed, but primary is slug)
    const plan = await client.fetch<Plan>(`*[_type == "plan" && slug.current == $slug][0]`, { slug });

    if (!plan) {
        notFound();
    }

    // Helper for display
    const planName = plan.name?.en || 'Unknown Plan';
    const planPrice = `${plan.currency === 'eur' ? '€' : '$'}${plan.price}`;

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                            Order Summary
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Complete your subscription for the {planName}</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
                        <div className="flex justify-between items-center pb-8 border-b border-zinc-200 dark:border-zinc-800 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{planName}</h2>
                                <p className="text-emerald-500 font-medium text-sm">Instant Delivery</p>
                            </div>
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {planPrice}
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {/* Dynamic Features could be added here if in Sanity, for now keep static verified features */}
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-5 h-5 text-indigo-600" />
                                <span>{plan.screens || 1} Device Connection{plan.screens > 1 ? 's' : ''}</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-5 h-5 text-indigo-600" />
                                <span>20,000+ Live Channels</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-5 h-5 text-indigo-600" />
                                <span>60,000+ VOD (Movies & Series)</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-5 h-5 text-indigo-600" />
                                <span>4K / Ultra HD Quality</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-5 h-5 text-indigo-600" />
                                <span>Anti-Freeze Technology</span>
                            </li>
                        </ul>

                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Billing Details</h3>
                            <CheckoutForm
                                planName={planName}
                                amount={plan.price}
                                planId={plan._id}
                            />
                        </div>
                    </div>


                    <div className="mt-8 text-center">
                        <Link href="/plans" className="text-zinc-500 hover:text-indigo-600 text-sm font-medium">
                            Change Plan
                        </Link>
                    </div>

                    <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12">
                        <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-8">
                            Customer Reviews
                        </h2>

                        <div className="mb-12">
                            <ReviewsList productId={plan._id} />
                        </div>

                        <div className="max-w-xl mx-auto">
                            <ReviewForm productId={plan._id} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
