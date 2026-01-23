import { client } from './sanity'

export interface LocalizedString {
    en: string
    es: string
    fr: string
    nl: string
}

export interface Category {
    _id: string
    name: LocalizedString
    slug: { current: string }
    description: LocalizedString
    icon: string
    order: number
}

export interface Guide {
    _id: string
    title: LocalizedString
    slug: { current: string }
    device: string
    category: {
        _ref: string
        name?: LocalizedString
    }
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedTime: number
}

export interface GuideDetail extends Guide {
    steps?: Array<{
        stepNumber: number
        title: LocalizedString
        description: LocalizedString
        image?: any
    }>
    videoUrl?: string
}

export interface FAQ {
    _id: string
    question: LocalizedString
    answer: LocalizedString
    category: {
        _ref: string
    }
    order: number
}

export async function getCategories(): Promise<Category[]> {
    const query = `*[_type == "category"] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon,
    order
  }`

    try {
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function getGuides(): Promise<Guide[]> {
    const query = `*[_type == "guide"] | order(device asc, title.en asc) {
    _id,
    title,
    slug,
    device,
    category->{
      _id,
      name
    },
    difficulty,
    estimatedTime
  }`

    try {
        const data = await client.fetch(query)
        if (data && data.length > 0) return data;

        // Return fallback data if Sanity is empty
        return fallbackGuides;
    } catch (error) {
        console.error('Error fetching guides:', error)
        return fallbackGuides;
    }
}

// Fallback Data
const fallbackGuides: Guide[] = [
    {
        _id: 'guide-firestick',
        title: { en: 'Install IPTV Smarters Pro on Firestick', es: 'Instalar IPTV Smarters Pro en Firestick', fr: 'Installer IPTV Smarters Pro sur Firestick', nl: 'Installeer IPTV Smarters Pro op Firestick' },
        slug: { current: 'install-iptv-smarters-pro-on-firestick' },
        device: 'firestick',
        category: { _ref: 'cat-install' },
        difficulty: 'medium',
        estimatedTime: 10
    },
    {
        _id: 'guide-android-tv',
        title: { en: 'Install IPTV Smarters Pro on Android TV', es: 'Instalar IPTV Smarters Pro en Android TV', fr: 'Installer IPTV Smarters Pro sur Android TV', nl: 'Installeer IPTV Smarters Pro op Android TV' },
        slug: { current: 'install-iptv-smarters-pro-on-android-tv' },
        device: 'android-tv',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 5
    },
    {
        _id: 'guide-samsung',
        title: { en: 'Install IPTV Smarters Pro on Samsung Smart TV', es: 'Instalar IPTV Smarters Pro en Samsung Smart TV', fr: 'Installer IPTV Smarters Pro sur Samsung Smart TV', nl: 'Installeer IPTV Smarters Pro op Samsung Smart TV' },
        slug: { current: 'install-iptv-smarters-pro-on-samsung-smart-tv' },
        device: 'smart-tv',
        category: { _ref: 'cat-install' },
        difficulty: 'medium',
        estimatedTime: 15
    },
    {
        _id: 'guide-ios',
        title: { en: 'Install IPTV Smarters Pro on iOS (iPhone/iPad)', es: 'Instalar IPTV Smarters Pro en iOS (iPhone/iPad)', fr: 'Installer IPTV Smarters Pro sur iOS (iPhone/iPad)', nl: 'Installeer IPTV Smarters Pro op iOS (iPhone/iPad)' },
        slug: { current: 'install-iptv-smarters-pro-on-ios-iphone-ipad' },
        device: 'ios',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 3
    },
    {
        _id: 'guide-windows',
        title: { en: 'Install IPTV Smarters Pro on Windows PC', es: 'Instalar IPTV Smarters Pro en PC Windows', fr: 'Installer IPTV Smarters Pro sur PC Windows', nl: 'Installeer IPTV Smarters Pro op Windows PC' },
        slug: { current: 'install-iptv-smarters-pro-on-windows' },
        device: 'windows',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 5
    }
];

export async function getGuideBySlug(slug: string): Promise<GuideDetail | null> {
    const query = `*[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    device,
    category->{
      _id,
      name
    },
    steps,
    videoUrl,
    difficulty,
    estimatedTime
  }`

    try {
        const data = await client.fetch(query, { slug })
        if (data) return data;

        // Return fallback detail
        return fallbackGuideDetails[slug] || null;
    } catch (error) {
        console.error('Error fetching guide:', error)
        return fallbackGuideDetails[slug] || null;
    }
}

const fallbackGuideDetails: Record<string, GuideDetail> = {
    'install-iptv-smarters-pro-on-firestick': {
        _id: 'guide-firestick',
        title: { en: 'Install IPTV Smarters Pro on Firestick', es: 'Instalar IPTV Smarters Pro en Firestick', fr: 'Installer IPTV Smarters Pro sur Firestick', nl: 'Installeer IPTV Smarters Pro op Firestick' },
        slug: { current: 'install-iptv-smarters-pro-on-firestick' },
        device: 'firestick',
        category: { _ref: 'cat-install' },
        difficulty: 'medium',
        estimatedTime: 10,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Install Downloader App', es: 'Instalar App Downloader', fr: 'Installer l\'application Downloader', nl: 'Installeer Downloader App' },
                description: {
                    en: 'Go to the Amazon App Store on your Firestick, search for "Downloader", and install it.',
                    es: 'Vaya a la Amazon App Store, busque "Downloader" e instálelo.',
                    fr: 'Allez sur l\'Amazon App Store, cherchez "Downloader" et installez-le.',
                    nl: 'Ga naar de Amazon App Store, zoek naar "Downloader" en installeer het.'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Enable Developer Options', es: 'Habilitar Opciones de Desarrollador', fr: 'Activer les options développeur', nl: 'Ontwikkelaarsopties inschakelen' },
                description: {
                    en: 'Go to Settings > My Fire TV > About. Click on "Fire TV Stick" 7 times until it says you are a developer.',
                    es: 'Vaya a Configuración > Mi Fire TV > Acerca de. Haga clic 7 veces en "Fire TV Stick".',
                    fr: 'Allez dans Paramètres > Ma Fire TV > À propos. Cliquez 7 fois sur "Fire TV Stick".',
                    nl: 'Ga naar Instellingen > Mijn Fire TV > Info. Klik 7 keer op "Fire TV Stick".'
                }
            },
            {
                stepNumber: 3,
                title: { en: 'Enter Download Code', es: 'Ingresar Código', fr: 'Entrer le code', nl: 'Voer downloadcode in' },
                description: {
                    en: 'Open Downloader and enter the code: 78522 (or use URL: https://www.iptvsmarters.com/smarters.apk).',
                    es: 'Abra Downloader e ingrese el código: 78522.',
                    fr: 'Ouvrez Downloader et entrez le code : 78522.',
                    nl: 'Open Downloader en voer de code in: 78522.'
                }
            }
        ]
    },
    'install-iptv-smarters-pro-on-android-tv': {
        _id: 'guide-android-tv',
        title: { en: 'Install IPTV Smarters Pro on Android TV', es: 'Instalar IPTV Smarters Pro en Android TV', fr: 'Installer IPTV Smarters Pro sur Android TV', nl: 'Installeer IPTV Smarters Pro op Android TV' },
        slug: { current: 'install-iptv-smarters-pro-on-android-tv' },
        device: 'android-tv',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 5,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Open Google Chrome', es: 'Abrir Google Chrome', fr: 'Ouvrir Google Chrome', nl: 'Open Google Chrome' },
                description: {
                    en: 'Open the Chrome browser on your Android TV box.',
                    es: 'Abra el navegador Chrome en su Android TV.',
                    fr: 'Ouvrez le navigateur Chrome sur votre Android TV.',
                    nl: 'Open de Chrome-browser op je Android TV.'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Download APK', es: 'Descargar APK', fr: 'Télécharger APK', nl: 'APK Downloaden' },
                description: {
                    en: 'Enter the URL: https://www.iptvsmarters.com/smarters.apk and download the file.',
                    es: 'Ingrese la URL: https://www.iptvsmarters.com/smarters.apk y descargue.',
                    fr: 'Entrez l\'URL : https://www.iptvsmarters.com/smarters.apk et téléchargez.',
                    nl: 'Voer de URL in: https://www.iptvsmarters.com/smarters.apk en download.'
                }
            }
        ]
    },
    'install-iptv-smarters-pro-on-samsung-smart-tv': {
        _id: 'guide-samsung',
        title: { en: 'Install IPTV Smarters Pro on Samsung Smart TV', es: 'Instalar IPTV Smarters Pro en Samsung Smart TV', fr: 'Installer IPTV Smarters Pro sur Samsung Smart TV', nl: 'Installeer IPTV Smarters Pro op Samsung Smart TV' },
        slug: { current: 'install-iptv-smarters-pro-on-samsung-smart-tv' },
        device: 'smart-tv',
        category: { _ref: 'cat-install' },
        difficulty: 'medium',
        estimatedTime: 15,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Go to App Store', es: 'Ir a App Store', fr: 'Aller sur App Store', nl: 'Ga naar App Store' },
                description: {
                    en: 'Press the Smart Hub button on your remote.',
                    es: 'Presione el botón Smart Hub en su control remoto.',
                    fr: 'Appuyez sur le bouton Smart Hub de votre télécommande.',
                    nl: 'Druk op de Smart Hub-knop op je afstandsbediening.'
                }
            }
        ]
    },
    'install-iptv-smarters-pro-on-ios-iphone-ipad': {
        _id: 'guide-ios',
        title: { en: 'Install IPTV Smarters Pro on iOS (iPhone/iPad)', es: 'Instalar IPTV Smarters Pro en iOS (iPhone/iPad)', fr: 'Installer IPTV Smarters Pro sur iOS (iPhone/iPad)', nl: 'Installeer IPTV Smarters Pro op iOS (iPhone/iPad)' },
        slug: { current: 'install-iptv-smarters-pro-on-ios-iphone-ipad' },
        device: 'ios',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 3,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'App Store', es: 'App Store', fr: 'App Store', nl: 'App Store' },
                description: {
                    en: 'Open the Apple App Store and search for "Smarters Player Lite".',
                    es: 'Abra la App Store de Apple y busque "Smarters Player Lite".',
                    fr: 'Ouvrez l\'App Store d\'Apple et recherchez "Smarters Player Lite".',
                    nl: 'Open de Apple App Store en zoek naar "Smarters Player Lite".'
                }
            }
        ]
    },
    'install-iptv-smarters-pro-on-windows': {
        _id: 'guide-windows',
        title: { en: 'Install IPTV Smarters Pro on Windows PC', es: 'Instalar IPTV Smarters Pro en PC Windows', fr: 'Installer IPTV Smarters Pro sur PC Windows', nl: 'Installeer IPTV Smarters Pro op Windows PC' },
        slug: { current: 'install-iptv-smarters-pro-on-windows' },
        device: 'windows',
        category: { _ref: 'cat-install' },
        difficulty: 'easy',
        estimatedTime: 5,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Download App', es: 'Descargar App', fr: 'Télécharger App', nl: 'Download App' },
                description: {
                    en: 'Download the Windows installer from our website links.',
                    es: 'Descargue el instalador de Windows desde nuestros enlaces.',
                    fr: 'Téléchargez l\'installateur Windows depuis nos liens.',
                    nl: 'Download de Windows-installatie via onze links.'
                }
            }
        ]
    }
};

