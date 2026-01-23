export const page = {
    name: 'page',
    title: 'Pages',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Page Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'seo',
            title: 'SEO Overrides',
            type: 'object',
            fields: [
                { name: 'title', title: 'Title Override', type: 'string' },
                { name: 'description', title: 'Description Override', type: 'text' },
            ]
        },
        {
            name: 'content',
            title: 'Page Content (Sections)',
            type: 'array',
            of: [
                { type: 'heroSection' },
                { type: 'featuresSection' },
                { type: 'pricingSection' },
                { type: 'faqSection' },
                { type: 'contentSection' },
            ]
        }
    ]
}

// Section Objects
export const heroSection = {
    name: 'heroSection',
    title: 'Hero Section',
    type: 'object',
    fields: [
        {
            name: 'badge',
            title: 'Badge Text',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        },
        {
            name: 'title',
            title: 'Main Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        },
        {
            name: 'titleHighlight',
            title: 'Title Highlight',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        },
        {
            name: 'description',
            title: 'Description',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'es', title: 'Spanish', type: 'text' },
                { name: 'fr', title: 'French', type: 'text' },
                { name: 'nl', title: 'Dutch', type: 'text' },
            ]
        },
        {
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        },
        { name: 'ctaLink', title: 'CTA Button Link', type: 'string' },
    ]
}

export const featuresSection = {
    name: 'featuresSection',
    title: 'Features Section',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Section Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        },
        {
            name: 'features',
            title: 'Features List',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Feature Title',
                            type: 'object',
                            fields: [
                                { name: 'en', title: 'English', type: 'string' },
                                { name: 'es', title: 'Spanish', type: 'string' },
                                { name: 'fr', title: 'French', type: 'string' },
                                { name: 'nl', title: 'Dutch', type: 'string' },
                            ]
                        },
                        {
                            name: 'description',
                            title: 'Feature Description',
                            type: 'object',
                            fields: [
                                { name: 'en', title: 'English', type: 'text' },
                                { name: 'es', title: 'Spanish', type: 'text' },
                                { name: 'fr', title: 'French', type: 'text' },
                                { name: 'nl', title: 'Dutch', type: 'text' },
                            ]
                        },
                        { name: 'icon', title: 'Icon (lucide name)', type: 'string' }
                    ]
                }
            ]
        }
    ]
}

export const pricingSection = {
    name: 'pricingSection',
    title: 'Pricing Section',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Section Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        }
    ]
}

export const faqSection = {
    name: 'faqSection',
    title: 'FAQ Section',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Section Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ]
        }
    ]
}

export const contentSection = {
    name: 'contentSection',
    title: 'Content Section (Rich Text)',
    type: 'object',
    fields: [
        {
            name: 'content',
            title: 'Content',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
                { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'block' }] },
                { name: 'fr', title: 'French', type: 'array', of: [{ type: 'block' }] },
                { name: 'nl', title: 'Dutch', type: 'array', of: [{ type: 'block' }] },
            ]
        }
    ]
}
