import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Crosshair,
  Info,
  RotateCcw,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ClientCivicMap } from "@/components/civic-map-panel";
import type { MapMode } from "@/components/civic-map";
import {
  ActivityTrendChart,
  AnimatedStat,
  AreaMiniCharts,
  HealthPieChart,
  IssueBreakdownChart,
} from "@/components/civic-charts";
import { CITIES, getCity, nearestCity, type CityId } from "@/services/cities";
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
  cityGeography,
  cityHealthDistribution,
  cityIssueBreakdown,
  complaintPoints,
  filterPoints,
  nearestArea,
  searchAreas,
  type AreaActivity,
  type MapFilters,
} from "@/services/geography";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Civic Map — locality civic activity | JANMIND" },
      {
        name: "description",
        content:
          "Explore aggregated civic activity by locality across Vadodara and Bengaluru: area health, complaint activity and emerging hotspots.",
      },
      { property: "og:title", content: "Civic Map — locality civic activity | JANMIND" },
      {
        property: "og:description",
        content:
          "A public, locality-based map of civic issue activity. Aggregate information only — no citizen identities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CivicMapPage,
});

const MODES: Array<{ key: MapMode; label: string; hint: string }> = [
  { key: "health", label: "Area health", hint: "Aggregate civic health per locality" },
  {
    key: "activity",
    label: "Complaint activity",
    hint: "Clustered reports — separates as you zoom",
  },
  { key: "hotspots", label: "Hotspots", hint: "Concentrated issue areas with trend and risk" },
];

