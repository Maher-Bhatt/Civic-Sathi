import type { IssueCategory, Severity } from "./types";

/**
 * Geographic prototype data for the citizen map.
 * Modular by design: swap `TILES` or add a city without touching components.
 */

export type CityId = "vadodara" | "bengaluru";

export interface City {
  id: CityId;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
}

export const CITIES: City[] = [
  { id: "vadodara", name: "Vadodara", state: "Gujarat", center: [22.3072, 73.1812], zoom: 13 },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", center: [12.9716, 77.5946], zoom: 12 },
];

export const getCity = (id: CityId): City => CITIES.find((c) => c.id === id) ?? CITIES[0]!;

/** Neutral, muted basemaps — no blue-heavy, neon or rainbow styling. */
export const TILES = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    labels: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    labels: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
  },
} as const;

export const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** Muted severity palette used for map geometry (SVG cannot read CSS variables). */
export const SEVERITY_HEX: Record<Severity | "Normal", string> = {
  Normal: "#7f8c85",
  Low: "#7f8c85",
  Moderate: "#a8823f",
  High: "#a4503f",
  Critical: "#75302a",
};

export interface MapCluster {
  id: string;
  city: CityId;
  category: IssueCategory;
  severity: Severity;
  /** Number of aggregated, de-identified reports in this cluster. */
  count: number;
  /** Related reports across the ward for hotspot clusters. */
  relatedCount?: number;
  ward: string;
  area: string;
  lat: number;
  lng: number;
  /** Approximate aggregation radius in metres. */
  radiusMeters: number;
  hotspot?: boolean;
  /** 0-100 concentration risk score, hotspots only. */
  risk?: number;
}

export const MAP_CLUSTERS: MapCluster[] = [
  {
    id: "vad-water-14",
    city: "vadodara",
    category: "Water Supply",
    severity: "High",
    count: 23,
    relatedCount: 127,
    ward: "Ward 14",
    area: "Sarvodaya Nagar",
    lat: 22.3148,
    lng: 73.1903,
    radiusMeters: 520,
    hotspot: true,
    risk: 91,
  },
  {
    id: "vad-road-9",
    city: "vadodara",
    category: "Road Damage",
    severity: "Moderate",
    count: 9,
    ward: "Ward 9",
    area: "Alkapuri",
    lat: 22.3104,
    lng: 73.1717,
    radiusMeters: 320,
  },
  {
    id: "vad-garbage-6",
    city: "vadodara",
    category: "Garbage Collection",
    severity: "Low",
    count: 5,
    ward: "Ward 6",
    area: "Karelibaug",
    lat: 22.3262,
    lng: 73.1994,
    radiusMeters: 260,
  },
  {
    id: "vad-drain-11",
    city: "vadodara",
    category: "Drainage",
    severity: "Moderate",
    count: 7,
    ward: "Ward 11",
    area: "Manjalpur",
    lat: 22.2793,
    lng: 73.1932,
    radiusMeters: 300,
  },
  {
    id: "vad-light-3",
    city: "vadodara",
    category: "Street Lighting",
    severity: "Low",
    count: 3,
    ward: "Ward 3",
    area: "Gotri",
    lat: 22.3251,
    lng: 73.1364,
    radiusMeters: 240,
  },
  {
    id: "blr-water-150",
    city: "bengaluru",
    category: "Water Supply",
    severity: "High",
    count: 17,
    relatedCount: 96,
    ward: "Ward 150",
    area: "Whitefield",
    lat: 12.9698,
    lng: 77.7499,
    radiusMeters: 560,
    hotspot: true,
    risk: 84,
  },
  {
    id: "blr-road-82",
    city: "bengaluru",
    category: "Road Damage",
    severity: "Moderate",
    count: 12,
    ward: "Ward 82",
    area: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    radiusMeters: 340,
  },
  {
    id: "blr-garbage-72",
    city: "bengaluru",
    category: "Garbage Collection",
    severity: "Low",
    count: 6,
    ward: "Ward 72",
    area: "Indiranagar",
    lat: 12.9719,
    lng: 77.6412,
    radiusMeters: 280,
  },
  {
    id: "blr-drain-174",
    city: "bengaluru",
    category: "Drainage",
    severity: "Moderate",
    count: 9,
    ward: "Ward 174",
    area: "HSR Layout",
    lat: 12.9121,
    lng: 77.6446,
    radiusMeters: 320,
  },
  {
    id: "blr-sewage-45",
    city: "bengaluru",
    category: "Sewage",
    severity: "Critical",
    count: 4,
    ward: "Ward 45",
    area: "Rajajinagar",
    lat: 12.9982,
    lng: 77.5551,
    radiusMeters: 240,
  },
];

export const clustersForCity = (city: CityId) => MAP_CLUSTERS.filter((c) => c.city === city);

/** Nearest city for a detected coordinate, so geolocation stays in a supported city. */
export function nearestCity(lat: number, lng: number): City {
  let best = CITIES[0]!;
  let bestD = Number.POSITIVE_INFINITY;
  for (const c of CITIES) {
    const d = (c.center[0] - lat) ** 2 + (c.center[1] - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

export function nearestWardOrArea(cityId: CityId, lat: number, lng: number): { ward: string; area: string } {
  const clusters = clustersForCity(cityId);
  if (clusters.length === 0) {
    const c = getCity(cityId);
    return { ward: "Ward 1", area: `${c.name} · Ward 1` };
  }
  let best = clusters[0]!;
  let bestD = Number.POSITIVE_INFINITY;
  for (const item of clusters) {
    const d = (item.lat - lat) ** 2 + (item.lng - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = item;
    }
  }
  const c = getCity(cityId);
  return { ward: best.ward, area: `${c.name} · ${best.area} (${best.ward})` };
}
