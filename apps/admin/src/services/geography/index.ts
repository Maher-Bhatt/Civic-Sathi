import { Delaunay } from "d3-delaunay";
import intersect from "@turf/intersect";
import { polygon as turfPolygon, featureCollection } from "@turf/helpers";
import type { CityId } from "@/services/cities";
import { PUNE } from "./pune";
import { MUMBAI } from "./mumbai";
import { NAGPUR } from "./nagpur";
import { CHHATRAPATI_SAMBHAJINAGAR } from "./chhatrapati_sambhajinagar";
import {
  AREA_HEALTH_HEX,
  AREA_HEALTH_LABEL,
  AREA_HEALTH_ORDER,
  ISSUE_KEYS,
  ISSUE_LABEL,
  type AreaHealth,
  type CityGeography,
  type CivicArea,
  type IssueBreakdown,
  type IssueKey,
} from "./types";

export * from "./types";
export { PUNE } from "./pune";
export { MUMBAI } from "./mumbai";
export { NAGPUR } from "./nagpur";
export { CHHATRAPATI_SAMBHAJINAGAR } from "./chhatrapati_sambhajinagar";

const GEOGRAPHY: Record<CityId, CityGeography> = {
  pune: PUNE,
  mumbai: MUMBAI,
  nagpur: NAGPUR,
  chhatrapati_sambhajinagar: CHHATRAPATI_SAMBHAJINAGAR,
};

export const cityGeography = (city: CityId): CityGeography => GEOGRAPHY[city] ?? PUNE;
export const cityAreas = (city: CityId): CivicArea[] => (GEOGRAPHY[city] ?? PUNE).areas;

/* -------------------------------------------------------------- seeded RNG */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------- derived catchment polygons */

const M_PER_DEG_LAT = 111_320;

export function areaRing(area: CivicArea): Array<[number, number]> {
  const r = rng(`ring:${area.id}`);
  const steps = 32;
  const [lat, lng] = area.center;
  const mPerDegLng = M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
  const wobble = Array.from({ length: 4 }, () => 0.12 + r() * 0.16);
  const phase = Array.from({ length: 4 }, () => r() * Math.PI * 2);
  const ring: Array<[number, number]> = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    let k = 1;
    for (let h = 0; h < 4; h++) k += wobble[h]! * Math.sin((h + 2) * t + phase[h]!);
    // slightly larger radius so they overlap nicely before voronoi clipping
    const radius = area.radiusMeters * (0.85 + 0.25 * k);
    ring.push([
      lat + (radius * Math.sin(t)) / M_PER_DEG_LAT,
      lng + (radius * Math.cos(t)) / mPerDegLng,
    ]);
  }
  ring.push(ring[0]!);
  return ring;
}

export interface AreaFeatureProps {
  areaId: string;
  name: string;
  boundarySource: CivicArea["boundarySource"];
}

export function areaFeatureCollection(city: CityId): GeoJSON.FeatureCollection {
  const areas = cityAreas(city);
  const points = areas.map((a) => [a.center[1], a.center[0]]);
  
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  for (const point of points) {
    const lng = point[0] as number;
    const lat = point[1] as number;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  
  const padding = 0.05; 
  const bounds = [minLng - padding, minLat - padding, maxLng + padding, maxLat + padding] as [number, number, number, number];

  const delaunay = Delaunay.from(points as [number, number][]);
  const voronoi = delaunay.voronoi(bounds);

  return {
    type: "FeatureCollection",
    features: areas.map((a, i) => {
      let cell = voronoi.cellPolygon(i);
      if (cell && cell.length > 0) {
        const first = cell[0];
        const last = cell[cell.length - 1];
        // Ensure closed for Turf
        if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
           cell = Array.from(cell);
           cell.push([first[0], first[1]]);
        }
      }
      
      const ringCoords = areaRing(a).map(([lat, lng]) => [lng, lat]);
      const organicPoly = turfPolygon([ringCoords]);
      
      let finalGeom = organicPoly.geometry;
      try {
        if (cell && cell.length >= 4) {
          const vPoly = turfPolygon([Array.from(cell)]);
          const intersection = intersect(featureCollection([vPoly, organicPoly]));
          if (intersection && intersection.geometry) {
             finalGeom = intersection.geometry as any;
          }
        }
      } catch(e) {
        // fallback to organic ring
      }

      return {
        type: "Feature",
        properties: { areaId: a.id, name: a.name, boundarySource: a.boundarySource },
        geometry: finalGeom,
      };
    }),
  };
}

