import React from 'react';

interface DirectAnswerProps {
    answer: string;
    className?: string;
}

/**
 * DirectAnswer Component
 * 
 * Displays a prominent, AI-optimized answer chunk at the top of pages.
 * Designed to be extracted by AI search engines (ChatGPT, Perplexity, Google AI).
 * Should be 40-60 words and answer the primary page question directly.
 * 
 * @example
 * <DirectAnswer answer="IPTV Smarters Pro is a free IPTV player application..." />
 */
export default function DirectAnswer({ answer, className = '' }: DirectAnswerProps) {
    return (
        <div
            className={`direct-answer bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-8 ${className}`}
            itemScope
            itemType="https://schema.org/Answer"
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">
                        Quick Answer
                    </p>
                    <p
                        className="text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium"
                        itemProp="text"
                    >
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}
