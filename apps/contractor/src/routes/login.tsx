import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Contractor Login - JANMIND" }] }),
  component: ContractorLogin,
});

function ContractorLogin() {
    const { t } = useI18n();
  const { signIn } = useContractorAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim().toLowerCase(), password);
      navigate({ to: "/contractor/dashboard" as any });
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] muni-page-enter p-4">
      <GlassCard className="w-full max-w-md p-8 glass-strong shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">{t('ui.janmind')}</h1>
          <p className="text-[var(--muted-foreground)]">{t('ui.contractor_portal')}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-[var(--critical)]/10 border border-[var(--critical)]/20 text-[var(--critical)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">{t('ui.email_address')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="filter-input w-full ambient-field px-4 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder={t('ui.suresh_patel_bharatinfra_in')}
              required
            />
          </div>

          <div>
            <label className="label-xs block mb-2 text-[var(--foreground)]">{t('ui.password')}</label>
            <input
              type="password"
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

        {/* 1-Click Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2.5 text-center">
            Quick Demo Login
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail("contractor@bharat.in");
                setPassword("Janmind@2026");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Bharat Infra Field Operations</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">contractor@bharat.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium">Click to Fill</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          <p>{t('ui.sign_in_with_your_registered_c')}</p>
        </div>
      </GlassCard>
    </div>
  );
}
