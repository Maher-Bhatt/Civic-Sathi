import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { LoadingState } from "@/components/ui/states";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { admin, ready } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && (!admin || admin.isSuperAdmin !== true)) {
      window.location.replace("/login?reason=super-admin-required");
    }
  }, [ready, admin]);

  if (!ready || !admin || admin.isSuperAdmin !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState message={ready ? "Private super-admin access required..." : "Loading secure admin session..."} />
      </div>
    );
  }

  return <>{children}</>;
}
