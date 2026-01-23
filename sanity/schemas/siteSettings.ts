export const siteSettings = {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
        },
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'headerNavigation',
            title: 'Header Navigation',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'label',
                            title: 'Label',
                            type: 'object',
                            fields: [
                                { name: 'en', title: 'English', type: 'string' },
                                { name: 'es', title: 'Spanish', type: 'string' },
                                { name: 'fr', title: 'French', type: 'string' },
                                { name: 'nl', title: 'Dutch', type: 'string' },
                            ]
                        },
                        {
                            name: 'href',
                            title: 'Link (e.g. /plans or https://...)',
                            type: 'string',
                        }
                    ]
                }
            ]
        },
        {
            name: 'footer',
            title: 'Footer Settings',
            type: 'object',
            fields: [
                {
                    name: 'copyright',
                    title: 'Copyright Text',
                    type: 'object',
                    fields: [
                        { name: 'en', title: 'English', type: 'string' },
                        { name: 'es', title: 'Spanish', type: 'string' },
                        { name: 'fr', title: 'French', type: 'string' },
                        { name: 'nl', title: 'Dutch', type: 'string' },
                    ]
                },
                {
                    name: 'footerLinks',
                    title: 'Footer Links',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                {
                                    name: 'label',
                                    title: 'Label',
                                    type: 'object',
                                    fields: [
                                        { name: 'en', title: 'English', type: 'string' },
                                        { name: 'es', title: 'Spanish', type: 'string' },
                                        { name: 'fr', title: 'French', type: 'string' },
                                        { name: 'nl', title: 'Dutch', type: 'string' },
                                    ]
                                },
                                { name: 'href', title: 'Link', type: 'string' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'seo',
            title: 'Global SEO Defaults',
            type: 'object',
            fields: [
                { name: 'title', title: 'Default Title', type: 'string' },
                { name: 'description', title: 'Default Description', type: 'text' },
                { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
            ]
        }
    ]
}
