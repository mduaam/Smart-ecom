export const metadata = {
    title: 'Next.js Studio',
    description: 'Sanity Studio',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
