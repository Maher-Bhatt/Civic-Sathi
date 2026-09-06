import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { adminApiFetch } from "@/services/shared-store";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Server, Edit2, Save, X, Lock } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings | Admin | Civic Sathi" }] }),
  component: AdminSettings,
});

async function patchMe(patch: Record<string, string>) {
  return adminApiFetch("/api/v1/auth/me", { method: "PATCH", body: JSON.stringify(patch) });
}

function AdminSettings() {
  const { t } = useI18n();
  const { admin } = useAdminAuth();
  const { mode, setMode } = useTheme();

  // Profile edit
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: admin?.name ?? "", phone: (admin as any)?.phone ?? "" });

  // Password change
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const patch: Record<string, string> = {};
      if (form.name.trim()) patch.name = form.name.trim();
      if (form.phone.trim()) patch.phone = form.phone.trim();
      await patchMe(patch);
      toast.success("Profile updated");
      setEditing(false);
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
      await patchMe({ current_password: pwdForm.current, new_password: pwdForm.next });
      toast.success("Password changed successfully");
      setChangingPwd(false);
      setPwdForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  }

  return (
    <div className="space-y-6 muni-page-enter max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('ui.platform_settings')}</h1>
        <p className="text-[var(--muted-foreground)]">{t('ui.system_configuration_and_admin')}</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Edit */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>My Profile</SectionLabel>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setForm({ name: admin?.name ?? "", phone: (admin as any)?.phone ?? "" }); }}
                className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] block mb-1">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] block mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 border border-[var(--glass-border)] rounded-lg text-sm font-medium hover:bg-[var(--surface-elevated)]">
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <div className="w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center text-lg font-bold">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-medium text-lg">{admin?.name}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{admin?.email}</p>
                <div className="mt-1 inline-flex px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)] capitalize">
                  {admin?.role}
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Password Change */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Security</SectionLabel>
            {!changingPwd && (
              <button onClick={() => setChangingPwd(true)} className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
                <Lock className="h-4 w-4" /> Change Password
              </button>
            )}
          </div>
          {changingPwd ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] block mb-1">Current Password</label>
                <input type="password" value={pwdForm.current} onChange={(e) => setPwdForm((f) => ({ ...f, current: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none" placeholder="••••••••" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] block mb-1">New Password</label>
                  <input type="password" value={pwdForm.next} onChange={(e) => setPwdForm((f) => ({ ...f, next: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none" placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] block mb-1">Confirm New Password</label>
                  <input type="password" value={pwdForm.confirm} onChange={(e) => setPwdForm((f) => ({ ...f, confirm: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleChangePassword} disabled={pwdSaving} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {pwdSaving ? "Changing…" : "Change Password"}
                </button>
                <button onClick={() => { setChangingPwd(false); setPwdForm({ current: "", next: "", confirm: "" }); }} className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-sm font-medium hover:bg-[var(--surface-elevated)]">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">Your account uses a secure bcrypt hash. Change your password above or use the forgot-password flow.</p>
          )}
        </GlassCard>

        {/* Theme */}
        <GlassCard className="p-6">
          <SectionLabel>Appearance</SectionLabel>
          <div className="mt-3 flex gap-2">
            {(["light", "dark", "system"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                  mode === m
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Platform Info */}
        <GlassCard className="p-6">
          <SectionLabel>{t('ui.global_notification_settings')}</SectionLabel>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.platform_name')}</p>
              <p className="font-medium">{t('ui.civicsathi_civic_infrastructure_p')}</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.environment')}</p>
              <p className="font-medium">Production — live API services</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.version')}</p>
              <p className="font-medium font-mono">Civic Sathi Platform 1.0</p>
            </div>
            <div className="p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">{t('ui.storage_mode')}</p>
              <p className="font-medium">PostgreSQL via Civic Sathi API</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-[var(--glass-border)]">
          <div className="flex items-start gap-3 p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
            <Server className="w-5 h-5 mt-0.5 text-[var(--success)]" />
            <div>
              <p className="font-medium">Production data protection enabled</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Destructive database resets are disabled from the browser. Manage users, contractors, tenders, work orders, and permissions through their dedicated authenticated controls.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