function Chip({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "press shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200",
        active
          ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]"
          : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:-translate-y-0.5 hover:text-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Trend({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className="inline-flex items-center gap-1 text-sm"
      style={{ color: up ? AREA_HEALTH_HEX.high : AREA_HEALTH_HEX.low }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {up ? "+" : ""}
      {pct}%
    </span>
  );
}

function CivicMapPage() {
  const [cityId, setCityId] = useState<CityId>("vadodara");
  const [mode, setMode] = useState<MapMode>("health");
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const geography = cityGeography(cityId);
  const activities = useMemo(() => areaActivity(cityId, filters), [cityId, filters]);
  const points = useMemo(() => filterPoints(complaintPoints(cityId), filters), [cityId, filters]);

  const ranked = useMemo(() => [...activities].sort((a, b) => b.total - a.total), [activities]);
  const hotspots = useMemo(() => ranked.filter((a) => a.hotspot).slice(0, 6), [ranked]);
  const selectedArea: AreaActivity | null = activities.find((a) => a.area.id === selected) ?? null;

  const suggestions = useMemo(() => searchAreas(cityId, query), [cityId, query]);

  const totals = useMemo(
    () => ({
      reports: activities.reduce((n, a) => n + a.total, 0),
      last7: activities.reduce((n, a) => n + a.last7, 0),
      areas: activities.length,
    }),
    [activities],
  );

  const trendData = useMemo(() => cityDailyTrend(cityId, filters), [cityId, filters]);
  const issueData = useMemo(() => cityIssueBreakdown(cityId, filters), [cityId, filters]);
  const healthData = useMemo(() => cityHealthDistribution(cityId, filters), [cityId, filters]);
  const areaTrend = useMemo(
    () => (selectedArea ? areaDailyTrend(selectedArea.area.id, filters) : []),
    [selectedArea, filters],
  );

  useEffect(() => {
    setSelected(null);
    setQuery("");
    setFocus(null);
    setLocationNote(null);
  }, [cityId]);

  const goToArea = (areaId: string) => {
    const a = activities.find((x) => x.area.id === areaId);
    if (!a) return;
    setSelected(areaId);
    setFocus({ lat: a.area.center[0], lng: a.area.center[1], zoom: 14 });
  };

  const nearMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationNote("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        const city = nearestCity(latitude, longitude);
        if (city.id !== cityId) setCityId(city.id);
        const area = nearestArea(city.id, latitude, longitude);
        setFocus({ lat: latitude, lng: longitude, zoom: 14 });
        if (area) {
          setTimeout(() => setSelected(area.id), 60);
          setLocationNote(`Nearest mapped locality: ${area.name}, ${city.name}.`);
        }
      },
      () => {
        setLocating(false);
        setLocationNote("Location permission denied — pick a locality from search instead.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    setMode("health");
    setSelected(null);
    setQuery("");
    setFocus(null);
    setLocationNote(null);
  };

  return (
    <PageShell>
      <div className="animate-rise jm-hero-glow space-y-2">
        <SectionLabel>Public civic intelligence</SectionLabel>
        <h1 className="jm-glitch-text text-2xl font-semibold sm:text-3xl">Civic Map</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {getCity(cityId).name} by locality, coloured by aggregate civic activity. Open an area to
          see its health, the issues driving it and recent momentum.
        </p>
      </div>

      {/* city switcher + modes */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {CITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCityId(c.id)}
              aria-pressed={cityId === c.id}
              className={cn(
                "press rounded-full border px-3.5 py-1.5 text-xs tracking-[0.08em] uppercase transition-all duration-200",
                cityId === c.id
                  ? "border-[color-mix(in_oklab,var(--primary)_45%,transparent)] bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-foreground"
                  : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:-translate-y-0.5 hover:text-foreground",
              )}
            >
              {c.name}
            </button>
          ))}
          <span className="text-[0.66rem] tracking-[0.08em] text-subtle uppercase">
            {geography.areas.length} localities
          </span>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div
            role="tablist"
            aria-label="Map mode"
            className="inline-flex gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-1 backdrop-blur-md"
          >
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={mode === m.key}
                title={m.hint}
                onClick={() => setMode(m.key)}
                className={cn(
                  "press rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-all duration-200",
                  mode === m.key
                    ? "jm-mode-active bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* search + controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div ref={searchRef} className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-subtle"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search area in ${getCity(cityId).name}`}
              aria-label="Search area or locality"
              className="glass h-11 w-full rounded-xl border border-[var(--glass-border)] pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-subtle focus:border-[color-mix(in_oklab,var(--foreground)_25%,transparent)]"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lift)] backdrop-blur-2xl">
                {suggestions.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        goToArea(a.id);
                        setQuery("");
                      }}
                      className="press flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[var(--glass)]"
                    >
                      <span className="text-sm">{a.name}</span>
                      {a.admin.division && (
                        <span className="text-[0.64rem] tracking-[0.08em] text-subtle uppercase">
                          {a.admin.division}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <GlassButton variant="glass" size="sm" onClick={nearMe} aria-busy={locating}>
              <Crosshair className={cn("h-3.5 w-3.5", locating && "animate-pulse")} aria-hidden />
              Near me
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Reset
            </GlassButton>
          </div>
        </div>

        {/* filters — horizontal scroll strip on mobile */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
            <Chip
              active={filters.issue === "all"}
              onClick={() => setFilters((f) => ({ ...f, issue: "all" }))}
            >
              All issues
            </Chip>
            {ISSUE_KEYS.map((k) => (
              <Chip
                key={k}
                active={filters.issue === k}
                onClick={() => setFilters((f) => ({ ...f, issue: k }))}
              >
                {ISSUE_LABEL[k]}
              </Chip>
            ))}
            <span className="mx-1 h-5 w-px shrink-0 bg-[var(--glass-border)]" aria-hidden />
            <Chip
              active={filters.health === "all"}
              onClick={() => setFilters((f) => ({ ...f, health: "all" }))}
            >
              Any severity
            </Chip>
            {AREA_HEALTH_ORDER.map((h) => (
              <Chip
                key={h}
                active={filters.health === h}
                onClick={() => setFilters((f) => ({ ...f, health: h }))}
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-[3px] align-middle"
                  style={{ background: AREA_HEALTH_HEX[h] }}
                  aria-hidden
                />
                {AREA_HEALTH_LABEL[h]}
              </Chip>
            ))}
            <span className="mx-1 h-5 w-px shrink-0 bg-[var(--glass-border)]" aria-hidden />
            {TIME_WINDOWS.map((w) => (
              <Chip
                key={w.key}
                active={filters.time === w.key}
                onClick={() => setFilters((f) => ({ ...f, time: w.key }))}
              >
                {w.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-3">
          <div className="relative">
            <ClientCivicMap
              cityId={cityId}
              mode={mode}
              activities={activities}
              points={points}
              selectedAreaId={selected}
              onSelectArea={setSelected}
              focus={focus}
              onNearMe={nearMe}
              locating={locating}
              className="jm-map-frame h-[24rem] sm:h-[32rem]"
            />

            {/* legend */}
            <div className="pointer-events-none absolute top-3 left-3 z-[500] rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 backdrop-blur-xl">
              <span className="label-xs">
                {mode === "hotspots"
                  ? "Hotspot severity"
                  : mode === "activity"
                    ? "Report severity"
                    : "Area health"}
              </span>
              <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 sm:block sm:space-y-1">
                {AREA_HEALTH_ORDER.map((h) => (
                  <li key={h} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-[3px]"
                      style={{ background: AREA_HEALTH_HEX[h] }}
                      aria-hidden
                    />
                    <span className="text-[0.62rem] tracking-[0.08em] text-muted-foreground uppercase">
                      {AREA_HEALTH_LABEL[h]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {locationNote && <p className="text-xs text-muted-foreground">{locationNote}</p>}

          <div className="grid grid-cols-3 gap-2">
            {[
              [totals.reports, "Reports in view"],
              [totals.last7, "Last 7 days"],
              [totals.areas, "Localities mapped"],
            ].map(([value, label], i) => (
              <GlassCard
                key={String(label)}
                className="jm-stat-card animate-rise p-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-lg font-semibold">
                  <AnimatedStat value={value as number} />
                </p>
                <p className="text-[0.66rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {label as string}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* live charts row */}
          <div className="grid gap-3 sm:grid-cols-2">
            <GlassCard className="jm-chart-card animate-rise p-4" style={{ animationDelay: "120ms" }}>
              <SectionLabel>7-day activity pulse</SectionLabel>
              <ActivityTrendChart data={trendData} className="mt-2" />
            </GlassCard>
            <GlassCard className="jm-chart-card animate-rise p-4" style={{ animationDelay: "200ms" }}>
              <SectionLabel>Issue breakdown</SectionLabel>
              {issueData.length > 0 ? (
                <IssueBreakdownChart data={issueData} className="mt-2" />
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">No data under current filters.</p>
              )}
            </GlassCard>
          </div>

          <p className="flex items-start gap-2 text-xs text-subtle">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              {geography.dataNote} Shaded polygons are an “Approximate Civic Activity Area”, not an
              official municipal boundary. Prototype activity data.
            </span>
          </p>
          <p className="flex items-start gap-2 text-xs text-subtle">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Aggregate view only — no names, contacts, private addresses or exact report locations
            are published.
          </p>
        </div>

        {/* ranking — desktop sidebar */}
        <div className="hidden space-y-4 lg:block">
          <GlassCard className="jm-chart-card animate-rise p-4" style={{ animationDelay: "80ms" }}>
            <SectionLabel>Severity distribution</SectionLabel>
            {healthData.length > 0 ? (
              <HealthPieChart data={healthData} />
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No data under current filters.</p>
            )}
          </GlassCard>

          <GlassCard className="animate-rise p-4" style={{ animationDelay: "160ms" }}>
            <SectionLabel>
              {mode === "hotspots" ? "Active hotspots" : "Most active areas"}
            </SectionLabel>
            <ul className="mt-3 space-y-1">
              {(mode === "hotspots" ? hotspots : ranked.slice(0, 10)).map((a) => (
                <li key={a.area.id}>
                  <button
                    type="button"
                    onClick={() => goToArea(a.area.id)}
                    className={cn(
                      "press flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                      selected === a.area.id
                        ? "bg-[var(--surface-elevated)]"
                        : "hover:bg-[var(--glass)]",
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                      style={{ background: AREA_HEALTH_HEX[a.health] }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{a.area.name}</span>
                      <span className="block text-[0.66rem] tracking-[0.08em] text-subtle uppercase">
                        {AREA_HEALTH_LABEL[a.health]} · {ISSUE_LABEL[a.topIssue]}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">{a.total}</span>
                  </button>
                </li>
              ))}
              {mode === "hotspots" && hotspots.length === 0 && (
                <li className="px-2.5 py-2 text-sm text-muted-foreground">
                  No hotspots under the current filters.
                </li>
              )}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* area panel — bottom sheet on mobile, card on desktop */}
      {selectedArea && (
        <AreaPanel
          activity={selectedArea}
          trendData={areaTrend}
          onClose={() => setSelected(null)}
        />
      )}
    </PageShell>
  );
}

function AreaPanel({
  activity,
  trendData,
  onClose,
}: {
  activity: AreaActivity;
  trendData: ReturnType<typeof areaDailyTrend>;
  onClose: () => void;
}) {
  const { area } = activity;
  return (
    <div className="animate-rise jm-panel-enter fixed inset-x-0 bottom-14 z-40 px-3 sm:static sm:mt-5 sm:px-0">
      <GlassCard
        elevation="raised"
        className="jm-panel-glow max-h-[72vh] overflow-y-auto p-4 sm:max-h-none sm:p-5"
        aria-label={`${area.name} civic detail`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="label-xs" style={{ color: AREA_HEALTH_HEX[activity.health] }}>
              {AREA_HEALTH_LABEL[activity.health]} civic activity
            </span>
            <h2 className="mt-1 truncate text-lg font-semibold">{area.name}</h2>
            <p className="mt-0.5 text-[0.7rem] text-subtle">
              {area.admin.body}
              {area.admin.bodyVerified ? " · verified" : ""}
              {area.admin.division
                ? ` · ${area.admin.division}${area.admin.divisionVerified ? "" : " (indicative)"}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close area details"
            onClick={onClose}
            className="press -mt-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-subtle hover:bg-[var(--glass)] hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="label-xs">Reports</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">
              <AnimatedStat value={activity.total} />
            </p>
          </div>
          <div>
            <p className="label-xs">Top issue</p>
            <p className="mt-0.5 truncate text-sm">{ISSUE_LABEL[activity.topIssue]}</p>
          </div>
          <div>
            <p className="label-xs">7-day trend</p>
            <p className="mt-0.5">
              <Trend pct={activity.trendPct} />
            </p>
          </div>
          <div>
            <p className="label-xs">Risk</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">
              <AnimatedStat value={activity.risk} />
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </p>
          </div>
        </div>

        {trendData.some((d) => d.reports > 0) && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="label-xs">Local 7-day trend</p>
            <ActivityTrendChart data={trendData} className="mt-2 h-[120px]" />
          </div>
        )}

        <AreaMiniCharts activity={activity} />

        <div className="mt-4 border-t border-border pt-3">
          <p className="label-xs">Recent activity</p>
          <ul className="mt-2 space-y-1.5">
            {activity.recent.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: AREA_HEALTH_HEX[r.health] }}
                  aria-hidden
                />
                <span className="flex-1 truncate">{ISSUE_LABEL[r.issue]} reported</span>
                <span className="text-xs text-subtle">
                  {r.daysAgo === 0 ? "today" : `${r.daysAgo}d ago`}
                </span>
              </li>
            ))}
            {activity.recent.length === 0 && (
              <li className="text-sm text-muted-foreground">No reports under these filters.</li>
            )}
          </ul>
        </div>

        <p className="mt-3 text-[0.68rem] leading-relaxed text-subtle">
          Approximate Civic Activity Area — derived catchment, not an official municipal boundary.
          Aggregate counts only; no citizen identity or address is shown.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <GlassButton size="sm" asChild>
            <Link to="/report">
              Report an issue here
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </GlassButton>
          <GlassButton variant="glass" size="sm" asChild>
            <Link to="/complaints">View complaints</Link>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
