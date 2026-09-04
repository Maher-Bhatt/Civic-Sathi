import type { IssueCategory, Severity } from "./types";

/**
 * Geographic prototype data for the citizen and municipal maps.
 * Covers four premier Municipal Corporations of Maharashtra:
 * Pune (PMC), Mumbai (BMC), Nagpur (NMC), Chhatrapati Sambhajinagar (CSMC).
 */

export type CityId = "pune" | "mumbai" | "nagpur" | "chhatrapati_sambhajinagar";

export interface City {
  id: CityId;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
}

export const CITIES: City[] = [
  { id: "pune", name: "Pune", state: "Maharashtra", center: [18.5204, 73.8567], zoom: 13 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", center: [18.9388, 72.8354], zoom: 12 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", center: [21.1458, 79.0882], zoom: 13 },
  { id: "chhatrapati_sambhajinagar", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", center: [19.8762, 75.3433], zoom: 13 },
];

export const getCity = (id: CityId): City => CITIES.find((c) => c.id === id) ?? CITIES[0]!;

/**
 * Watermark-free, high-performance raster basemaps.
 * Uses OpenStreetMap standard clean tile servers and Google Maps compatible layers.
 * Completely eliminates the deprecated CARTO "API KEY REQUIRED" watermark.
 */
export const TILES = {
  dark: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    labels: "",
  },
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    labels: "",
  },
} as const;

