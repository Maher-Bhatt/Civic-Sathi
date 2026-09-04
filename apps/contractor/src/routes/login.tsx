import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n";
import type { CityId } from "@/services/cities";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Contractor Login - Civic Sathi" }] }),
  component: ContractorLogin,
});

function ContractorLogin() {
  const { t } = useI18n();
  const { signIn } = useContractorAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState<CityId>("vadodara");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password, city);
      navigate({ to: "/contractor/dashboard" as any });
    } catch (err: any) {
      const status = Number(err?.status ?? err?.statusCode ?? 0);
      const detail = String(err?.message || "");
      if (status === 401) {
        setError("Login rejected. Use the current official SIH handoff password for this account; the old shared demo password is no longer active.");
      } else if (status === 403 && detail.toLowerCase().includes("approved")) {
        setError(`This contractor is not approved for ${city.toUpperCase()}. Select the municipality shown on your registration.`);
      } else {
        setError(detail || "Unable to sign in right now. Please retry and confirm the municipality selection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] muni-page-enter p-4">
      <GlassCard className="w-full max-w-md p-8 glass-strong shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
            {t("ui.civicsathi")}
          </h1>
          <p className="text-[var(--muted-foreground)]">{t("ui.contractor_portal")}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-[var(--critical)]/10 border border-[var(--critical)]/20 text-[var(--critical)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">
              {t("ui.email_address")}
            </label>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">Municipality</label>
            <select value={city} onChange={(e) => setCity(e.target.value as CityId)} className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]">
              <option value="vadodara">Vadodara · VMC</option>
              <option value="mumbai">Mumbai · BMC</option>
              <option value="bengaluru">Bengaluru · BBMP</option>
              <option value="delhi">Delhi · MCD</option>
              
            </select>
          </div>

          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">
              {t("ui.password")}
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="action-btn primary w-full py-3 rounded-md font-medium text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50 press"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="text-primary underline-offset-4 hover:underline">Forgot password?</Link>
        </div>

        <div className="mt-6 border-t border-[var(--glass-border)] pt-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Registered contractor access
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted-foreground)]">
            Use the login issued by your municipal registration administrator. Contractor city eligibility is checked by the Civic Sathi backend.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          <p>{t("ui.sign_in_with_your_registered_c")}</p>
          <p className="mt-2 text-[10px] uppercase font-semibold text-primary/80">
            Want to bid on Civic Projects? Contact your local municipality admin to register your
            company.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
