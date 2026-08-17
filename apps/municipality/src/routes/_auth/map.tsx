import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ButtonHTMLAttributes } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { ClientCivicMap } from "@/components/civic-map-panel";
import type { MapMode } from "@/components/civic-map";
import {
  ActivityTrendChart,
  AnimatedStat,
  AreaMiniCharts,
  HealthPieChart,
} from "@/components/civic-charts";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { FilterDrawer } from "@/components/municipality/filter-drawer";
import { useMuniAuth } from "@/lib/muni-auth";
import {
  AREA_HEALTH_HEX,
  AREA_HEALTH_LABEL,
  AREA_HEALTH_ORDER,
  DEFAULT_FILTERS,
  ISSUE_KEYS,
  ISSUE_LABEL,
  TIME_WINDOWS,
  areaActivity,
  areaDailyTrend,
  cityDailyTrend,
  cityHealthDistribution,
  complaintPoints,
  filterPoints,
  type AreaActivity,
  type AreaHealth,
  type ComplaintPoint,
  type IssueKey,
  type MapFilters,
} from "@/services/geography";
import { getCivicIssues } from "@/services/api";
import { cn } from "@/lib/utils";
import { DEFAULT_COMPLAINT_FILTERS } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/map")({
  head: () => ({ meta: [{ title: "Civic Map — Municipal Intelligence" }] }),
  component: MuniMapPage,
});

const MODES: Array<{ key: MapMode; label: string }> = [
  { key: "health", label: "Area Health" },
  { key: "activity", label: "Complaint Activity" },
  { key: "hotspots", label: "Hotspots" },
];

