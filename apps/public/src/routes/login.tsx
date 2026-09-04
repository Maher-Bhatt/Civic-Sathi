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
      { title: "Sign in — Civic Sathi Citizen Portal" },
      {
        name: "description",
        content:
          "Sign in to your Civic Sathi account to report civic problems and track complaints.",
      },
      { property: "og:title", content: "Sign in — Civic Sathi Citizen Portal" },
      {
        property: "og:description",
        content: "Access your civic reports, notifications and complaint history on Civic Sathi.",
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
      // A successful citizen sign-in should land on the public home experience.
      // Keep `redirect` for registration links and auth-guard compatibility, but do
      // not send a normal login directly into the complaints workspace.
      void navigate({ to: "/" });
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

        <div className="mt-4 text-center text-sm">
          <Link
            to="/forgot-password"
            search={redirect ? { redirect } : {}}
            className="text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            {t("login.forgot", "Forgot password?")}
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("login.new", "New to Civic Sathi?")}{" "}
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
