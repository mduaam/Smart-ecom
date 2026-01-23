import { Sparkles } from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main className="flex-grow pt-0 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Premium Features</h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
                        Discover what makes our service unique.
                    </p>

                    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Detailed features breakdown coming soon...
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
