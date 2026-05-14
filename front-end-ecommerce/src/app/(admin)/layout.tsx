import { AuthProvider } from "@/context/AuthContext";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AuthProvider>
  );
}
