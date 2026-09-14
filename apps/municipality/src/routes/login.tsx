import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMuniAuth } from "@/lib/muni-auth";
import { muniDemoLogin } from "@/services/api";
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
      await signIn(email.trim().toLowerCase(), password);
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left Panel: Brand */}
      <div className="hidden lg:flex lg:w-[40%] bg-emerald-700 flex-col justify-center items-center p-12 text-white text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("ui.civicsathi")}</h1>
        <p className="text-emerald-100 text-lg max-w-md">
          {t("ui.municipal_intelligence")}
        </p>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-1 lg:w-[60%] bg-white dark:bg-slate-900 justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your municipal officer account
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("ui.officer_id_email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("ui.officer_vmc_gov_in")}
                autoComplete="username"
                className="w-full min-h-[48px] px-4 py-2 rounded-lg border-[2px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("ui.password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full min-h-[48px] px-4 py-2 rounded-lg border-[2px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              <p>Your role and city are assigned to your professional account and verified by the backend. They cannot be selected or changed on the login screen.</p>
              <p className="mt-1.5 font-medium">Supported municipal roles: Commissioner / Collector, Department Head, Supervisor, and Ward Officer.</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                {t("ui.remember_session")}
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400"
              >
                {t("ui.forgot_password")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[48px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Quick Demo Access
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  await muniDemoLogin("vadodara");
                  toast.success("Demo session started — Welcome, Officer!");
                  window.location.href = "/dashboard";
                } catch (err: any) {
                  setError(err?.message || "Demo login failed. The backend may be starting up — please retry in 30 seconds.");
                } finally {
                  setBusy(false);
                }
              }}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {busy ? "Starting demo..." : "⚡ Instant Demo Login (No Password)"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Creates a temporary demo officer account for Vadodara
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Authorized municipal access
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Use the professional account issued by your municipal administrator. City and role access are validated by the Civic Sathi backend.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            {t("ui.civicsathi_municipal_intelligence")}
          </p>
        </div>
      </div>
    </div>
  );
}

