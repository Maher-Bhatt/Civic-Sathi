import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
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
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user = await signIn(email.trim().toLowerCase(), password);
      if (user) {
        toast.success("Signed in successfully");
        void navigate({ to: "/admin/dashboard" as any, replace: true });
      } else {
        setErrorMessage("Invalid credentials");
        toast.error("Invalid credentials");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "An error occurred during sign in";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[40%] bg-primary text-primary-foreground flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white text-center">
          {t("ui.civicsathi_admin")}
        </h1>
        <p className="text-white/80 text-lg text-center max-w-md">
          {t("ui.platform_administration")}
        </p>
        <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10 max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">
            Private super-admin access
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            This command center is restricted to allowlisted platform administrators. Municipality officers,
            contractors, and citizens must use their dedicated portals.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 lg:w-[60%] bg-white dark:bg-slate-900 justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">{t("ui.civicsathi_admin")}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t("ui.platform_administration")}</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please sign in to your administrator account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                {t("ui.email_address")}
              </label>
              <input
                id="email"
                type="text"
                inputMode="email"
                autoComplete="email"
                required
                className="w-full min-h-[48px] px-4 rounded-md border-2 border-slate-200 focus:border-primary focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                placeholder={t("ui.admin_civicsathi_gov_in")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                  {t("ui.password")}
                </label>
                <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full min-h-[48px] px-4 rounded-md border-2 border-slate-200 focus:border-primary focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t("ui.sign_in_to_platform")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="lg:hidden mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Private super-admin access
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              This command center is restricted to allowlisted platform administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
