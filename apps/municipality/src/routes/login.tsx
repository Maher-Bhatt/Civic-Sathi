import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useMuniAuth } from "@/lib/muni-auth";
import { CITIES, type CityId } from "@/services/cities";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Municipal Sign In — JANMIND" }],
  }),
  component: MuniLoginPage,
});

function MuniLoginPage() {
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
      await signIn(email, password, city);
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
          <p className="text-2xl font-semibold tracking-tight">JANMIND</p>
          <p className="mt-1 text-sm text-muted-foreground">Municipal Intelligence</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <GlassInput
            label="Officer ID / Email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="officer@vmc.gov.in"
          />
          <GlassInput
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error ?? undefined}
          />

          <div>
            <label className="label-xs mb-1.5 block">City</label>
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
            <label className="label-xs mb-1.5 block">Role</label>
            <input value="Officer" readOnly className="filter-input opacity-70" />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-[var(--glass-border)]"
            />
            Remember session
          </label>

          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => toast.info("Password reset is not available in the prototype.")}
          >
            Forgot password?
          </button>

          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </GlassButton>
        </form>

        <p className="mt-6 text-center text-[0.65rem] text-muted-foreground">
          JANMIND Municipal Intelligence Platform
        </p>
      </GlassCard>
    </div>
  );
}
