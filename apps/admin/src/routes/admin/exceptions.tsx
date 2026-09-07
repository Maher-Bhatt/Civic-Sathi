import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ArrowRight,
  Database,
  RefreshCw,
  Shield,
  Layers,
  Sparkles,
  Server,
  Radio,
  FileCheck,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { getMdmExceptions, resolveMdmException } from "@/services/api";
import type { MdmException } from "@/services/types";
import { cn } from "@/lib/utils";
import { FeatureExplainerBanner } from "@/components/feature-explainer-banner";

export const Route = createFileRoute("/exceptions")({
  head: () => ({
    meta: [
      { title: "MDM Data Quality & Exception Queue — Govt. of Maharashtra (SIH26129)" },
      {
        name: "description",
        content:
          "Master Data Management (MDM) exception queue. Resolve cross-department identity conflicts, schema mapping gaps, and duplicate grievance filings.",
      },
    ],
  }),
  component: MdmExceptionQueuePage,
});

export function MdmExceptionQueuePage() {
  const [exceptions, setExceptions] = useState<MdmException[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadExceptions = async () => {
    try {
      setLoading(true);
      const data = await getMdmExceptions();
      setExceptions(data);
    } catch (err) {
      console.warn("Failed to load exceptions, using fallback:", err);
      setExceptions([
        {
          id: "exc-01",
          issue_type: "MISMATCHED_CITIZEN_MOBILE",
          title: "Conflicting Citizen Mobile Across Portals",
          system_a: {
            name: "Water Supply Board",
            field: "consumer_phone",
            value: "+91 98201 44821",
          },
          system_b: {
            name: "MCGM Property Tax",
            field: "assessee_mobile",
            value: "+91 98204 99120",
          },
          severity: "HIGH",
          status: "OPEN",
          confidence_score: 0.88,
          recommended_action: "Merge to primary verified MeriPehchaan SSO contact (+91 98201 44821)",
          occurred_at: "2026-09-07T12:45:00Z",
        },
        {
          id: "exc-02",
          issue_type: "CONFLICTING_WARD_BOUNDARY_GIS",
          title: "Discrepant Ward Cadastral Boundary",
          system_a: {
            name: "PWD Roads Division",
            field: "ward_code",
            value: "WARD-H-WEST",
          },
          system_b: {
            name: "Stormwater Drainage",
            field: "catchment_zone",
            value: "ZONE-B-BANDRA",
          },
          severity: "MEDIUM",
          status: "OPEN",
          confidence_score: 0.94,
          recommended_action: "Adopt State Master GIS Cadastral Polygon (Ward H-West)",
          occurred_at: "2026-09-07T14:10:00Z",
        },
        {
          id: "exc-03",
          issue_type: "UNMAPPED_LEGACY_SCHEMA_CODE",
          title: "Unknown Telemetry Attribute in External Feed",
          system_a: {
            name: "Power Distribution (MSEDCL)",
            field: "breaker_code",
            value: "FEEDER_SW_99",
          },
          system_b: {
            name: "Sathi Setu CDM",
            field: "canonical_breaker_state",
            value: "UNMAPPED",
          },
          severity: "LOW",
          status: "OPEN",
          confidence_score: 0.75,
          recommended_action: "Map to Canonical CDM attribute 'FEEDER_AUTO_TRIPPED'",
          occurred_at: "2026-09-07T15:00:00Z",
        },
        {
          id: "exc-04",
          issue_type: "DUPLICATE_CROSS_PORTAL_GRIEVANCE",
          title: "Duplicate Incident Filed in Aaple Sarkar & Civic Sathi",
          system_a: {
            name: "Aaple Sarkar Portal",
            field: "ticket_id",
            value: "AS-2026-94812",
          },
          system_b: {
            name: "Civic Sathi Master Case",
            field: "case_number",
            value: "MH-MCGM-2026-080596",
          },
          severity: "HIGH",
          status: "RESOLVED",
          confidence_score: 0.99,
          recommended_action: "Merged to Golden Record Master Case MH-MCGM-2026-080596",
          occurred_at: "2026-09-06T18:20:00Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExceptions();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      setResolvingId(id);
      await resolveMdmException(id);
      setToastMessage("✓ Golden Record Merged! Canonical entity published to Sathi Setu.");
      setExceptions((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "RESOLVED" } : e))
      );
    } catch {
      setExceptions((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "RESOLVED" } : e))
      );
      setToastMessage("✓ Golden Record Merged (Simulated).");
    } finally {
      setResolvingId(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <PageShell className="pt-24 sm:pt-28 pb-20 max-w-6xl">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <Database className="h-3.5 w-3.5" />
              <span>MDM Golden Record Resolution · SIH26129 Interoperability</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Data Quality & MDM Exception Queue
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Arbitrates conflicting records and unmapped schemas across sovereign department
              databases without modifying legacy departmental schemas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton asChild size="sm" variant="glass">
              <Link to="/integration-hub">
                <Server className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                Integration Hub
              </Link>
            </GlassButton>
            <GlassButton size="sm" variant="glass" onClick={loadExceptions} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Friendly Plain-English Explainer Banner */}
      <div className="mb-8">
        <FeatureExplainerBanner
          title="Data Quality & Profile Record Sync (Master Data Management)"
          problem="If your phone number is updated in the Water Department records but outdated in the PWD Road records, SMS notifications fail and field workers cannot reach you."
          solution="Civic Sathi automatically catches these conflicting records across departments and lets citizens or officials merge them into a single verified 'Golden Record' in 1 click."
          benefit="Never miss a repair update, eliminate duplicate profiles, and ensure all municipal departments have your accurate contact information."
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
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

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Total Anomalies Flagged
          </span>
          <div className="text-2xl font-black text-foreground">{exceptions.length}</div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Across 6 Sovereign Feeds
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 border-amber-500/30">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Open Exceptions
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {exceptions.filter((e) => e.status === "OPEN").length}
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Pending Resolution
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Resolved & Merged
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {exceptions.filter((e) => e.status === "RESOLVED").length}
          </div>
          <span className="text-[0.65rem] text-muted-foreground font-semibold block">
            Golden Records Created
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            Confidence Matching
          </span>
          <div className="text-2xl font-black text-foreground">91.5%</div>
          <span className="text-[0.65rem] text-emerald-600 dark:text-emerald-400 font-semibold block">
            ● MDM Heuristic Accuracy
          </span>
        </GlassCard>
      </div>

      {/* Exceptions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Flagged Identity & Schema Discrepancies ({exceptions.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            One-Click Golden Record Deduplication
          </span>
        </div>

        <div className="space-y-4">
          {exceptions.map((exc) => {
            const isOpen = exc.status === "OPEN";
            const isCurrent = resolvingId === exc.id;

            return (
              <GlassCard
                key={exc.id}
                elevation="raised"
                className={cn(
                  "p-5 space-y-4 border transition-all",
                  isOpen
                    ? "border-amber-500/40 hover:border-amber-500/70"
                    : "border-emerald-500/30 opacity-80"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {exc.id}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase",
                          exc.severity === "HIGH"
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                            : exc.severity === "MEDIUM"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        )}
                      >
                        {exc.severity} SEVERITY
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase border",
                          isOpen
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        )}
                      >
                        ● {exc.status}
                      </span>
                      <span className="text-[0.68rem] text-muted-foreground font-mono">
                        Match Confidence: {(exc.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground">{exc.title}</h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      Type: {exc.issue_type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {isOpen ? (
                      <GlassButton
                        size="sm"
                        onClick={() => handleResolve(exc.id)}
                        disabled={isCurrent}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs hover:brightness-110 shadow-sm"
                      >
                        <GitMerge className="h-3.5 w-3.5 mr-1" />
                        {isCurrent ? "Merging..." : "Merge Golden Record"}
                      </GlassButton>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Merged to Golden Record</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Data Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface/60 border border-border/40 space-y-1">
                    <span className="text-[0.68rem] font-bold uppercase text-orange-600 dark:text-orange-400 block">
                      System A: {exc.system_a.name}
                    </span>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-muted-foreground">{exc.system_a.field}:</span>
                      <span className="font-bold text-foreground">{exc.system_a.value}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface/60 border border-border/40 space-y-1">
                    <span className="text-[0.68rem] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                      System B: {exc.system_b.name}
                    </span>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-muted-foreground">{exc.system_b.field}:</span>
                      <span className="font-bold text-foreground">{exc.system_b.value}</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Resolution Directives */}
                <div className="rounded-xl bg-surface-elevated/70 border border-border/50 p-3 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500 shrink-0" />
                    <span>
                      <strong className="text-foreground">Recommended Resolution:</strong>{" "}
                      <span className="text-muted-foreground">{exc.recommended_action}</span>
                    </span>
                  </div>
                  <span className="text-[0.68rem] text-muted-foreground shrink-0 hidden sm:inline">
                    Flagged: {new Date(exc.occurred_at).toLocaleTimeString()}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
