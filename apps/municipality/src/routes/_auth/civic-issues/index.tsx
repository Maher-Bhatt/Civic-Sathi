import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionLabel, GlassCard } from "@/components/ui/glass-card";
import { getCivicIssues } from "@/services/api";
import { LoadingState, EmptyState } from "@/components/ui/states";
import { SeverityBadge, StatusBadge } from "@/components/municipality/status-badge";
import { format } from "date-fns";
import { MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/_auth/civic-issues/")({
  head: () => ({ meta: [{ title: "Civic Issues — Municipal Intelligence" }] }),
  component: CivicIssuesPage,
});

function CivicIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCivicIssues()
      .then(setIssues)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading civic issues..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>Civic Issues</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">Clustered Citizen Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Intelligence layer identifying singular problems from multiple citizen reports.</p>
      </header>

      {issues.length === 0 ? (
        <EmptyState title="No civic issues" description="No civic issues have been reported yet." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {issues.map((issue) => (
            <GlassCard key={issue.id} elevation="raised" className="p-5 flex flex-col sm:flex-row gap-5">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <span className="text-sm font-medium text-foreground">{issue.category}</span>
                </div>
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <p className="text-sm text-subtle line-clamp-2">{issue.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {issue.reportCount} reports</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {issue.ward}</span>
                  <span>Impact: {issue.impactScore}/100</span>
                </div>
              </div>
              <div className="sm:border-l border-border sm:pl-5 flex flex-col justify-between min-w-[120px]">
                <div className="text-right sm:text-left">
                  <StatusBadge status={issue.status} />
                  <p className="mt-2 text-[0.65rem] text-muted-foreground uppercase tracking-wider">
                    {format(new Date(issue.firstReportedAt || issue.createdAt || Date.now()), "dd MMM")}
                  </p>
                </div>
                <Link
                  to="/civic-issues/$id"
                  params={{ id: String(issue.id) }}
                  className="action-btn text-center mt-4 sm:mt-0"
                >
                  Review
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
