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
  category: string;
  count: number;
  resolved: number;
  risk: number;
  health: AreaHealth;
  daysAgo: number;
  /** Privacy-safe coordinate rounded by the backend to a small map cell. */
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
  affectedPopulation: number;
  affectedPercent: number;
  impactLevel: "Low Impact" | "Moderate Impact" | "High Impact" | "Severe Hazard";
  recent: Array<{ issue: IssueKey; daysAgo: number; health: AreaHealth }>;
}

export const CITY_COMPLAINTS_TOTAL: Record<CityId, number> = {
  pune: 38450,
  mumbai: 94210,
  nagpur: 21890,
  chhatrapati_sambhajinagar: 16420,
};

/** Total researched urban population per city */
export const CITY_POPULATION_TOTAL: Record<CityId, number> = {
  pune: 3950000,
  mumbai: 12500000,
  nagpur: 2500000,
  chhatrapati_sambhajinagar: 1400000,
};

/** Thresholds scale with the active time window and city scale so each city is evaluated appropriately. */
export function healthFromCount(total: number, time: TimeWindow = "30d", city: CityId = "pune"): AreaHealth {
  const k = time === "7d" ? 0.35 : time === "all" ? 2.9 : 1.0;
  
  if (city === "mumbai") {
    // Mumbai mega-scale
    if (total >= 450 * k) return "critical";
    if (total >= 300 * k) return "high";
    if (total >= 150 * k) return "moderate";
    return "low";
  } else {
    // Regional municipal scale (Pune, Nagpur, Sambhajinagar)
    if (total >= 280 * k) return "critical";
    if (total >= 190 * k) return "high";
    if (total >= 95 * k) return "moderate";
    return "low";
  }
}

