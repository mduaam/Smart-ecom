import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
    name: 'default',
    title: 'Ecom Smarters IPTV',
    basePath: '/admin/cms',


    projectId: '79u0009g',
    dataset: 'production',



    plugins: [structureTool(), visionTool()],

    schema: {
        types: schemaTypes,
    },
})
