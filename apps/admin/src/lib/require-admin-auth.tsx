import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { LoadingState } from "@/components/ui/states";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { admin, ready } = useAdminAuth();
  const navigate = useNavigate();

  const isAuthorized = admin && (admin.isSuperAdmin === true || admin.role === "admin");

  useEffect(() => {
    if (ready && !isAuthorized) {
      window.location.replace("/login?reason=admin-required");
    }
  }, [ready, isAuthorized]);

  if (!ready || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState message={ready ? "Admin access required..." : "Loading secure admin session..."} />
      </div>
    );
  }

  return <>{children}</>;
}
