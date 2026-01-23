import { getPage } from '@/lib/sanity-utils';
import SectionRenderer from '@/components/SectionRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string[]; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    // Join slug array to string (e.g., ['support', 'guide'] -> 'support/guide')
    // Note: Sanity usually stores slugs as strings, but next.js catch-all gives array.
    // If your sanity slug is just 'about', then it's fine.
    // Ideally we match the full path.
    // For now let's assume specific pages are mapped.
    const pageSlug = slug[slug.length - 1]; // Use the last segment for now or join?
    // Let's assume we use the last segment for "slug" lookup in Sanity 
    // OR we should have a logic. 
    // Sanity `slug` field usually unique.

    const page = await getPage(pageSlug);

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.seo?.title || page.title,
        description: page.seo?.description,
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const pageSlug = slug[slug.length - 1];

    const page = await getPage(pageSlug);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            <main>
                <SectionRenderer sections={page.content || []} />
            </main>
        </div>
    );
}
