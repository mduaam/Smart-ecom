import { MetadataRoute } from 'next';
import { routing } from '@/navigation';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smart-ecom12.netlify.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/account/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
