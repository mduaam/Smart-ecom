import ChatClient from './ChatClient';
import { MessageSquare } from 'lucide-react';


export const metadata = {
    title: 'Support Chat | Admin Dashboard',
    description: 'Real-time support chat for customers.'
};

export default function ChatPage() {
    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-indigo-600" />
                        Support Chat
                    </h1>
                    <p className="text-zinc-500 mt-2">Real-time messaging with your customers.</p>
                </div>
            </div>

            <ChatClient />
        </main>
    );
}
