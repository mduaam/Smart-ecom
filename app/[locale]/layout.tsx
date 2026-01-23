import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/navigation';

import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/sanity-utils";

const geistSans = Geist({

  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPTV Smarters Subscription",
  description: "Premium IPTV Smarters Pro and Player Lite subscriptions.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Receiving messages provided in `i18n.ts`
  const messages = await getMessages();

  // Fetch site settings from Sanity
  const siteSettings = await getSiteSettings();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Navbar siteSettings={siteSettings} />
            <div className="pt-16"> {/* Fixed Navbar height */}
              <Breadcrumbs />
            </div>
            <main className="flex-grow">
              {children}
            </main>
            <Footer siteSettings={siteSettings} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

