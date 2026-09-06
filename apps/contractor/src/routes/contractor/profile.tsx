import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractor, getMyCivicRolePerformance, client } from "@/services/api";
import { Contractor, CivicRolePerformance } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Building, MapPin, Phone, Mail, FileText, CheckCircle2, Edit2, Save, X, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/contractor/profile")({
  head: () => ({ meta: [{ title: "Profile - Contractor Portal" }] }),
  component: ContractorProfile,
});

function ContractorProfile() {
  const { t } = useI18n();
  const { contractor: contractorAuth, signOut } = useContractorAuth();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [performance, setPerformance] = useState<CivicRolePerformance | null>(null);
  const [performanceError, setPerformanceError] = useState("");

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  // Password change state
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    async function loadData() {
      if (!contractorAuth?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getContractor(contractorAuth.id);
        setContractor(data);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Contractor details could not be loaded from the backend."));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contractorAuth]);

  useEffect(() => {
    if (!contractorAuth?.id) return;
    let active = true;
    void getMyCivicRolePerformance()
      .then((data) => { if (active) setPerformance(data); })
      .catch(() => { if (active) setPerformanceError("Live Civic Reputation is temporarily unavailable."); });
    return () => { active = false; };
  }, [contractorAuth?.id]);

  // Sync form with loaded auth data
  useEffect(() => {
    if (contractorAuth) {
      setForm({
        name: contractorAuth.name ?? "",
        phone: (contractorAuth as any).phone ?? "",
      });
    }
  }, [contractorAuth]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading profile."} />;

  // Fall back to auth user data when the contractor detail endpoint is not yet populated
  const displayName = contractor?.companyName ?? contractorAuth?.name ?? "Unknown";
  const displayEmail = contractor?.email ?? contractorAuth?.email ?? "";
  const displayId = contractor?.id ?? contractorAuth?.id ?? "";
  const displayPhone = contractor?.phone ?? "";
  const displayAddress = contractor?.address ?? "";
  const displayRegNum = contractor?.registrationNumber ?? "";
  const displayGSTIN = contractor?.gstin ?? "";
  const displayPan = (contractor as any)?.pan ?? "";
  const displayContactPerson = contractor?.contactPerson ?? contractorAuth?.name ?? "";
  const unavailable = t('ui.unavailable', 'Unavailable — not provided by backend');

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const patch: Record<string, string> = {};
      if (form.name.trim()) patch.name = form.name.trim();
      if (form.phone.trim()) patch.phone = form.phone.trim();
      await client.patch("/api/v1/auth/me", patch);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{t('ui.company_profile')}</h1>
        <p className="text-[var(--muted-foreground)] text-sm">{t('ui.manage_your_business_informati')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6 glass-strong flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[var(--surface-elevated)] border-2 border-[var(--primary)]/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-[var(--primary)] shadow-sm mb-4">
              {displayName.substring(0, 1)}
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] leading-tight mb-1">{displayName}</h2>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 rounded-md text-xs font-medium mb-6">
              <CheckCircle2 size={14} />
              {t('ui.verified_contractor')}</div>
            
            <button 
              onClick={() => void signOut()}
              className="w-full py-2 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] hover:bg-[var(--critical)]/10 hover:text-[var(--critical)] hover:border-[var(--critical)]/30 transition-colors rounded-md text-sm font-medium"
            >
              {t('ui.sign_out')}</button>
          </GlassCard>

          <GlassCard className="p-5 glass-strong space-y-4">
            <SectionLabel>{t('ui.contact_details')}</SectionLabel>
            
            <div className="flex items-start gap-3">
              <Phone className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">{t('ui.phone')}</div>
                <div className="text-[var(--foreground)] text-sm">{displayPhone || unavailable}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">{t('ui.email')}</div>
                <dd className="mt-1 font-medium break-all">{displayEmail}</dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">{t('ui.address')}</div>
                <div className="text-[var(--foreground)] text-sm leading-relaxed">{displayAddress || unavailable}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Registration & Legal */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 glass-strong">
            <SectionLabel className="mb-4 flex items-center gap-2">
              <Building size={18} /> {t('ui.company_information')}</SectionLabel>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
                <div className="text-[var(--muted-foreground)] text-xs mb-1">{t('ui.company_name')}</div>
                <div className="text-[var(--foreground)] font-medium">{displayName}</div>
              </div>
              
              <div className="p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
                <h1 className="text-2xl font-semibold mt-3 mb-1">{displayName}</h1>
                <p className="text-[var(--muted-foreground)]">{t('ui.id')}{displayId}</p>
                <p className="text-[var(--muted-foreground)] text-sm">{displayContactPerson}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 glass-strong">
            <SectionLabel className="mb-4 flex items-center gap-2">
              <FileText size={18} /> {t('ui.legal_registration')}</SectionLabel>
            
            <div className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">{t('ui.registration_number')}</div>
                  <div className="text-[var(--foreground)] font-mono">{displayRegNum || unavailable}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">{displayRegNum ? t('ui.active') : t('ui.pending_verification', 'Pending verification')}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">{t('ui.gstin')}</div>
                  <div className="text-[var(--foreground)] font-mono">{displayGSTIN || unavailable}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">{displayGSTIN ? t('ui.verified') : t('ui.pending_verification', 'Pending verification')}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">{t('ui.pan')}</div>
                  <h3 className="font-medium text-[var(--foreground)]">{displayPan || unavailable}</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">{displayPan ? t('ui.verified') : t('ui.pending_verification', 'Pending verification')}</span>
              </div>
            </div>
          </GlassCard>
        </div>
        
      </div>

      {/* Personal Account Edit */}
      <GlassCard className="p-6 glass-strong">
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Personal Account</SectionLabel>
            <p className="text-[var(--muted-foreground)] text-xs mt-1">Update your login name and phone number</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
            >
              <Edit2 size={14} /> Edit
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
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 border border-[var(--glass-border)] rounded-lg text-sm font-medium hover:bg-[var(--surface-elevated)]"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Login Name</div>
              <div className="text-[var(--foreground)] font-medium">{contractorAuth?.name || unavailable}</div>
            </div>
            <div className="p-3 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Login Email</div>
              <div className="text-[var(--foreground)] font-medium break-all">{displayEmail}</div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Password Change */}
      <GlassCard className="p-6 glass-strong">
        <div className="flex items-center justify-between mb-4">
          <div>
            <SectionLabel>Security</SectionLabel>
            <p className="text-[var(--muted-foreground)] text-xs mt-1">Change your login password</p>
          </div>
          {!changingPwd && (
            <button
              onClick={() => setChangingPwd(true)}
              className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
            >
              <Lock size={14} /> Change Password
            </button>
          )}
        </div>
        {changingPwd ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--muted-foreground)] block mb-1">Current Password</label>
              <input
                type="password"
                value={pwdForm.current}
                onChange={(e) => setPwdForm((f) => ({ ...f, current: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] block mb-1">New Password</label>
                <input
                  type="password"
                  value={pwdForm.next}
                  onChange={(e) => setPwdForm((f) => ({ ...f, next: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={pwdSaving}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {pwdSaving ? "Changing…" : "Change Password"}
              </button>
              <button
                onClick={() => { setChangingPwd(false); setPwdForm({ current: "", next: "", confirm: "" }); }}
                className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-sm font-medium hover:bg-[var(--surface-elevated)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Use a strong, unique password. You can also reset it via the forgot password flow on the login page.</p>
        )}
      </GlassCard>

      <GlassCard className="p-6 glass-strong space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>Civic Reputation</SectionLabel>
            <h2 className="mt-2 text-xl font-semibold">Verified execution quality</h2>
          </div>
          {performance ? <div className="text-right"><p className="text-3xl font-semibold">{performance.score}/100</p><p className="text-xs text-[var(--muted-foreground)]">Private role view</p></div> : null}
        </div>
        {performanceError ? <p className="rounded-xl border border-[var(--glass-border)] px-4 py-3 text-sm text-[var(--muted-foreground)]" role="status">{performanceError}</p> : null}
        {!performance && !performanceError ? <p className="text-sm text-[var(--muted-foreground)]">Loading verified contractor metrics…</p> : null}
        {performance ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PerformanceMetric label="Work orders" value={performance.metrics["work_orders"] ?? 0} />
            <PerformanceMetric label="Completed" value={performance.metrics["completed"] ?? 0} />
            <PerformanceMetric label="Rework" value={performance.metrics["rework"] ?? 0} />
            <PerformanceMetric label="Data status" value={performance.metrics["data_status"] ? "Live" : "—"} />
          </div>
        ) : null}
        <p className="text-xs text-[var(--muted-foreground)]">Reputation is quality-adjusted: raw work-order quantity does not determine recognition. Inspection pass rate, evidence quality, on-time completion, and citizen-confirmed quality are added as verified workflow events become available.</p>
      </GlassCard>
    </div>
  );
}

function PerformanceMetric({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] p-4"><p className="text-xs text-[var(--muted-foreground)]">{label}</p><p className="mt-1 text-xl font-semibold">{String(value)}</p></div>;
}
