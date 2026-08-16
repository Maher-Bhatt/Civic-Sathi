import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  ExplainabilityPanel,
  RecommendedActionsPanel,
  RootCausePanel,
} from "@/components/municipality/explainability-panel";
import { FieldActionCard } from "@/components/municipality/investigation-timeline";
import { RiskScorePanel } from "@/components/municipality/risk-score";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import {
  assignIssueDepartment,
  getMuniComplaints,
  getSystemicIssue,
  startInvestigation,
  updateSystemicIssue,
} from "@/services/api";
import { DEPARTMENTS, riskLevel, type MuniComplaint, type SystemicIssue } from "@/services/types";

export const Route = createFileRoute("/_auth/issues/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `Issue Intelligence — ${params.id}` }],
  }),
  component: IssueDetailPage,
});

function IssueDetailPage() {
  const { id } = Route.useParams() as any;
  const [issue, setIssue] = useState<SystemicIssue | null>(null);
  const [related, setRelated] = useState<MuniComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSystemicIssue(id)
      .then(async (i) => {
        if (!i) {
          setError(true);
          return;
        }
        setIssue(i);
        if (i.relatedComplaintIds.length > 0) {
          const all = await getMuniComplaints();
          setRelated(all.filter((c) => i.relatedComplaintIds.includes(c.id)));
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function refresh() {
    const i = await getSystemicIssue(id);
    if (i) setIssue(i);
  }

  if (loading) return <LoadingState message="Loading issue intelligence..." />;
  if (error || !issue) {
    return (
      <ErrorState
        description="Systemic issue not found."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const level = riskLevel(issue.riskScore);
  const up = issue.trendPct >= 0;

  return (
    <div className="muni-page-enter space-y-6">
      <Link
        to={"/issues" as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Emerging issues
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <SectionLabel>Systemic Issue Intelligence</SectionLabel>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
              level === "Critical"
                ? "border-critical/40 bg-critical/10 text-critical"
                : "border-warning/40 bg-warning/10 text-warning",
            )}
          >
            {issue.status}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">{issue.category}</h1>
        <p className="mt-1 text-muted-foreground">
          {issue.areaName} · {issue.ward}
        </p>
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Reports </span>
            <span className="font-semibold tabular-nums">{issue.complaintCount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Risk </span>
            <span className="font-semibold tabular-nums">{issue.riskScore}/100</span>
          </div>
          <div className={cn("flex items-center gap-1", up ? "text-[#a4503f]" : "text-primary")}>
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-semibold tabular-nums">
              {up ? "+" : ""}
              {issue.trendPct}%
            </span>
            <span className="text-muted-foreground">7-day trend</span>
          </div>
          <div className="text-muted-foreground">
            Updated {format(new Date(issue.updatedAt), "dd MMM yyyy, HH:mm")}
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ExplainabilityPanel issue={issue} />
          <RootCausePanel issue={issue} />
          <RecommendedActionsPanel
            actions={issue.recommendedActions}
            onStartInvestigation={() =>
              void startInvestigation(id).then(() => {
                toast.success("Investigation started");
                void refresh();
              })
            }
            onAssign={() =>
              void assignIssueDepartment(id, "Municipal Water").then(() => {
                toast.success("Assigned to Municipal Water");
                void refresh();
              })
            }
            onFieldAction={() => toast.info("Field action created (prototype).")}
            onMarkInvestigating={() =>
              void updateSystemicIssue(id, { status: "Investigating" }).then(() => {
                toast.success("Marked as investigating");
                void refresh();
              })
            }
          />
        </div>

        <div className="space-y-6">
          <RiskScorePanel score={issue.riskScore} factors={issue.riskFactors} />

          <FieldActionCard
            area={issue.areaName}
            priority={level}
            recommendations={issue.recommendedActions.slice(0, 3)}
            onAssign={() =>
              void assignIssueDepartment(id, DEPARTMENTS[0]!).then(() => {
                toast.success("Field team assigned");
                void refresh();
              })
            }
            onAcknowledge={() => toast.success("Acknowledged")}
            onStart={() =>
              void startInvestigation(id).then(() => {
                toast.success("Field action started");
                void refresh();
              })
            }
          />

          {related.length > 0 && (
            <GlassCard elevation="raised" className="p-6">
              <SectionLabel>Related Complaints</SectionLabel>
              <ul className="mt-4 space-y-2">
                {related.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={"/complaints/$id" as any}
                      params={{ id: c.id } as any}
                      className="text-sm text-primary hover:underline"
                    >
                      {c.id}
                    </Link>
                    <span className="ml-2 text-xs text-muted-foreground">{c.area}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
