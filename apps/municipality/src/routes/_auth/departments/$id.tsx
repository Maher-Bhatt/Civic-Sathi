import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { getDepartment } from "@/services/api";
import type { DepartmentStats } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/departments/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `Department — ${params.id}` }],
  }),
  component: DepartmentDetailPage,
});

function DepartmentDetailPage() {
    const { t } = useI18n();
  const { id } = Route.useParams() as any;
  const [dept, setDept] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDepartment(id)
      .then((d) => {
        if (!d) setError(true);
        else setDept(d);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading department..." />;
  if (error || !dept) {
    return (
      <ErrorState
        description="Department not found."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const categories = Object.entries(dept.categoryBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="muni-page-enter space-y-6">
      <Link
        to={"/departments" as any}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('ui.all_departments')}</Link>

      <header>
        <SectionLabel>{t('ui.department_detail')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{dept.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('ui.average_response_time')}{dept.avgResponseDays.toFixed(1)} {t('ui.days')}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('ui.open')} value={dept.open} />
        <StatCard label={t('ui.critical')} value={dept.critical} accent="critical" />
        <StatCard label={t('ui.in_progress')} value={dept.inProgress} />
        <StatCard label={t('ui.resolved')} value={dept.resolved} accent="success" />
      </div>

      <GlassCard elevation="raised" className="p-6">
        <SectionLabel>{t('ui.category_breakdown')}</SectionLabel>
        <div className="mt-4 space-y-3">
          {categories.map(([cat, count]) => {
            const max = categories[0]?.[1] ?? 1;
            const pct = Math.round((count / max) * 100);
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm">
                  <span>{cat}</span>
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--glass)]">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        <Link
          to={"/complaints" as any}
          search={{ area: "" } as any}
          className="action-btn"
        >
          {t('ui.view_department_complaints')}</Link>
        <Link to={"/issues" as any} className="action-btn">
          {t('ui.view_emerging_issues')}</Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "critical" | "success";
}) {
    const { t } = useI18n();
  return (
    <GlassCard elevation="raised" className="p-5">
      <p className="label-xs">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          accent === "critical" ? "text-critical" : accent === "success" ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </GlassCard>
  );
}
