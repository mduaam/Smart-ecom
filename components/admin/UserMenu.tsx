'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { adminLogout } from '@/app/actions/auth';

interface UserMenuProps {
    user?: {
        email?: string;
        user_metadata?: {
            full_name?: string;
        };
    } | null;
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await adminLogout();
    };

    const initial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A';
    const name = user?.user_metadata?.full_name || 'Admin User';
    const email = user?.email || '';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20 uppercase">
                    {initial}
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm font-bold dark:text-white truncate">{name}</p>
                        <p className="text-xs text-zinc-500 truncate">{email}</p>
                    </div>
                    <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left">
                            <User className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
