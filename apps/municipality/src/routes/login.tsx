import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useMuniAuth } from "@/lib/muni-auth";
import { CITIES, type CityId } from "@/services/cities";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Municipal Sign In — Civic Sathi" }],
  }),
  component: MuniLoginPage,
});

function MuniLoginPage() {
  const { t } = useI18n();
  const { signIn, officer, ready } = useMuniAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState<CityId>("pune");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && officer) {
      void navigate({ to: "/dashboard" as any, replace: true });
    }
  }, [navigate, officer, ready]);

  if (ready && officer) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password, city);
      toast.success("Signed in to Municipal Intelligence");
      void navigate({ to: "/dashboard" as any });
    } catch (err: any) {
      console.error("Municipal login error:", err);
      const status = Number(err?.status ?? 0);
      const message = String(err?.message ?? "");
      const userMessage =
        status === 401
          ? "Email or password is incorrect. Re-enter the current professional credential."
          : status === 403
            ? "This account is not authorized for the selected city or designation."
            : status === 422
              ? "The login details are incomplete or invalid. Check the email, city, and designation."
              : status === 408 || status === 0
                ? "The Civic Sathi backend could not be reached. Please retry in a moment."
                : message && message !== "API Request Failed"
                  ? message
                  : "The Civic Sathi backend rejected the request. Please retry or contact the platform administrator.";
      setError(userMessage);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ambient-field flex min-h-screen items-center justify-center bg-background p-4">
      <GlassCard elevation="raised" className="animate-rise w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">{t("ui.civicsathi")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("ui.municipal_intelligence")}</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <GlassInput
            label={t("ui.officer_id_email")}
            type="text"
            inputMode="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("ui.officer_vmc_gov_in")}
          />
          <GlassInput
            label={t("ui.password")}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error ?? undefined}
          />

          <div>
            <label className="label-xs mb-1.5 block">{t("ui.city")}</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as CityId)}
              className="filter-input"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-xs text-muted-foreground">
            <p>Your role is assigned to your professional account and verified by the backend. It cannot be selected or changed on the login screen.</p>
            <p className="mt-1.5 text-[11px] text-foreground/75">Supported municipal roles: Commissioner / Collector, Department Head, Supervisor, and Ward Officer.</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-[var(--glass-border)]"
            />
            {t("ui.remember_session")}
          </label>

          <Link
            to="/forgot-password"
            className="block text-center text-xs text-primary underline-offset-4 hover:underline"
          >
            {t("ui.forgot_password")}
          </Link>

          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </GlassButton>
        </form>

        <div className="mt-6 border-t border-[var(--glass-border)] pt-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Authorized municipal access
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted-foreground)]">
            Use the professional account issued by your municipal administrator. City and role access are validated by the Civic Sathi backend.
          </p>
        </div>

        <p className="mt-6 text-center text-[0.65rem] text-muted-foreground">
          {t("ui.civicsathi_municipal_intelligence")}
        </p>
      </GlassCard>
    </div>
  );
}
