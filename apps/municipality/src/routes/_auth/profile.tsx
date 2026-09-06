import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeFormat } from "@/lib/safe-format";
import { LogOut, Edit2, Save, X, Lock } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getCity } from "@/services/cities";
import { getMyCivicRolePerformance, client } from "@/services/api";
import type { CivicRolePerformance } from "@/services/types";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_auth/profile")({
  head: () => ({ meta: [{ title: "Profile — Municipal Intelligence" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const { officer, ready, signOut } = useMuniAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<CivicRolePerformance | null>(null);
  const [performanceError, setPerformanceError] = useState("");

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", designation: "" });

  // Password change state
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (officer) {
      setForm({
        name: officer.name ?? "",
        phone: (officer as any).phone ?? "",
        designation: officer.designation ?? "",
      });
    }
  }, [officer]);

  useEffect(() => {
    if (!officer) return;
    let active = true;
    void getMyCivicRolePerformance()
      .then((data) => { if (active) setPerformance(data); })
      .catch(() => { if (active) setPerformanceError("Live Civic Performance is temporarily unavailable."); });
    return () => { active = false; };
  }, [officer]);

  if (!ready || !officer) return <LoadingState message="Loading profile..." />;

  const city = getCity(officer.city);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const patch: Record<string, string> = {};
      if (form.name.trim()) patch.name = form.name.trim();
      if (form.phone.trim()) patch.phone = form.phone.trim();
      if (form.designation.trim()) patch.designation = form.designation.trim();
      await client.patch("/api/v1/auth/me", patch);
      toast.success("Profile updated");
      setEditing(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (pwdForm.next !== pwdForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwdForm.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPwdSaving(true);
    try {
      await client.patch("/api/v1/auth/me", {
        current_password: pwdForm.current,
        new_password: pwdForm.next,
      });
      toast.success("Password changed successfully");
      setChangingPwd(false);
      setPwdForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    void navigate({ to: "/login" as any });
  }

  const metrics = performance?.metrics ?? {};

  return (
    <div className="muni-page-enter mx-auto max-w-3xl space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <SectionLabel>{t("ui.officer_profile")}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">{officer.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{officer.email}</p>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <GlassButton variant="glass" onClick={() => setEditing(true)}>
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </GlassButton>
          )}
        </div>
      </header>

      {/* Profile Info / Edit Form */}
      <GlassCard elevation="raised" className="p-6">
        {editing ? (
          <div className="space-y-4">
            <SectionLabel>Edit Profile</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground block mb-1">Designation</label>
                <input
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Ward Officer, Municipal Supervisor"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <GlassButton onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Saving…" : "Save Changes"}
              </GlassButton>
              <GlassButton variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </GlassButton>
            </div>
          </div>
        ) : (
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.officer_id")}</dt><dd className="font-medium tabular-nums">{officer.id}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.department")}</dt><dd className="font-medium">{officer.department}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.role")}</dt><dd className="font-medium">{officer.role}</dd></div>
            {officer.designation && <div className="flex justify-between"><dt className="text-muted-foreground">Designation</dt><dd className="font-medium">{officer.designation}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.city")}</dt><dd className="font-medium">{city?.name ?? officer.city}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("ui.last_active")}</dt><dd>{safeFormat(officer.lastActive, "dd MMM yyyy, HH:mm")}</dd></div>
          </dl>
        )}
      </GlassCard>

      {/* Password Change */}
      <GlassCard elevation="raised" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Security</SectionLabel>
            <h2 className="mt-1 text-base font-medium">Change Password</h2>
          </div>
          {!changingPwd && (
            <GlassButton variant="glass" onClick={() => setChangingPwd(true)}>
              <Lock className="h-4 w-4 mr-1" /> Change
            </GlassButton>
          )}
        </div>
        {changingPwd ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Current Password</label>
              <input
                type="password"
                value={pwdForm.current}
                onChange={(e) => setPwdForm((f) => ({ ...f, current: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">New Password</label>
                <input
                  type="password"
                  value={pwdForm.next}
                  onChange={(e) => setPwdForm((f) => ({ ...f, next: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <GlassButton onClick={handleChangePassword} disabled={pwdSaving}>
                {pwdSaving ? "Changing…" : "Change Password"}
              </GlassButton>
              <GlassButton variant="outline" onClick={() => { setChangingPwd(false); setPwdForm({ current: "", next: "", confirm: "" }); }}>
                Cancel
              </GlassButton>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Use a strong, unique password. You can also reset it via the forgot password flow on the login page.</p>
        )}
      </GlassCard>

      {/* Theme Toggle */}
      <GlassCard elevation="raised" className="p-6">
        <SectionLabel>Appearance</SectionLabel>
        <div className="mt-3 flex gap-2">
          {(["light", "dark", "system"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                mode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Civic Performance */}
      <GlassCard elevation="raised" className="space-y-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>Civic Performance</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Verified municipal outcomes</h2>
          </div>
          {performance ? <div className="text-right"><p className="text-3xl font-semibold">{performance.score}/100</p><p className="text-xs text-muted-foreground">Private role view</p></div> : null}
        </div>
        {performanceError ? <p className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground" role="status">{performanceError}</p> : null}
        {!performance && !performanceError ? <p className="text-sm text-muted-foreground">Loading verified municipal metrics…</p> : null}
        {performance ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Handled complaints" value={metrics["handled_complaints"] ?? 0} />
            <Metric label="Resolved complaints" value={metrics["resolved_complaints"] ?? 0} />
            <Metric label="Resolution rate" value={`${metrics["resolution_rate"] ?? 0}%`} />
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">Score based on live complaint outcomes, SLA adherence, and citizen confirmations.</p>
      </GlassCard>

      <GlassButton variant="outline" className="w-full" onClick={() => void handleSignOut()}>
        <LogOut className="h-4 w-4" />
        {t("ui.sign_out")}
      </GlassButton>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-xl border border-border bg-[var(--glass)] p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{String(value)}</p></div>;
}
