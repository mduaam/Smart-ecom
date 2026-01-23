export const guide = {
    name: 'guide',
    title: 'Installation Guide',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
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
                source: 'title.en',
                maxLength: 96,
            },
        },
        {
            name: 'device',
            title: 'Device Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Amazon Firestick', value: 'firestick' },
                    { title: 'Android TV', value: 'android-tv' },
                    { title: 'Android Mobile', value: 'android-mobile' },
                    { title: 'iOS (iPhone/iPad)', value: 'ios' },
                    { title: 'Smart TV (Samsung/LG)', value: 'smart-tv' },
                    { title: 'MAG Box', value: 'mag' },
                    { title: 'Windows PC', value: 'windows' },
                    { title: 'macOS', value: 'macos' },
                ],
            },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        },
        {
            name: 'steps',
            title: 'Installation Steps',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'stepNumber',
                            title: 'Step Number',
                            type: 'number',
                        },
                        {
                            name: 'title',
                            title: 'Step Title',
                            type: 'object',
                            fields: [
                                { name: 'en', title: 'English', type: 'string' },
                                { name: 'es', title: 'Spanish', type: 'string' },
                                { name: 'fr', title: 'French', type: 'string' },
                                { name: 'nl', title: 'Dutch', type: 'string' },
                            ],
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
                            title: 'Screenshot',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: 'videoUrl',
            title: 'Video Tutorial URL',
            type: 'url',
        },
        {
            name: 'difficulty',
            title: 'Difficulty Level',
            type: 'string',
            options: {
                list: [
                    { title: 'Easy', value: 'easy' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Hard', value: 'hard' },
                ],
            },
        },
        {
            name: 'estimatedTime',
            title: 'Estimated Time (minutes)',
            type: 'number',
        },
    ],
}
