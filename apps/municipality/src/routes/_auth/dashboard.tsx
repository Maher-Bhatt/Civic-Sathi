import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/municipality/kpi-card";
import { EmergingIssueCard } from "@/components/municipality/emerging-issue-card";
import { LiveActivityFeed } from "@/components/municipality/live-activity-feed";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ClientCivicMap } from "@/components/civic-map-panel";
import type { MapMode } from "@/components/civic-map";
import {
  ActivityTrendChart,
  HealthPieChart,
  IssueBreakdownChart,
} from "@/components/civic-charts";
import {
  getDashboardKPIs,
  getLiveActivity,
  getSystemicIssues,
  getHotspotRankings,
  startLiveSimulation,
  stopLiveSimulation,
  getCivicIssues,
} from "@/services/api";
import { useMuniAuth } from "@/lib/muni-auth";
import {
  AREA_HEALTH_HEX,
  AREA_HEALTH_LABEL,
  areaActivity,
  cityDailyTrend,
  cityHealthDistribution,
  cityIssueBreakdown,
  complaintPoints,
  DEFAULT_FILTERS,
  type AreaHealth,
  type ComplaintPoint,
  type IssueKey,
} from "@/services/geography";
import type { DashboardKPIs, LiveActivity, SystemicIssue } from "@/services/types";
import { LoadingState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/dashboard")({
  head: () => ({ meta: [{ title: "Municipal Intelligence — JANMIND" }] }),
  component: MuniDashboardPage,
});

function MuniDashboardPage() {
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [live, setLive] = useState<LiveActivity[]>([]);
  const [mapMode] = useState<MapMode>("health");

  const points: ComplaintPoint[] = useMemo(() => {
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

  const activities = useMemo(() => areaActivity(city, DEFAULT_FILTERS, points), [city, points]);
  const trendData = useMemo(() => cityDailyTrend(city, DEFAULT_FILTERS, points), [city, points]);
  const issueData = useMemo(() => cityIssueBreakdown(city, DEFAULT_FILTERS, points), [city, points]);
  const healthData = useMemo(() => cityHealthDistribution(city, DEFAULT_FILTERS, points), [city, points]);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["muni-dashboard", city],
    queryFn: async () => {
      const [k, i, l, h, c] = await Promise.all([
        getDashboardKPIs(),
        getSystemicIssues(city),
        getLiveActivity(),
        getHotspotRankings(),
        getCivicIssues(),
      ]);
      return { kpis: k, issues: i.slice(0, 4), live: l, hotspots: h.slice(0, 3), civicIssues: c };
    }
  });

  useEffect(() => {
    startLiveSimulation(setLive);
    return () => stopLiveSimulation();
  }, [city]);

  const kpis = data?.kpis;
  const issues = data?.issues || [];
  const hotspots = data?.hotspots || [];
  const civicIssues = data?.civicIssues || [];

  if (loading || !kpis) {
    return <LoadingState message="Loading municipal intelligence..." />;
  }

  const healthCounts = activities.reduce(
    (acc, a) => {
      acc[a.health] += 1;
      return acc;
    },
    { low: 0, moderate: 0, high: 0, critical: 0 },
  );

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>Municipal Intelligence</SectionLabel>
        <h1 className="jm-glitch-text mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          See what is happening across your city.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Prototype Intelligence Data</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total Reports" value={kpis.totalReports} delay={0} />
        <KpiCard label="Critical" value={kpis.critical} accent="critical" delay={60} />
        <KpiCard label="Active" value={kpis.active} delay={120} />
        <KpiCard label="Resolved" value={kpis.resolved} accent="success" delay={180} />
        <KpiCard label="Emerging Issues" value={kpis.emergingIssues} accent="warning" delay={240} />
        <KpiCard label="Area Hotspots" value={kpis.areaHotspots} delay={300} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <GlassCard elevation="raised" className="overflow-hidden xl:col-span-2">
          <div className="border-b border-[var(--glass-border)] p-5">
            <SectionLabel>City Health</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-4">
              {(["low", "moderate", "high", "critical"] as const).map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: AREA_HEALTH_HEX[h] }}
                  />
                  <span className="text-muted-foreground">{AREA_HEALTH_LABEL[h]}</span>
                  <span className="font-medium tabular-nums">{healthCounts[h]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="jm-map-frame">
            <ClientCivicMap
              cityId={city}
              mode={mapMode}
              activities={activities}
              points={points}
              selectedAreaId={null}
              onSelectArea={() => {}}
              compact
              className="h-[280px] sm:h-[320px]"
            />
          </div>
        </GlassCard>

        <LiveActivityFeed activities={live} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>7-day activity pulse</SectionLabel>
          <ActivityTrendChart data={trendData} className="mt-2" />
        </GlassCard>
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Issue breakdown</SectionLabel>
          {issueData.length > 0 ? (
            <IssueBreakdownChart data={issueData} className="mt-2" />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No data yet.</p>
          )}
        </GlassCard>
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Severity distribution</SectionLabel>
          {healthData.length > 0 ? (
            <HealthPieChart data={healthData} />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No data yet.</p>
          )}
        </GlassCard>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <SectionLabel>Emerging Systemic Issues</SectionLabel>
            <h2 className="mt-1 text-lg font-semibold">Something is happening in these areas</h2>
          </div>
          <Link
            to={"/issues" as any}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {issues.map((issue, i) => (
            <EmergingIssueCard key={issue.id} issue={issue} delay={i * 80} />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Hotspot Analysis</SectionLabel>
        <div className="mt-4 grid gap-3">
          {hotspots.map((h) => (
            <Link
              key={h.issueId}
              to={"/issues/$id" as any}
              params={{ id: h.issueId } as any}
              className="lift glass flex flex-wrap items-center gap-4 rounded-2xl p-4 transition-all duration-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-sm font-semibold">
                {h.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{h.category}</p>
                <p className="text-sm text-muted-foreground">{h.area}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold tabular-nums">{h.reports} reports</p>
                <p className="text-muted-foreground">Risk {h.risk}</p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  h.trend >= 0 ? "text-[#a4503f]" : "text-primary",
                )}
              >
                {h.trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {h.trend >= 0 ? "+" : ""}
                {h.trend}%
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
