import type { CityId } from "@/services/cities";

/** Aggregate civic health of a geographic area. */
export type AreaHealth = "low" | "moderate" | "high" | "critical";

export type IssueKey = "water" | "roads" | "garbage" | "drainage" | "lighting" | "other";

export interface IssueBreakdown {
  water: number;
  roads: number;
  garbage: number;
  drainage: number;
  lighting: number;
  other: number;
}

/**
 * A named locality / area used as the primary map label.
 *
 * boundarySource records whether the polygon shown on the map comes from an
 * official municipal file or from a derived catchment approximation. Derived
 * polygons are always presented as "Approximate Civic Activity Area" and are
 * never described as official municipal boundaries.
 */
export interface CivicArea {
  id: string;
  city: CityId;
  name: string;
  center: [number, number];
  radiusMeters: number;
  boundarySource: "official" | "derived";
  population?: number;
  admin: {
    body: string;
    bodyVerified: boolean;
    division?: string;
    divisionVerified?: boolean;
  };
}

export interface CityGeography {
  city: CityId;
  dataNote: string;
  areas: CivicArea[];
}

export const AREA_HEALTH_ORDER: AreaHealth[] = ["low", "moderate", "high", "critical"];

/** Muted charcoal to amber to red scale. No blue, purple, gold, neon or rainbow. */
export const AREA_HEALTH_HEX: Record<AreaHealth, string> = {
  low: "#6f7d76",
  moderate: "#a8823f",
  high: "#a4503f",
  critical: "#75302a",
};

export const AREA_HEALTH_LABEL: Record<AreaHealth, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

export const ISSUE_LABEL: Record<IssueKey, string> = {
  water: "Water supply",
  roads: "Road damage",
  garbage: "Garbage",
  drainage: "Drainage",
  lighting: "Street lighting",
  other: "Other",
};

export const ISSUE_KEYS: IssueKey[] = [
  "water",
  "roads",
  "garbage",
  "drainage",
  "lighting",
  "other",
];
