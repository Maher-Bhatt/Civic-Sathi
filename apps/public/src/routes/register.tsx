import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useAuth } from "@/lib/auth";
import { parseRedirect } from "@/lib/require-auth";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseRedirect(search["redirect"]),
  }),
  head: () => ({
    meta: [
      { title: "Create account — JANMIND Citizen Portal" },
      {
        name: "description",
        content:
          "Create a JANMIND citizen account to report civic problems and follow their resolution.",
      },
      { property: "og:title", content: "Create account — JANMIND Citizen Portal" },
      {
        property: "og:description",
        content: "Join JANMIND to report civic issues and track municipal response.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signUp(form);
      toast.success("Account created");
      void navigate({ to: redirect ?? "/report" });
    } catch {
      setError("We couldn't create your account right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell className="max-w-md">
      <GlassCard elevation="raised" className="animate-rise p-6 sm:p-8">
        <SectionLabel>Citizen access</SectionLabel>
        <h1 className="mt-3 text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your contact details stay private and are never shown on public maps.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
          <GlassInput
            label="Full name"
            required
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
          />
          <GlassInput
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
          />
          <GlassInput
            label="Phone"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 00000 00000"
          />
          <GlassInput
            label="Password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 8 characters"
            error={error ?? undefined}
          />
          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy ? "Creating account..." : "Create account"}
          </GlassButton>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link
            to="/login"
            search={{ redirect }}
            className="text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </PageShell>
  );
}
