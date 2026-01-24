import AdminShell from "@/components/admin/AdminShell";
import { CommandPalette } from "@/components/admin/CommandPalette";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminShell>
            {/* Command Palette available globally */}
            <CommandPalette />
            {children}
        </AdminShell>
    );
}
