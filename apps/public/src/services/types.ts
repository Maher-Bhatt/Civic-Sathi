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
  /** Real Haversine distance from user's location, in metres. */
  distanceMeters: number;
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

export interface DepartmentRoutingItem {
  department_code: string;
  department_name: string;
  external_system_key?: string | null;
  action_required: string;
  sla_hours: number;
  sequence_order: number;
  depends_on?: string | null;
  dependency_note?: string | null;
  status: string;
}

export interface MultiDeptAnalysisResult {
  title: string;
  summary: string;
  severity: string;
  priority: string;
  root_cause: string;
  preventive_warning: string;
  departments: DepartmentRoutingItem[];
  estimated_total_sla_hours: number;
  source: string;
}

export interface CaseDepartment {
  id: string;
  case_id: string;
  department_id?: string | null;
  department_name: string;
  department_code: string;
  external_system_key?: string | null;
  external_ticket_id?: string | null;
  sequence_order: number;
  dependency_case_dept_id?: string | null;
  dependency_note?: string | null;
  status: "WAITING" | "READY_FOR_REPAIR" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | string;
  action_required?: string | null;
  sla_hours: number;
  sla_deadline?: string | null;
  assigned_officer_name?: string | null;
  assigned_officer_phone?: string | null;
  assigned_at?: string | null;
  completed_at?: string | null;
  completion_evidence_url?: string | null;
  completion_notes?: string | null;
  is_blocked: boolean;
}

export interface CaseTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "in-progress" | "blocked" | "pending" | string;
  actor?: string | null;
  department?: string | null;
}

export interface CivicCase {
  id: string;
  case_number: string;
  title: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  address_text?: string | null;
  city_name?: string | null;
  ward_name?: string | null;
  severity: string;
  priority: string;
  root_cause?: string | null;
  preventive_warning?: string | null;
  action_plan_summary?: string | null;
  status: "SUBMITTED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
  estimated_total_sla_hours: number;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  departments: CaseDepartment[];
  timeline: CaseTimelineItem[];
}

export interface ConnectedSystem {
  system_key: string;
  name: string;
  protocol: string;
  endpoint_url: string;
  status: "ONLINE" | "STANDBY" | "HEALTHY" | "DEGRADED" | string;
  latency_ms: number;
  uptime_percent: number;
  total_events_synced: number;
  last_sync_at?: string | null;
  supported_schemas: string[];
  schema_mapping_preview: Record<string, string>;
}

export interface IntegrationEventIn {
  event_id?: string;
  event_type: string;
  source_system: string;
  target_system?: string;
  case_number?: string;
  case_id?: string;
  external_ticket_id?: string;
  department_code: string;
  status: string;
  notes?: string;
  actor?: string;
  telemetry?: Record<string, any>;
}

export interface IntegrationEventOut {
  event_id: string;
  status: string;
  processed_at: string;
  unblocked_departments: string[];
  case_status?: string | null;
  timeline_event_id?: string | null;
  message: string;
}

export interface LiveTransitMessage {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  event_type: string;
  summary: string;
  case_number?: string | null;
  status: "success" | "warning" | "error" | string;
  payload?: Record<string, any> | null;
}

export interface PredictiveRiskCostAnalysis {
  current_repair_cost_inr: number;
  escalated_cost_inr: number;
  cost_multiplier: number;
  taxpayer_savings_inr: number;
  currency: string;
  cost_escalation_explanation: string;
}

export interface PredictiveRiskResult {
  calculated_at: string;
  case_title: string;
  ward_name: string;
  city_name: string;
  coordinates: { lat: number; lng: number };
  risk_level: string;
  risk_score_index: number;
  impact_radius_km: number;
  impact_area_sqkm: number;
  affected_population: number;
  time_to_critical_failure_hours: number;
  cost_analysis: PredictiveRiskCostAnalysis;
  systemic_failure_forecast: string;
  preventive_intervention_directives: string;
  collateral_risks: string[];
  departments_involved: string[];
}

export interface CorporationTelemetry {
  id: string;
  name: string;
  city: string;
  division: string;
  lat: number;
  lng: number;
  active_cases: number;
  resolved_rate: number;
  connected_depts: number;
  critical_cascades: number;
  taxpayer_savings_cr: number;
  status: string;
}

export interface DigitalTwinIncident {
  id: string;
  city: string;
  ward: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  severity: string;
  priority: string;
  status: string;
  departments: string[];
  cost_multiplier: number;
  affected_citizens: number;
  impact_radius_km: number;
}

export interface StateCommandData {
  generated_at: string;
  state_name: string;
  protocol: string;
  architecture: string;
  summary: {
    total_municipal_corporations: number;
    monitored_municipalities: number;
    total_sovereign_departments: number;
    total_active_cases: number;
    average_resolution_rate: number;
    critical_systemic_cascades: number;
    average_inter_agency_latency_ms: number;
    estimated_taxpayer_savings_cr: number;
    sla_compliance_rate: number;
  };
  corporations: CorporationTelemetry[];
  critical_incidents: DigitalTwinIncident[];
  digital_twin_layers: Array<{
    id: string;
    name: string;
    count: number;
    color: string;
  }>;
}

export interface DepaConsent {
  id: string;
  citizen_name: string;
  citizen_masked_id: string;
  source_authority: string;
  target_authority: string;
  data_attributes: string[];
  purpose: string;
  status: "GRANTED" | "PENDING" | "REVOKED";
  legal_basis: string;
  expires_at: string;
  granted_at?: string | null;
  audit_hash: string;
}

export interface MdmException {
  id: string;
  issue_type: string;
  title: string;
  system_a: { name: string; field: string; value: string };
  system_b: { name: string; field: string; value: string };
  severity: "HIGH" | "MEDIUM" | "LOW" | string;
  status: "OPEN" | "RESOLVED" | string;
  confidence_score: number;
  recommended_action: string;
  occurred_at: string;
}



