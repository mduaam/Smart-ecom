import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { routing } from '@/navigation';
import { getGuides } from '@/lib/sanity-utils';

export async function generateSitemaps() {
    return routing.locales.map((locale) => ({ id: locale }));
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iptvsmarters.pro';
    const locale = id; // The current sitemap's locale

    // 1. Static Routes (Generic, apply to all)
    const staticPaths = [
        '', // home
        '/plans',
        '/iptv/devices',
        '/iptv/regions',
        '/support',
        '/support/faq',
        '/support/guides',
        '/about',
        '/contact',
        '/features',
    ];

    // 2. Fetch Dynamic Content
    const plans = await client.fetch(`*[_type == "plan"] { "slug": slug.current, _updatedAt }`);
    const guides = await getGuides();

    // 3. Static Lists
    const devices = [
        'firestick', 'android-tv', 'samsung-smart-tv', 'lg-smart-tv',
        'ios', 'android-mobile', 'windows', 'macos', 'mag'
    ];

    const regions = [
        'france', 'spain', 'netherlands', 'uk', 'usa',
        'germany', 'belgium', 'italy', 'canada', 'australia'
    ];

    // --- Entry Generators ---
    // Helper to generate a single entry for the CURRENT locale, but with alternates for ALL locales
    const createEntry = (path: string, changeFreq: 'daily' | 'weekly' | 'monthly', priority: number, lastMod?: string) => {
        return {
            url: `${baseUrl}/${locale}${path}`,
            lastModified: lastMod || new Date().toISOString(),
            changeFrequency: changeFreq,
            priority: priority,
            alternates: {
                languages: Object.fromEntries(
                    routing.locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                ),
            },
        };
    };

    const staticEntries = staticPaths.map(path => createEntry(path, 'daily', 1.0));

    // Devices & Regions
    const deviceEntries = devices.map(d => createEntry(`/iptv/devices/${d}`, 'weekly', 0.9));
    const regionEntries = regions.map(r => createEntry(`/iptv/${r}`, 'weekly', 0.9));

    // Plans
    const planEntries = plans.map((plan: any) =>
        createEntry(`/plans/${plan.slug}`, 'weekly', 0.9, plan._updatedAt)
    );

    // Guides
    const guideEntries = guides.map((guide: any) =>
        createEntry(`/support/guides/${guide.slug.current}`, 'monthly', 0.7)
    );

    return [...staticEntries, ...planEntries, ...guideEntries, ...deviceEntries, ...regionEntries];
}