export async function getFAQs(): Promise<FAQ[]> {
    const query = `*[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`

    try {
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching FAQs:', error)
        return []
    }
}

// Helper function to get localized content
export function getLocalizedContent<T extends Record<string, any>>(
    content: T | null | undefined,
    locale: string
): string {
    if (!content) return ''
    if (typeof content === 'string') return content
    return content[locale as keyof T] || content.en || ''
}
// Search Function
export async function searchGuides(term: string, locale: string = 'en'): Promise<Guide[]> {
    if (!term) return [];

    // GROQ Query: Match title in current locale or English
    const query = `*[_type == "guide" && (
        title[$locale] match $term + "*" || 
        title.en match $term + "*" ||
        device match $term + "*"
    )] | order(title[$locale] asc) {
        _id,
        title,
        slug,
        device,
        category->{
            _id,
            name
        },
        difficulty,
        estimatedTime
    }`;

    try {
        const data = await client.fetch(query, { term, locale });
        return data || [];
    } catch (error) {
        console.error('Error searching guides:', error);

        // Fallback Client-Side Search (if Sanity fails or for fallback data)
        const lowerTerm = term.toLowerCase();
        return fallbackGuides.filter(g =>
            (g.title[locale as keyof LocalizedString] || g.title.en).toLowerCase().includes(lowerTerm) ||
            g.device.toLowerCase().includes(lowerTerm)
        );
    }
}

