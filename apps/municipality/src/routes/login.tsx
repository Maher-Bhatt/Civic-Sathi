import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useMuniAuth } from "@/lib/muni-auth";
import { CITIES, type CityId } from "@/services/cities";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Municipal Sign In — JANMIND" }],
  }),
  component: MuniLoginPage,
});

function MuniLoginPage() {
    const { t } = useI18n();
  const { signIn, officer, ready } = useMuniAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState<CityId>("vadodara");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && officer) {
    void navigate({ to: "/dashboard" as any, replace: true });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password, city);
      toast.success("Signed in to Municipal Intelligence");
      void navigate({ to: "/dashboard" as any });
    } catch {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ambient-field flex min-h-screen items-center justify-center bg-background p-4">
      <GlassCard elevation="raised" className="animate-rise w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">{t('ui.janmind')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('ui.municipal_intelligence')}</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <GlassInput
            label={t('ui.officer_id_email')}
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('ui.officer_vmc_gov_in')}
          />
          <GlassInput
            label={t('ui.password')}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error ?? undefined}
          />

          <div>
            <label className="label-xs mb-1.5 block">{t('ui.city')}</label>
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

          <div>
            <label className="label-xs mb-1.5 block">{t('ui.role')}</label>
            <input value="Officer" readOnly className="filter-input opacity-70" />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-[var(--glass-border)]"
            />
            {t('ui.remember_session')}</label>

          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => toast.info("Password reset is not available in the prototype.")}
          >
            {t('ui.forgot_password')}</button>

          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </GlassButton>
        </form>

        {/* 1-Click Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2.5 text-center">
            Quick Demo Logins
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail("officer@vmc.gov.in");
                setPassword("Janmind@2026");
                setCity("vadodara");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Vadodara Officer (VMC)</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">officer@vmc.gov.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Click to Fill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("officer@bbmp.gov.in");
                setPassword("Janmind@2026");
                setCity("bengaluru");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Bengaluru Officer (BBMP)</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">officer@bbmp.gov.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium">Click to Fill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("supervisor@vmc.gov.in");
                setPassword("Janmind@2026");
                setCity("vadodara");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Municipal Supervisor (VMC)</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">supervisor@vmc.gov.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium">Click to Fill</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.65rem] text-muted-foreground">
          {t('ui.janmind_municipal_intelligence')}</p>
      </GlassCard>
    </div>
  );
}
