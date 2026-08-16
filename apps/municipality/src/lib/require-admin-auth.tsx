import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { LoadingState } from "@/components/ui/states";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { admin, ready } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !admin) {
      void navigate({ to: "/admin/login" as any, replace: true });
    }
  }, [ready, admin, navigate]);

  if (!ready || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState message={ready ? "Redirecting to admin sign in..." : "Loading admin session..."} />
      </div>
    );
  }

  return <>{children}</>;
}
