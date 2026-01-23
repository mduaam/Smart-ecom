import { Package } from 'lucide-react';

export const product = {
    name: 'product',
    title: 'Product',
    type: 'document',
    icon: Package,
    fields: [
        {
            name: 'name',
            title: 'Product Name',
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
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'currency',
            title: 'Currency',
            type: 'string',
            initialValue: 'usd',
            options: {
                list: [
                    { title: 'USD', value: 'usd' },
                    { title: 'EUR', value: 'eur' },
                    { title: 'GBP', value: 'gbp' },
                ],
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
            name: 'image',
            title: 'Product Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'stripeProductId',
            title: 'Stripe Product ID',
            type: 'string',
        },
        {
            name: 'stock',
            title: 'Stock Availability',
            type: 'number',
            description: 'Leave empty if unlimited',
        },
        {
            name: 'variants',
            title: 'Variants',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Variant',
                    fields: [
                        { name: 'name', title: 'Variant Name', type: 'string', description: 'e.g. Size, Color' },
                        { name: 'value', title: 'Option Value', type: 'string', description: 'e.g. Red, XL' },
                        { name: 'sku', title: 'SKU', type: 'string' },
                        { name: 'price', title: 'Price', type: 'number' },
                        { name: 'stock', title: 'Stock', type: 'number' }
                    ]
                }
            ]
        }
    ],
}
