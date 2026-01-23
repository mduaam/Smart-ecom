import Sidebar from "@/components/admin/Sidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            {/* Global Sidebar for authenticated admin pages */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
                {/* Command Palette available globally */}
                <CommandPalette />
                {children}
            </div>
        </div>
    );
}
