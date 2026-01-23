export const faq = {
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    fields: [
        {
            name: 'question',
            title: 'Question',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ],
        },
        {
            name: 'answer',
            title: 'Answer',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'text' },
                { name: 'es', title: 'Spanish', type: 'text' },
                { name: 'fr', title: 'French', type: 'text' },
                { name: 'nl', title: 'Dutch', type: 'text' },
            ],
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
        },
    ],
}