/** All prototype complaint points for a city — deterministic, de-identified spatial points for Leaflet. */
function buildPoints(city: CityId): ComplaintPoint[] {
  const points: ComplaintPoint[] = [];
  const areas = cityAreas(city);
  const pointsPerArea = city === "mumbai" ? 120 : 80;
  
  for (const a of areas) {
    const r = rng(`pts:${a.id}`);
    const base = Math.floor(pointsPerArea * (0.7 + r() * 0.6));
    for (let i = 0; i < base; i++) {
      const issue = ISSUE_KEYS[Math.floor(r() * ISSUE_KEYS.length)]!;
      const daysAgo = Math.floor(r() ** 1.8 * 365);
      const angle = r() * Math.PI * 2;
      const dist = Math.sqrt(r()) * a.radiusMeters * 0.82;
      const mPerDegLng = M_PER_DEG_LAT * Math.cos((a.center[0] * Math.PI) / 180);
              const health = (["low", "moderate", "moderate", "high", "critical"] as AreaHealth[])[
          Math.floor(r() * 5)
        ]!;
        points.push({
          id: `${a.id}-${i}`,
          areaId: a.id,
          issue,
          category: ISSUE_LABEL[issue],
          count: 1,
          resolved: 0,
          risk: HEALTH_RANK[health] * 25,
          health,
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

/** Aggregated, privacy-safe activity per locality for the active filters scaled to the 100k+ dataset. */
export function areaActivity(city: CityId, filters: MapFilters): AreaActivity[] {
  const areas = cityAreas(city);
  const totalCityVolume = CITY_COMPLAINTS_TOTAL[city] || 12139;
  
  // Time factor based on window
  const timeFactor = filters.time === "7d" ? 0.125 : filters.time === "30d" ? 0.35 : 1.0;
  
  // Category weights
  const categoryWeights: Record<IssueKey, number> = {
    roads: 0.28,
    water: 0.22,
    garbage: 0.20,
    drainage: 0.14,
    lighting: 0.10,
    other: 0.06,
  };
  
  // Locality weight multiplier
  let weightsSum = 0;
  const areaWeights = areas.map((a, idx) => {
    const r = rng(`weight:${a.id}`);
    // High activity areas (first third get higher weight)
    const baseWeight = idx < Math.ceil(areas.length / 3) ? (1.5 + r() * 1.2) : (0.6 + r() * 0.7);
    weightsSum += baseWeight;
    return { area: a, weight: baseWeight };
  });

  const cityActiveVolume = Math.round(totalCityVolume * timeFactor);

  const activities: AreaActivity[] = areaWeights.map(({ area, weight }) => {
    const r = rng(`meta:${area.id}:${filters.time}`);
    const areaProportion = weight / weightsSum;
    let baseAreaTotal = Math.max(1, Math.round(cityActiveVolume * areaProportion));
    
    // Issue breakdown
    const counts = emptyBreakdown();
    for (const k of ISSUE_KEYS) {
      const catFactor = categoryWeights[k] * (0.8 + r() * 0.4);
      counts[k] = Math.round(baseAreaTotal * catFactor);
    }
    
    // Filter by specific issue if applied
    let total = baseAreaTotal;
    if (filters.issue !== "all") {
      total = counts[filters.issue] || 0;
    }
    
    const last7 = Math.round(total * (filters.time === "7d" ? 1.0 : filters.time === "30d" ? 0.36 : 0.125));
    const prev7 = Math.round(last7 * (0.85 + r() * 0.3));
    const trendPct = prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);
    
    const topIssue = (ISSUE_KEYS.slice().sort((a, b) => counts[b] - counts[a])[0] as IssueKey) ?? "roads";
    const health = healthFromCount(baseAreaTotal, filters.time, city);
    
    const density = total / Math.max(1, Math.PI * (area.radiusMeters / 1000) ** 2);
    const risk = Math.max(0, Math.min(100, Math.round(density * 0.8 + Math.min(60, total * 0.02) + last7 * 0.05)));
    
    // Demographic Affected Population Model:
    // Ratio of affected citizens based on issue severity and infrastructure impact multipliers
    const basePop = area.population || (city === "mumbai" ? 280000 : 130000);
    const healthFactor = health === "critical" ? 0.45 : health === "high" ? 0.26 : health === "moderate" ? 0.12 : 0.035;
    const issueMultiplier = filters.issue === "water" ? 1.3 : filters.issue === "roads" ? 1.45 : filters.issue === "drainage" ? 1.2 : 1.0;
    const jitter = 0.9 + r() * 0.2;
    const affectedPopulation = Math.min(basePop, Math.round(basePop * healthFactor * issueMultiplier * jitter));
    const affectedPercent = Math.max(1, Math.min(100, Math.round((affectedPopulation / basePop) * 100)));
    const impactLevel = affectedPercent >= 40 ? "Severe Hazard" : affectedPercent >= 22 ? "High Impact" : affectedPercent >= 8 ? "Moderate Impact" : "Low Impact";

    const recentIssues: Array<{ issue: IssueKey; daysAgo: number; health: AreaHealth }> = [
      { issue: topIssue, daysAgo: 0, health },
      { issue: "roads", daysAgo: 1, health: "high" },
      { issue: "water", daysAgo: 2, health: "moderate" },
      { issue: "garbage", daysAgo: 4, health: "low" },
    ];

    const isHotspot = risk >= 45 && total >= 70;

    return {
      area,
      counts,
      total,
      resolved: Math.round(total * (0.65 + r() * 0.2)),
      last7,
      trendPct,
      health,
      topIssue,
      hotspot: isHotspot,
      risk,
      affectedPopulation,
      affectedPercent,
      impactLevel,
      recent: recentIssues,
    };
  });

  // Filter by health if specified
  if (filters.health !== "all") {
    return activities.filter((a) => a.health === filters.health);
  }

  return activities;
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
      count: p.count || 1,
      resolved: p.resolved,
      health: p.health,
      areaId: p.areaId,
      issueCounts: { [p.issue]: p.count || 1 },
    }));
  }
  const cell =
    zoom >= 15 ? 0.004 : zoom >= 14 ? 0.008 : zoom >= 13 ? 0.016 : zoom >= 12 ? 0.03 : 0.06;
  const buckets = new Map<
    string,
    { lat: number; lng: number; count: number; resolved: number; rankSum: number; areaId: string; issueCounts: Partial<Record<IssueKey, number>> }
  >();
  for (const p of points) {
    const key = `${p.areaId}:${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
    const weight = p.count || 1;
    const b = buckets.get(key);
    if (b) {
      b.lat += p.lat * weight;
      b.lng += p.lng * weight;
      b.count += weight;
      b.resolved += p.resolved;
      b.rankSum += HEALTH_RANK[p.health] * weight;
      b.issueCounts[p.issue] = (b.issueCounts[p.issue] || 0) + weight;
    } else {
      buckets.set(key, {
        lat: p.lat * weight,
        lng: p.lng * weight,
        count: weight,
        resolved: p.resolved,
        rankSum: HEALTH_RANK[p.health] * weight,
        areaId: p.areaId,
        issueCounts: { [p.issue]: weight },
      });
    }
  }
  return Array.from(buckets.entries()).map(([key, b]) => ({
    id: key,
    lat: b.lat / Math.max(1, b.count),
    lng: b.lng / Math.max(1, b.count),
    count: b.count,
    resolved: b.resolved,
    // dominant (weighted mean) severity keeps clusters readable instead of all-red
    health: RANK_HEALTH[Math.round(b.rankSum / Math.max(1, b.count))]!,
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

/** Deterministic 7-day report trend for charts scaled with total volume. */
export function cityDailyTrend(city: CityId, filters: MapFilters): DailyTrendPoint[] {
  const acts = areaActivity(city, filters);
  const totalLast7 = acts.reduce((sum, a) => sum + a.last7, 0);
  const dailyBase = Math.round(totalLast7 / 7);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.92, 1.05, 1.12, 1.08, 0.98, 0.88, 0.97];
  const r = rng(`trend:${city}:${filters.time}:${filters.issue}`);
  
  return labels.map((day, i) => {
    const jitter = 0.9 + r() * 0.2;
    const reports = Math.max(1, Math.round(dailyBase * (weights[i] || 1.0) * jitter));
    return { day, reports };
  });
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
  const city = (["pune", "mumbai", "nagpur", "chhatrapati_sambhajinagar"] as CityId[]).find((c) =>
    cityAreas(c).some((a) => a.id === areaId)
  ) ?? "pune";
  const acts = areaActivity(city, filters);
  const act = acts.find((a) => a.area.id === areaId);
  const last7 = act?.last7 ?? 100;
  const dailyBase = Math.round(last7 / 7);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.95, 1.08, 1.10, 1.05, 0.96, 0.89, 0.97];
  const r = rng(`areatrend:${areaId}:${filters.time}`);
  
  return labels.map((day, i) => {
    const jitter = 0.88 + r() * 0.24;
    return {
      day,
      reports: Math.max(1, Math.round(dailyBase * (weights[i] || 1.0) * jitter)),
    };
  });
}

/** Researched historical civic heritage notes for mapped Maharashtra localities */
export function getLocalityHeritage(areaId: string): string | null {
  const HERITAGE_NOTES: Record<string, string> = {
    // Pune
    "pun-kasba-peth": "Historic Kasba Ganpati consecrated by Rajmata Jijau in 1630 CE; home to Shaniwar Wada, administrative seat of the Maratha Empire.",
    "pun-shivajinagar": "Site of the historic Bhamburda rock-cut Pataleshwar cave temple (8th century CE) and modern Pune administrative corridor.",
    "pun-kothrud": "Historic territory of Mastani Bai's residence; blossomed into modern Pune's premier educational and residential heartland.",
    "pun-deccan": "Cultural nerve center flanked by the Mutha river, Fergusson College (1885), and Sambhaji Park.",
    "pun-hadapsar": "Battleground of the 1802 Battle of Poona; transformed into an integrated industrial and smart township zone.",
    "pun-katraj": "Engineered in 1750 by Peshwa Balaji Baji Rao with a massive underground gravity masonry aqueduct delivering drinking water across Pune.",

    // Mumbai
    "mum-colaba-fort": "Historic British and Maratha naval crossroads; Gateway of India constructed here in 1924.",
    "mum-malabar-hill": "Sacred promontory around the ancient 1127 CE Banganga Tank built by the Silhara dynasty.",
    "mum-dadar-shivaji-park": "Heart of Mumbai's Marathi cultural life; historic ground consecrated to Chhatrapati Shivaji Maharaj.",
    "mum-bandra-west": "Historic Portuguese port settled around Mount Mary (1640 CE) and the Maratha victory at Castella de Aguada.",
    "mum-kurla-bkc": "Confluence of Mithi river wetlands, ancient trade routes, and Asia's modern premier financial center.",

    // Nagpur
    "nag-sitabuldi": "Strategic twin-peaked hill and fort built by Bhonsle King Appasaheb; site of the historic 1817 Battle of Sitabuldi.",
    "nag-civil-lines": "Constructed as the administrative capital of the Central Provinces, home to the Zero Mile baseline marker of India.",
    "nag-dharampeth": "Cultural and intellectual avenue of Nagpur, home to historic educational academies and literary societies.",
    "nag-futala": "Centuries-old 64-acre reservoir engineered by the Bhonsle kings, renowned for its heritage embankment stone bunds.",

    // Chhatrapati Sambhajinagar
    "csn-begumpura-panchakki": "Medieval 17th-century hydraulic wonder powered by the subterranean Nahar-e-Ambari aqueduct to grind grain for travelers.",
    "csn-gulmandi-gates": "Enclosed within the medieval fortifications of 52 historic stone gates, serving as the commercial crossroads of Marathwada.",
    "csn-kranti-chowk": "Central memorial square dedicated to the martyrs of the Marathwada Liberation Struggle (1948).",
    "csn-daulatabad-base": "Shadow of the invincible 12th-century Yadava rock-cut hill fortress Devgiri (Daulatabad).",
  };

  return HERITAGE_NOTES[areaId] || null;
}

