import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login | Civic Sathi" }] }),
  component: AdminLogin,
});

function AdminLogin() {
    const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await signIn(email.trim().toLowerCase(), password);
      if (success) {
        toast.success("Signed in successfully");
        void navigate({ to: "/admin/dashboard" as any, replace: true });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 muni-page-enter">
      <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-bl-full -z-10" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-[var(--foreground)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{t('ui.civicsathi_admin')}</h1>
          <p className="text-[var(--muted-foreground)]">{t('ui.platform_administration')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="label-xs" htmlFor="email">{t('ui.email_address')}</label>
            <input
              id="email"
              type="text" inputMode="email" autoComplete="email"
              required
              className="ambient-field w-full"
              placeholder={t('ui.admin_civicsathi_gov_in')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="label-xs" htmlFor="password">{t('ui.password')}</label>
            <input
              id="password"
              type="password"
              required
              className="ambient-field w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="action-btn primary w-full flex items-center justify-center gap-2 press"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('ui.sign_in_to_platform')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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
                setEmail("admin@civicsathi.in");
                setPassword("CivicSathi@2026");
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs transition text-left"
            >
              <div>
                <span className="font-semibold text-[var(--foreground)]">Super Admin</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] font-mono">admin@civicsathi.in</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-primary/15 text-primary font-medium">Click to Fill</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
