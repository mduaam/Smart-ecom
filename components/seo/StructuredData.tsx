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
                __html: JSON.stringify([
                    data,
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "IPTV Smarters Pro",
                        "url": "https://iptvsmarters.pro",
                        "logo": "https://iptvsmarters.pro/images/logo.png", // Ensure this exists or use a valid path
                        "sameAs": [
                            "https://twitter.com/iptvsmarters",
                            "https://facebook.com/iptvsmarters",
                            "https://instagram.com/iptvsmarters"
                        ],
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+1-555-0123-456", // Replace with real or support number/email
                            "contactType": "customer service",
                            "areaServed": "US",
                            "availableLanguage": ["English", "Spanish", "French"]
                        }
                    }
                ], null, 2)
            }}
        />

    );
}
