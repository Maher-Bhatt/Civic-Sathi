import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { api } from "@/services/api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed: { identifier?: string; redirect?: string } = {};
    if (typeof search["identifier"] === "string") parsed.identifier = search["identifier"];
    if (typeof search["redirect"] === "string") parsed.redirect = search["redirect"];
    return parsed;
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { identifier: initialIdentifier } = Route.useSearch();
  const [identifier, setIdentifier] = useState(initialIdentifier ?? "");
  const [channel, setChannel] = useState<"auto" | "email" | "sms">("auto");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await api.auth.requestPasswordReset({ identifier: identifier.trim(), channel });
      setDestination(response.destination ?? null);
      setSent(true);
      toast.success(response.message);
    } catch (err: any) {
      setError(err?.message ?? "We could not send a reset code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await api.auth.confirmPasswordReset({
        identifier: identifier.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      toast.success(response.message);
      void navigate({ to: "/login", search: { redirect: undefined } });
    } catch (err: any) {
      setError(err?.message ?? "The code is invalid or expired.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell className="max-w-md">
      <GlassCard elevation="raised" className="animate-rise p-6 sm:p-8">
        <SectionLabel>{t("login.access", "Citizen access")}</SectionLabel>
        <h1 className="mt-3 text-2xl font-semibold">{t("login.forgot", "Forgot password?")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {sent
            ? `Enter the six-digit code${destination ? ` sent to ${destination}` : ""} and choose a new password.`
            : "We will send a one-time code to your verified email or mobile number."}
        </p>

        {!sent ? (
          <form onSubmit={requestCode} className="mt-7 space-y-4" noValidate>
            <GlassInput
              label="Email or mobile number"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="you@example.com or +91..."
              error={error ?? undefined}
            />
            <label className="block text-sm text-muted-foreground">
              Delivery method
              <select value={channel} onChange={(event) => setChannel(event.target.value as typeof channel)} className="filter-input mt-1 w-full">
                <option value="auto">Use my verified contact</option>
                <option value="email">Email</option>
                <option value="sms">Mobile SMS</option>
              </select>
            </label>
            <GlassButton type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending code..." : "Send reset code"}
            </GlassButton>
          </form>
        ) : (
          <form onSubmit={confirmCode} className="mt-7 space-y-4" noValidate>
            <GlassInput label="One-time code" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" error={error ?? undefined} />
            <GlassInput label="New password" type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" />
            <GlassButton type="submit" className="w-full" disabled={busy}>
              {busy ? "Updating password..." : "Reset password"}
            </GlassButton>
            <button type="button" className="w-full text-sm text-primary underline-offset-4 hover:underline" onClick={() => { setSent(false); setOtp(""); setError(null); }}>
              Use a different contact
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" search={{ redirect: undefined }} className="text-primary underline-offset-4 hover:underline">Back to sign in</Link>
        </p>
      </GlassCard>
    </PageShell>
  );
}
