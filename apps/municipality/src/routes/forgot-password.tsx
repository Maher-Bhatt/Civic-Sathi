import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { api } from "@/services/api";

export const Route = createFileRoute("/forgot-password")({
  component: MunicipalityForgotPassword,
});

function MunicipalityForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [channel, setChannel] = useState<"auto" | "email" | "sms">("auto");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const result = await api.auth.requestPasswordReset({ identifier: identifier.trim(), channel });
      setDestination(result.destination ?? null); setSent(true); toast.success(result.message);
    } catch (err: any) { setError(err?.message ?? "We could not send a reset code."); }
    finally { setBusy(false); }
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const result = await api.auth.confirmPasswordReset({ identifier: identifier.trim(), otp: otp.trim(), new_password: newPassword });
      toast.success(result.message); void navigate({ to: "/login" });
    } catch (err: any) { setError(err?.message ?? "The reset code is invalid or expired."); }
    finally { setBusy(false); }
  }

  return <div className="ambient-field flex min-h-screen items-center justify-center bg-background p-4">
    <GlassCard elevation="raised" className="w-full max-w-md p-6 sm:p-8">
      <SectionLabel>Municipal Intelligence</SectionLabel>
      <h1 className="mt-3 text-2xl font-semibold">Forgot password?</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sent ? `Enter the code${destination ? ` sent to ${destination}` : ""} and choose a new password.` : "Send a one-time code to your verified municipal account contact."}</p>
      {!sent ? <form onSubmit={sendCode} className="mt-7 space-y-4" noValidate>
        <GlassInput label="Officer email or mobile" type="text" autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="officer@municipality.gov.in" error={error ?? undefined} />
        <label className="block text-sm text-muted-foreground">Delivery method<select value={channel} onChange={(event) => setChannel(event.target.value as typeof channel)} className="filter-input mt-1 w-full"><option value="auto">Use my verified contact</option><option value="email">Email</option><option value="sms">Mobile SMS</option></select></label>
        <GlassButton type="submit" className="w-full" disabled={busy}>{busy ? "Sending code..." : "Send reset code"}</GlassButton>
      </form> : <form onSubmit={resetPassword} className="mt-7 space-y-4" noValidate>
        <GlassInput label="One-time code" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" error={error ?? undefined} />
        <GlassInput label="New password" type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" />
        <GlassButton type="submit" className="w-full" disabled={busy}>{busy ? "Updating password..." : "Reset password"}</GlassButton>
        <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => { setSent(false); setError(null); }}>Use a different contact</button>
      </form>}
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link to="/login" className="text-primary hover:underline">Back to sign in</Link></p>
    </GlassCard>
  </div>;
}
