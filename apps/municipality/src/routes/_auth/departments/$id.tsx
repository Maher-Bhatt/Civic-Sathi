import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { getDepartment } from "@/services/api";
import type { DepartmentStats } from "@/services/types";

export const Route = createFileRoute("/_auth/departments/$id")({
  head: ({ params }: { params: any }) => ({
    meta: [{ title: `Department — ${params.id}` }],
  }),
  component: DepartmentDetailPage,
});

function DepartmentDetailPage() {
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
        All departments
      </Link>

      <header>
        <SectionLabel>Department Detail</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{dept.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Average response time: {dept.avgResponseDays.toFixed(1)} days
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open" value={dept.open} />
        <StatCard label="Critical" value={dept.critical} accent="critical" />
        <StatCard label="In progress" value={dept.inProgress} />
        <StatCard label="Resolved" value={dept.resolved} accent="success" />
      </div>

      <GlassCard elevation="raised" className="p-6">
        <SectionLabel>Category Breakdown</SectionLabel>
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
          View department complaints
        </Link>
        <Link to={"/issues" as any} className="action-btn">
          View emerging issues
        </Link>
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
