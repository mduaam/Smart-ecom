import AdminShell from "@/components/admin/AdminShell";
import { CommandPalette } from "@/components/admin/CommandPalette";
import AdminHeader from "@/components/admin/AdminHeader";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminShell>
            {/* Command Palette available globally */}
            <CommandPalette />
            <AdminHeader />
            {children}
        </AdminShell>
    );
}
