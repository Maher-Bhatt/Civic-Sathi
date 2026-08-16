import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, HardHat, CheckCircle2, Clock, Building2 } from "lucide-react";

import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { ClientCityMap } from "@/components/city-map-panel";
import { getComplaint } from "@/services/api";
import { RELATED_SAMPLES } from "@/services/mockData";
import { clustersForCity, nearestCity } from "@/services/cities";
import { cn } from "@/lib/utils";

// Read work execution info from the shared store (public-safe fields only)
function useWorkExecutionStatus(complaintId: string) {
  const [info, setInfo] = useState<{
    hasWorkOrder: boolean;
    contractorCompany?: string;
    workOrderStatus?: string;
    progressPercent?: number;
    department?: string;
  }>({ hasWorkOrder: false });

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("janmind.work_orders") ?? "[]") as Array<{
        relatedComplaintIds: string[];
        contractorName: string;
        status: string;
        department: string;
      }>;
      const wo = orders.find((o) => o.relatedComplaintIds.includes(complaintId));
      if (!wo) return;

      const progress = JSON.parse(localStorage.getItem("janmind.field_progress") ?? "[]") as Array<{
        workOrderId: string; percentComplete: number;
      }>;
      // Find matching work order id
      const ordersRaw = JSON.parse(localStorage.getItem("janmind.work_orders") ?? "[]") as Array<{id:string;relatedComplaintIds:string[];}>;
      const woFull = ordersRaw.find((o) => o.relatedComplaintIds.includes(complaintId));
      const latestProgress = woFull ? progress.filter(p => p.workOrderId === (woFull as any).id).sort((a,b) => b.percentComplete - a.percentComplete)[0] : null;

      setInfo({
        hasWorkOrder: true,
        contractorCompany: wo.contractorName,
        workOrderStatus: wo.status,
        ...(latestProgress?.percentComplete !== undefined ? { progressPercent: latestProgress.percentComplete } : {}),
        department: wo.department,
      });
    } catch {
      // storage unavailable
    }
  }, [complaintId]);

  return info;
}

const WO_STATUS_PUBLIC: Record<string, { label: string; desc: string }> = {
  PENDING_ACCEPTANCE: { label: "Contractor Notified", desc: "A contractor has been assigned and notified." },
  ACCEPTED: { label: "Contractor Assigned", desc: "Contractor has confirmed and is preparing to mobilize." },
  MOBILIZATION: { label: "Mobilization", desc: "Contractor is mobilizing equipment and materials." },
  IN_PROGRESS: { label: "Work In Progress", desc: "Physical work is underway at the site." },
  SUBMITTED_FOR_INSPECTION: { label: "Inspection Pending", desc: "Work submitted. Municipal inspection is scheduled." },
  INSPECTION_FAILED: { label: "Rework Required", desc: "Inspection identified issues. Contractor is addressing them." },
  REWORK: { label: "Rework In Progress", desc: "Contractor is correcting identified issues." },
  INSPECTION_PASSED: { label: "Inspection Passed", desc: "Work passed municipal quality inspection." },
  COMPLETED: { label: "Work Completed", desc: "Physical work has been completed and verified." },
  CLOSED: { label: "Resolved", desc: "Work is complete and complaint has been resolved." },
};