export const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Government of Maharashtra (SIH26129)';

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
  // ── Pune (PMC) ─────────────────────────────────────────────────────────────
  {
    id: "pun-water-katraj",
    city: "pune",
    category: "Water Supply",
    severity: "High",
    count: 24,
    relatedCount: 118,
    ward: "Ward 18 · Katraj Basin",
    area: "Katraj Aqueduct Basin",
    lat: 18.4575,
    lng: 73.8677,
    radiusMeters: 520,
    hotspot: true,
    risk: 92,
  },
  {
    id: "pun-road-kothrud",
    city: "pune",
    category: "Road Damage",
    severity: "Moderate",
    count: 14,
    ward: "Ward 12 · Kothrud",
    area: "Kothrud & Karve Road",
    lat: 18.5074,
    lng: 73.8077,
    radiusMeters: 380,
  },
  {
    id: "pun-garbage-kasba",
    city: "pune",
    category: "Garbage Collection",
    severity: "Low",
    count: 6,
    ward: "Ward 1 · Kasba",
    area: "Kasba Peth & Shaniwar Wada",
    lat: 18.5196,
    lng: 73.8553,
    radiusMeters: 260,
  },
  {
    id: "pun-drain-hadapsar",
    city: "pune",
    category: "Drainage",
    severity: "Moderate",
    count: 11,
    ward: "Ward 22 · Hadapsar",
    area: "Hadapsar & Magarpatta",
    lat: 18.5089,
    lng: 73.9259,
    radiusMeters: 340,
  },
  {
    id: "pun-light-baner",
    city: "pune",
    category: "Street Lighting",
    severity: "Low",
    count: 4,
    ward: "Ward 8 · Baner",
    area: "Aundh & Baner Smart Strip",
    lat: 18.559,
    lng: 73.8031,
    radiusMeters: 240,
  },

  // ── Mumbai (BMC) ───────────────────────────────────────────────────────────
  {
    id: "mum-water-dadar",
    city: "mumbai",
    category: "Water Supply",
    severity: "High",
    count: 31,
    relatedCount: 142,
    ward: "G/North Ward",
    area: "Dadar & Shivaji Park",
    lat: 19.0222,
    lng: 72.8428,
    radiusMeters: 550,
    hotspot: true,
    risk: 88,
  },
  {
    id: "mum-drain-kurla",
    city: "mumbai",
    category: "Drainage",
    severity: "Critical",
    count: 22,
    relatedCount: 160,
    ward: "L Ward",
    area: "Kurla & BKC Financial Center",
    lat: 19.0688,
    lng: 72.87,
    radiusMeters: 580,
    hotspot: true,
    risk: 95,
  },
  {
    id: "mum-road-andheri",
    city: "mumbai",
    category: "Road Damage",
    severity: "Moderate",
    count: 18,
    ward: "K/West Ward",
    area: "Andheri West & Lokhandwala",
    lat: 19.1197,
    lng: 72.8464,
    radiusMeters: 390,
  },
  {
    id: "mum-garbage-colaba",
    city: "mumbai",
    category: "Garbage Collection",
    severity: "Low",
    count: 8,
    ward: "A Ward",
    area: "Colaba & Fort",
    lat: 18.922,
    lng: 72.8347,
    radiusMeters: 290,
  },

  // ── Nagpur (NMC) ───────────────────────────────────────────────────────────
  {
    id: "nag-water-dharampeth",
    city: "nagpur",
    category: "Water Supply",
    severity: "Moderate",
    count: 12,
    ward: "Zone 2 · Dharampeth",
    area: "Dharampeth & West High Court Road",
    lat: 21.1432,
    lng: 79.0617,
    radiusMeters: 360,
  },
  {
    id: "nag-road-sitabuldi",
    city: "nagpur",
    category: "Road Damage",
    severity: "High",
    count: 15,
    relatedCount: 74,
    ward: "Zone 4 · Dhantoli",
    area: "Sitabuldi Fort & Interchange",
    lat: 21.1466,
    lng: 79.0833,
    radiusMeters: 440,
    hotspot: true,
    risk: 83,
  },
  {
    id: "nag-garbage-sadar",
    city: "nagpur",
    category: "Garbage Collection",
    severity: "Low",
    count: 5,
    ward: "Zone 7 · Mangalwari",
    area: "Sadar & Residency Road",
    lat: 21.1639,
    lng: 79.0805,
    radiusMeters: 250,
  },

  // ── Chhatrapati Sambhajinagar (CSMC) ───────────────────────────────────────
  {
    id: "csn-water-begumpura",
    city: "chhatrapati_sambhajinagar",
    category: "Water Supply",
    severity: "High",
    count: 19,
    relatedCount: 88,
    ward: "Zone 4 · Heritage Hydraulic",
    area: "Begumpura & Panchakki Aqueduct",
    lat: 19.897,
    lng: 75.318,
    radiusMeters: 480,
    hotspot: true,
    risk: 86,
  },
  {
    id: "csn-road-cidco",
    city: "chhatrapati_sambhajinagar",
    category: "Road Damage",
    severity: "Moderate",
    count: 13,
    ward: "Zone 2 · New City",
    area: "CIDCO Cannaught Place",
    lat: 19.8778,
    lng: 75.367,
    radiusMeters: 360,
  },
];

export const clustersForCity = (city: CityId) => MAP_CLUSTERS.filter((c) => c.city === city);

/** Nearest city for a detected coordinate, so geolocation stays in a supported Maharashtra city. */
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

/** Find the nearest mapped ward or area for a coordinate within a city */
export function nearestWardOrArea(cityId: CityId, lat: number, lng: number): { ward: string; area: string } {
  const cityClusters = clustersForCity(cityId);
  if (!cityClusters.length) {
    const c = getCity(cityId);
    return { ward: "Central Zone", area: c.name };
  }
  let best = cityClusters[0]!;
  let bestD = Number.POSITIVE_INFINITY;
  for (const c of cityClusters) {
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  const c = getCity(cityId);
  return { ward: best.ward, area: `${c.name} · ${best.area}` };
}

/** Get the active default city based on user preference, saved selection or IP/geo fallback */
export function getDefaultCity(): CityId {
  if (typeof window === "undefined") return "pune";
  try {
    const saved = localStorage.getItem("civicsathi_preferred_city") as CityId;
    if (saved === "pune" || saved === "mumbai" || saved === "nagpur" || saved === "chhatrapati_sambhajinagar") return saved;
  } catch {}
  return "pune";
}

/** Save preferred city selection across sessions */
export function setPreferredCity(cityId: CityId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("civicsathi_preferred_city", cityId);
  } catch {}
}
