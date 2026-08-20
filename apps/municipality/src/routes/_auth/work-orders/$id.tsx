import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { safeFormat } from "@/lib/safe-format";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  Building2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import {
  getWorkOrder,
  getWorkOrderEvents,
  updateWorkOrderStatus,
  recordInspection,
  submitMeasurement,
  getMeasurement,
  getBill,
  approveBill,
  getEvidence,
} from "@/services/api";
import { inspectWorkOrder } from "@/services/api";
import {
  workOrderStatusLabel,
  workOrderStatusColor,
  validateWorkOrderTransition,
  type WorkOrder,
  type WorkOrderEvent,
  type Inspection,
  type Measurement,
  type Bill,
} from "@/services/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/work-orders/$id")({
  head: ({ params }: any) => ({ meta: [{ title: `Work Order ${params.id} — Civic Sathi` }] }),
  component: WorkOrderDetailPage,
});

const STATUS_COLOR_MAP: Record<string, string> = {
  success: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  warning: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  primary: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  muted: "text-[var(--muted-foreground)] bg-[var(--muted)]",
};

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  STATUS_CHANGE: CheckCircle2,
  PROGRESS_UPDATE: Clock,
  INSPECTION: ClipboardCheck,
  MEASUREMENT: FileText,
  BILL: FileText,
  NOTE: FileText,
  PHOTO_UPLOADED: FileText,
};

