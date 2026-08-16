import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import {
  getWorkOrder,
  submitFieldEvidence,
  updateWorkOrderStatus,
} from "@/services/api";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { toast } from "sonner";
import { Calendar, Clock, FileText, IndianRupee, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contractor/work-orders/$id")({
  head: ({ params }: any) => ({ meta: [{ title: `Work Order – JANMIND` }] }),
  component: ContractorWorkOrderDetail,
});

// Maps backend WorkOrderStatus values to display labels
const STATUS_LABEL: Record<string, string> = {
  ISSUED: "Issued — Action Required",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  INSPECTION_PENDING: "Awaiting Municipal Inspection",
  INSPECTION_FAILED: "Inspection Failed",
  REWORK: "Rework Required",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

const STATUS_COLOR: Record<string, string> = {
  ISSUED: "var(--primary)",
  ACCEPTED: "var(--primary)",
  IN_PROGRESS: "var(--warning)",
  INSPECTION_PENDING: "var(--warning)",
  INSPECTION_FAILED: "var(--critical)",
  REWORK: "var(--critical)",
  COMPLETED: "var(--success)",
  CLOSED: "var(--muted-foreground)",
};

// Backend transition rules for contractors
const CONTRACTOR_NEXT_STATUS: Record<string, string | null> = {
  ISSUED: "ACCEPTED",
  ACCEPTED: "IN_PROGRESS",
  IN_PROGRESS: "INSPECTION_PENDING",
  REWORK: "INSPECTION_PENDING",
};

const CONTRACTOR_NEXT_LABEL: Record<string, string> = {
  ISSUED: "Accept Work Order",
  ACCEPTED: "Start Work",
  IN_PROGRESS: "Submit for Inspection",
  REWORK: "Resubmit for Inspection",
};

function ContractorWorkOrderDetail() {
  const { id } = Route.useParams();
  const { contractor } = useContractorAuth();
  const router = useRouter();

  const [wo, setWo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Evidence form
  const [evidenceStage, setEvidenceStage] = useState("COMPLETION");
  const [fileData, setFileData] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getWorkOrder(id);
      if (!data) throw new Error("Work order not found.");
      setWo(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use contractor.id (real JWT sub) — not the old contractorId field
    if (contractor?.id) loadData();
  }, [id, contractor?.id]);

  if (loading) return <LoadingState message="Loading work order details..." />;
  if (error) return <ErrorState description={error.message} />;
  if (!wo) return null;

  const nextStatus = CONTRACTOR_NEXT_STATUS[wo.status] ?? null;
  const nextLabel = CONTRACTOR_NEXT_LABEL[wo.status] ?? "";

  const isOverdue =
    wo.target_completion_date &&
    new Date(wo.target_completion_date) < new Date() &&
    !["COMPLETED", "CLOSED"].includes(wo.status);

  /* ── Status transition handler ────────────────────────────────────── */
  const handleStatusChange = async (status: string) => {
    setActionLoading(true);
    try {
      await updateWorkOrderStatus(wo.id, status);
      toast.success(`Work order updated to: ${STATUS_LABEL[status] ?? status}`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Evidence submit ──────────────────────────────────────────────── */
  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) {
      toast.error("Please select a photo.");
      return;
    }
    setActionLoading(true);
    try {
      await submitFieldEvidence(wo.id, fileData, evidenceDesc || evidenceStage);
      toast.success("Evidence uploaded. Work order is now pending inspection.");
      setFileData("");
      setEvidenceDesc("");
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload evidence.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade pb-12 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        to={"/contractor/work-orders" as any}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Work Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
              {wo.title ?? "Work Order"}
            </h1>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface-elevated)]"
              style={{ color: STATUS_COLOR[wo.status] ?? "var(--foreground)" }}
            >
              {STATUS_LABEL[wo.status] ?? wo.status}
            </span>
          </div>
          <p className="text-sm font-mono text-[var(--muted-foreground)]">ID: {wo.id}</p>
        </div>

        {/* Primary action button */}
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            disabled={actionLoading}
            className="shrink-0 px-5 py-2.5 rounded-md font-medium text-sm text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {actionLoading ? "Updating..." : nextLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left — Details ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-5 glass-strong space-y-5">
            <SectionLabel>Work Order Details</SectionLabel>

            {wo.description && (
              <p className="text-sm text-[var(--foreground)] leading-relaxed">{wo.description}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-0.5">Contract Value</div>
                  <div className="font-semibold text-[var(--foreground)]">
                    ₹{(wo.award_value ?? 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-0.5">Estimated Budget</div>
                  <div className="text-[var(--foreground)]">
                    ₹{(wo.estimated_budget ?? wo.award_value ?? 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-0.5">Risk Level</div>
                  <div
                    className="font-medium uppercase text-xs"
                    style={{
                      color:
                        wo.risk_level === "HIGH" || wo.risk_level === "CRITICAL"
                          ? "var(--critical)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {wo.risk_level ?? "LOW"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar size={15} className="text-[var(--muted-foreground)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[var(--muted-foreground)] text-xs">Issued On</div>
                    <div className="text-[var(--foreground)]">
                      {wo.created_at ? new Date(wo.created_at).toLocaleDateString("en-IN") : "—"}
                    </div>
                  </div>
                </div>
                {wo.target_completion_date && (
                  <div className="flex items-start gap-2">
                    <Clock
                      size={15}
                      className={`mt-0.5 shrink-0 ${isOverdue ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}`}
                    />
                    <div>
                      <div
                        className={`text-xs ${isOverdue ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}`}
                      >
                        Target Completion
                      </div>
                      <div
                        className={`font-medium ${isOverdue ? "text-[var(--critical)]" : "text-[var(--foreground)]"}`}
                      >
                        {new Date(wo.target_completion_date).toLocaleDateString("en-IN")}
                        {isOverdue && (
                          <span className="ml-2 text-xs font-normal">(overdue)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Progress bar */}
          <GlassCard className="p-5 glass-strong">
            <SectionLabel>Execution Progress</SectionLabel>
            <div className="mt-4 space-y-3">
              {[
                { label: "Reported by You", pct: wo.reported_progress_pct ?? 0, color: "var(--primary)" },
                { label: "Verified by Officer", pct: wo.verified_progress_pct ?? 0, color: "var(--success)" },
                { label: "Planned", pct: wo.planned_progress_pct ?? 0, color: "var(--muted-foreground)" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted-foreground)]">{label}</span>
                    <span style={{ color }} className="font-medium">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── Right — Evidence + Status ──────────────────────────────── */}
        <div className="space-y-6">
          {/* Evidence upload panel — show whenever work is in progress or rework */}
          {["IN_PROGRESS", "REWORK"].includes(wo.status) && (
            <GlassCard className="p-5 border border-[var(--primary)]/30">
              <SectionLabel className="flex items-center gap-2 text-[var(--primary)]">
                <FileText size={16} /> Submit Field Evidence
              </SectionLabel>
              <form onSubmit={handleEvidenceSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="label-xs block mb-1">Stage</label>
                  <select
                    value={evidenceStage}
                    onChange={(e) => setEvidenceStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--glass-border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="BEFORE">Before Repair</option>
                    <option value="START">Start of Work</option>
                    <option value="DURING">During Execution</option>
                    <option value="COMPLETION">Completion</option>
                  </select>
                </div>
                <div>
                  <label className="label-xs block mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    placeholder="Brief note about the photo…"
                    className="w-full px-3 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="label-xs block mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFileData(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-sm text-[var(--muted-foreground)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[var(--surface-elevated)] file:text-[var(--foreground)] hover:file:bg-[var(--primary)]/10"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading || !fileData}
                  className="w-full py-2 rounded-md text-sm font-medium text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {actionLoading ? "Uploading…" : "Upload Evidence"}
                </button>
              </form>
            </GlassCard>
          )}

          {/* Inspection pending notice */}
          {wo.status === "INSPECTION_PENDING" && (
            <GlassCard className="p-5 border border-[var(--warning)]/40 bg-[color-mix(in_oklab,var(--warning)_5%,transparent)]">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-[var(--warning)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Awaiting Municipal Inspection
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Evidence has been submitted. A municipal officer will review and either pass or
                    request rework.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Inspection failed — rework notice */}
          {wo.status === "REWORK" && (
            <GlassCard className="p-5 border border-[var(--critical)]/40 bg-[color-mix(in_oklab,var(--critical)_5%,transparent)]">
              <div className="flex items-start gap-3">
                <IndianRupee size={20} className="text-[var(--critical)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--critical)]">Rework Required</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    The municipal inspection did not pass. Please address the issues and resubmit
                    evidence.
                  </p>
                  <button
                    onClick={() => handleStatusChange("INSPECTION_PENDING")}
                    disabled={actionLoading}
                    className="mt-3 px-4 py-1.5 rounded-md text-xs font-medium text-white bg-[var(--critical)] hover:opacity-90 disabled:opacity-50"
                  >
                    Resubmit for Inspection
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Completed */}
          {wo.status === "COMPLETED" && (
            <GlassCard className="p-5 border border-[var(--success)]/40 bg-[color-mix(in_oklab,var(--success)_5%,transparent)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--success)]">Work Completed</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    This work order has been inspected and marked complete. The linked civic issue
                    and citizen complaints have been resolved automatically.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Quick info card */}
          <GlassCard className="p-5 glass-strong space-y-3 text-sm">
            <SectionLabel>Quick Info</SectionLabel>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Awarded By</span>
                <span className="font-medium truncate max-w-[55%] text-right">
                  {wo.contractor_name ?? "Municipality"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Award Value</span>
                <span className="font-medium">₹{(wo.award_value ?? 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Tender ID</span>
                <span className="font-mono text-xs truncate max-w-[55%] text-right">{wo.tender_id}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
