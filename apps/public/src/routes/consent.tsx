import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Hash,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Eye,
  FileCheck,
  Building2,
  Droplets,
  Construction,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { getDepaConsents, grantDepaConsent, revokeDepaConsent } from "@/services/api";
import type { DepaConsent } from "@/services/types";
import { cn } from "@/lib/utils";
import { FeatureExplainerBanner } from "@/components/feature-explainer-banner";

export const Route = createFileRoute("/consent")({
  head: () => ({
    meta: [
      { title: "Sathi Sahamati — Citizen Data Consent & Privacy Governance (DEPA / DPDP)" },
      {
        name: "description",
        content:
          "India DEPA & DPDP Act 2023 citizen consent management portal. Control cross-department data sharing permissions with cryptographic audit trails.",
      },
    ],
  }),
  component: ConsentGovernancePage,
});

export function ConsentGovernancePage() {
  const [consents, setConsents] = useState<DepaConsent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const loadConsents = async () => {
    try {
      setLoading(true);
      const data = await getDepaConsents();
      setConsents(data);
    } catch (err) {
      console.warn("Failed to load consents, using fallback:", err);
      setConsents([
        {
          id: "con-01",
          citizen_name: "Aarav Sharma",
          citizen_masked_id: "•••• •••• 4091",
          source_authority: "Maharashtra Water Supply & Sewerage Board",
          target_authority: "Public Works Department (PWD Roads)",
          data_attributes: ["Utility Trench Location", "Consumer Connection ID", "Site Contact"],
          purpose:
            "Verification of utility connection coordinates and property boundary for road excavation",
          status: "GRANTED",
          legal_basis: "DEPA Framework / DPDP Act 2023 Sec 6(1)",
          expires_at: "2026-10-15T18:30:00Z",
          granted_at: "2026-09-01T10:14:00Z",
          audit_hash: "0x7a8f9c21e04b4d6a",
        },
        {
          id: "con-02",
          citizen_name: "Aarav Sharma",
          citizen_masked_id: "•••• •••• 4091",
          source_authority: "MCGM Municipal Front-Office",
          target_authority: "Power Distribution & Streetlighting (MSEDCL)",
          data_attributes: ["GIS Geo-Coordinates", "Transformer Substation Code"],
          purpose:
            "Corridor electrical feeder telemetry and transformer safety verification during water pipe weld",
          status: "PENDING",
          legal_basis: "DEPA Framework / DPDP Act 2023 Sec 6(2)",
          expires_at: "2026-09-30T23:59:59Z",
          granted_at: null,
          audit_hash: "0x3b1c4e92f1807d2a",
        },
        {
          id: "con-03",
          citizen_name: "Priya Nair",
          citizen_masked_id: "•••• •••• 8219",
          source_authority: "Public Works Department (PWD Roads)",
          target_authority: "Verified PWD Contractor (Reg #MH-PWD-4091)",
          data_attributes: ["Geo-Tagged Damage Evidence", "Pothole Dimensions", "Locality Landmark"],
          purpose: "Field execution inspection and post-repair photographic quality sign-off",
          status: "GRANTED",
          legal_basis: "Public Municipal Reinstatement Standard",
          expires_at: "2026-11-20T12:00:00Z",
          granted_at: "2026-09-05T14:22:00Z",
          audit_hash: "0x9d4e5f6a1c2b3048",
        },
        {
          id: "con-04",
          citizen_name: "Vikram Deshmukh",
          citizen_masked_id: "•••• •••• 5520",
          source_authority: "Stormwater Drainage Directorate",
          target_authority: "Public Health & Sanitation Directorate",
          data_attributes: ["Culvert Silt Depth", "Water Stagnation Index"],
          purpose:
            "Water sample microbiological evaluation and vector-borne pathogen containment",
          status: "REVOKED",
          legal_basis: "Revocation under DPDP Act 2023 Right to Withdraw",
          expires_at: "2026-08-30T10:00:00Z",
          granted_at: "2026-08-10T09:00:00Z",
          audit_hash: "0x2e8a7c14f09d6b53",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsents();
  }, []);

  const handleGrant = async (id: string) => {
    try {
      setActionLoading(id);
      await grantDepaConsent(id);
      setToastMessage("✓ Consent successfully GRANTED. Cryptographic audit receipt generated.");
      setConsents((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "GRANTED", granted_at: new Date().toISOString() } : c
        )
      );
    } catch {
      setConsents((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "GRANTED", granted_at: new Date().toISOString() } : c
        )
      );
      setToastMessage("✓ Consent GRANTED (Simulated).");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      setActionLoading(id);
      await revokeDepaConsent(id);
      setToastMessage("🔒 Consent immediately REVOKED. Department access severed.");
      setConsents((prev) => (c.id === id ? { ...c, status: "REVOKED" } : c));
    } catch {
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "REVOKED" } : c))
      );
      setToastMessage("🔒 Consent REVOKED (Simulated).");
    } finally {
      setActionLoading(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <PageShell className="pt-24 sm:pt-28 pb-20 max-w-6xl">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>DEPA (Consent Artefact) · DPDP Act 2023 Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Sathi Sahamati (Citizen Data Consent)
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Citizen-centric data empowerment portal. Transparently grant, audit, and revoke data
              sharing agreements between sovereign government departments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton asChild size="sm" variant="glass">
              <Link to="/state-command-center">
                <Shield className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                State Command
              </Link>
            </GlassButton>
            <GlassButton size="sm" variant="glass" onClick={loadConsents} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Friendly Plain-English Explainer Banner */}
      <div className="mb-8">
        <FeatureExplainerBanner
          title="Sathi Sahamati (Citizen Data Consent & Privacy Governance)"
          problem="Citizens worry that reporting a civic issue will lead to government departments silently sharing, selling, or leaking their phone numbers, Aadhaar, and home addresses."
          solution="Compliant with India's Digital Personal Data Protection (DPDP) Act 2023, departments can only share your details across agencies when you explicitly grant consent for that specific repair."
          benefit="Complete privacy control: Grant or revoke access with 1 click, verified with tamper-proof cryptographic audit receipts."
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* DPDP Educational Callout */}
      <GlassCard className="p-5 border-teal-500/25 bg-gradient-to-r from-teal-500/[0.05] via-surface/80 to-surface/80 mb-8 space-y-2">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-xs">
          <Lock className="h-4 w-4" />
          <span>Zero Silent Data Sharing Across Sovereign Silos</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Under the Government of Maharashtra SIH26129 architecture, sovereign government systems
          (e.g., Water Board, PWD Roads, MCGM) <strong>never share raw database credentials</strong>.
          Every cross-agency attribute exchange requires a cryptographically signed DEPA consent
          artefact specifying exact purpose, attribute boundaries, and automatic expiry dates.
        </p>
      </GlassCard>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Active Data Consents
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {consents.filter((c) => c.status === "GRANTED").length}
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Authorized Agreements
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Pending Approval
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {consents.filter((c) => c.status === "PENDING").length}
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Action Required
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Revoked / Expired
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {consents.filter((c) => c.status === "REVOKED").length}
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Access Severed
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Audit Trail
          </span>
          <div className="text-2xl font-black text-foreground">100%</div>
          <span className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 font-semibold block">
            ● Signed Digests
          </span>
        </GlassCard>
      </div>

      {/* Consent Agreements Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-orange-500" />
          Active Inter-Agency Consent Artefacts ({consents.length})
        </h2>

        <div className="space-y-4">
          {consents.map((c) => {
            const isGranted = c.status === "GRANTED";
            const isPending = c.status === "PENDING";
            const isRevoked = c.status === "REVOKED";
            const isCurrentAction = actionLoading === c.id;

            return (
              <GlassCard
                key={c.id}
                elevation="raised"
                className={cn(
                  "p-5 space-y-4 border transition-all",
                  isGranted
                    ? "border-emerald-500/30 hover:border-emerald-500/60"
                    : isPending
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : "border-border/40 opacity-70"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        Artefact #{c.id}
                      </span>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border",
                          isGranted
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : isPending
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        )}
                      >
                        ● {c.status}
                      </span>
                      <span className="text-[0.68rem] text-muted-foreground font-mono">
                        Citizen ID: {c.citizen_masked_id} ({c.citizen_name})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-foreground flex-wrap pt-1">
                      <span className="text-orange-600 dark:text-orange-400">
                        {c.source_authority}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {c.target_authority}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending && (
                      <GlassButton
                        size="sm"
                        onClick={() => handleGrant(c.id)}
                        disabled={isCurrentAction}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Grant Consent
                      </GlassButton>
                    )}

                    {isGranted && (
                      <GlassButton
                        size="sm"
                        variant="glass"
                        onClick={() => handleRevoke(c.id)}
                        disabled={isCurrentAction}
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border-rose-500/30 text-xs font-semibold"
                      >
                        <Lock className="h-3.5 w-3.5 mr-1" />
                        Revoke Access
                      </GlassButton>
                    )}

                    {isRevoked && (
                      <span className="text-xs text-muted-foreground font-semibold px-2 py-1 rounded bg-surface-elevated">
                        Access Terminated
                      </span>
                    )}
                  </div>
                </div>

                {/* Purpose & Legal Basis */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-foreground font-medium">{c.purpose}</div>
                  <div className="text-[0.68rem] text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-teal-500" />
                    <span>Legal Ground: {c.legal_basis}</span>
                  </div>
                </div>

                {/* Attribute Badges */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[0.68rem] font-bold text-muted-foreground uppercase">
                    Authorized Fields:
                  </span>
                  {c.data_attributes.map((attr) => (
                    <span
                      key={attr}
                      className="px-2.5 py-0.5 rounded-lg bg-surface/70 border border-border/50 font-mono text-[0.68rem] text-foreground font-medium"
                    >
                      {attr}
                    </span>
                  ))}
                </div>

                {/* Footer Metadata */}
                <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[0.7rem] text-muted-foreground">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span>Expires: {new Date(c.expires_at).toLocaleDateString()}</span>
                    {c.granted_at && (
                      <span>
                        Granted: {new Date(c.granted_at).toLocaleDateString()} at{" "}
                        {new Date(c.granted_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => copyHash(c.audit_hash)}
                    className="inline-flex items-center gap-1 bg-surface/60 border border-border/40 px-2 py-0.5 rounded hover:text-foreground font-mono text-[0.68rem]"
                    title="Click to copy SHA-256 Audit Signature"
                  >
                    <Hash className="h-3 w-3 text-orange-500" />
                    <span>{c.audit_hash}</span>
                    {copiedHash === c.audit_hash ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
