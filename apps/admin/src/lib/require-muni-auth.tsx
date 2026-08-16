import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMuniAuth } from "@/lib/muni-auth";
import { LoadingState } from "@/components/ui/states";

export function MuniAuthGate({ children }: { children: React.ReactNode }) {
  const { officer, ready } = useMuniAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !officer) {
      void navigate({ to: "/login" as any, replace: true });
    }
  }, [ready, officer, navigate]);

  if (!ready || !officer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState
          message={ready ? "Redirecting to sign in..." : "Loading municipal session..."}
        />
      </div>
    );
  }

  return <>{children}</>;
}
