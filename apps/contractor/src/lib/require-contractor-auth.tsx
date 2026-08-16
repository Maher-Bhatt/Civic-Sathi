import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useContractorAuth } from "@/lib/contractor-auth";
import { LoadingState } from "@/components/ui/states";

export function ContractorAuthGate({ children }: { children: React.ReactNode }) {
  const { contractor, ready } = useContractorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !contractor) {
      void navigate({ to: "/login" as any, replace: true });
    }
  }, [ready, contractor, navigate]);

  if (!ready || !contractor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState message={ready ? "Redirecting to contractor sign in..." : "Loading contractor session..."} />
      </div>
    );
  }

  return <>{children}</>;
}
