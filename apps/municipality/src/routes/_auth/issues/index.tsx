import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EmergingIssueCard } from "@/components/municipality/emerging-issue-card";
import { SectionLabel } from "@/components/ui/glass-card";
import { getSystemicIssues } from "@/services/api";
import { useMuniAuth } from "@/lib/muni-auth";
import type { SystemicIssue } from "@/services/types";
import { LoadingState, EmptyState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/issues/")({
  head: () => ({ meta: [{ title: "Emerging Issues — Municipal Intelligence" }] }),
  component: IssuesPage,
});

function IssuesPage() {
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const [issues, setIssues] = useState<SystemicIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemicIssues(officer?.city)
      .then(setIssues)
      .finally(() => setLoading(false));
  }, [officer?.city]);

  if (loading) return <LoadingState message="Loading emerging issues..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>{t('ui.emerging_systemic_issues')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{t('ui.patterns_civicsathi_has_detected')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('ui.prototype_intelligence_data')}</p>
      </header>

      {issues.length === 0 ? (
        <EmptyState title={t('ui.no_critical_issues')} description="No emerging systemic issues at this time." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue, i) => (
            <EmergingIssueCard key={issue.id} issue={issue} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
