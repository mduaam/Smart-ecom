
'use server';

import { Resend } from 'resend';
import { assertAdmin } from '../auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendIPTVCredentials(data: {
    to: string;
    customerName: string;
    planName: string;
    username: string;
    password: string;
    portalUrl: string;
    m3uLink: string;
}) {
    await assertAdmin();

    try {
        const { error } = await resend.emails.send({
            from: 'IPTV Smarters <support@votre-domaine.com>', // MUST BE UPDATED BY USER TO VERIFIED DOMAIN
            to: data.to,
            subject: `Your IPTV Credentials for ${data.planName}`,
            html: `
                <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 32px;">
                    <div style="background-color: #ffffff; padding: 48px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <div style="display: inline-block; padding: 12px; bg-color: #f1f5f9; border-radius: 16px;">
                                <span style="font-size: 24px; font-weight: 900; color: #6366f1; letter-spacing: -1px;">IPTV SMARTERS</span>
                            </div>
                        </div>

                        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.025em; text-align: center;">Welcome, ${data.customerName}!</h2>
                        <p style="color: #64748b; font-size: 16px; margin: 0 0 32px 0; text-align: center;">Your line for ${data.planName} is now active. Use the credentials below to connect.</p>

                        <div style="background-color: #f1f5f9; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                            <div style="margin-bottom: 24px;">
                                <p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Username</p>
                                <p style="font-family: monospace; font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${data.username}</p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Password</p>
                                <p style="font-family: monospace; font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${data.password}</p>
                            </div>
                            <div style="margin-bottom: 24px;">
                                <p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Portal URL</p>
                                <p style="font-family: monospace; font-size: 14px; font-weight: 600; color: #6366f1; margin: 0;">${data.portalUrl}</p>
                            </div>
                        </div>

                        <a href="${data.m3uLink}" style="display: block; background-color: #6366f1; color: #ffffff; padding: 16px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; text-align: center; margin-bottom: 32px;">DOWNLOAD M3U PLAYLIST</a>

                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
                            If you have any questions, please contact our support team. <br/>
                            Thank you for choosing IPTV Smarters.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error('[Email Action] Resend Error:', err.message);
        return { error: err.message };
    }
}
