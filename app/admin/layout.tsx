import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin Panel | Smarters Pro",
    description: "Administrative dashboard for managing subscriptions and orders.",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
            >
                {/* 
                  Root Admin Layout: 
                  - Provides HTML/Body context.
                  - Does NOT provide Sidebar (Login page uses this).
                  - Authenticated pages use (dashboard)/layout.tsx which ADDS the Sidebar.
                */}
                {children}
            </body>
        </html>
    );
}
