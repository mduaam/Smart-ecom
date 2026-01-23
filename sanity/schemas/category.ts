export const category = {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Category Name',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'nl', title: 'Dutch', type: 'string' },
            ],
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name.en',
                maxLength: 96,
            },
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
            ],
        },
        {
            name: 'icon',
            title: 'Icon Name (Lucide)',
            type: 'string',
            description: 'Enter the Lucide icon name (e.g., "Smartphone", "Tv", "Monitor")',
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
        },
    ],
}
