
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
                    en: 'From the Firestick Home screen, go to "Find" > "Search". Type "Downloader", select it from the results, and click "Download" or "Get" to install.',
                    es: 'Desde la pantalla de inicio, vaya a "Buscar". Escriba "Downloader", selecciónelo y haga clic en "Descargar" u "Obtener".',
                    fr: 'Depuis l\'écran d\'accueil, allez dans "Rechercher". Tapez "Downloader", sélectionnez-le et cliquez sur "Télécharger" ou "Obtenir".',
                    nl: 'Ga vanaf het startscherm naar "Zoeken". Typ "Downloader", selecteer het en klik op "Downloaden" of "Ophalen".'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Enable Developer Options', es: 'Habilitar Opciones de Desarrollador', fr: 'Activer les options développeur', nl: 'Ontwikkelaarsopties inschakelen' },
                description: {
                    en: 'Go to Settings > My Fire TV > About. Highlight "Fire TV Stick" and click the Select button on your remote 7 times quickly until you see "You are already a developer".',
                    es: 'Vaya a Configuración > Mi Fire TV > Acerca de. Haga clic 7 veces en "Fire TV Stick" hasta que aparezca el mensaje de desarrollador.',
                    fr: 'Allez dans Paramètres > Ma Fire TV > À propos. Cliquez 7 fois sur "Fire TV Stick" jusqu\'à ce que vous soyez développeur.',
                    nl: 'Ga naar Instellingen > Mijn Fire TV > Info. Klik 7 keer snel op "Fire TV Stick" totdat je ontwikkelaar bent.'
                }
            },
            {
                stepNumber: 3,
                title: { en: 'Enable Unknown Sources', es: 'Habilitar Fuentes Desconocidas', fr: 'Sources inconnues', nl: 'Onbekende bronnen' },
                description: {
                    en: 'Press Back to go to "My Fire TV". Select "Developer Options". Turn ON "Install unknown apps" (or "Apps from Unknown Sources") specifically for the Downloader app.',
                    es: 'Regrese a "Mi Fire TV" > "Opciones para desarrolladores". Active "Instalar aplicaciones desconocidas" para Downloader.',
                    fr: 'Retournez à "Ma Fire TV" > "Options pour les développeurs". Activez "Install. applis inconnues" pour Downloader.',
                    nl: 'Ga terug naar "Mijn Fire TV" > "Ontwikkelaarsopties". Zet "Onbekende apps installeren" AAN voor Downloader.'
                }
            },
            {
                stepNumber: 4,
                title: { en: 'Download & Install', es: 'Descargar e Instalar', fr: 'Télécharger et Installer', nl: 'Downloaden en installeren' },
                description: {
                    en: 'Open Downloader, enter the code: 78522 (or URL: iptvsmarters.com/smarters.apk) and click Go. Wait for the download, then click "Install".',
                    es: 'Abra Downloader, ingrese el código: 78522 (o URL: iptvsmarters.com/smarters.apk). Espere la descarga y haga clic en "Instalar".',
                    fr: 'Ouvrez Downloader, entrez le code : 78522 (ou URL : iptvsmarters.com/smarters.apk). Attendez le téléchargement puis cliquez sur "Installer".',
                    nl: 'Open Downloader, voer code in: 78522 (of URL: iptvsmarters.com/smarters.apk). Wacht op downloaden en klik op "Installeren".'
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
                title: { en: 'Download Downloader', es: 'Descargar Downloader', fr: 'Télécharger Downloader', nl: 'Download Downloader' },
                description: {
                    en: 'Open the Google Play Store on your Android TV and install the "Downloader by AFTVnews" app. Alternatively, use Google Chrome.',
                    es: 'Abra Google Play Store e instale la aplicación "Downloader by AFTVnews". O use Google Chrome.',
                    fr: 'Ouvrez le Google Play Store et installez l\'application "Downloader by AFTVnews". Ou utilisez Google Chrome.',
                    nl: 'Open de Google Play Store en installeer de app "Downloader by AFTVnews". Of gebruik Google Chrome.'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Enable Unknown Sources', es: 'Permisos', fr: 'Permissions', nl: 'Machtigingen' },
                description: {
                    en: 'Go to Settings > Security & Restrictions > Unknown Sources. Turn it ON for the Downloader app (or Chrome).',
                    es: 'Vaya a Configuración > Seguridad > Fuentes desconocidas. Actívelo para Downloader.',
                    fr: 'Allez dans Paramètres > Sécurité > Sources inconnues. Activez-le pour Downloader.',
                    nl: 'Ga naar Instellingen > Beveiliging > Onbekende bronnen. Zet het AAN voor Downloader.'
                }
            },
            {
                stepNumber: 3,
                title: { en: 'Install APK', es: 'Instalar APK', fr: 'Installer APK', nl: 'APK Installeren' },
                description: {
                    en: 'Open Downloader and enter code: 78522 (or open Chrome and go to iptvsmarters.com/smarters.apk). Download and Install the file.',
                    es: 'Abra Downloader e ingrese código: 78522 (o use Chrome en iptvsmarters.com/smarters.apk). Descargue e instale.',
                    fr: 'Ouvrez Downloader et entrez le code : 78522 (ou Chrome : iptvsmarters.com/smarters.apk). Téléchargez et installez.',
                    nl: 'Open Downloader en voer code in: 78522 (of Chrome: iptvsmarters.com/smarters.apk). Download en installeer.'
                }
            }
        ]
    },
    {
        _id: 'guide-samsung',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Samsung/LG Smart TV', es: 'Instalar en Samsung/LG Smart TV', fr: 'Installer sur Samsung/LG Smart TV', nl: 'Installeren op Samsung/LG Smart TV' },
        slug: { current: 'install-iptv-smarters-pro-on-samsung-smart-tv' },
        device: 'smart-tv',
        category: { _ref: 'cat-install', _type: 'reference' },
        difficulty: 'medium',
        estimatedTime: 15,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Search App Store', es: 'Buscar en App Store', fr: 'Rechercher sur l\'App Store', nl: 'Zoek in App Store' },
                description: {
                    en: 'Go to the Samsung or LG App Store on your TV. Search for "IPTV Smarters Pro".',
                    es: 'Vaya a la App Store de Samsung o LG. Busque "IPTV Smarters Pro".',
                    fr: 'Allez sur l\'App Store Samsung ou LG. Recherchez "IPTV Smarters Pro".',
                    nl: 'Ga naar de Samsung of LG App Store. Zoek naar "IPTV Smarters Pro".'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Alternative Apps', es: 'Apps Alternativas', fr: 'Applications alternatives', nl: 'Alternatieve apps' },
                description: {
                    en: 'If specifically "IPTV Smarters Pro" is not found (due to region restrictions), search for "Smarters Player Lite" or play via the web browser.',
                    es: 'Si no encuentra "IPTV Smarters Pro", busque "Smarters Player Lite".',
                    fr: 'Si vous ne trouvez pas "IPTV Smarters Pro", cherchez "Smarters Player Lite".',
                    nl: 'Als "IPTV Smarters Pro" niet wordt gevonden, zoek dan naar "Smarters Player Lite".'
                }
            },
            {
                stepNumber: 3,
                title: { en: 'Install & Login', es: 'Instalar y Acceder', fr: 'Installer et Connexion', nl: 'Installeren en inloggen' },
                description: {
                    en: 'Install the app. Open it and choose "Login with Xtream Codes API". Enter your subscription details.',
                    es: 'Instale la app. Ábrala y seleccione "Login with Xtream Codes API". Ingrese sus datos.',
                    fr: 'Installez l\'application. Ouvrez-la et choisissez "Login with Xtream Codes API". Entrez vos détails.',
                    nl: 'Installeer de app. Open deze en kies "Inloggen met Xtream Codes API". Voer je gegevens in.'
                }
            }
        ]
    },
    {
        _id: 'guide-ios',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on iOS (iPhone/iPad)', es: 'Instalar en iOS (iPhone/iPad)', fr: 'Installer sur iOS (iPhone/iPad)', nl: 'Installeren op iOS (iPhone/iPad)' },
        slug: { current: 'install-iptv-smarters-pro-on-ios-iphone-ipad' },
        device: 'ios',
        category: { _ref: 'cat-install', _type: 'reference' },
        difficulty: 'easy',
        estimatedTime: 3,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Apple App Store', es: 'Apple App Store', fr: 'Apple App Store', nl: 'Apple App Store' },
                description: {
                    en: 'Open the App Store on your device and search for "Smarters Player Lite" (The Pro version is rebranded as Lite on iOS but works arguably better).',
                    es: 'Abra la App Store y busque "Smarters Player Lite".',
                    fr: 'Ouvrez l\'App Store et recherchez "Smarters Player Lite".',
                    nl: 'Open de App Store en zoek naar "Smarters Player Lite".'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Install & Launch', es: 'Instalar y Lanzar', fr: 'Installer et lancer', nl: 'Installeren en starten' },
                description: {
                    en: 'Tap "Get" to install. Once installed, open the app.',
                    es: 'Toque "Obtener" para instalar. Una vez instalado, abra la aplicación.',
                    fr: 'Appuyez sur "Obtenir". Une fois installée, ouvrez l\'application.',
                    nl: 'Tik op "Ophalen". Open de app na installatie.'
                }
            },
            {
                stepNumber: 3,
                title: { en: 'Login Details', es: 'Datos de Acceso', fr: 'Connexion', nl: 'Inloggegevens' },
                description: {
                    en: 'Choose "Login with Xtream Codes API". Enter your Username, Password, and Portal URL provided in your subscription email.',
                    es: 'Seleccione "Login with Xtream Codes API". Ingrese su usuario, contraseña y URL del portal.',
                    fr: 'Choisissez "Login with Xtream Codes API". Entrez votre nom d\'utilisateur, mot de passe et URL.',
                    nl: 'Kies "Inloggen met Xtream Codes API". Voer je gebruikersnaam, wachtwoord en URL in.'
                }
            }
        ]
    },
    {
        _id: 'guide-windows',
        _type: 'guide',
        title: { en: 'Install IPTV Smarters Pro on Windows PC', es: 'Instalar en Windows PC', fr: 'Installer sur Windows PC', nl: 'Installeren op Windows PC' },
        slug: { current: 'install-iptv-smarters-pro-on-windows' },
        device: 'windows',
        category: { _ref: 'cat-install', _type: 'reference' },
        difficulty: 'easy',
        estimatedTime: 5,
        steps: [
            {
                stepNumber: 1,
                title: { en: 'Download Application', es: 'Descargar Aplicación', fr: 'Télécharger l\'application', nl: 'Applicatie downloaden' },
                description: {
                    en: 'Visit iptvsmarters.com/downloads/ and download the Windows version (.exe file).',
                    es: 'Visite iptvsmarters.com/downloads/ y descargue la versión para Windows (.exe).',
                    fr: 'Visitez iptvsmarters.com/downloads/ et téléchargez la version Windows (.exe).',
                    nl: 'Bezoek iptvsmarters.com/downloads/ en download de Windows-versie (.exe).'
                }
            },
            {
                stepNumber: 2,
                title: { en: 'Install', es: 'Instalar', fr: 'Installer', nl: 'Installeren' },
                description: {
                    en: 'Run the downloaded .exe file. If prompted by Windows Defender ("Windows protected your PC"), click "More info" > "Run anyway".',
                    es: 'Ejecute el archivo. Si Windows Defender lo bloquea, haga clic en "Más información" > "Ejecutar de todos modos".',
                    fr: 'Lancez le fichier. Si Windows Defender bloque, cliquez sur "Informations complémentaires" > "Exécuter quand même".',
                    nl: 'Voer het bestand uit. Als Windows Defender waarschuwt, klik op "Meer info" > "Toch uitvoeren".'
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