function WorkOrderDetailPage() {
    const { t } = useI18n();
  const { id } = Route.useParams();
  const { officer } = useMuniAuth();
  const role = officer?.role === "Department Head" ? "department_head" : "supervisor";

  const [wo, setWo] = useState<WorkOrder | null>(null);
  const [events, setEvents] = useState<WorkOrderEvent[]>([]);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [acting, setActing] = useState(false);

  // Inspection form state
  const [inspPanel, setInspPanel] = useState(false);
  const [inspResult, setInspResult] = useState<"PASSED" | "FAILED">("PASSED");
  const [inspNotes, setInspNotes] = useState("");

  // Measurement form state
  const [measPanel, setMeasPanel] = useState(false);
  const [measTotal, setMeasTotal] = useState("");

  const canApprove = (officer?.role === "Department Head" || officer?.role === "Administrator") && wo?.status === "PENDING_APPROVAL";

  useEffect(() => {
    Promise.all([
      getWorkOrder(id),
      getWorkOrderEvents(id),
      getMeasurement(id),
      getBill(id),
      getEvidence(id),
    ])
      .then(([order, evts, meas, b, evds]) => {
        if (!order) { setError(true); return; }
        setWo(order);
        setEvents(evts);
        setMeasurement(meas);
        setBill(b);
        setEvidenceList(evds);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function transition(toStatus: Parameters<typeof validateWorkOrderTransition>[1]) {
    if (!wo || !officer) return;
    const check = validateWorkOrderTransition(wo.status, toStatus, role);
    if (!check.valid) { toast.error(check.reason); return; }
    setActing(true);
    try {
      const updated = await updateWorkOrderStatus(id, toStatus, officer.id, officer.name, role);
      setWo(updated);
      const evts = await getWorkOrderEvents(id);
      setEvents(evts);
      toast.success(`Status updated to: ${workOrderStatusLabel(toStatus)}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActing(false);
    }
  }

  async function handleInspection() {
    if (!officer) return;
    setActing(true);
    try {
      await inspectWorkOrder(id, inspResult === "PASSED" ? "PASS" : "FAIL", inspNotes);
      const [updated, evts, evds] = await Promise.all([
        getWorkOrder(id),
        getWorkOrderEvents(id),
        getEvidence(id),
      ]);
      setWo(updated);
      setEvents(evts);
      setEvidenceList(evds);
      setInspPanel(false);
      setInspNotes("");
      toast.success(inspResult === "PASSED" ? "Inspection passed and work order completed" : "Inspection failed and work order closed");
    } catch (cause: any) {
      toast.error(cause?.message || "Inspection was not saved; the work order is unchanged");
    } finally {
      setActing(false);
    }
  }

  async function handleVerifyMeasurement() {
    if (!officer || !wo) return;
    setActing(true);
    try {
      const meas = await submitMeasurement(
        {
          workOrderId: id,
          items: (wo.boqItems || []).map((b, i) => ({
            id: `mi_${i}`,
            description: b.description,
            unit: b.unit,
            plannedQuantity: b.quantity,
            executedQuantity: b.quantity,
            unitRate: b.unitRate,
            amount: b.amount,
          })),
          totalAmount: Number(measTotal) || wo.estimatedCost,
          measuredBy: officer.id,
          measuredByName: officer.name,
          measurementDate: new Date().toISOString(),
          verificationStatus: "VERIFIED",
          verifiedBy: officer.id,
          verifiedAt: new Date().toISOString(),
          contractorAcknowledged: false,
        },
        officer.id,
        officer.name,
      );
      setMeasurement(meas);
      await transition("BILL_SUBMITTED");
      setMeasPanel(false);
      toast.success("Measurement verified");
    } catch {
      toast.error("Failed to verify measurement");
    } finally {
      setActing(false);
    }
  }

  async function handleApproveBill() {
    if (!officer || !bill) return;
    setActing(true);
    try {
      const updated = await approveBill(bill.id, id, officer.id, officer.name, bill.submittedAmount);
      setBill(updated);
      await transition("PAYMENT_APPROVED");
      toast.success("Bill approved");
    } catch {
      toast.error("Failed to approve bill");
    } finally {
      setActing(false);
    }
  }

  if (loading) return <LoadingState message="Loading work order..." />;
  if (error || !wo) return <ErrorState description="Work order not found." onRetry={() => window.location.reload()} />;

  const colorKey = workOrderStatusColor(wo.status);
  const isOverdue = wo.slaDeadline && !isNaN(new Date(wo.slaDeadline).getTime()) ? isPast(new Date(wo.slaDeadline)) && wo.status !== "CLOSED" : false;

  return (
    <div className="muni-page-enter space-y-6">
      <Link
        to={"/work-orders" as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t('ui.all_work_orders')}</Link>

      <div className="flex flex-wrap items-center gap-3">
        <SectionLabel className="tabular-nums">{wo.id}</SectionLabel>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            STATUS_COLOR_MAP[colorKey] ?? STATUS_COLOR_MAP["muted"],
          )}
        >
          {workOrderStatusLabel(wo.status)}
        </span>
        {isOverdue && (
          <span className="flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--critical)]">
            <AlertTriangle className="h-3 w-3" /> {t('ui.overdue')}</span>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-2">
          {/* Details */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.work_order_details')}</SectionLabel>
            <h1 className="mt-3 text-xl font-semibold">{wo.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{wo.description}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="label-xs">{t('ui.contractor')}</dt>
                <dd className="mt-1 text-sm font-medium">{wo.contractorName}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.department')}</dt>
                <dd className="mt-1 text-sm">{wo.department}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.assigned_engineer')}</dt>
                <dd className="mt-1 text-sm">{wo.assignedEngineerName ?? "—"}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.location')}</dt>
                <dd className="mt-1 flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {wo.area}, {wo.ward}
                </dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.start_date')}</dt>
                <dd className="mt-1 text-sm">
                  {wo.actualStartDate
                    ? safeFormat(wo.actualStartDate, "dd MMM yyyy")
                    : safeFormat(wo.startDate, "dd MMM yyyy")}
                </dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.sla_deadline')}</dt>
                <dd className={cn("mt-1 text-sm font-medium", isOverdue && "text-[var(--critical)]")}>
                  {safeFormat(wo.slaDeadline, "dd MMM yyyy")}
                  {" "}
                  <span className="font-normal text-muted-foreground">
                    ({wo.slaDeadline && !isNaN(new Date(wo.slaDeadline).getTime()) ? formatDistanceToNow(new Date(wo.slaDeadline), { addSuffix: true }) : "N/A"})
                  </span>
                </dd>
              </div>
            </dl>
          </GlassCard>

          {/* BOQ */}
          {(wo.boqItems || []).length > 0 && (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.bill_of_quantities')}</SectionLabel>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)] text-left">
                      <th className="label-xs pb-2 pr-4">{t('ui.description')}</th>
                      <th className="label-xs pb-2 pr-4 text-right">{t('ui.unit')}</th>
                      <th className="label-xs pb-2 pr-4 text-right">{t('ui.qty')}</th>
                      <th className="label-xs pb-2 pr-4 text-right">{t('ui.rate')}</th>
                      <th className="label-xs pb-2 text-right">{t('ui.amount')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {(wo.boqItems || []).map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 pr-4 text-sm">{item.description}</td>
                        <td className="py-2 pr-4 text-right text-xs text-muted-foreground">{item.unit}</td>
                        <td className="py-2 pr-4 text-right tabular-nums">{item.quantity}</td>
                        <td className="py-2 pr-4 text-right tabular-nums">₹{item.unitRate.toLocaleString("en-IN")}</td>
                        <td className="py-2 text-right font-medium tabular-nums">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[var(--glass-border)] font-semibold">
                      <td colSpan={4} className="pt-2 pr-4">{t('ui.total')}</td>
                      <td className="pt-2 text-right tabular-nums">
                        ₹{(wo.boqItems || []).reduce((s, i) => s + i.amount, 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    {wo.approvedAmount && (
                      <tr className="text-[var(--success)]">
                        <td colSpan={4} className="pr-4 text-xs font-medium">{t('ui.approved_amount')}</td>
                        <td className="text-right text-sm tabular-nums font-semibold">
                          ₹{wo.approvedAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </GlassCard>
          )}

          {/* Municipality Action Panels */}
          {/* INSPECTION */}
          {wo.status === "SUBMITTED_FOR_INSPECTION" || wo.status === "RESUBMITTED" ? (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.record_inspection')}</SectionLabel>
              {!inspPanel ? (
                <button
                  type="button"
                  onClick={() => setInspPanel(true)}
                  className="action-btn primary mt-4"
                >
                  <ClipboardCheck className="mr-2 inline h-4 w-4" />
                  {t('ui.record_site_inspection')}</button>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    {(["PASSED", "FAILED"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setInspResult(r)}
                        className={cn(
                          "flex-1 rounded-xl border py-3 text-sm font-medium transition-colors",
                          inspResult === r
                            ? r === "PASSED"
                              ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]"
                              : "border-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] text-[var(--critical)]"
                            : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:bg-[var(--glass-strong)]",
                        )}
                      >
                        {r === "PASSED" ? "✓ Pass" : "✗ Fail"}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-xs">{t('ui.inspection_notes')}</label>
                    <textarea
                      value={inspNotes}
                      onChange={(e) => setInspNotes(e.target.value)}
                      rows={3}
                      className="filter-input"
                      placeholder={t('ui.describe_findings_quality_obse')}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => void handleInspection()}
                      disabled={acting}
                      className="action-btn primary flex-1"
                    >
                      {acting ? "Saving..." : "Submit Inspection"}
                    </button>
                    <button type="button" onClick={() => setInspPanel(false)} className="action-btn flex-1">
                      {t('ui.cancel')}</button>
                  </div>
                </div>
              )}
            </GlassCard>
          ) : null}

          {/* MEASUREMENT */}
          {wo.status === "MEASUREMENT_PENDING" && !measurement ? (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.verify_measurement')}</SectionLabel>
              {!measPanel ? (
                <button type="button" onClick={() => setMeasPanel(true)} className="action-btn primary mt-4">
                  {t('ui.verify_measurement_proceed_to_')}</button>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="label-xs">{t('ui.verified_total_amount')}</label>
                    <input
                      type="number"
                      value={measTotal}
                      onChange={(e) => setMeasTotal(e.target.value)}
                      className="filter-input"
                      placeholder={String(wo.approvedAmount ?? wo.estimatedCost)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => void handleVerifyMeasurement()} disabled={acting} className="action-btn primary flex-1">
                      {acting ? "Saving..." : "Verify & Proceed"}
                    </button>
                    <button type="button" onClick={() => setMeasPanel(false)} className="action-btn flex-1">{t('ui.cancel')}</button>
                  </div>
                </div>
              )}
            </GlassCard>
          ) : null}

          {/* BILL APPROVAL */}
          {bill && bill.status === "SUBMITTED" && wo.status === "BILL_SUBMITTED" ? (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.bill_approval')}</SectionLabel>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('ui.contractor_submitted_bill_for')}{" "}
                <span className="font-semibold text-foreground">₹{bill.submittedAmount.toLocaleString("en-IN")}</span>
              </p>
              <button
                type="button"
                onClick={() => void handleApproveBill()}
                disabled={acting}
                className="action-btn primary mt-4"
              >
                {acting ? "Approving..." : "Approve Bill & Initiate Payment"}
              </button>
            </GlassCard>
          ) : null}

          {/* CLOSE */}
          {wo.status === "PAYMENT_APPROVED" && (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.close_work_order')}</SectionLabel>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('ui.payment_approved_close_the_wor')}</p>
              <button
                type="button"
                onClick={() => void transition("CLOSED")}
                disabled={acting}
                className="action-btn primary mt-4"
              >
                {acting ? "Closing..." : "Close Work Order & Resolve Complaints"}
              </button>
            </GlassCard>
          )}

          {/* Timeline */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.work_order_timeline')}</SectionLabel>
            <ol className="relative mt-6 border-l border-[var(--glass-border)] pl-6 space-y-6">
              {events.map((evt) => {
                const Icon = EVENT_ICONS[evt.eventType] ?? CheckCircle2;
                return (
                  <li key={evt.id} className="relative">
                    <span className="absolute -left-[1.625rem] flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface-elevated)] ring-1 ring-[var(--glass-border)]">
                      <Icon className="h-3 w-3 text-[var(--primary)]" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{evt.title}</p>
                      {evt.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{evt.description}</p>
                      )}
                      <div className="mt-1 flex gap-3 text-[0.65rem] text-muted-foreground">
                        <span>{evt.actorName}</span>
                        <span className="capitalize">{evt.actorRole}</span>
                        <span>{safeFormat(evt.at, "dd MMM yyyy, HH:mm")}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </GlassCard>

          {/* Linked Complaints */}
          {Boolean(wo.civicIssueIds && wo.civicIssueIds.length > 0) && (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.linked_civic_issues')} ({(wo.civicIssueIds ?? []).length})</SectionLabel>
              <ul className="mt-4 space-y-2">
                {(wo.civicIssueIds ?? []).map((cid) => (
                  <li key={cid}>
                    <Link
                      to="/civic-issues/$id"
                      params={{ id: cid }}
                      className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 text-xs font-mono hover:bg-[var(--glass-strong)] transition-colors"
                    >
                      {cid}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
            <GlassCard className="p-0 glass-strong overflow-hidden mt-6">
              <div className="p-5 border-b border-[var(--glass-border)]">
                <SectionLabel>{t('ui.evidence_ai_validation')}</SectionLabel>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidenceList.map((e) => (
                  <div key={e.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--surface-elevated)] flex flex-col">
                    {e.fileUrl && e.fileUrl.length > 20 ? (
                      <div className="h-40 w-full bg-black/10 overflow-hidden flex items-center justify-center">
                         <img src={e.fileUrl} alt={e.stage} className="object-cover h-full w-full opacity-80 hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="h-40 w-full flex items-center justify-center bg-black/10 text-[var(--muted-foreground)]">
                         <FileText size={32} />
                      </div>
                    )}
                    <div className="p-3 text-sm flex flex-col gap-1">
                       <div className="font-bold">{e.stage}</div>
                       <div className="text-xs text-[var(--muted-foreground)]">{e.captureTimestamp ? safeFormat(e.captureTimestamp, "dd MMM yyyy, HH:mm") : "N/A"}</div>
                       <div className="mt-2 text-xs">
                          <span className={`inline-block px-2 py-1 rounded font-medium ${e.status === 'FLAGGED' ? 'bg-[var(--critical)]/20 text-[var(--critical)]' : 'bg-[var(--success)]/20 text-[var(--success)]'}`}>
                             {e.status}
                          </span>
                       </div>
                       {e.aiAnalysis && (
                         <div className="mt-2 pt-2 border-t border-[var(--glass-border)] text-xs text-[var(--muted-foreground)] space-y-1">
                           <div>{t('ui.ai_relevance')}<span className="text-[var(--foreground)] font-medium">{e.aiAnalysis.relevanceScore}%</span></div>
                           <div>{t('ui.tamper_risk')}<span className="text-[var(--foreground)] font-medium">{e.aiAnalysis.tamperRisk}</span></div>
                           {e.distanceFromSite !== undefined && (
                             <div>{t('ui.gps_distance')}<span className="text-[var(--foreground)] font-medium">{Math.round(e.distanceFromSite)}{t('ui.m')}</span></div>
                           )}
                           {e.aiAnalysis.flags?.length > 0 && (
                             <div className="text-[var(--critical)] mt-1 font-medium">{e.aiAnalysis.flags.join(", ")}</div>
                           )}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
                {evidenceList.length === 0 && (
                  <div className="text-sm text-[var(--muted-foreground)] p-4 col-span-full text-center">{t('ui.no_evidence_submitted_yet')}</div>
                )}
              </div>
            </GlassCard>

          </div>

          {/* Right Column */}
        <div className="space-y-6">
          <GlassCard elevation="raised" className="p-5">
            <SectionLabel>{t('ui.financial_summary')}</SectionLabel>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="label-xs">{t('ui.estimated')}</dt>
                <dd className="mt-1 font-semibold tabular-nums">₹{wo.estimatedCost.toLocaleString("en-IN")}</dd>
              </div>
              {wo.approvedAmount && (
                <div>
                  <dt className="label-xs">{t('ui.approved')}</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[var(--success)]">
                    ₹{wo.approvedAmount.toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
              {bill?.approvedAmount && (
                <div>
                  <dt className="label-xs">{t('ui.bill_approved')}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">₹{bill.approvedAmount.toLocaleString("en-IN")}</dd>
                </div>
              )}
            </dl>
          </GlassCard>

          <GlassCard elevation="raised" className="p-5">
            <SectionLabel>{t('ui.quick_actions')}</SectionLabel>
            <div className="mt-4 space-y-2">
              <Link
                to={"/tenders/$id" as any}
                params={{ id: wo.workPackageId } as any}
                className="action-btn flex w-full items-center gap-2 text-xs"
              >
                <Building2 className="h-3.5 w-3.5" />
                {t('ui.view_work_package')}</Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

