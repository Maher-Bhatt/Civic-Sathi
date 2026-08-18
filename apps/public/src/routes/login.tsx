import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { parseRedirect } from "@/lib/require-auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseRedirect(search["redirect"]),
  }),
  head: () => ({
    meta: [
      { title: "Sign in — CivicSathi Citizen Portal" },
      {
        name: "description",
        content: "Sign in to your CivicSathi account to report civic problems and track complaints.",
      },
      { property: "og:title", content: "Sign in — CivicSathi Citizen Portal" },
      {
        property: "og:description",
        content: "Access your civic reports, notifications and complaint history on CivicSathi.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password);
      toast.success(t("login.success", "Signed in"));
      void navigate({ to: redirect ?? "/complaints" });
    } catch {
      setError(t("login.error", "We couldn't sign you in. Check your details and try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell className="max-w-md">
      <GlassCard elevation="raised" className="animate-rise p-6 sm:p-8">
        <SectionLabel>{t("login.access", "Citizen access")}</SectionLabel>
        <h1 className="mt-3 text-2xl font-semibold">{t("login.heading", "Sign in")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("login.subtext", "Continue to your reports, notifications and complaint history.")}
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
          <GlassInput
            label={t("login.email", "Email")}
            type="text"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.email.placeholder", "you@example.com")}
          />
          <GlassInput
            label={t("login.password", "Password")}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error ?? undefined}
          />
          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy ? t("login.btn.busy", "Signing in...") : t("login.btn", "Sign in")}
          </GlassButton>
        </form>

        {/* 1-Click Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2.5 text-center">
            Quick Demo Login
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail("citizen@civicsathi.in");
                setPassword("CivicSathi@2026");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Verified Citizen Account</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">citizen@civicsathi.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-primary/15 text-primary font-medium">Click to Fill</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("login.new", "New to CivicSathi?")}{" "}
          <Link
            to="/register"
            search={{ redirect }}
            className="text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            {t("login.createaccount", "Create an account")}
          </Link>
        </p>
      </GlassCard>
    </PageShell>
  );
}
