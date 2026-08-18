import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { getDepartments } from "@/services/api";
import type { DepartmentStats } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/departments/")({
  head: () => ({ meta: [{ title: "Departments — Municipal Intelligence" }] }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
    const { t } = useI18n();
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading departments..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>{t('ui.department_overview')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{t('ui.operational_workload_by_depart')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('ui.prototype_intelligence_data')}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <GlassCard key={dept.id} elevation="raised" interactive className="lift p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{dept.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('ui.avg_response')}{(dept.avgResponseDays ?? 2.4).toFixed(1)} {t('ui.days')}</p>
              </div>
              {(dept.critical ?? 0) > 0 && (
                <span className="rounded-full bg-critical/15 px-2 py-0.5 text-[0.65rem] font-medium text-critical">
                  {dept.critical} {t('ui.critical')}</span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label-xs">{t('ui.open')}</p>
                <p className="mt-0.5 text-xl font-semibold tabular-nums">{dept.open ?? 0}</p>
              </div>
              <div>
                <p className="label-xs">{t('ui.in_progress')}</p>
                <p className="mt-0.5 text-xl font-semibold tabular-nums">{dept.inProgress ?? 0}</p>
              </div>
              <div>
                <p className="label-xs">{t('ui.resolved')}</p>
                <p className="mt-0.5 text-xl font-semibold tabular-nums text-primary">
                  {dept.resolved ?? 0}
                </p>
              </div>
              <div>
                <p className="label-xs">{t('ui.emerging_issues')}</p>
                <p className="mt-0.5 text-xl font-semibold tabular-nums text-warning">
                  {dept.emergingIssues ?? 0}
                </p>
              </div>
            </div>

            <Link
              to={"/departments/$id" as any}
              params={{ id: dept.id } as any}
              className="mt-5 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
            >
              {t('ui.view_details')}<ArrowUpRight className="h-3 w-3" />
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