/* ------------------------------------------------------ prototype activity */

export type TimeWindow = "7d" | "30d" | "all";

export const TIME_WINDOWS: Array<{ key: TimeWindow; label: string; days: number }> = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "all", label: "All time", days: 365 },
];

export interface ComplaintPoint {
  id: string;
  areaId: string;
  issue: IssueKey;
  category?: string;
  health: AreaHealth;
  daysAgo: number;
  risk?: number;
  /** Privacy-safe: coarse coordinate inside the locality catchment only. */
  lat: number;
  lng: number;
  /** Number of persisted complaints represented by this aggregate point. */
  count?: number;
  /** Number of those persisted complaints resolved or closed. */
  resolved?: number;
}

export interface AreaActivity {
  area: CivicArea;
  counts: IssueBreakdown;
  total: number;
  critical: number;
  resolved: number;
  last7: number;
  trendPct: number;
  health: AreaHealth;
  topIssue: IssueKey;
  hotspot: boolean;
  risk: number;
  recent: Array<{ issue: IssueKey; daysAgo: number; health: AreaHealth }>;
}

/*
 * Complaint points are intentionally supplied only by the backend public-map
 * aggregate. The former deterministic generator was removed so a network
 * failure cannot make the municipality map look populated with invented data.
 */

export interface MapFilters {
  issue: IssueKey | "all";
  health: AreaHealth | "all";
  time: TimeWindow;
}

export const DEFAULT_FILTERS: MapFilters = { issue: "all", health: "all", time: "30d" };

const windowDays = (t: TimeWindow) => TIME_WINDOWS.find((w) => w.key === t)?.days ?? 30;

export function filterPoints(points: ComplaintPoint[], f: MapFilters): ComplaintPoint[] {
  const days = windowDays(f.time);
  return points.filter(
    (p) =>
      p.daysAgo <= days &&
      (f.issue === "all" || p.issue === f.issue) &&
      (f.health === "all" || p.health === f.health),
  );
}

const emptyBreakdown = (): IssueBreakdown => ({
  water: 0,
  roads: 0,
  garbage: 0,
  drainage: 0,
  lighting: 0,
  other: 0,
});

