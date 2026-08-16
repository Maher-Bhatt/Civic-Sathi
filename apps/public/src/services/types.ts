export const ISSUE_TYPES = [
  "Water Supply",
  "Road Damage",
  "Garbage Collection",
  "Drainage",
  "Sewage",
  "Street Lighting",
  "Electricity",
  "Public Transport",
  "Sanitation",
] as const;

export type IssueCategory = (typeof ISSUE_TYPES)[number];

export type Severity = "Low" | "Moderate" | "High" | "Critical";

export const COMPLAINT_STATUSES = [
  "Received",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
] as const;

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface LocationInfo extends GeoPoint {
  ward: string;
  area: string;
  /** Optional city label, e.g. "Vadodara". */
  city?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  notifyStatus: boolean;
  notifyNearby: boolean;
}

export interface TimelineEvent {
  label: string;
  description: string;
  at: string | null;
  done: boolean;
}

export interface Complaint {
  id: string;
  description: string;
  category: IssueCategory;
  severity: Severity;
  location: LocationInfo;
  photo?: string | null;
  createdAt: string;
  status: ComplaintStatus;
  relatedCount: number;
  nearbyCount: number;
  timeline: TimelineEvent[];
}

export interface AnalysisResult {
  category: IssueCategory;
  severity: Severity;
  confidence: "Low" | "Medium" | "High";
  location: LocationInfo;
  relatedCount: number;
  nearbyCount: number;
  radiusMeters: number;
  hotspot: boolean;
  relatedSamples: string[];
  summary: string;
}

export interface ImageAnalysis {
  detected: string;
  category: IssueCategory;
  confidence: "Low" | "Medium" | "High";
}

export interface NearbyReport {
  id: string;
  category: IssueCategory;
  severity: Severity;
  /** Normalized 0-1 coordinates for the schematic map. */
  x: number;
  y: number;
  ageHours: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  complaintId: string;
  at: string;
  kind: "received" | "assigned" | "status" | "resolution";
  read: boolean;
}
