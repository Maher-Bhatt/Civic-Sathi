import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { contractorDemoLogin } from "@/services/api";
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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[40%] bg-blue-600 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Civic Sathi</h1>
          <p className="text-xl text-blue-100 font-medium mb-8">Contractor Portal</p>
          <p className="text-blue-200 leading-relaxed">
            Bid on municipal projects, manage contracts, and track progress all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 lg:w-[60%] bg-white dark:bg-slate-900 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:text-left text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              {t("ui.contractor_portal")} Login
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sign in to manage your municipal projects and bids.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("ui.email_address")}
              </label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] px-4 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                Municipality
              </label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value as CityId)} 
                className="w-full min-h-[48px] px-4 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="vadodara">Vadodara · VMC</option>
                <option value="mumbai">Mumbai · BMC</option>
                <option value="bengaluru">Bengaluru · BBMP</option>
                <option value="delhi">Delhi · MCD</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("ui.password")}
                </label>
                <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] rounded-md font-semibold text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50 press"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Quick Demo Access
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  await contractorDemoLogin(city);
                  window.location.href = "/contractor/dashboard";
                } catch (err: any) {
                  setError(err?.message || "Demo login failed. The backend may be starting up — please retry in 30 seconds.");
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Starting demo..." : "⚡ Instant Demo Login (No Password)"}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Creates a demo contractor account for {city.charAt(0).toUpperCase() + city.slice(1)}
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Registered contractor access
            </p>
            <p>
              Use the login issued by your municipal registration administrator. Contractor city eligibility is checked by the Civic Sathi backend.
            </p>
            <p className="mt-4 font-semibold text-[var(--primary)]">
              Want to bid on Civic Projects? Contact your local municipality admin to register your company.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
