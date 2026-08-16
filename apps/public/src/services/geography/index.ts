import { Delaunay } from "d3-delaunay";
import intersect from "@turf/intersect";
import { polygon as turfPolygon, featureCollection } from "@turf/helpers";
import type { CityId } from "@/services/cities";
import { VADODARA } from "./vadodara";
import { BENGALURU } from "./bengaluru";
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
export { VADODARA } from "./vadodara";
export { BENGALURU } from "./bengaluru";

const GEOGRAPHY: Record<CityId, CityGeography> = {
  vadodara: VADODARA,
  bengaluru: BENGALURU,
};

export const cityGeography = (city: CityId): CityGeography => GEOGRAPHY[city];
export const cityAreas = (city: CityId): CivicArea[] => GEOGRAPHY[city].areas;

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
  health: AreaHealth;
  daysAgo: number;
  /** Privacy-safe: coarse coordinate inside the locality catchment only. */
  lat: number;
  lng: number;
}

export interface AreaActivity {
  area: CivicArea;
  counts: IssueBreakdown;
  total: number;
  resolved: number;
  last7: number;
  trendPct: number;
  health: AreaHealth;
  topIssue: IssueKey;
  hotspot: boolean;
  risk: number;
  recent: Array<{ issue: IssueKey; daysAgo: number; health: AreaHealth }>;
}

/** Thresholds scale with the active time window so colours stay meaningful. */
export function healthFromCount(total: number, time: TimeWindow = "30d"): AreaHealth {
  const k = time === "7d" ? 0.28 : time === "all" ? 3.4 : 1;
  if (total >= 78 * k) return "critical";
  if (total >= 46 * k) return "high";
  if (total >= 20 * k) return "moderate";
  return "low";
}

/** All prototype complaint points for a city — deterministic, de-identified. */
function buildPoints(city: CityId): ComplaintPoint[] {
  const points: ComplaintPoint[] = [];
  for (const a of cityAreas(city)) {
    const r = rng(`pts:${a.id}`);
    const base = 6 + Math.floor(r() ** 2.1 * 210);
    for (let i = 0; i < base; i++) {
      const issue = ISSUE_KEYS[Math.floor(r() * ISSUE_KEYS.length)]!;
      const daysAgo = Math.floor(r() ** 2 * 180);
      const angle = r() * Math.PI * 2;
      const dist = Math.sqrt(r()) * a.radiusMeters * 0.82;
      const mPerDegLng = M_PER_DEG_LAT * Math.cos((a.center[0] * Math.PI) / 180);
      points.push({
        id: `${a.id}-${i}`,
        areaId: a.id,
        issue,
        health: (["low", "low", "moderate", "moderate", "high", "critical"] as AreaHealth[])[
          Math.floor(r() * 6)
        ]!,
        daysAgo,
        // rounded to ~50m so no exact private location is ever published
        lat: Math.round((a.center[0] + (dist * Math.sin(angle)) / M_PER_DEG_LAT) * 2200) / 2200,
        lng: Math.round((a.center[1] + (dist * Math.cos(angle)) / mPerDegLng) * 2200) / 2200,
      });
    }
  }
  return points;
}

const pointCache = new Map<CityId, ComplaintPoint[]>();

