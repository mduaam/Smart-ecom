'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
            <div className="p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl text-center max-w-md">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    {error.message || 'An unexpected error occurred.'}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
