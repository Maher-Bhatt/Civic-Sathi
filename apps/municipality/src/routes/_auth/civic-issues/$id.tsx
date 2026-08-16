import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Split, Merge, AlertTriangle, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { SeverityBadge, StatusBadge } from "@/components/municipality/status-badge";
import { getCivicIssues } from "@/services/api";

export const Route = createFileRoute("/_auth/civic-issues/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `Civic Issue — ${params.id}` }],
  }),
  component: CivicIssueDetailPage,
});

function CivicIssueDetailPage() {
  const { id } = Route.useParams() as any;
  const [issue, setIssue] = useState<any>(null);
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    getCivicIssues()
      .then((issues) => {
        setAllIssues(issues);
        const found = issues.find((i) => i.id === id);
        if (found) setIssue(found);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading civic issue..." />;
  if (error || !issue) return <ErrorState description="Civic issue not found." onRetry={() => window.location.reload()} />;

  const handleMerge = () => {
    // In a real implementation, this would call a backend endpoint to merge the issues
    toast.success("Issue merged successfully.");
    setMerging(false);
  };

  const handleSplit = () => {
    toast.success("Complaint split into new Civic Issue.");
  };

  return (
    <div className="muni-page-enter space-y-6 max-w-5xl">
      <Link
        to={"/civic-issues" as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Civic Issues
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <SectionLabel>Civic Issue Intelligence</SectionLabel>
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
            <SectionLabel>Issue Summary</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{issue.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-[var(--glass-border)]">
              <div>
                <dt className="label-xs">Total Reports</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{issue.reportCount}</dd>
              </div>
              <div>
                <dt className="label-xs">Impact Score</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-critical">{issue.impactScore}<span className="text-sm font-normal text-muted-foreground">/100</span></dd>
              </div>
              <div>
                <dt className="label-xs">First Reported</dt>
                <dd className="mt-1 text-sm font-medium">{format(new Date(issue.firstReportedAt), "dd MMM yyyy")}</dd>
              </div>
            </div>
          </GlassCard>

          <GlassCard elevation="raised" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Linked Complaints</SectionLabel>
            </div>
            
            <div className="space-y-3">
              {/* Mocking linked complaints display for the UI requirement */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)]">
                <div>
                  <Link to="/complaints/$id" params={{ id: "JN-2026-00001" }} className="text-sm font-medium text-primary hover:underline">JN-2026-00001</Link>
                  <p className="text-xs text-muted-foreground mt-0.5">Primary reporter</p>
                </div>
                <button onClick={handleSplit} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--glass-strong)] transition-colors">
                  <Split className="w-3 h-3" /> Split
                </button>
              </div>
              
              {issue.reportCount > 1 && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)]">
                  <div>
                    <Link to="/complaints/$id" params={{ id: "JN-2026-00002" }} className="text-sm font-medium text-primary hover:underline">JN-2026-00002</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">Citizen confirmation</p>
                  </div>
                  <button onClick={handleSplit} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--glass-strong)] transition-colors">
                    <Split className="w-3 h-3" /> Split
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard elevation="raised" className="p-6 border-warning/30 bg-warning/5">
            <SectionLabel className="text-warning flex items-center gap-2"><Merge className="w-4 h-4" /> Merge Issue</SectionLabel>
            <p className="mt-3 text-sm text-muted-foreground">
              If this issue is a duplicate of another Civic Issue, you can merge them together to consolidate impact scores and reports.
            </p>
            
            {merging ? (
              <div className="mt-4 space-y-3">
                <select className="w-full bg-[var(--glass-strong)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-sm text-foreground">
                  <option value="">Select target issue...</option>
                  {allIssues.filter(i => i.id !== issue.id).map(i => (
                    <option key={i.id} value={i.id}>{i.category} - {i.ward}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={handleMerge} className="action-btn flex-1 bg-warning text-warning-foreground hover:bg-warning/90">Confirm Merge</button>
                  <button onClick={() => setMerging(false)} className="action-btn flex-1 bg-transparent border border-border">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setMerging(true)} className="action-btn w-full mt-4 bg-[var(--glass-strong)]">
                Merge with another issue
              </button>
            )}
          </GlassCard>

          <GlassCard elevation="raised" className="p-6 border-primary/20">
            <SectionLabel className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Work Execution</SectionLabel>
            <p className="mt-3 text-sm text-muted-foreground">
              This Civic Issue is ready to be converted into a Work Package for contractors.
            </p>
            <button className="action-btn w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Create Work Package
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