/** Aggregated, privacy-safe activity per locality for the active filters. */
export function areaActivity(city: CityId, filters: MapFilters, rawPoints: ComplaintPoint[]): AreaActivity[] {
  const points = filterPoints(rawPoints, filters);
  const all = rawPoints;
  const byArea = new Map<string, ComplaintPoint[]>();
  for (const p of points) {
    const list = byArea.get(p.areaId);
    if (list) list.push(p);
    else byArea.set(p.areaId, [p]);
  }

  return cityAreas(city).map((area) => {
    const list = byArea.get(area.id) ?? [];
    const weight = (point: ComplaintPoint) => Math.max(1, Number(point.count ?? 1));
    const counts = emptyBreakdown();
    for (const p of list) counts[p.issue] += weight(p);
    const total = list.reduce((sum, point) => sum + weight(point), 0);
    const last7 = list.filter((p) => p.daysAgo <= 7).reduce((sum, point) => sum + weight(point), 0);
    const prev7 = all
      .filter((p) => p.areaId === area.id && p.daysAgo > 7 && p.daysAgo <= 14)
      .reduce((sum, point) => sum + weight(point), 0);
    const trendPct =
      prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
    const topIssue =
      (ISSUE_KEYS.slice().sort((a, b) => counts[b] - counts[a])[0] as IssueKey) ?? "other";
    const severityRisk = total === 0
      ? 0
      : Math.round(list.reduce((sum, point) => sum + ({ low: 15, moderate: 45, high: 72, critical: 92 }[point.health] ?? 15) * weight(point), 0) / total);
    const volumeRisk = Math.min(100, Math.round(total / 12));
    const risk = Math.min(100, Math.round(severityRisk * 0.72 + volumeRisk * 0.28));
    const health: AreaHealth = risk >= 82 ? "critical" : risk >= 62 ? "high" : risk >= 38 ? "moderate" : "low";
    const critical = list.reduce(
      (sum, point) => sum + ((point.health === "critical") ? weight(point) : 0),
      0,
    );
    const resolved = list.reduce((sum, point) => sum + Math.min(weight(point), Number(point.resolved ?? 0)), 0);
    return {
      area,
      counts,
      total,
      critical,
      resolved,
      last7,
      trendPct,
      health,
      topIssue,
      hotspot: risk >= 62 && total >= 12,
      risk,
      recent: list
        .slice()
        .sort((a, b) => a.daysAgo - b.daysAgo)
        .slice(0, 4)
        .map((p) => ({ issue: p.issue, daysAgo: p.daysAgo, health: p.health })),
    };
  });
}

/* ----------------------------------------------------------- clustering */

export interface PointCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  resolved: number;
  health: AreaHealth;
  areaId: string;
  issueCounts: Partial<Record<IssueKey, number>>;
}

const HEALTH_RANK: Record<AreaHealth, number> = { low: 0, moderate: 1, high: 2, critical: 3 };
const RANK_HEALTH: AreaHealth[] = ["low", "moderate", "high", "critical"];

