import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { parseRedirect } from "@/lib/require-auth";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: parseRedirect(search["redirect"]),
  }),
  head: () => ({
    meta: [
      { title: "Create account — Civic Sathi Citizen Portal" },
      {
        name: "description",
        content:
          "Create a Civic Sathi citizen account to report civic problems and follow their resolution.",
      },
      { property: "og:title", content: "Create account — Civic Sathi Citizen Portal" },
      {
        property: "og:description",
        content: "Join Civic Sathi to report civic issues and track municipal response.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const { t } = useI18n();
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
      setError(t("register.password.error", "Password must be at least 8 characters."));
      return;
    }
    // Normalize phone and email before submission
    const normalizedForm = {
      ...form,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\s+/g, ""),
    };
    setBusy(true);
    setError(null);
    try {
      await signUp(normalizedForm);
      toast.success(t("register.success", "Account created"));
      void navigate({ to: redirect ?? "/report" });
    } catch (err: any) {
      // Surface the actual backend error message when available
      const detail = err?.details || err?.message || "";
      if (detail.toLowerCase().includes("already exists") || detail.includes("409")) {
        setError("An account with this email already exists. Sign in instead.");
      } else if (detail.toLowerCase().includes("phone")) {
        setError("Please enter a valid 10-digit phone number.");
      } else {
        setError(t("register.error", "We couldn't create your account right now."));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell className="max-w-md">
      <GlassCard elevation="raised" className="animate-rise p-6 sm:p-8">
        <SectionLabel>{t("register.access", "Citizen access")}</SectionLabel>
        <h1 className="mt-3 text-2xl font-semibold">{t("register.heading", "Create your account")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("register.subtext", "Your contact details stay private and are never shown on public maps.")}
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
          <GlassInput
            label={t("register.name", "Full name")}
            required
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            placeholder={t("register.name.placeholder", "Your name")}
          />
          <GlassInput
            label={t("register.email", "Email")}
            type="text"
            inputMode="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder={t("register.email.placeholder", "you@example.com")}
          />
          <GlassInput
            label={t("register.phone", "Phone")}
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder={t("register.phone.placeholder", "+91 00000 00000")}
          />
          <GlassInput
            label={t("register.password", "Password")}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            placeholder={t("register.password.placeholder", "At least 8 characters")}
            error={error ?? undefined}
          />
          <GlassButton type="submit" className="w-full" disabled={busy}>
            {busy
              ? t("register.btn.busy", "Creating account...")
              : t("register.btn", "Create account")}
          </GlassButton>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("register.existing", "Already registered?")}{" "}
          <Link
            to="/login"
            search={{ redirect }}
            className="text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            {t("register.signin", "Sign in")}
          </Link>
        </p>
      </GlassCard>
    </PageShell>
  );
}
