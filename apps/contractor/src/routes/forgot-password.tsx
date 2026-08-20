import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { api } from "@/services/api";

export const Route = createFileRoute("/forgot-password")({ component: ContractorForgotPassword });

function ContractorForgotPassword() {
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
    try { const result = await api.auth.requestPasswordReset({ identifier: identifier.trim(), channel }); setDestination(result.destination ?? null); setSent(true); }
    catch (err: any) { setError(err?.message ?? "We could not send a reset code."); }
    finally { setBusy(false); }
  }
  async function resetPassword(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try { const result = await api.auth.confirmPasswordReset({ identifier: identifier.trim(), otp: otp.trim(), new_password: newPassword }); window.alert(result.message); void navigate({ to: "/login" }); }
    catch (err: any) { setError(err?.message ?? "The reset code is invalid or expired."); }
    finally { setBusy(false); }
  }

  return <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 muni-page-enter">
    <GlassCard className="w-full max-w-md p-8 glass-strong shadow-2xl">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Forgot password?</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{sent ? `Enter the code${destination ? ` sent to ${destination}` : ""} and choose a new password.` : "Use the verified email or mobile number registered with your contractor account."}</p>
      {!sent ? <form onSubmit={sendCode} className="mt-7 space-y-5" noValidate>
        <GlassInput label="Email or mobile number" type="text" autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="contractor@example.com" error={error ?? undefined} />
        <label className="block text-sm text-[var(--muted-foreground)]">Delivery method<select value={channel} onChange={(event) => setChannel(event.target.value as typeof channel)} className="filter-input mt-1 w-full"><option value="auto">Use my verified contact</option><option value="email">Email</option><option value="sms">Mobile SMS</option></select></label>
        <button type="submit" disabled={busy} className="action-btn primary w-full py-3 rounded-md font-medium text-white disabled:opacity-50">{busy ? "Sending code..." : "Send reset code"}</button>
      </form> : <form onSubmit={resetPassword} className="mt-7 space-y-5" noValidate>
        <GlassInput label="One-time code" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" error={error ?? undefined} />
        <GlassInput label="New password" type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" />
        <button type="submit" disabled={busy} className="action-btn primary w-full py-3 rounded-md font-medium text-white disabled:opacity-50">{busy ? "Updating password..." : "Reset password"}</button>
      </form>}
      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]"><Link to="/login" className="text-primary hover:underline">Back to sign in</Link></p>
    </GlassCard>
  </div>;
}
