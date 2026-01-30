'use server';

import { Resend } from 'resend';
import { assertSuperAdmin } from '../auth';
import { getSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getRecipientCount(filter: any) {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();

        let query = supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'user');

        if (filter.status === 'paid') {
            const { data: paidUsers } = await supabase.from('orders').select('user_id').eq('status', 'paid');
            const ids = Array.from(new Set(paidUsers?.map(o => o.user_id).filter(Boolean)));
            if (ids.length === 0) return { count: 0 };
            query = query.in('id', ids);
        } else if (filter.status === 'active_sub') {
            const { data: activeUsers } = await supabase.from('subscriptions').select('user_id').eq('status', 'active');
            const ids = Array.from(new Set(activeUsers?.map(s => s.user_id).filter(Boolean)));
            if (ids.length === 0) return { count: 0 };
            query = query.in('id', ids);
        }

        const { count, error } = await query;
        if (error) throw error;
        return { count: count || 0 };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getCampaigns() {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();
        const { data, error } = await supabase
            .from('email_campaigns')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function saveCampaign(id: string | null, data: any) {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        const payload = {
            ...data,
            created_by: user?.id,
            updated_at: new Date().toISOString()
        };

        let result;
        if (id) {
            result = await supabase.from('email_campaigns').update(payload).eq('id', id).select().single();
        } else {
            result = await supabase.from('email_campaigns').insert(payload).select().single();
        }

        if (result.error) throw result.error;
        revalidatePath('/admin/marketing');
        return { success: true, data: result.data };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteCampaign(id: string) {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();
        const { error } = await supabase.from('email_campaigns').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getTemplates() {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();
        const { data, error } = await supabase.from('email_templates').select('*');
        if (error) throw error;
        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function saveTemplate(id: string | null, data: any) {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();

        let result;
        if (id) {
            result = await supabase.from('email_templates').update(data).eq('id', id).select().single();
        } else {
            result = await supabase.from('email_templates').insert(data).select().single();
        }

        if (result.error) throw result.error;
        revalidatePath('/admin/marketing');
        return { success: true, data: result.data };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteTemplate(id: string) {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();
        const { error } = await supabase.from('email_templates').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function sendBroadcastEmail(subject: string, content: string, filter: 'all' | 'paid' | 'active_sub' = 'all') {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();

        // 1. Fetch Recipients
        let query = supabase.from('profiles').select('email, full_name').eq('role', 'user');

        if (filter === 'paid') {
            const { data: paidUsers } = await supabase.from('orders').select('user_id').eq('status', 'paid');
            const ids = Array.from(new Set(paidUsers?.map(o => o.user_id).filter(Boolean)));
            if (ids.length === 0) return { error: 'No recipients found' };
            query = query.in('id', ids);
        } else if (filter === 'active_sub') {
            const { data: activeUsers } = await supabase.from('subscriptions').select('user_id').eq('status', 'active');
            const ids = Array.from(new Set(activeUsers?.map(s => s.user_id).filter(Boolean)));
            if (ids.length === 0) return { error: 'No recipients found' };
            query = query.in('id', ids);
        }

        const { data: recipients, error } = await query;
        if (error) throw error;
        if (!recipients || recipients.length === 0) return { error: 'No recipients found' };

        // 2. Personalization & Sending
        const batchSize = 50; // Resend batch limit is often 100, playing safe with 50
        const batches = [];

        // Chunk recipients
        for (let i = 0; i < recipients.length; i += batchSize) {
            batches.push(recipients.slice(i, i + batchSize));
        }

        let sentCount = 0;

        for (const batch of batches) {
            // Map each user to a personalized email object
            const emailBatch = batch.map((user) => {
                const personalizedContent = content
                    .replace(/{{name}}/g, user.full_name || 'Customer')
                    .replace(/{{email}}/g, user.email || '');

                const personalizedSubject = subject
                    .replace(/{{name}}/g, user.full_name || 'Customer');

                return {
                    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                    to: user.email,
                    subject: personalizedSubject,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            ${personalizedContent}
                            <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
                            <p style="font-size: 12px; color: #999; text-align: center;">
                                You received this because you are a customer of IPTV Smarters.
                            </p>
                        </div>
                    `
                };
            });

            // Send batch
            const { error: batchError } = await resend.batch.send(emailBatch);
            if (!batchError) {
                sentCount += batch.length;
            } else {
                console.error('Batch send error:', batchError);
                // Continue to next batch even if one fails
            }
        }

        return { success: true, count: sentCount };

    } catch (err: any) {
        console.error('[Marketing] Broadcast Error:', err.message);
        return { error: err.message };
    }
}

export async function sendTestEmail(subject: string, content: string, targetEmail: string) {
    try {
        await assertSuperAdmin();

        // Personalization mock for test
        const personalizedContent = content
            .replace(/{{name}}/g, 'Test Admin')
            .replace(/{{email}}/g, targetEmail);

        const personalizedSubject = `[TEST] ${subject.replace(/{{name}}/g, 'Test Admin')}`;

        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: targetEmail,
            subject: personalizedSubject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px dashed #ccc; background: #f9f9f9;">
                    <p style="text-align: center; color: #666; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 20px;">--- Test Email Preview ---</p>
                    ${personalizedContent}
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        This is a test email sent from the Admin Panel.
                    </p>
                </div>
            `
        });

        if (error) throw error;

        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getMarketingStats() {
    try {
        await assertSuperAdmin();
        const supabase = await getSupabase();

        // 1. Total Recipients (Role: user)
        const { count: totalRecipients } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'user');

        // 2. Emails Sent (this month - estimated from campaigns)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: monthlyCampaigns } = await supabase
            .from('email_campaigns')
            .select('recipients_count')
            .eq('status', 'sent')
            .gte('sent_at', startOfMonth.toISOString());

        const monthlySentCount = monthlyCampaigns?.reduce((acc, curr) => acc + (curr.recipients_count || 0), 0) || 0;

        return {
            totalRecipients: totalRecipients || 0,
            monthlySentCount
        };
    } catch (err: any) {
        return { error: err.message };
    }
}

