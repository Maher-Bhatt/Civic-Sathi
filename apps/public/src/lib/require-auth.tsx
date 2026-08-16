import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/site-nav";
import { LoadingState } from "@/components/ui/states";

/** Routes a signed-out citizen can be returned to after authenticating. */
export const PROTECTED_PATHS = ["/report", "/complaints", "/notifications", "/profile"] as const;

export type ProtectedPath = (typeof PROTECTED_PATHS)[number];

export function parseRedirect(value: unknown): ProtectedPath | undefined {
  return typeof value === "string" && (PROTECTED_PATHS as readonly string[]).includes(value)
    ? (value as ProtectedPath)
    : undefined;
}

/**
 * Client-side authentication gate. Reporting and every personal page requires a
 * signed-in citizen; Home, Civic Map and How It Works stay public.
 */
export function AuthGate({
  redirectTo,
  children,
}: {
  redirectTo: ProtectedPath;
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) {
      void navigate({ to: "/login", search: { redirect: redirectTo }, replace: true });
    }
  }, [ready, user, navigate, redirectTo]);

  if (!ready || !user) {
    return (
      <PageShell className="max-w-md">
        <LoadingState message={ready ? "Redirecting to sign in..." : "Checking your session..."} />
      </PageShell>
    );
  }

  return <>{children}</>;
}
