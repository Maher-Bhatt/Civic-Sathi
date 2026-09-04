import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { safeFormat } from "@/lib/safe-format";
import { ArrowLeft, Split, Merge, AlertTriangle, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { SeverityBadge, StatusBadge } from "@/components/municipality/status-badge";
import { getCivicIssues, materializeCivicIssue } from "@/services/api";
import { useI18n } from "@/lib/i18n";
import { useMuniAuth } from "@/lib/muni-auth";

export const Route = createFileRoute("/_auth/civic-issues/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `Civic Issue — ${params.id}` }],
  }),
  component: CivicIssueDetailPage,
});

function CivicIssueDetailPage() {
    const { t } = useI18n();
    const { officer } = useMuniAuth();
    const city = officer?.city ?? "pune";
  const { id } = Route.useParams() as any;
  const [issue, setIssue] = useState<any>(null);
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [merging, setMerging] = useState(false);
  const [materializing, setMaterializing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCivicIssues(city)
      .then((issues) => {
        setAllIssues(issues);
        const found = issues.find((i) => i.id === id);
        if (found) setIssue(found);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, city]);

  if (loading) return <LoadingState message="Loading civic issue..." />;
  if (error || !issue) return <ErrorState description="Civic issue not found." onRetry={() => window.location.reload()} />;

  const handleMerge = () => {
    toast.info("Issue merging is available after a backend systemic-issue cluster is created.");
    setMerging(false);
  };

  const handleSplit = () => {
    toast.info("Complaint splitting requires a backend civic-issue cluster.");
  };

  const handleCreateWorkPackage = async () => {
    setMaterializing(true);
    try {
      const approvedIssue = await materializeCivicIssue(String(issue.id));
      toast.success("Civic issue approved for procurement.");
      await navigate({
        to: "/tenders/new" as any,
        search: {
          civicIssueId: String(approvedIssue.id),
          title: approvedIssue.title ?? issue.title,
          description: approvedIssue.summary ?? issue.description,
          departmentId: approvedIssue.department_id ?? "",
          department: approvedIssue.department ?? issue.category,
          category: approvedIssue.category ?? issue.category,
          ward: String(approvedIssue.ward_number ?? issue.ward ?? ""),
          area: issue.area ?? "",
          scope: `1. Inspect the reported ${approvedIssue.category ?? issue.category} condition at the linked location.\n2. Restore safe public service and complete the required municipal repair.\n3. Submit photographic evidence and completion notes for inspection.`,
        } as any,
      });
    } catch (error: any) {
      toast.error(error?.message ?? "Unable to approve this civic issue for procurement");
    } finally {
      setMaterializing(false);
    }
  };

  return (
    <div className="muni-page-enter space-y-6 max-w-5xl">
      <Link
        to={"/civic-issues" as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('ui.all_civic_issues')}</Link>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <SectionLabel>{t('ui.civic_issue_intelligence')}</SectionLabel>
          <StatusBadge status={issue.status} />
          <SeverityBadge severity={issue.severity} />
        </div>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">{issue.title}</h1>
        <p className="mt-1 text-muted-foreground">
          {issue.area} · {issue.ward}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.issue_summary')}</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{issue.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-[var(--glass-border)]">
              <div>
                <dt className="label-xs">{t('ui.total_reports')}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{issue.reportCount}</dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.impact_score')}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-critical">{issue.impactScore}<span className="text-sm font-normal text-muted-foreground">/100</span></dd>
              </div>
              <div>
                <dt className="label-xs">{t('ui.first_reported')}</dt>
                <dd className="mt-1 text-sm font-medium">{safeFormat(issue.firstReportedAt, "dd MMM yyyy")}</dd>
              </div>
            </div>
          </GlassCard>

          <GlassCard elevation="raised" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>{t('ui.linked_complaints')}</SectionLabel>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)]">
                <div>
                  <Link to="/complaints/$id" params={{ id: String(issue.id) }} className="text-sm font-medium text-primary hover:underline">{String(issue.id)}</Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('ui.primary_reporter')}</p>
                </div>
                <button onClick={handleSplit} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--glass-strong)] transition-colors">
                  <Split className="w-3 h-3" /> {t('ui.split')}</button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard elevation="raised" className="p-6 border-warning/30 bg-warning/5">
            <SectionLabel className="text-warning flex items-center gap-2"><Merge className="w-4 h-4" /> {t('ui.merge_issue')}</SectionLabel>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('ui.if_this_issue_is_a_duplicate_o')}</p>
            
            {merging ? (
              <div className="mt-4 space-y-3">
                <select className="w-full bg-[var(--glass-strong)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-sm text-foreground">
                  <option value="">{t('ui.select_target_issue')}</option>
                  {allIssues.filter(i => i.id !== issue.id).map(i => (
                    <option key={i.id} value={i.id}>{i.category} - {i.ward}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={handleMerge} className="action-btn flex-1 bg-warning text-warning-foreground hover:bg-warning/90">{t('ui.confirm_merge')}</button>
                  <button onClick={() => setMerging(false)} className="action-btn flex-1 bg-transparent border border-border">{t('ui.cancel')}</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setMerging(true)} className="action-btn w-full mt-4 bg-[var(--glass-strong)]">
                {t('ui.merge_with_another_issue')}</button>
            )}
          </GlassCard>

          <GlassCard elevation="raised" className="p-6 border-primary/20">
            <SectionLabel className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> {t('ui.work_execution')}</SectionLabel>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('ui.this_civic_issue_is_ready_to_b')}</p>
            <button
              type="button"
              onClick={() => void handleCreateWorkPackage()}
              disabled={materializing}
              className="action-btn w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {materializing ? "Approving issue..." : t('ui.create_work_package')}</button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
