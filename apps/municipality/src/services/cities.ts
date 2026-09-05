import type { IssueCategory, Severity } from "./types";

/**
 * Geographic prototype data for the citizen and municipal maps.
 * Multi-city, multi-state coverage across India:
 * Vadodara (VMC), Mumbai (BMC), Bengaluru (BBMP), Delhi (MCD).
 */

export type CityId = "vadodara" | "mumbai" | "bengaluru" | "delhi" | "pune";

export interface City {
  id: CityId;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
}

export const CITIES: City[] = [
  { id: "vadodara", name: "Vadodara", state: "Gujarat", center: [22.3072, 73.1812], zoom: 13 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", center: [18.9388, 72.8354], zoom: 12 },
  { id: "pune", name: "Pune", state: "Maharashtra", center: [18.5204, 73.8567], zoom: 12 },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", center: [12.9716, 77.5946], zoom: 12 },
  { id: "delhi", name: "Delhi", state: "NCT Delhi", center: [28.6139, 77.2090], zoom: 12 },
];

export const getCity = (id: CityId): City => CITIES.find((c) => c.id === id) ?? CITIES[0]!;

/**
 * Watermark-free, high-performance raster basemaps.
 * Uses OpenStreetMap standard clean tile servers.
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
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Civic Sathi (SIH26129)';

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
  count: number;
  relatedCount?: number;
  ward: string;
  area: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  hotspot?: boolean;
  risk?: number;
}

export const MAP_CLUSTERS: MapCluster[] = [
  // ── Vadodara (VMC) ────────────────────────────────────────────────────────
  {
    id: "vad-water-fatehgunj",
    city: "vadodara",
    category: "Water Supply",
    severity: "High",
    count: 22,
    relatedCount: 96,
    ward: "Ward 3 · Fatehgunj",
    area: "Fatehgunj & Alkapuri",
    lat: 22.3217,
    lng: 73.1851,
    radiusMeters: 480,
    hotspot: true,
    risk: 89,
  },
  {
    id: "vad-road-sayajigunj",
    city: "vadodara",
    category: "Road Damage",
    severity: "Moderate",
    count: 15,
    ward: "Ward 1 · Sayajigunj",
    area: "Sayajigunj & Raopura",
    lat: 22.3103,
    lng: 73.1920,
    radiusMeters: 360,
  },
  {
    id: "vad-garbage-manjalpur",
    city: "vadodara",
    category: "Garbage Collection",
    severity: "Low",
    count: 8,
    ward: "Ward 12 · Manjalpur",
    area: "Manjalpur & Old Padra Road",
    lat: 22.2776,
    lng: 73.1731,
    radiusMeters: 280,
  },
  {
    id: "vad-drain-karelibaug",
    city: "vadodara",
    category: "Drainage",
    severity: "Moderate",
    count: 12,
    ward: "Ward 7 · Karelibaug",
    area: "Karelibaug & Productivity Road",
    lat: 22.3271,
    lng: 73.2060,
    radiusMeters: 350,
  },
  {
    id: "vad-light-gotri",
    city: "vadodara",
    category: "Street Lighting",
    severity: "Low",
    count: 5,
    ward: "Ward 15 · Gotri",
    area: "Gotri & Waghodia Road",
    lat: 22.3340,
    lng: 73.1430,
    radiusMeters: 260,
  },

  // ── Mumbai (BMC) ────────────────────────────────────────────────────────────
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

  // ── Bengaluru (BBMP) ──────────────────────────────────────────────────────
  {
    id: "blr-water-koramangala",
    city: "bengaluru",
    category: "Water Supply",
    severity: "High",
    count: 28,
    relatedCount: 130,
    ward: "Ward 150 · Koramangala",
    area: "Koramangala & HSR Layout",
    lat: 12.9352,
    lng: 77.6245,
    radiusMeters: 500,
    hotspot: true,
    risk: 91,
  },
  {
    id: "blr-road-whitefield",
    city: "bengaluru",
    category: "Road Damage",
    severity: "Moderate",
    count: 20,
    ward: "Ward 85 · Whitefield",
    area: "Whitefield & ITPL Main Road",
    lat: 12.9698,
    lng: 77.7500,
    radiusMeters: 420,
  },
  {
    id: "blr-drain-rajajinagar",
    city: "bengaluru",
    category: "Drainage",
    severity: "Critical",
    count: 18,
    relatedCount: 95,
    ward: "Ward 72 · Rajajinagar",
    area: "Rajajinagar & Mahalakshmi Layout",
    lat: 12.9920,
    lng: 77.5540,
    radiusMeters: 460,
    hotspot: true,
    risk: 87,
  },
  {
    id: "blr-garbage-majestic",
    city: "bengaluru",
    category: "Garbage Collection",
    severity: "Low",
    count: 7,
    ward: "Ward 109 · Chickpete",
    area: "Majestic & KR Market",
    lat: 12.9772,
    lng: 77.5722,
    radiusMeters: 300,
  },

  // ── Delhi (MCD) ───────────────────────────────────────────────────────────
  {
    id: "del-water-dwarka",
    city: "delhi",
    category: "Water Supply",
    severity: "High",
    count: 35,
    relatedCount: 155,
    ward: "Zone 17 · Dwarka",
    area: "Dwarka & Palam",
    lat: 28.5921,
    lng: 77.0460,
    radiusMeters: 560,
    hotspot: true,
    risk: 93,
  },
  {
    id: "del-road-rohini",
    city: "delhi",
    category: "Road Damage",
    severity: "Moderate",
    count: 22,
    ward: "Zone 6 · Rohini",
    area: "Rohini & Pitampura",
    lat: 28.7320,
    lng: 77.1198,
    radiusMeters: 440,
  },
  {
    id: "del-drain-yamuna",
    city: "delhi",
    category: "Drainage",
    severity: "Critical",
    count: 25,
    relatedCount: 170,
    ward: "Zone 10 · Shahdara",
    area: "Shahdara & Yamuna Vihar",
    lat: 28.6814,
    lng: 77.2894,
    radiusMeters: 600,
    hotspot: true,
    risk: 96,
  },
  {
    id: "del-garbage-chandni",
    city: "delhi",
    category: "Garbage Collection",
    severity: "Moderate",
    count: 14,
    ward: "Zone 1 · City Zone",
    area: "Chandni Chowk & Old Delhi",
    lat: 28.6506,
    lng: 77.2334,
    radiusMeters: 380,
  },
];

export const clustersForCity = (city: CityId) => MAP_CLUSTERS.filter((c) => c.city === city);

/** Nearest city for a detected coordinate. */
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

/** Get the active default city based on user preference or fallback */
export function getDefaultCity(): CityId {
  if (typeof window === "undefined") return "vadodara";
  try {
    const saved = localStorage.getItem("civicsathi_preferred_city") as CityId;
    if (saved === "vadodara" || saved === "mumbai" || saved === "bengaluru" || saved === "delhi") return saved;
  } catch {}
  return "vadodara";
}

/** Save preferred city selection across sessions */
export function setPreferredCity(cityId: CityId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("civicsathi_preferred_city", cityId);
  } catch {}
}
