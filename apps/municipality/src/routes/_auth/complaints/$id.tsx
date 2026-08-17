import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CivicMap } from "@/components/civic-map";
import { InvestigationTimeline } from "@/components/municipality/investigation-timeline";
import { SeverityBadge, StatusBadge } from "@/components/municipality/status-badge";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getMuniComplaint, getCivicIssues } from "@/services/api";
import { DEPARTMENTS, type MuniComplaint } from "@/services/types";
import type { ComplaintPoint, IssueKey, AreaHealth } from "@/services/geography";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/complaints/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `${params.id} — Municipal Intelligence` }],
  }),
  component: ComplaintDetailPage,
});

function ComplaintDetailPage() {
    const { t } = useI18n();
  const { id } = Route.useParams() as any;
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [complaint, setComplaint] = useState<MuniComplaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [civicIssues, setCivicIssues] = useState<any[]>([]);

  useEffect(() => {
    getMuniComplaint(id)
      .then((c) => {
        if (!c) setError(true);
        else setComplaint(c);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    getCivicIssues().then(setCivicIssues).catch(() => {});
  }, [id]);

  const allPoints: ComplaintPoint[] = useMemo(() => {
    return civicIssues.map((ci) => {
      let issue: IssueKey = "other";
      const cat = (ci.category || "").toLowerCase();
      if (cat.includes("water")) issue = "water";
      else if (cat.includes("road") || cat.includes("pothole")) issue = "roads";
      else if (cat.includes("garbage") || cat.includes("waste")) issue = "garbage";
      else if (cat.includes("drainage")) issue = "drainage";
      else if (cat.includes("light")) issue = "lighting";

      let health: AreaHealth = "low";
      const sev = (ci.severity || "").toLowerCase();
      if (sev === "critical") health = "critical";
      else if (sev === "high") health = "high";
      else if (sev === "moderate") health = "moderate";

      return {
        id: String(ci.id),
        areaId: String(ci.area || ""),
        issue,
        health,
        daysAgo: 0,
        lat: Number(ci.lat) || 0,
        lng: Number(ci.lng) || 0,
      };
    });
  }, [civicIssues]);

  async function handleAssign(dept: (typeof DEPARTMENTS)[number]) {
    const api = await import("@/services/api");
    const updated = await api.assignComplaint(id, { department: dept, ...(officer?.name ? { officer: officer.name } : {}) });
    setComplaint(updated);
    toast.success(`Assigned to ${dept}`);
  }

  if (loading) return <LoadingState message="Loading complaint..." />;
  if (error || !complaint) {
    return (
      <ErrorState
        description="Complaint not found."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const point: any = {
    id: complaint.id,
    lat: complaint.lat,
    lng: complaint.lng,
    issue: "other",
    health: "moderate",
    daysAgo: 0,
    areaId: complaint.area,
  };

  return (
    <div className="muni-page-enter space-y-6">
      <Link
        to={"/complaints" as any}
        search={{ area: "" } as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('ui.all_complaints')}</Link>

      <header className="flex flex-wrap items-center gap-3">
        <SectionLabel className="tabular-nums">{complaint.id}</SectionLabel>
        <StatusBadge status={complaint.status} />
        <SeverityBadge severity={complaint.severity} />
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.report_details')}</SectionLabel>
            <h1 className="mt-3 text-xl font-semibold">{complaint.category}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {complaint.description}
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="label-xs">{t('ui.area')}</dt>
                <dd className="mt-1 text-sm font-medium">{complaint.area}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.ward')}</dt>
                <dd className="mt-1 text-sm font-medium">{complaint.ward}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.department')}</dt>
                <dd className="mt-1 text-sm font-medium">{complaint.department}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.assigned_to')}</dt>
                <dd className="mt-1 text-sm font-medium">{complaint.assignedTo ?? "—"}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.created')}</dt>
                <dd className="mt-1 text-sm">
                  {format(new Date(complaint.createdAt), "dd MMM yyyy, HH:mm")}
                </dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.last_updated')}</dt>
                <dd className="mt-1 text-sm">
                  {format(new Date(complaint.updatedAt), "dd MMM yyyy, HH:mm")}
                </dd>
              </div>
            </dl>
          </GlassCard>

          {complaint.aiAnalysis && (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>{t('ui.ai_intelligence_analysis')}</SectionLabel>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="label-xs">{t('ui.detected_category')}</dt>
                  <dd className="mt-1 text-sm font-medium">{complaint.aiAnalysis.category}</dd>
                </div>
                <div>
                  <dt className="label-xs">{t('ui.urgency')}</dt>
                  <dd className="text-sm font-medium">{complaint.aiAnalysis?.sentiment}</dd>
                </div>
                <div>
                  <dt className="label-xs">{t('ui.similarity_match')}</dt>
                  <dd className="mt-1 text-sm tabular-nums">{complaint.aiAnalysis.similarity}%</dd>
                </div>
                {complaint.aiAnalysis.cluster && (
                  <div className="sm:col-span-2">
                    <dt className="label-xs">{t('ui.cluster')}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {complaint.aiAnalysis.cluster}
                    </dd>
                  </div>
                )}
              </dl>
              {complaint.clusterId && (
                <Link
                  to={"/issues/$id" as any}
                  params={{ id: complaint.clusterId } as any}
                  className="mt-4 inline-block text-sm text-primary hover:underline"
                >
                  {t('ui.view_related_systemic_issue')}</Link>
              )}
            </GlassCard>
          )}

          <GlassCard elevation="raised" className="overflow-hidden">
            <div className="border-b border-[var(--glass-border)] p-4">
              <SectionLabel>{t('ui.location')}</SectionLabel>
            </div>
            <div className="jm-map h-[240px]">
              <CivicMap
                cityId={city}
                mode="activity"
                activities={[]}
                points={[...allPoints, point]}
                selectedAreaId={null}
                onSelectArea={() => {}}
                compact
              />
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <InvestigationTimeline
            events={complaint.timeline}
            currentStatus={complaint.status}
          />

          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.officer_actions')}</SectionLabel>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void handleAssign("Water Supply" as any)} // TODO: Update to actual Verify API
                className="action-btn text-left bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
              >
                {t('ui.verify_accept_complaint')}</button>
              <button
                type="button"
                onClick={() => toast.success("Rejecting complaint...")} // TODO: Update to actual API
                className="action-btn text-left bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"
              >
                {t('ui.reject_as_invalid')}</button>
              <hr className="border-[var(--glass-border)] my-2" />
              <button
                type="button"
                className="action-btn text-left"
                onClick={() => toast.success("Opening classification...")}
              >
                {t('ui.classify_route')}</button>
              <button
                type="button"
                className="action-btn text-left"
                onClick={() => toast.success("Linking to issue...")}
              >
                {t('ui.link_to_civic_issue')}</button>
              <button
                type="button"
                className="action-btn text-left"
                onClick={() => toast.success("Creating procurement opportunity...")}
              >
                {t('ui.create_procurement_opportunity')}</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