/** Grid clustering: coarse when zoomed out, individual points when zoomed in. */
export function clusterPoints(points: ComplaintPoint[], zoom: number): PointCluster[] {
  if (zoom >= 16) {
    return points.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      count: Math.max(1, Number(p.count ?? 1)),
      resolved: Math.max(0, Number(p.resolved ?? 0)),
      health: p.health,
      areaId: p.areaId,
      issueCounts: { [p.issue]: Math.max(1, Number(p.count ?? 1)) },
    }));
  }
  const cell =
    zoom >= 15 ? 0.004 : zoom >= 14 ? 0.008 : zoom >= 13 ? 0.016 : zoom >= 12 ? 0.03 : 0.06;
  const buckets = new Map<
    string,
    { lat: number; lng: number; n: number; resolved: number; rankSum: number; areaId: string; issueCounts: Partial<Record<IssueKey, number>> }
  >();
  for (const p of points) {
    const key = `${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
    const b = buckets.get(key);
    if (b) {
      const weight = Math.max(1, Number(p.count ?? 1));
      b.lat += p.lat * weight;
      b.lng += p.lng * weight;
      b.n += weight;
      b.resolved += Math.max(0, Number(p.resolved ?? 0));
      b.rankSum += HEALTH_RANK[p.health] * weight;
      b.issueCounts[p.issue] = (b.issueCounts[p.issue] || 0) + weight;

    } else {
      buckets.set(key, {
        lat: p.lat * Math.max(1, Number(p.count ?? 1)),
        lng: p.lng * Math.max(1, Number(p.count ?? 1)),
        n: Math.max(1, Number(p.count ?? 1)),
        resolved: Math.max(0, Number(p.resolved ?? 0)),
        rankSum: HEALTH_RANK[p.health] * Math.max(1, Number(p.count ?? 1)),
        areaId: p.areaId,
        issueCounts: { [p.issue]: Math.max(1, Number(p.count ?? 1)) },
      });
    }
  }
  return Array.from(buckets.entries()).map(([key, b]) => ({
    id: key,
    lat: b.lat / b.n,
    lng: b.lng / b.n,
    count: b.n,
    resolved: b.resolved,
    // dominant (mean) severity keeps clusters readable instead of all-red
    health: RANK_HEALTH[Math.round(b.rankSum / b.n)]!,
    areaId: b.areaId,
    issueCounts: b.issueCounts,
  }));
}

/** Nearest locality to a coordinate — used by "Near me". */
export function nearestArea(city: CityId, lat: number, lng: number): CivicArea | null {
  let best: CivicArea | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const a of cityAreas(city)) {
    const d = (a.center[0] - lat) ** 2 + (a.center[1] - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return best;
}

export function searchAreas(city: CityId, query: string): CivicArea[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return cityAreas(city)
    .filter(
      (a) => a.name.toLowerCase().includes(q) || (a.admin.division ?? "").toLowerCase().includes(q),
    )
    .slice(0, 6);
}

/* ---------------------------------------------------------- chart series */

export interface DailyTrendPoint {
  day: string;
  reports: number;
}

export interface IssueChartPoint {
  issue: IssueKey;
  label: string;
  count: number;
  fill: string;
}

const ISSUE_CHART_COLORS: Record<IssueKey, string> = {
  water: "var(--color-chart-1)",
  roads: "var(--color-chart-2)",
  garbage: "var(--color-chart-3)",
  drainage: "var(--color-chart-4)",
  lighting: "var(--color-chart-5)",
  other: "var(--muted-foreground)",
};

export function cityDailyTrend(city: CityId, filters: MapFilters, rawPoints: ComplaintPoint[]): DailyTrendPoint[] {
  const points = filterPoints(rawPoints, filters);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const p of points) {
    if (p.daysAgo > 6) continue;
    buckets[6 - p.daysAgo]! += Math.max(1, Number(p.count ?? 1));
  }
  return labels.map((day, i) => ({
    day,
    reports: buckets[i]!,
  }));
}

export function cityIssueBreakdown(city: CityId, filters: MapFilters, rawPoints: ComplaintPoint[]): IssueChartPoint[] {
  const acts = areaActivity(city, filters, rawPoints);
  const totals = emptyBreakdown();
  for (const a of acts) {
    for (const k of ISSUE_KEYS) totals[k] += a.counts[k];
  }
  return ISSUE_KEYS.map((issue) => ({
    issue,
    label: ISSUE_LABEL[issue],
    count: totals[issue],
    fill: ISSUE_CHART_COLORS[issue],
  })).filter((d) => d.count > 0);
}

export function cityHealthDistribution(
  city: CityId,
  filters: MapFilters,
  rawPoints: ComplaintPoint[]
): Array<{ health: AreaHealth; label: string; count: number; fill: string }> {
  const acts = areaActivity(city, filters, rawPoints);
  const buckets: Record<AreaHealth, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
  for (const a of acts) buckets[a.health] += a.total;
  return AREA_HEALTH_ORDER.map((health) => ({
    health,
    label: AREA_HEALTH_LABEL[health],
    count: buckets[health],
    fill: AREA_HEALTH_HEX[health],
  })).filter((d) => d.count > 0);
}

export function areaDailyTrend(areaId: string, filters: MapFilters, rawPoints: ComplaintPoint[]): DailyTrendPoint[] {
  const city = (["pune", "mumbai", "nagpur", "chhatrapati_sambhajinagar"] as CityId[]).find((c) =>
    cityAreas(c).some((a) => a.id === areaId)
  ) ?? "pune";
  const points = filterPoints(rawPoints, filters).filter((p) => p.areaId === areaId);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const p of points) {
    if (p.daysAgo > 6) continue;
    buckets[6 - p.daysAgo]! += Math.max(1, Number(p.count ?? 1));
  }
  return labels.map((day, i) => ({ day, reports: buckets[i]! }));
}