export function complaintPoints(city: CityId): ComplaintPoint[] {
  let p = pointCache.get(city);
  if (!p) {
    p = buildPoints(city);
    pointCache.set(city, p);
  }
  return p;
}

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
export function areaActivity(city: CityId, filters: MapFilters): AreaActivity[] {
  const points = filterPoints(complaintPoints(city), filters);
  const all = complaintPoints(city);
  const byArea = new Map<string, ComplaintPoint[]>();
  for (const p of points) {
    const list = byArea.get(p.areaId);
    if (list) list.push(p);
    else byArea.set(p.areaId, [p]);
  }

  return cityAreas(city).map((area) => {
    const list = byArea.get(area.id) ?? [];
    const counts = emptyBreakdown();
    for (const p of list) counts[p.issue] += 1;
    const total = list.length;
    const last7 = list.filter((p) => p.daysAgo <= 7).length;
    const prev7 = all.filter(
      (p) => p.areaId === area.id && p.daysAgo > 7 && p.daysAgo <= 14,
    ).length;
    const trendPct =
      prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
    const topIssue =
      (ISSUE_KEYS.slice().sort((a, b) => counts[b] - counts[a])[0] as IssueKey) ?? "other";
    const health = healthFromCount(total, filters.time);
    const density = total / Math.max(1, Math.PI * (area.radiusMeters / 1000) ** 2);
    const risk = Math.max(0, Math.min(100, Math.round(density * 5 + total * 0.5 + last7 * 2)));
    const r = rng(`meta:${area.id}`);
    return {
      area,
      counts,
      total,
      resolved: Math.round(total * (0.28 + r() * 0.34)),
      last7,
      trendPct,
      health,
      topIssue,
      hotspot: risk >= 62 && total >= 20,
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
  health: AreaHealth;
  areaId: string;
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
      count: 1,
      health: p.health,
      areaId: p.areaId,
    }));
  }
  const cell =
    zoom >= 15 ? 0.004 : zoom >= 14 ? 0.008 : zoom >= 13 ? 0.016 : zoom >= 12 ? 0.03 : 0.06;
  const buckets = new Map<
    string,
    { lat: number; lng: number; n: number; rankSum: number; areaId: string }
  >();
  for (const p of points) {
    const key = `${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
    const b = buckets.get(key);
    if (b) {
      b.lat += p.lat;
      b.lng += p.lng;
      b.n += 1;
      b.rankSum += HEALTH_RANK[p.health];
    } else {
      buckets.set(key, {
        lat: p.lat,
        lng: p.lng,
        n: 1,
        rankSum: HEALTH_RANK[p.health],
        areaId: p.areaId,
      });
    }
  }
  return Array.from(buckets.entries()).map(([key, b]) => ({
    id: key,
    lat: b.lat / b.n,
    lng: b.lng / b.n,
    count: b.n,
    // dominant (mean) severity keeps clusters readable instead of all-red
    health: RANK_HEALTH[Math.round(b.rankSum / b.n)]!,
    areaId: b.areaId,
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

/** Deterministic 7-day report trend for charts. */
export function cityDailyTrend(city: CityId, filters: MapFilters): DailyTrendPoint[] {
  const points = filterPoints(complaintPoints(city), filters);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const p of points) {
    if (p.daysAgo > 6) continue;
    buckets[6 - p.daysAgo]! += 1;
  }
  const r = rng(`trend:${city}:${filters.time}:${filters.issue}`);
  return labels.map((day, i) => ({
    day,
    reports: buckets[i]! + Math.floor(r() * 4),
  }));
}

/** Issue breakdown across all localities for bar/pie charts. */
export function cityIssueBreakdown(city: CityId, filters: MapFilters): IssueChartPoint[] {
  const acts = areaActivity(city, filters);
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

/** Health distribution for radial chart. */
export function cityHealthDistribution(
  city: CityId,
  filters: MapFilters,
): Array<{ health: AreaHealth; label: string; count: number; fill: string }> {
  const acts = areaActivity(city, filters);
  const buckets: Record<AreaHealth, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
  for (const a of acts) buckets[a.health] += a.total;
  return AREA_HEALTH_ORDER.map((health) => ({
    health,
    label: AREA_HEALTH_LABEL[health],
    count: buckets[health],
    fill: AREA_HEALTH_HEX[health],
  })).filter((d) => d.count > 0);
}

/** Area-specific 7-day sparkline data. */
export function areaDailyTrend(areaId: string, filters: MapFilters): DailyTrendPoint[] {
  const city = cityAreas("vadodara").some((a) => a.id === areaId)
    ? ("vadodara" as CityId)
    : ("bengaluru" as CityId);
  const points = filterPoints(complaintPoints(city), filters).filter((p) => p.areaId === areaId);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const p of points) {
    if (p.daysAgo > 6) continue;
    buckets[6 - p.daysAgo]! += 1;
  }
  return labels.map((day, i) => ({ day, reports: buckets[i]! }));
}