export interface SiteSettings {
    siteName: string
    logo?: any
    headerNavigation?: Array<{
        label: LocalizedString
        href: string
    }>
    footer?: {
        copyright: LocalizedString
        footerLinks: Array<{
            label: LocalizedString
            href: string
        }>
    }
    seo?: {
        title: string
        description: string
        keywords: string[]
    }
}

export interface PageContent {
    _type: string
    [key: string]: any
}

export interface Page {
    _id: string
    title: string
    slug: { current: string }
    seo?: {
        title?: string
        description?: string
    }
    content?: PageContent[]
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
    const query = `*[_type == "siteSettings"][0]`
    try {
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching site settings:', error)
        return null
    }
}

export async function getPage(slug: string): Promise<Page | null> {
    const query = `*[_type == "page" && slug.current == $slug][0] {
        ...,
        content[] {
            ...,
            _type == 'pricingSection' => {
                ...,
                plans[]->
            }
        }
    }`
    try {
        return await client.fetch(query, { slug })
    } catch (error) {
        console.error('Error fetching page:', error)
        return null
    }
}

export async function getAllPages(): Promise<Page[]> {
    const query = `*[_type == "page"] { slug }`
    try {
        return await client.fetch(query)
    } catch (error) {
        console.error('Error fetching all pages:', error)
        return []
    }
}
