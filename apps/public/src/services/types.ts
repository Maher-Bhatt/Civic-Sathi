export const ISSUE_TYPES = [
  "Water Supply",
  "Road Damage",
  "Garbage Collection",
  "Drainage",
  "Sewage", "Spam",
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

export interface RelatedComplaint {
  id: string;
  public_id?: string;
  title: string;
  category: string;
  similarity_score?: number | null;
  created_at: string;
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
  problemGroupId?: string | null;
  relatedComplaints: RelatedComplaint[];
  matchingState: "complete" | "pending" | "failed";
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
  recommendedAction?: string;
  interpretedText?: string;
  language?: string;
}

export interface ImageAnalysis {
  detected: string;
  category: IssueCategory;
  confidence: "Low" | "Medium" | "High";
  evidence?: string;
  safetyNote?: string;
  source?: string;
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


export interface ReputationBadge {
  code: string;
  name: string;
  description: string;
  awarded_at?: string | null;
  revoked_at?: string | null;
}

export interface ReputationTransaction {
  id: string;
  amount: number;
  action: string;
  reason: string;
  source_type: string;
  source_id?: string | null;
  status: string;
  verification_status: string;
  at: string;
}

export interface ImpactEvent {
  id: string;
  event_type: string;
  impact_points: number;
  source_type: string;
  source_id?: string | null;
  verification_status: string;
  at: string;
}

export interface CivicMission {
  code: string;
  title: string;
  description: string;
  category?: string | null;
  progress: number;
  target: number;
  xp_reward: number;
  completed: boolean;
  city_name?: string | null;
  ends_at?: string | null;
}

export interface CivicProfileSummary {
  user_id: string;
  role: string;
  xp_total: number;
  impact_score: number;
  reputation_score: number;
  level: number;
  level_name: string;
  current_level_xp: number;
  next_level_xp: number;
  level_progress_pct: number;
  streak_days: number;
  display_mode: "initials" | "first_name" | "alias";
  leaderboard_opt_in: boolean;
  sharing_opt_in: boolean;
  animation_enabled: boolean;
  reward_notifications_enabled: boolean;
  reports_submitted: number;
  verified_contributions: number;
  resolutions_supported: number;
}

export interface CityImpact {
  city_name: string;
  contributing_citizens: number;
  reports: number;
  verified_reports: number;
  resolved_reports: number;
  impact_points: number;
  milestone?: string | null;
}

export interface ReputationMe {
  profile: CivicProfileSummary;
  badges: ReputationBadge[];
  missions: CivicMission[];
  transactions: ReputationTransaction[];
  impact_events: ImpactEvent[];
  city_impact: CityImpact[];
}
