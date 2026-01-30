
import fs from 'fs';
import path from 'path';
import { broadcastNotification } from '../lib/notification-service';

// Load .env.local manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            const value = values.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
    console.log('Loaded .env.local');
} catch (e) {
    console.warn('Could not load .env.local', e);
}

async function main() {
    console.log('--- Starting Notification Logic Test ---');

    // We can't easily mock the DB here without full setup, but broadcastNotification uses getAdminSupabase which should work if env vars are present.
    // It will fetch no users if DB is empty, but SHOULD still send to hardcoded emails.

    await broadcastNotification(
        ['admin'],
        'Test Notification Title',
        'This is a test message to verify email logic.',
        { link: '/test-link' }
    );

    console.log('--- Test Finished ---');
}

main().catch(err => console.error(err));
