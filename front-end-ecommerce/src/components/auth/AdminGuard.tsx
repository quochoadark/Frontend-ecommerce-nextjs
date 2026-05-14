"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // After rehydration check: if not authenticated and not loading, redirect
    if (!state.isLoading && !state.isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [state.isAuthenticated, state.isLoading, router, pathname]);

  // Show loading spinner while checking auth status
  if (state.isLoading || !state.isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "var(--accent)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Đang xác thực...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
