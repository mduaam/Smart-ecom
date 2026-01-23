'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions/user_orders';
import { Save } from 'lucide-react';
import { useEffect } from 'react';

const initialState = {
    message: '',
    error: undefined,
    success: false
};

export default function SettingsForm({
    displayName,
    email
}: {
    displayName: string,
    email: string
}) {
    // @ts-ignore - Generic type issue with server action signature matching
    const [state, formAction] = useActionState(updateProfile, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        defaultValue={displayName}
                        className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <input
                        type="email"
                        defaultValue={email}
                        readOnly
                        className="w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900/50 border-none rounded-2xl text-zinc-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-zinc-400">Email address cannot be changed</p>
                </div>
            </div>

            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {state?.success && (
                <p className="text-green-500 text-sm">Profile updated successfully!</p>
            )}

            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
            </button>
        </form>
    );
}
