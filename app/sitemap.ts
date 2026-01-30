import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { routing } from '@/navigation';
import { getGuides } from '@/lib/sanity-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iptvsmarters.pro';
    const locales = routing.locales;

    // 1. Static Routes
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

    // 2. Dynamic Content: Plans (Sanity)
    const plans = await client.fetch(`*[_type == "plan"] { "slug": slug.current, _updatedAt }`);

    // 3. Dynamic Content: Guides (Sanity)
    const guides = await getGuides();

    // 4. Static Lists (Devices & Regions)
    const devices = [
        'firestick', 'android-tv', 'samsung-smart-tv', 'lg-smart-tv',
        'ios', 'android-mobile', 'windows', 'macos', 'mag'
    ];

    const regions = [
        'france', 'spain', 'netherlands', 'uk', 'usa',
        'germany', 'belgium', 'italy', 'canada', 'australia'
    ];

    // --- Helpers ---
    const generateEntries = (paths: string[], changeFreq: 'daily' | 'weekly' | 'monthly' = 'daily', priority = 0.8) => {
        return paths.flatMap((path) => {
            return locales.map((locale) => ({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date().toISOString(),
                changeFrequency: changeFreq,
                priority: priority,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                    ),
                },
            }));
        });
    };

    const staticEntries = generateEntries(staticPaths, 'daily', 1.0);
    const deviceEntries = generateEntries(devices.map(d => `/iptv/devices/${d}`), 'weekly', 0.9);
    const regionEntries = generateEntries(regions.map(r => `/iptv/${r}`), 'weekly', 0.9);

    // Dynamic Sanity Entries
    const planEntries = plans.flatMap((plan: any) => {
        return locales.map((locale) => ({
            url: `${baseUrl}/${locale}/plans/${plan.slug}`,
            lastModified: plan._updatedAt || new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((l) => [l, `${baseUrl}/${l}/plans/${plan.slug}`])
                ),
            },
        }));
    });

    const guideEntries = guides.flatMap((guide: any) => {
        return locales.map((locale) => ({
            url: `${baseUrl}/${locale}/support/guides/${guide.slug.current}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((l) => [l, `${baseUrl}/${l}/support/guides/${guide.slug.current}`])
                ),
            },
        }));
    });

    return [...staticEntries, ...planEntries, ...guideEntries, ...deviceEntries, ...regionEntries];
}


