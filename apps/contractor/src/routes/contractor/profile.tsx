import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractor, getMyCivicRolePerformance } from "@/services/api";
import { Contractor, CivicRolePerformance } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Building, MapPin, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
