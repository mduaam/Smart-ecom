
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN || 'sk...', // ensuring we have a token. Wait, I suspect the user might not have a write token in env yet for the script context if it's not in .env.local or if I don't pass it. 
    // Actually, I'll assume the user has the token in their environment or I might need to ask for it if it fails. 
    // BUT, for local development with `sanity login`, the CLI often handles auth. 
    // However, `createClient` needs a token for write operations unless we are in a studio context? No, for external scripts we need a token.
    // Let's check if there is a token in .env.local first? I saw .env.local in the file list earlier.
});

// I'll use the token from process.env if available. 
// If not, I might need to ask the user to provide one or check if I can use the CLI session? 
// The `sanity exec` command might be better? `npx sanity exec scripts/seed-sanity-guides.ts`? 
// That pre-configures the client? 
// Let's try to stick to standard node script with `dotenv`.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Re-initialize with potentially loaded env vars
const clientWithAuth = createClient({
    projectId: '79u0009g',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

const category = {
    _id: 'cat-install',
    _type: 'category',
    name: { en: 'Installation', es: 'Instalación', fr: 'Installation', nl: 'Installatie' },
    slug: { current: 'installation' },
    icon: 'download',
    order: 1
};

const guides = [
    {
        _id: 'guide-firestick',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Firestick', es: 'Instalar IPTV Smarters Pro en Firestick', fr: 'Installer IPTV Smarters Pro sur Firestick', nl: 'Installeer IPTV Smarters Pro op Firestick' },
        slug: { current: 'install-iptv-smarters-pro-on-firestick' },
        device: 'firestick',
        category: { _ref: 'cat-install', _type: 'reference' },
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
    {
        _id: 'guide-android-tv',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Android TV', es: 'Instalar IPTV Smarters Pro en Android TV', fr: 'Installer IPTV Smarters Pro sur Android TV', nl: 'Installeer IPTV Smarters Pro op Android TV' },
        slug: { current: 'install-iptv-smarters-pro-on-android-tv' },
        device: 'android-tv',
        category: { _ref: 'cat-install', _type: 'reference' },
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
    {
        _id: 'guide-samsung',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Samsung Smart TV', es: 'Instalar IPTV Smarters Pro en Samsung Smart TV', fr: 'Installer IPTV Smarters Pro sur Samsung Smart TV', nl: 'Installeer IPTV Smarters Pro op Samsung Smart TV' },
        slug: { current: 'install-iptv-smarters-pro-on-samsung-smart-tv' },
        device: 'smart-tv',
        category: { _ref: 'cat-install', _type: 'reference' },
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
    {
        _id: 'guide-ios',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on iOS (iPhone/iPad)', es: 'Instalar IPTV Smarters Pro en iOS (iPhone/iPad)', fr: 'Installer IPTV Smarters Pro sur iOS (iPhone/iPad)', nl: 'Installeer IPTV Smarters Pro op iOS (iPhone/iPad)' },
        slug: { current: 'install-iptv-smarters-pro-on-ios-iphone-ipad' },
        device: 'ios',
        category: { _ref: 'cat-install', _type: 'reference' },
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
    {
        _id: 'guide-windows',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Windows PC', es: 'Instalar IPTV Smarters Pro en PC Windows', fr: 'Installer IPTV Smarters Pro sur PC Windows', nl: 'Installeer IPTV Smarters Pro op Windows PC' },
        slug: { current: 'install-iptv-smarters-pro-on-windows' },
        device: 'windows',
        category: { _ref: 'cat-install', _type: 'reference' },
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
];

async function seed() {
    if (!clientWithAuth.config().token) {
        console.error('Error: No SANITY_API_WRITE_TOKEN found in .env.local');
        process.exit(1);
    }

    console.log('Seeding data...');

    // Create Category
    try {
        await clientWithAuth.createOrReplace(category);
        console.log(`Category '${category.name.en}' seeded.`);
    } catch (e: any) {
        console.error(`Failed to seed category: ${e.message}`);
    }

    // Create Guides
    for (const guide of guides) {
        try {
            await clientWithAuth.createOrReplace(guide);
            console.log(`Guide '${guide.title.en}' seeded.`);
        } catch (e: any) {
            console.error(`Failed to seed guide '${guide.title.en}': ${e.message}`);
        }
    }

    console.log('Done!');
}

seed();
