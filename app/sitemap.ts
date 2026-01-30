import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { routing } from '@/navigation';
import { getGuides } from '@/lib/sanity-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smart-ecom12.netlify.app';

    // 1. Fetch Dynamic Content (Once for all locales)
    const plans = await client.fetch(`*[_type == "plan"] { "slug": slug.current, _updatedAt }`);
    const guides = await getGuides();

    // 2. Static Lists
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

    const devices = [
        'firestick', 'android-tv', 'samsung-smart-tv', 'lg-smart-tv',
        'ios', 'android-mobile', 'windows', 'macos', 'mag'
    ];

    const regions = [
        'france', 'spain', 'netherlands', 'uk', 'usa',
        'germany', 'belgium', 'italy', 'canada', 'australia'
    ];

    let allEntries: MetadataRoute.Sitemap = [];

    // 3. Generate entries for EACH locale
    for (const locale of routing.locales) {

        // Helper to generate a single entry with alternates
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
        const deviceEntries = devices.map(d => createEntry(`/iptv/devices/${d}`, 'weekly', 0.9));
        const regionEntries = regions.map(r => createEntry(`/iptv/${r}`, 'weekly', 0.9));

        const planEntries = plans.map((plan: any) =>
            createEntry(`/plans/${plan.slug}`, 'weekly', 0.9, plan._updatedAt)
        );

        const guideEntries = guides.map((guide: any) =>
            createEntry(`/support/guides/${guide.slug.current}`, 'monthly', 0.7)
        );

        allEntries = [
            ...allEntries,
            ...staticEntries,
            ...planEntries,
            ...guideEntries,
            ...deviceEntries,
            ...regionEntries
        ];
    }

    return allEntries;
}


