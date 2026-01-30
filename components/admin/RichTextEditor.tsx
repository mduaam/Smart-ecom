'use client';

import { useState, useRef } from 'react';
import {
    Bold, Italic, List, Link as LinkIcon,
    Type, AlignLeft, AlignCenter, AlignRight,
    Braces, Copy
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string, endTag: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + tag + selection + endTag + after;

        onChange(newText);

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + tag.length; // + (selection ? selection.length : 0);
            textarea.setSelectionRange(newCursorPos, newCursorPos + selection.length);
        }, 0);
    };

    const insertVariable = (variable: string) => {
        insertTag(variable);
    };

    return (
        <div className={`flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 transition-all focus-within:ring-2 focus-within:ring-indigo-600 ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-0.5 pr-2 border-r border-zinc-200 dark:border-zinc-800 mr-2">
                    <ToolbarButton icon={<Bold size={14} />} onClick={() => insertTag('<b>', '</b>')} tooltip="Bold" />
                    <ToolbarButton icon={<Italic size={14} />} onClick={() => insertTag('<i>', '</i>')} tooltip="Italic" />
                </div>

                <div className="flex items-center gap-0.5 pr-2 border-r border-zinc-200 dark:border-zinc-800 mr-2">
                    <ToolbarButton icon={<AlignLeft size={14} />} onClick={() => insertTag('<div style="text-align: left;">', '</div>')} tooltip="Align Left" />
                    <ToolbarButton icon={<AlignCenter size={14} />} onClick={() => insertTag('<div style="text-align: center;">', '</div>')} tooltip="Align Center" />
                </div>

                <div className="flex items-center gap-0.5 pr-2 border-r border-zinc-200 dark:border-zinc-800 mr-2">
                    <ToolbarButton icon={<List size={14} />} onClick={() => insertTag('<ul>\n<li>', '</li>\n</ul>')} tooltip="Bullet List" />
                    <ToolbarButton icon={<LinkIcon size={14} />} onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) insertTag(`<a href="${url}">`, '</a>');
                    }} tooltip="Link" />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Variables:</span>
                    <button
                        type="button"
                        onClick={() => insertVariable('{{name}}')}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
                    >
                        <span>Name</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertVariable('{{email}}')}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
                    >
                        <span>Email</span>
                    </button>
                </div>
            </div>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 w-full p-6 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none min-h-[400px]"
                spellCheck={false}
            />
        </div>
    );
}

function ToolbarButton({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={tooltip}
            className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
            {icon}
        </button>
    );
}
