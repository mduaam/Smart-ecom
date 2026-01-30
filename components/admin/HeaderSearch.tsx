'use client';

import { Search } from 'lucide-react';
import { useEffect } from 'react';

export default function HeaderSearch() {
    return (
        <button
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors text-sm w-64 group"
            onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }}
            type="button"
        >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <span className="ml-auto text-xs text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-1.5 rounded bg-white dark:bg-zinc-800 font-medium group-hover:border-zinc-400">⌘K</span>
        </button>
    );
}
