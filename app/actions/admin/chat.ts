'use server';

import { getSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';
import { revalidatePath } from 'next/cache';

export async function getChatConvo(userId: string) {
    await assertAdmin();
    const supabase = await getSupabase();

    const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

    if (error) return { error: error.message };
    return { messages };
}

export async function getConversations() {
    await assertAdmin();
    const supabase = await getSupabase();

    // Fetch unique users who have messaged or been messaged
    // This is a simplified lookup
    const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('role', 'member');

    if (error) return { error: error.message };
    return { users };
}

export async function sendChatMessage(receiverId: string, message: string) {
    await assertAdmin();
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            sender_id: user?.id,
            receiver_id: receiverId,
            message
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, message: data };
}
