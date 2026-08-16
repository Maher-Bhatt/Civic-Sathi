import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import { useMuniAuth } from "@/lib/muni-auth";
import { getAreaOverviews } from "@/services/api";
import { AREA_HEALTH_HEX, AREA_HEALTH_LABEL } from "@/services/geography";
import type { AreaOverview } from "@/services/types";

export const Route = createFileRoute("/_auth/areas/")({
  head: () => ({ meta: [{ title: "Areas — Municipal Intelligence" }] }),
  component: AreasPage,
});

function AreasPage() {
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [areas, setAreas] = useState<AreaOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"risk" | "reports" | "trend">("risk");

  useEffect(() => {
    getAreaOverviews(city)
      .then(setAreas)
      .finally(() => setLoading(false));
  }, [city]);

  const sorted = [...areas].sort((a, b) => {
    if (sortBy === "risk") return b.risk - a.risk;
    if (sortBy === "reports") return b.reports - a.reports;
    return b.trendPct - a.trendPct;
  });

  if (loading) return <LoadingState message="Loading area overviews..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Area Intelligence</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">Neighbourhood activity overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Prototype Intelligence Data</p>
        </div>
        <div className="flex gap-2">
          {(["risk", "reports", "trend"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSortBy(s)}
              className={cn(
                "press rounded-full border px-3 py-1.5 text-xs capitalize",
                sortBy === s
                  ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)]"
                  : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground",
              )}
            >
              Sort by {s}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-3">
        {sorted.map((area) => {
          const up = area.trendPct >= 0;
          return (
            <Link
              key={area.id}
              to={"/map" as any}
              className="lift glass flex flex-wrap items-center gap-4 rounded-2xl p-4 transition-all duration-200"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: AREA_HEALTH_HEX[area.health] }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{area.name}</p>
                <p className="text-sm text-muted-foreground">
                  {area.ward} · {AREA_HEALTH_LABEL[area.health]} activity
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold tabular-nums">{area.reports} reports</p>
                <p className="text-muted-foreground">{area.critical} critical</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold tabular-nums">Risk {area.risk}</p>
                <p className="text-muted-foreground">{area.topIssue}</p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  up ? "text-[#a4503f]" : "text-primary",
                )}
              >
                {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {up ? "+" : ""}
                {area.trendPct}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
