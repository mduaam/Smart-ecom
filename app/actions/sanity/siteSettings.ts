'use server'

import { writeClient } from "@/lib/sanity"
import { revalidateTag } from "next/cache"

export interface SiteSettingsData {
    siteName: string
    seoTitle?: string
    seoDescription?: string
    // Add other fields as needed
}

export async function updateSiteSettings(data: SiteSettingsData) {
    try {
        // Fetch the existing document ID or use a singleton ID if you have one fixed
        // For singletons in Sanity, typically you query for it.
        // Assuming there is only one siteSettings document.
        const query = `*[_type == "siteSettings"][0]._id`
        const docId = await writeClient.fetch(query)

        if (!docId) {
            throw new Error("Site Settings document not found")
        }

        await writeClient
            .patch(docId)
            .set({
                siteName: data.siteName,
                seo: {
                    title: data.seoTitle,
                    description: data.seoDescription
                }
            })
            .commit()

        revalidateTag('siteSettings', 'default')

        return { success: true }
    } catch (error) {
        console.error("Failed to update site settings:", error)
        return { success: false, error: "Failed to update settings" }
    }
}