export const Route = createFileRoute("/complaint/$id")({
  head: () => ({
    meta: [
      { title: "Complaint details — JANMIND" },
      {
        name: "description",
        content:
          "Full detail of a civic complaint: category, severity, location, evidence and resolution timeline.",
      },
      { property: "og:title", content: "Complaint details — JANMIND" },
      {
        property: "og:description",
        content: "Follow a civic complaint from submission to resolution.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/complaints">
      <ComplaintDetail />
    </AuthGate>
  ),
});

function ComplaintDetail() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["complaint", id],
    queryFn: () => getComplaint(id),
  });

  const workInfo = useWorkExecutionStatus(id);

  const city = data ? nearestCity(data.location.lat, data.location.lng) : null;

  const getRelatedSamples = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("water")) return ["No water supply for 2 days", "Contaminated drinking water", "Low water pressure in morning"];
    if (cat.includes("garbage") || cat.includes("waste")) return ["Garbage not collected", "Overflowing community bin", "Debris dumped on sidewalk"];
    if (cat.includes("drainage") || cat.includes("sewage")) return ["Sewage overflow on street", "Blocked storm drain", "Foul smell from open drain"];
    if (cat.includes("light")) return ["Streetlights not working", "Pole leaning dangerously", "Lights blinking continuously"];
    return ["Pothole on main road", "Road cave-in near circle", "Broken asphalt after rain"];
  };

  return (
    <PageShell className="max-w-3xl">
      <Link
        to="/complaints"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        My complaints
      </Link>

      <div className="mt-5">
        {isLoading && <LoadingState message="Loading complaint..." />}
        {isError && (
          <ErrorState
            description="We couldn't load this complaint."
            onRetry={() => void refetch()}
          />
        )}

        {data && (
          <div className="space-y-5">
            <div className="animate-rise flex flex-wrap items-center gap-3">
              <SectionLabel className="tabular-nums">{data.id}</SectionLabel>
              <StatusBadge status={data.status} />
              <SeverityBadge severity={data.severity} />
            </div>

            <GlassCard elevation="raised" className="animate-rise space-y-6 p-5 sm:p-7">
              <h1 className="text-xl font-semibold sm:text-2xl">{data.category}</h1>
              <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
                {data.description}
              </p>
              {data.photo && (
                <img
                  src={data.photo}
                  alt="Evidence submitted with this complaint"
                  loading="lazy"
                  className="h-56 w-full rounded-xl object-cover sm:h-72"
                />
              )}
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="label-xs">Location</dt>
                  <dd className="mt-1.5 text-sm font-medium">{data.location.area}</dd>
                </div>
                <div>
                  <dt className="label-xs">Submitted</dt>
                  <dd className="mt-1.5 text-sm font-medium">
                    {new Date(data.createdAt).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">Related reports</dt>
                  <dd className="mt-1.5 text-sm font-medium tabular-nums text-primary">
                    {data.relatedCount}
                  </dd>
                </div>
              </dl>
            </GlassCard>

            {/* Work Execution Status — shown only when a work order exists */}
            {workInfo.hasWorkOrder && workInfo.workOrderStatus && (
              <GlassCard elevation="raised" className="animate-rise p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <HardHat className="h-4 w-4 text-[var(--primary)]" />
                  <SectionLabel>Work Execution Status</SectionLabel>
                </div>
                <div className="mt-4 space-y-4">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        workInfo.workOrderStatus === "CLOSED" || workInfo.workOrderStatus === "COMPLETED"
                          ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]"
                          : workInfo.workOrderStatus?.includes("FAIL") || workInfo.workOrderStatus === "REWORK"
                            ? "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[var(--warning)]"
                            : "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-[var(--primary)]",
                      )}
                    >
                      {WO_STATUS_PUBLIC[workInfo.workOrderStatus]?.label ?? workInfo.workOrderStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {WO_STATUS_PUBLIC[workInfo.workOrderStatus]?.desc ?? "Work is in progress."}
                  </p>

                  {/* Contractor */}
                  {workInfo.contractorCompany && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contractor:</span>
                      <span className="font-medium">{workInfo.contractorCompany}</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  {workInfo.progressPercent !== undefined && workInfo.progressPercent > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Work progress
                        </span>
                        <span className="font-semibold tabular-nums text-foreground">{workInfo.progressPercent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--glass-border)]">
                        <div
                          className="h-full rounded-full bg-[var(--primary)] transition-all duration-700"
                          style={{ width: `${workInfo.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {workInfo.workOrderStatus === "INSPECTION_PASSED" || workInfo.workOrderStatus === "COMPLETED" || workInfo.workOrderStatus === "CLOSED" ? (
                    <div className="flex items-center gap-2 text-[var(--success)] text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Inspection passed — work quality verified by municipal engineer
                    </div>
                  ) : null}
                </div>
              </GlassCard>
            )}

            <GlassCard className="animate-rise overflow-hidden p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 pt-2 pb-3">
                <SectionLabel>Nearby civic activity</SectionLabel>
                <span className="text-xs text-muted-foreground">
                  {data.nearbyCount} similar reports within ~500m
                </span>
              </div>
              <ClientCityMap
                cityId={city!.id}
                clusters={clustersForCity(city!.id)}
                className="h-[260px] sm:h-[320px]"
                focus={{ lat: data.location.lat, lng: data.location.lng, zoom: 14 }}
                ariaLabel={`Map of civic activity near ${data.location.ward}`}
                showLegend={false}
              />
              <ul className="space-y-2 px-2.5 py-4">
                {getRelatedSamples(data.category).map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-critical opacity-70" />
                    "{s}"
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard elevation="raised" className="animate-rise p-5 sm:p-7">
              <SectionLabel className="mb-5">Timeline</SectionLabel>
              <ComplaintTimeline events={data.timeline} />
            </GlassCard>
          </div>
        )}
      </div>
    </PageShell>
  );
}

