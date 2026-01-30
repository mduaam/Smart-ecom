
import https from 'https';

const SITEMAP_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
    : 'https://iptvsmarters.pro/sitemap.xml';

const searchEngines = [
    `http://www.google.com/ping?sitemap=${SITEMAP_URL}`,
    `http://www.bing.com/ping?sitemap=${SITEMAP_URL}`
];

console.log(`🚀 Submitting sitemap: ${SITEMAP_URL}`);

searchEngines.forEach((url) => {
    https.get(url, (res) => {
        console.log(`[${res.statusCode}] Submitted to: ${url}`);
    }).on('error', (e) => {
        console.error(`Error submitting to ${url}:`, e.message);
    });
});
