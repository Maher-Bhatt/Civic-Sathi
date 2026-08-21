import type { CityId } from "@/services/cities";
import {
  AREA_HEALTH_HEX,
  AREA_HEALTH_LABEL,
  ISSUE_KEYS,
  cityAreas,
  type AreaActivity,
  type AreaHealth,
  type ComplaintPoint,
  type IssueKey,
  type MapFilters,
} from "@/services/geography";

export type LiveMapAggregate = {
  city: string;
  time: string;
  total_reports: number;
  last7_days: number;
  aggregate_points: number;
  resolved_total?: number;
  health_distribution?: Record<string, number>;
  daily_trends: Array<{ date: string; count: number }>;
  points: Array<{
    id: string;
    lat: number;
    lng: number;
    category: string;
    count: number;
    resolved: number;
    risk: number;
    health: string;
    days_ago: number;
  }>;
  source?: string;
};

const ISSUE_FROM_BACKEND: Record<string, IssueKey> = {
  water_supply: "water",
  road_damage: "roads",
  garbage_collection: "garbage",
  drainage: "drainage",
  street_lighting: "lighting",
  electricity: "other",
  sanitation: "other",
  other: "other",
};

function issueKey(category: string): IssueKey {
  return ISSUE_FROM_BACKEND[category.toLowerCase()] ?? "other";
}

function healthFromRisk(risk: number): AreaHealth {
  if (risk >= 80) return "critical";
  if (risk >= 60) return "high";
  if (risk >= 35) return "moderate";
  return "low";
}

function nearestArea(city: CityId, lat: number, lng: number) {
  return cityAreas(city).reduce((closest, area) => {
    const distance = (area.center[0] - lat) ** 2 + (area.center[1] - lng) ** 2;
    if (!closest || distance < closest.distance) return { area, distance };
    return closest;
  }, null as { area: ReturnType<typeof cityAreas>[number]; distance: number } | null)?.area;
}

function emptyCounts(): Record<IssueKey, number> {
  return { water: 0, roads: 0, garbage: 0, drainage: 0, lighting: 0, other: 0 };
}

function inTimeWindow(daysAgo: number, time: MapFilters["time"]): boolean {
  if (time === "7d") return daysAgo <= 7;
  if (time === "30d") return daysAgo <= 30;
  return true;
}

export function buildLiveMapModel(
  city: CityId,
  aggregate: LiveMapAggregate,
  filters: MapFilters,
): { activities: AreaActivity[]; points: ComplaintPoint[] } {
  const sourcePoints = (aggregate.points ?? []).filter((point) => {
    const issue = issueKey(point.category);
    const health = healthFromRisk(Number(point.risk ?? 0));
    return (
      inTimeWindow(Number(point.days_ago ?? 0), filters.time) &&
      (filters.issue === "all" || issue === filters.issue) &&
      (filters.health === "all" || health === filters.health)
    );
  });

  const points: ComplaintPoint[] = sourcePoints.map((point) => {
    const area = nearestArea(city, Number(point.lat), Number(point.lng));
    return {
      id: String(point.id),
      areaId: area?.id ?? `${city}-unmapped`,
      issue: issueKey(point.category),
      category: String(point.category || "other"),
      count: Math.max(0, Number(point.count ?? 0)),
      resolved: Math.max(0, Number(point.resolved ?? 0)),
      risk: Math.max(0, Number(point.risk ?? 0)),
      health: healthFromRisk(Number(point.risk ?? 0)),
      daysAgo: Math.max(0, Number(point.days_ago ?? 0)),
      lat: Number(point.lat ?? 0),
      lng: Number(point.lng ?? 0),
    };
  });

  const activities = cityAreas(city).map((area): AreaActivity => {
    const areaPoints = sourcePoints.filter((point) => nearestArea(city, Number(point.lat), Number(point.lng))?.id === area.id);
    const counts = emptyCounts();
    let total = 0;
    let resolved = 0;
    let riskSum = 0;
    let riskWeight = 0;

    for (const point of areaPoints) {
      const count = Math.max(0, Number(point.count ?? 0));
      const issue = issueKey(point.category);
      counts[issue] += count;
      total += count;
      resolved += Math.max(0, Number(point.resolved ?? 0));
      riskSum += Number(point.risk ?? 0) * Math.max(1, count);
      riskWeight += Math.max(1, count);
    }

    const risk = riskWeight ? Math.round(riskSum / riskWeight) : 0;
    const health = healthFromRisk(risk);
    const topIssue = ISSUE_KEYS.reduce((best, key) => (counts[key] > counts[best] ? key : best), "other" as IssueKey);
    const recent = areaPoints
      .slice()
      .sort((a, b) => Number(a.days_ago ?? 0) - Number(b.days_ago ?? 0))
      .slice(0, 4)
      .map((point) => ({
        issue: issueKey(point.category),
        daysAgo: Math.max(0, Number(point.days_ago ?? 0)),
        health: healthFromRisk(Number(point.risk ?? 0)),
      }));

    return {
      area,
      counts,
      total,
      resolved,
      last7: areaPoints
        .filter((point) => Number(point.days_ago ?? 0) <= 7)
        .reduce((sum, point) => sum + Math.max(0, Number(point.count ?? 0)), 0),
      trendPct: 0,
      health,
      topIssue,
      hotspot: total > 0 && (health === "critical" || (health === "high" && total >= 20)),
      risk,
      // The public-map endpoint does not expose a population-impact measure.
      // Keep these values zero so the UI cannot imply a synthetic affected-population estimate.
      affectedPopulation: 0,
      affectedPercent: 0,
      impactLevel:
        health === "critical"
          ? "Severe Hazard"
          : health === "high"
            ? "High Impact"
            : health === "moderate"
              ? "Moderate Impact"
              : "Low Impact",
      recent,
    };
  });

  return { activities, points };
}

export function liveHealthData(aggregate: LiveMapAggregate) {
  const distribution = aggregate.health_distribution ?? {};
  return (["low", "moderate", "high", "critical"] as AreaHealth[])
    .map((health) => ({
      health,
      label: AREA_HEALTH_LABEL[health],
      count: Number(distribution[health] ?? 0),
      fill: AREA_HEALTH_HEX[health],
    }))
    .filter((entry) => entry.count > 0);
}

export function liveIssueData(aggregate: LiveMapAggregate) {
  const counts = emptyCounts();
  for (const point of aggregate.points ?? []) {
    counts[issueKey(point.category)] += Math.max(0, Number(point.count ?? 0));
  }
  const labels: Record<IssueKey, string> = {
    water: "Water supply",
    roads: "Road damage",
    garbage: "Garbage",
    drainage: "Drainage",
    lighting: "Street lighting",
    other: "Other",
  };
  return ISSUE_KEYS.map((issue) => ({
    issue,
    label: labels[issue],
    count: counts[issue],
    fill: AREA_HEALTH_HEX[issue === "other" ? "moderate" : issue === "roads" ? "high" : issue === "lighting" ? "low" : "critical"],
  })).filter((entry) => entry.count > 0);
}

export function liveTrendData(aggregate: LiveMapAggregate) {
  return (aggregate.daily_trends ?? []).map((entry) => ({
    day: entry.date.slice(5),
    reports: Number(entry.count ?? 0),
  }));
}
