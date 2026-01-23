export const plan = {
    name: 'plan',
    title: 'Subscription Plan',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Plan Name',
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
            name: 'stripeProductId',
            title: 'Stripe Product ID',
            type: 'string',
        },
        {
            name: 'stripePriceId',
            title: 'Stripe Price ID',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'currency',
            title: 'Currency',
            type: 'string',
            options: {
                list: [
                    { title: 'USD', value: 'usd' },
                    { title: 'EUR', value: 'eur' },
                    { title: 'GBP', value: 'gbp' },
                ],
            },
        },
        {
            name: 'duration',
            title: 'Duration',
            type: 'string',
            options: {
                list: [
                    { title: '1 Month', value: '1-month' },
                    { title: '6 Months', value: '6-months' },
                    { title: '12 Months', value: '12-months' },
                ],
            },
        },
        {
            name: 'screens',
            title: 'Number of Screens',
            type: 'number',
            options: {
                list: [1, 2, 3, 4],
            },
            initialValue: 1,
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'en', title: 'English', type: 'string' },
                        { name: 'es', title: 'Spanish', type: 'string' },
                        { name: 'fr', title: 'French', type: 'string' },
                        { name: 'nl', title: 'Dutch', type: 'string' },
                    ],
                },
            ],
        },
        {
            name: 'isPopular',
            title: 'Mark as Popular',
            type: 'boolean',
            initialValue: false,
        },

    ],
    preview: {
        select: {
            title: 'name.en',
            price: 'price',
            currency: 'currency',
        },
        prepare(selection: any) {
            const { title, price, currency } = selection;
            return {
                title: typeof title === 'string' ? title : 'Untitled Plan',
                subtitle: typeof price === 'number' ? `${price} ${currency || ''}`.trim() : '',
            };
        },
    },
}
