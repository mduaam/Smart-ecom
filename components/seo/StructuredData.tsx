import React from 'react';

interface StructuredDataProps {
    data: object;
}

/**
 * StructuredData Component
 * 
 * Injects JSON-LD structured data into the page head for SEO and AI search visibility.
 * Supports multiple schema types: SoftwareApplication, FAQPage, HowTo, VideoObject, etc.
 * 
 * @example
 * <StructuredData data={{
 *   "@context": "https://schema.org",
 *   "@type": "SoftwareApplication",
 *   "name": "IPTV Smarters Pro"
 * }} />
 */
export default function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data, null, 2)
            }}
        />
    );
}
