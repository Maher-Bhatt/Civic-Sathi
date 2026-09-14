import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
      void navigate({ to: (redirect || "/") as any });
    } catch {
      setError(t("login.error", "We couldn't sign you in. Check your details and try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left panel - Brand */}
      <div className="hidden lg:flex lg:w-[40%] bg-[var(--primary)] p-12 flex-col justify-center items-start text-white">
        <h1 className="text-4xl font-bold mb-4">Civic Sathi</h1>
        <p className="text-lg text-[var(--primary-foreground)]/80">
          The smart way to report and track civic issues in your neighborhood.
        </p>
      </div>

      {/* Right panel - Form */}
      <div className="flex flex-col flex-1 lg:w-[60%] bg-white dark:bg-slate-900 px-6 py-12 sm:px-12 justify-center">
        <div className="w-full max-w-md mx-auto">
          <span className="text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] uppercase tracking-wider">
            {t("login.access", "Citizen access")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {t("login.heading", "Sign in")}
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            {t("login.subtext", "Continue to your reports, notifications and complaint history.")}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("login.email", "Email")}
              </label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.email.placeholder", "you@example.com")}
                className="w-full min-h-[48px] rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("login.password", "Password")}
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[48px] rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-primary"
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[48px] rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-primary dark:hover:bg-primary/90 transition-colors mt-2"
            >
              {busy ? t("login.btn.busy", "Signing in...") : t("login.btn", "Sign in")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              to="/forgot-password"
              search={redirect ? { redirect } : {}}
              className="text-primary font-medium hover:underline"
            >
              {t("login.forgot", "Forgot password?")}
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t("login.new", "New to Civic Sathi?")}{" "}
            <Link
              to="/register"
              search={{ redirect }}
              className="text-primary font-medium hover:underline"
            >
              {t("login.createaccount", "Create an account")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
