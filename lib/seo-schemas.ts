/**
 * SEO Schema Generators
 * 
 * Helper functions to generate JSON-LD structured data schemas
 * for different page types and content.
 */

export interface SoftwareApplicationSchema {
    name: string;
    operatingSystems: string[];
    price: string;
    priceCurrency: string;
    ratingValue?: string;
    reviewCount?: string;
    description: string;
    version?: string;
    downloadUrl?: string;
    screenshot?: string;
    features?: string[];
}

export function generateSoftwareApplicationSchema(data: SoftwareApplicationSchema) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": data.name,
        "applicationCategory": "MultimediaApplication",
        "applicationSubCategory": "IPTV Player",
        "operatingSystem": data.operatingSystems,
        "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": data.priceCurrency,
            "availability": "https://schema.org/InStock"
        },
        ...(data.ratingValue && data.reviewCount && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": data.ratingValue,
                "reviewCount": data.reviewCount,
                "bestRating": "5",
                "worstRating": "1"
            }
        }),
        "description": data.description,
        ...(data.version && { "softwareVersion": data.version }),
        "datePublished": "2020-01-15",
        "author": {
            "@type": "Organization",
            "name": "IPTV Smarters"
        },
        ...(data.screenshot && { "screenshot": data.screenshot }),
        ...(data.downloadUrl && { "downloadUrl": data.downloadUrl }),
        ...(data.features && { "featureList": data.features })
    };
}

export interface FAQItem {
    question: string;
    answer: string;
}

export function generateFAQPageSchema(faqs: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export interface HowToStep {
    name: string;
    text: string;
    image?: string;
    url?: string;
}

export interface HowToSchema {
    name: string;
    description: string;
    image?: string;
    totalTime?: string; // ISO 8601 duration format (e.g., "PT5M" for 5 minutes)
    estimatedCost?: string;
    steps: HowToStep[];
    tools?: string[];
}

export function generateHowToSchema(data: HowToSchema) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": data.name,
        "description": data.description,
        ...(data.image && { "image": data.image }),
        ...(data.estimatedCost && {
            "estimatedCost": {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": data.estimatedCost
            }
        }),
        ...(data.totalTime && { "totalTime": data.totalTime }),
        ...(data.tools && {
            "tool": data.tools.map(tool => ({
                "@type": "HowToTool",
                "name": tool
            }))
        }),
        "step": data.steps.map((step, index) => ({
            "@type": "HowToStep",
            "name": step.name,
            "text": step.text,
            ...(step.image && { "image": step.image }),
            ...(step.url && { "url": step.url })
        }))
    };
}

export interface VideoObjectSchema {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string; // ISO 8601 format
    duration: string; // ISO 8601 duration format (e.g., "PT8M30S")
    contentUrl: string;
    embedUrl?: string;
}

export function generateVideoObjectSchema(data: VideoObjectSchema) {
    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": data.name,
        "description": data.description,
        "thumbnailUrl": data.thumbnailUrl,
        "uploadDate": data.uploadDate,
        "duration": data.duration,
        "contentUrl": data.contentUrl,
        ...(data.embedUrl && { "embedUrl": data.embedUrl }),
        "publisher": {
            "@type": "Organization",
            "name": "IPTV Smarters Pro Guide",
            "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
            }
        }
    };
}

export interface OrganizationSchema {
    name: string;
    description: string;
    url: string;
    logo?: string;
    email?: string;
    address?: {
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
    };
}

export function generateOrganizationSchema(data: OrganizationSchema) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": data.name,
        "description": data.description,
        "url": data.url,
        ...(data.logo && {
            "logo": {
                "@type": "ImageObject",
                "url": data.logo
            }
        }),
        ...(data.email && { "email": data.email }),
        ...(data.address && {
            "address": {
                "@type": "PostalAddress",
                ...data.address
            }
        })
    };
}
