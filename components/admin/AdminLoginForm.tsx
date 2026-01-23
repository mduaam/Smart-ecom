'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/app/actions/auth';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const initialState = {
    error: '',
};

export default function AdminLoginForm() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return adminLogin(formData);
    }, initialState);

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-indigo-500/10 p-8 md:p-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-3">
                    Admin Portal
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Sign in to manage the platform
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="admin@example.com"
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white dark:placeholder-zinc-600"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                        Password
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all dark:text-white dark:placeholder-zinc-600"
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{state.error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
        </div>
    );
}