function Chip({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
    const { t } = useI18n();
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "press shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200",
        active
          ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground"
          : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function MuniMapPage() {
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [mode, setMode] = useState<MapMode>("health");
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [complaintFilters, setComplaintFilters] = useState(DEFAULT_COMPLAINT_FILTERS);
  const [civicIssues, setCivicIssues] = useState<any[]>([]);

  useEffect(() => {
    getCivicIssues().then(setCivicIssues);
  }, []);

  const allPoints: ComplaintPoint[] = useMemo(() => {
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

  const activities = useMemo(() => areaActivity(city, filters, allPoints), [city, filters, allPoints]);
  const points = useMemo(() => filterPoints(allPoints, filters), [allPoints, filters]);
  const selected = activities.find((a) => a.area.id === selectedAreaId);
  const trendData = useMemo(() => cityDailyTrend(city, filters, allPoints), [city, filters, allPoints]);
  const healthData = useMemo(() => cityHealthDistribution(city, filters, allPoints), [city, filters, allPoints]);
  const areaTrend = useMemo(
    () => (selected ? areaDailyTrend(selected.area.id, filters, allPoints) : []),
    [selected, filters, allPoints],
  );

  return (
    <div className="muni-page-enter space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>{t('ui.civic_map')}</SectionLabel>
          <h1 className="jm-glitch-text mt-1 text-2xl font-semibold">{t('ui.city_wide_operational_view')}</h1>
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2 text-xs"
        >
          <Filter className="h-3.5 w-3.5" />
          {t('ui.filters')}</button>
      </header>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <Chip key={m.key} active={mode === m.key} onClick={() => setMode(m.key)}>
            {m.label}
          </Chip>
        ))}
        {TIME_WINDOWS.map((w) => (
          <Chip
            key={w.key}
            active={filters.time === w.key}
            onClick={() => setFilters((f) => ({ ...f, time: w.key }))}
          >
            {w.label}
          </Chip>
        ))}
        {ISSUE_KEYS.map((k) => (
          <Chip
            key={k}
            active={filters.issue === k}
            onClick={() => setFilters((f) => ({ ...f, issue: f.issue === k ? "all" : k }))}
          >
            {ISSUE_LABEL[k]}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <GlassCard elevation="raised" className="overflow-hidden">
          <div className="jm-map-frame">
            <ClientCivicMap
              cityId={city}
              mode={mode}
              activities={activities}
              points={points}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onResetView={() => setSelectedAreaId(null)}
              className="h-[480px] lg:h-[calc(100vh-16rem)]"
            />
          </div>
          <div className="flex flex-wrap gap-4 border-t border-[var(--glass-border)] p-4">
            {AREA_HEALTH_ORDER.map((h) => (
              <div key={h} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: AREA_HEALTH_HEX[h] }} />
                {AREA_HEALTH_LABEL[h]}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard elevation="raised" className="jm-chart-card p-5">
            <SectionLabel>{t('ui.7_day_pulse')}</SectionLabel>
            <ActivityTrendChart data={trendData} className="mt-2 h-[140px]" />
          </GlassCard>
          <GlassCard elevation="raised" className="jm-chart-card p-5">
            <SectionLabel>{t('ui.severity_mix')}</SectionLabel>
            {healthData.length > 0 ? (
              <HealthPieChart data={healthData} className="h-[160px]" />
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{t('ui.no_data_under_filters')}</p>
            )}
          </GlassCard>
          {selected ? (
            <AreaDetailPanel
              activity={selected}
              trendData={areaTrend}
              onClose={() => setSelectedAreaId(null)}
            />
          ) : (
            <GlassCard elevation="raised" className="p-5">
              <SectionLabel>{t('ui.map_legend')}</SectionLabel>
              <p className="mt-3 text-sm text-muted-foreground">
                {t('ui.click_an_area_to_view_operatio')}</p>
              <p className="mt-2 text-xs text-subtle">
                {t('ui.prototype_area_boundaries_not_')}</p>
            </GlassCard>
          )}
        </div>
      </div>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={complaintFilters}
        onChange={(p) => setComplaintFilters((f) => ({ ...f, ...p }))}
        onApply={() => setFilterOpen(false)}
        onClear={() => setComplaintFilters(DEFAULT_COMPLAINT_FILTERS)}
      />
    </div>
  );
}

function AreaDetailPanel({
  activity,
  trendData,
  onClose,
}: {
  activity: AreaActivity;
  trendData: ReturnType<typeof areaDailyTrend>;
  onClose: () => void;
}) {
    const { t } = useI18n();
  const { area, total, health, trendPct, topIssue, risk, resolved } = activity;
  return (
    <GlassCard elevation="raised" className="jm-panel-enter jm-panel-glow animate-rise p-5">
      <div className="flex items-start justify-between">
        <SectionLabel>{t('ui.area_details')}</SectionLabel>
        <button type="button" onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{area.name}</h3>
      <p className="text-sm text-muted-foreground">
        {area.admin.division ?? "—"} · {area.admin.body}
      </p>
      {area.boundarySource === "derived" && (
        <p className="mt-1 text-xs text-warning">{t('ui.prototype_area_boundary')}</p>
      )}
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="label-xs">{t('ui.complaints')}</dt>
          <dd className="font-semibold tabular-nums">
            <AnimatedStat value={total} />
          </dd>
        </div>
        <div>
          <dt className="label-xs">{t('ui.critical')}</dt>
          <dd className="font-semibold tabular-nums">{Math.round(total * 0.08)}</dd>
        </div>
        <div>
          <dt className="label-xs">{t('ui.7_day_trend')}</dt>
          <dd className={cn("font-semibold", trendPct >= 0 ? "text-[#a4503f]" : "text-primary")}>
            {trendPct >= 0 ? "+" : ""}
            {trendPct}%
          </dd>
        </div>
        <div>
          <dt className="label-xs">{t('ui.risk')}</dt>
          <dd className="font-semibold tabular-nums">
            <AnimatedStat value={risk} />
          </dd>
        </div>
        <div>
          <dt className="label-xs">{t('ui.top_category')}</dt>
          <dd>{ISSUE_LABEL[topIssue]}</dd>
        </div>
        <div>
          <dt className="label-xs">{t('ui.resolved')}</dt>
          <dd className="tabular-nums">{resolved}</dd>
        </div>
      </dl>
      {trendData.some((d) => d.reports > 0) && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="label-xs">{t('ui.local_7_day_trend')}</p>
          <ActivityTrendChart data={trendData} className="mt-2 h-[120px]" />
        </div>
      )}
      <AreaMiniCharts activity={activity} />
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to={"/complaints" as any}
          search={{ area: area.name } as any}
          className="action-btn text-center"
        >
          {t('ui.view_reports')}</Link>
        <Link to={"/issues" as any} className="action-btn text-center">
          {t('ui.view_emerging_issues')}</Link>
      </div>
      <span
        className="mt-3 inline-block rounded-full px-2 py-0.5 text-[0.65rem] uppercase"
        style={{
          background: `${AREA_HEALTH_HEX[health]}22`,
          color: AREA_HEALTH_HEX[health],
        }}
      >
        {AREA_HEALTH_LABEL[health]} {t('ui.activity')}</span>
    </GlassCard>
  );
}
