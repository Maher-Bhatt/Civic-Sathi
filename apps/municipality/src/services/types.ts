import type { CityId } from "@/services/cities";

/** Shared civic domain types — kept in sync with the citizen portal API contract. */
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
  "Other",
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
  "Rejected",
] as const;

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export type OfficerRole = "Officer" | "Supervisor" | "Department Head" | "Collector" | "Administrator";

export type AlertPriority = "Critical" | "High" | "Moderate" | "Informational";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export const DEPARTMENTS = [
  "Municipal Water",
  "Public Works",
  "Sanitation",
  "Drainage",
  "Electrical",
  "Transport",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export interface Officer {
  id: string;
  name: string;
  email: string;
  department: Department;
  designation?: string;
  role: OfficerRole;
  city: CityId;
  lastActive: string;
}

export interface RiskFactors {
  complaintVolume: number;
  geographicConcentration: number;
  semanticSimilarity: number;
  recentGrowth: number;
  severity: number;
  overall: number;
}

export interface SystemicIssue {
  id: string;
  category: IssueCategory;
  areaId: string;
  areaName: string;
  ward: string;
  city: CityId;
  complaintCount: number;
  riskScore: number;
  trendPct: number;
  dominantIssue: IssueCategory;
  possibleCause: string;
  causeConfidence: number;
  recommendedActions: string[];
  whyFlagged: string;
  evidence: Array<{ label: string; value: string; detail: string }>;
  riskFactors: RiskFactors;
  status: "Emerging" | "Investigating" | "Assigned" | "Monitoring" | "Resolved";
  department?: Department;
  relatedComplaintIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MuniComplaint {
  id: string;
  backendId?: string | undefined;
  publicId?: string | undefined;
  title: string;
  description: string;
  category: IssueCategory;
  categoryKey?: string | undefined;
  severity: Severity;
  priority: string;
  severityScore: number;
  riskScore: number;
  area: string;
  ward: string;
  city: CityId;
  department: string;
  addressText?: string | null;
  status: ComplaintStatus;
  lat: number;
  lng: number;
  photo?: string | null;
  submittedByName?: string | null;
  submittedByPhone?: string | null;
  privacyStatus?: string | undefined;
  rawStatus?: string | undefined;
  analysisDetails?: {
    language?: string | null;
    keywords: string[];
    entities: Array<{ text: string; label: string; start?: number | null; end?: number | null }>;
    similarCount: number;
    possibleDuplicate: boolean;
    confidenceScore?: number | null | undefined;
  } | undefined;
  createdAt: string;
  updatedAt: string;
  assignedOfficerId?: string | null;
  assignedOfficerName?: string | null;
  assignedAt?: string | null;
  assignmentNotes?: string | null;
  rejectionReason?: string | null;
  rejectedByName?: string | null;
  rejectedAt?: string | null;
  assignedTo?: string;
  clusterId?: string;
  similarity?: number;
  language?: string;
  interpretedText?: string;
  suggestedAction?: string;
  aiAnalysis?: {
    category: IssueCategory;
    severity: Severity;
    sentiment: "Negative" | "Neutral" | "Urgent";
    similarity: number;
    confidenceScore?: number | null;
    cluster?: string;
  };
  timeline: Array<{
    label: string;
    at: string;
    actor?: string;
    reason?: string;
  }>;
}

export interface MuniAlert {
  id: string;
  priority: AlertPriority;
  category: IssueCategory;
  area: string;
  ward: string;
  city: CityId;
  complaintCount: number;
  riskScore: number;
  trendPct: number;
  issueId?: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface DepartmentStats {
  id: string;
  name: Department;
  open: number;
  critical: number;
  inProgress: number;
  resolved: number;
  avgResponseDays: number;
  emergingIssues: number;
  categoryBreakdown: Record<string, number>;
}

export interface AreaOverview {
  id: string;
  name: string;
  ward: string;
  city: CityId;
  activity: "Low" | "Moderate" | "High" | "Critical";
  reports: number;
  critical: number;
  trendPct: number;
  topIssue: IssueCategory;
  risk: number;
  health: "low" | "moderate" | "high" | "critical";
}

export interface DashboardKPIs {
  totalReports: number;
  critical: number;
  active: number;
  resolved: number;
  emergingIssues: number;
  areaHotspots: number;
}

export interface LiveActivity {
  id: string;
  type: "new_report" | "issue_updated" | "alert" | "assignment" | "resolution";
  title: string;
  subtitle: string;
  detail?: string;
  at: string;
}

export interface OfficerNotification {
  id: string;
  title: string;
  body: string;
  kind: "critical" | "risk_increase" | "cluster" | "assignment" | "overdue" | "resolved";
  read: boolean;
  at: string;
  link?: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: Record<string, string>;
}

export interface MuniSettings {
  theme: "dark" | "light" | "system";
  compactMode: boolean;
  defaultCity: CityId;
  defaultMapMode: "health" | "activity" | "hotspots";
  notifications: {
    critical: boolean;
    assignments: boolean;
    riskChanges: boolean;
    dailyDigest: boolean;
  };
}

export interface ComplaintFilters {
  search: string;
  city: CityId | "all";
  area: string;
  ward: string;
  category: IssueCategory | "all";
  severity: Severity | "all";
  department: Department | "all";
  status: ComplaintStatus | "all";
  dateFrom: string;
  dateTo: string;
  riskMin: number;
  riskMax: number;
}

export const DEFAULT_COMPLAINT_FILTERS: ComplaintFilters = {
  search: "",
  city: "all",
  area: "",
  ward: "",
  category: "all",
  severity: "all",
  department: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
  riskMin: 0,
  riskMax: 100,
};

export function riskLevel(score: number): RiskLevel {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

export function alertPriority(score: number): AlertPriority {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 40) return "Moderate";
  return "Informational";
}

/* ================================================================
   DOMAIN ENTITIES — Work Execution Lifecycle & Roles
   ================================================================ */

export type SystemRole =
  | "citizen"
  | "contractor"
  | "officer"
  | "supervisor"
  | "department_head"
  | "collector"
  | "admin";

export type Permission =
  | "complaint.view"
  | "complaint.assign"
  | "complaint.close"
  | "work.create"
  | "work.approve"
  | "work.inspect"
  | "work.complete"
  | "contractor.view"
  | "contractor.manage"
  | "contractor.verify"
  | "work.accept"
  | "work.progress.update"
  | "measurement.submit"
  | "measurement.verify"
  | "bill.submit"
  | "bill.verify"
  | "payment.approve"
  | "admin.users.manage"
  | "admin.system.manage"
  | "audit.view";

export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  citizen: ["complaint.view"],
  contractor: [
    "contractor.view",
    "work.accept",
    "work.progress.update",
    "measurement.submit",
    "bill.submit",
  ],
  officer: [
    "complaint.view",
    "complaint.assign",
    "contractor.view",
    "work.create",
    "work.inspect",
    "work.complete",
    "audit.view",
  ],
  supervisor: [
    "complaint.view",
    "complaint.assign",
    "complaint.close",
    "contractor.view",
    "work.create",
    "work.approve",
    "work.inspect",
    "work.complete",
    "measurement.verify",
    "bill.verify",
    "payment.approve",
    "audit.view",
  ],
  collector: [
    "complaint.view",
    "complaint.assign",
    "contractor.view",
    "contractor.manage",
    "contractor.verify",
    "work.create",
    "work.approve",
    "work.inspect",
    "work.complete",
    "admin.users.manage",
    "audit.view",
  ],
  department_head: [
    "complaint.view",
    "complaint.assign",
    "complaint.close",
    "contractor.view",
    "contractor.manage",
    "work.create",
    "work.approve",
    "work.inspect",
    "work.complete",
    "measurement.verify",
    "bill.verify",
    "payment.approve",
    "audit.view",
  ],
  admin: [
    "complaint.view",
    "complaint.assign",
    "complaint.close",
    "contractor.view",
    "contractor.manage",
    "contractor.verify",
    "work.create",
    "work.approve",
    "work.inspect",
    "work.complete",
    "measurement.submit",
    "measurement.verify",
    "bill.submit",
    "bill.verify",
    "payment.approve",
    "admin.users.manage",
    "admin.system.manage",
    "audit.view",
  ],
};

export function hasPermission(role: SystemRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// ------------------------------------------------------------- Admin User

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: string;
  lastActive: string;
}

// ------------------------------------------------------------- Contractor

export type ContractorStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "SUSPENDED"
  | "INACTIVE"
  | "REJECTED";

export type ContractorSpecialization =
  | "Road Damage"
  | "Water Supply"
  | "Drainage"
  | "Sewage"
  | "Street Lighting"
  | "Electricity"
  | "Garbage Collection"
  | "Sanitation"
  | "Public Transport"
  | "General Civil";

export interface Contractor {
  id: string;
  companyName: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  pan: string;
  status: ContractorStatus;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  registrationDate: string;
  expiryDate: string;
  specializationCategories: ContractorSpecialization[];
  serviceAreas: string[]; // city IDs
  performanceScore: number; // 0-100
  slaScore: number; // 0-100
  inspectionPassRate: number; // 0-100
  onTimeCompletionRate: number; // 0-100
  reworkRate: number; // 0-100
  rating: number; // 0-5
  activeWorkCount: number;
  totalCompleted: number;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------- Contractor Document

export type ContractorDocumentType =
  | "Registration Certificate"
  | "GST Certificate"
  | "PAN Card"
  | "Bank Details"
  | "Experience Certificate"
  | "Technical Certificate"
  | "Insurance Certificate"
  | "Other";

export interface ContractorDocument {
  id: string;
  contractorId: string;
  documentType: ContractorDocumentType;
  documentName: string;
  fileUrl: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  expiryDate?: string;
  rejectionReason?: string;
}

// ------------------------------------------------------------- Work Package

export type WorkPackageStatus =
  | "DRAFT"
  | "OPEN"
  | "CONTRACTOR_SELECTION"
  | "CONTRACTED"
  | "IN_EXECUTION"
  | "COMPLETED"
  | "CANCELLED";

export interface WorkPackage {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  department: Department;
  cityId: string;
  ward: string;
  area: string;
  lat: number;
  lng: number;
  civicIssueIds?: string[];
  relatedComplaintIds?: string[];
  relatedSystemicIssueId?: string;
  estimatedCost: number;
  priority: "Low" | "Moderate" | "High" | "Critical";
  scope: string;
  status: WorkPackageStatus;
  workOrderId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------- Work Order Status Machine

export const WORK_ORDER_STATUSES = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "CONTRACTOR_ASSIGNED",
  "PENDING_ACCEPTANCE",
  "ACCEPTED",
  "MOBILIZATION",
  "IN_PROGRESS",
  "SUBMITTED_FOR_INSPECTION",
  "INSPECTION_FAILED",
  "REWORK",
  "RESUBMITTED",
  "INSPECTION_PASSED",
  "COMPLETED",
  "MEASUREMENT_PENDING",
  "BILL_SUBMITTED",
  "BILL_VERIFIED",
  "PAYMENT_APPROVED",
  "CLOSED",
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

const VALID_TRANSITIONS: Record<WorkOrderStatus, Partial<Record<SystemRole, WorkOrderStatus[]>>> = {
  DRAFT: { officer: ["PENDING_APPROVAL"], supervisor: ["PENDING_APPROVAL", "APPROVED"] },
  PENDING_APPROVAL: {
    supervisor: ["APPROVED", "DRAFT"],
    department_head: ["APPROVED", "DRAFT"],
    admin: ["APPROVED", "DRAFT"],
  },
  APPROVED: {
    officer: ["CONTRACTOR_ASSIGNED"],
    supervisor: ["CONTRACTOR_ASSIGNED"],
  },
  CONTRACTOR_ASSIGNED: {
    officer: ["PENDING_ACCEPTANCE"],
    supervisor: ["PENDING_ACCEPTANCE"],
  },
  PENDING_ACCEPTANCE: {
    contractor: ["ACCEPTED", "DRAFT"],
  },
  ACCEPTED: {
    contractor: ["MOBILIZATION"],
  },
  MOBILIZATION: {
    contractor: ["IN_PROGRESS"],
  },
  IN_PROGRESS: {
    contractor: ["SUBMITTED_FOR_INSPECTION"],
  },
  SUBMITTED_FOR_INSPECTION: {
    officer: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
    supervisor: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
  },
  INSPECTION_FAILED: {
    contractor: ["REWORK"],
  },
  REWORK: {
    contractor: ["RESUBMITTED"],
  },
  RESUBMITTED: {
    officer: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
    supervisor: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
  },
  INSPECTION_PASSED: {
    officer: ["COMPLETED"],
    supervisor: ["COMPLETED"],
  },
  COMPLETED: {
    officer: ["MEASUREMENT_PENDING"],
    supervisor: ["MEASUREMENT_PENDING"],
    contractor: ["MEASUREMENT_PENDING"],
  },
  MEASUREMENT_PENDING: {
    contractor: ["BILL_SUBMITTED"],
  },
  BILL_SUBMITTED: {
    officer: ["BILL_VERIFIED"],
    supervisor: ["BILL_VERIFIED"],
  },
  BILL_VERIFIED: {
    supervisor: ["PAYMENT_APPROVED"],
    department_head: ["PAYMENT_APPROVED"],
    admin: ["PAYMENT_APPROVED"],
  },
  PAYMENT_APPROVED: {
    officer: ["CLOSED"],
    supervisor: ["CLOSED"],
    admin: ["CLOSED"],
  },
  CLOSED: {},
};

export function validateWorkOrderTransition(
  current: WorkOrderStatus,
  next: WorkOrderStatus,
  role: SystemRole,
): { valid: boolean; reason?: string } {
  const allowed = VALID_TRANSITIONS[current]?.[role] ?? [];
  if (allowed.includes(next)) return { valid: true };
  return {
    valid: false,
    reason: `Role '${role}' cannot transition work order from '${current}' to '${next}'.`,
  };
}

export function workOrderStatusLabel(status: WorkOrderStatus): string {
  const labels: Record<WorkOrderStatus, string> = {
    DRAFT: "Draft",
    PENDING_APPROVAL: "Pending Approval",
    APPROVED: "Approved",
    CONTRACTOR_ASSIGNED: "Contractor Assigned",
    PENDING_ACCEPTANCE: "Pending Acceptance",
    ACCEPTED: "Accepted",
    MOBILIZATION: "Mobilization",
    IN_PROGRESS: "In Progress",
    SUBMITTED_FOR_INSPECTION: "Submitted for Inspection",
    INSPECTION_FAILED: "Inspection Failed",
    REWORK: "Rework",
    RESUBMITTED: "Resubmitted",
    INSPECTION_PASSED: "Inspection Passed",
    COMPLETED: "Completed",
    MEASUREMENT_PENDING: "Measurement Pending",
    BILL_SUBMITTED: "Bill Submitted",
    BILL_VERIFIED: "Bill Verified",
    PAYMENT_APPROVED: "Payment Approved",
    CLOSED: "Closed",
  };
  return labels[status] ?? status;
}

export function workOrderStatusColor(status: WorkOrderStatus): string {
  if (status === "CLOSED" || status === "PAYMENT_APPROVED") return "success";
  if (
    status === "INSPECTION_FAILED" ||
    status === "REWORK" ||
    status === "DRAFT" ||
    status === "PENDING_APPROVAL"
  )
    return "warning";
  if (status === "IN_PROGRESS" || status === "MOBILIZATION" || status === "ACCEPTED")
    return "primary";
  return "muted";
}

// ------------------------------------------------------------- Work Order

export interface WorkOrderBOQItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
}

export interface WorkOrder {
  id: string;
  workPackageId: string;
  contractorId: string;
  contractorName: string;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  departmentId: string;
  department: Department;
  title: string;
  description: string;
  cityId: string;
  ward: string;
  area: string;
  lat: number;
  lng: number;
  priority: "Low" | "Moderate" | "High" | "Critical";
  estimatedCost: number;
  approvedAmount?: number;
  startDate: string;
  expectedCompletionDate: string;
  actualStartDate?: string;
  actualCompletionDate?: string;
  slaDeadline: string;
  status: WorkOrderStatus;
  boqItems: WorkOrderBOQItem[];
  terms?: string;
  relatedComplaintIds?: string[];
  civicIssueIds?: string[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  
  contractorReportedProgress?: number;
  aiEstimatedProgress?: number;
  engineerVerifiedProgress?: number;
  officialProgress?: number;
}

// ------------------------------------------------------------- Work Order Timeline Event

export type WorkOrderEventType =
  | "STATUS_CHANGE"
  | "PROGRESS_UPDATE"
  | "INSPECTION"
  | "MEASUREMENT"
  | "BILL"
  | "NOTE"
  | "PHOTO_UPLOADED";

export interface WorkOrderEvent {
  id: string;
  workOrderId: string;
  eventType: WorkOrderEventType;
  fromStatus?: WorkOrderStatus;
  toStatus?: WorkOrderStatus;
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  actorRole: SystemRole;
  photoUrls?: string[];
  gpsLat?: number;
  gpsLng?: number;
  metadata?: Record<string, string | number>;
  at: string;
}

// ------------------------------------------------------------- Field Progress

export interface FieldProgress {
  id: string;
  workOrderId: string;
  progressType: "START" | "PROGRESS" | "COMPLETION";
  percentComplete: number;
  description: string;
  evidenceIds?: string[];
  photoUrls?: string[];
  gpsLat?: number;
  gpsLng?: number;
  materialUsed?: string;
  submittedBy: string;
  submittedAt: string;
}

// ------------------------------------------------------------- Evidence & Proof Policy

export type EvidenceStage = "BEFORE" | "START" | "DURING" | "COMPLETION" | "INSPECTION";

export type EvidenceStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "FLAGGED";

export type RiskLevelIndicator = "LOW" | "MEDIUM" | "HIGH";

export interface AIAnalysisResult {
  relevanceScore: number;
  tamperRisk: RiskLevelIndicator;
  reuseRisk: RiskLevelIndicator;
  expectedObjectDetected: boolean;
  visualProgressConfidence?: number;
  flags: string[];
}

export interface Evidence {
  id: string;
  workOrderId: string;
  workItemId?: string;
  stage: EvidenceStage;
  uploaderId: string;
  contractorId?: string;
  captureTimestamp?: string;
  serverReceiptTimestamp: string;
  lat?: number;
  lng?: number;
  gpsAccuracy?: number;
  fileHash: string;
  fileUrl: string;
  status: EvidenceStatus;
  aiAnalysis?: AIAnalysisResult;
  distanceFromSite?: number;
  rejectionReason?: string;
}

export interface ProofPolicy {
  category: IssueCategory;
  requiredStages: EvidenceStage[];
  requiresGPS: boolean;
  requiresTimestamp: boolean;
  requiresMeasurement: boolean;
  requiresInspection: boolean;
  maxGeofenceRadiusMeters: number;
}

export const DEFAULT_PROOF_POLICIES: Record<IssueCategory, ProofPolicy> = {
  "Road Damage": { category: "Road Damage", requiredStages: ["BEFORE", "START", "DURING", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: true, requiresInspection: true, maxGeofenceRadiusMeters: 50 },
  "Street Lighting": { category: "Street Lighting", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: true, maxGeofenceRadiusMeters: 30 },
  "Garbage Collection": { category: "Garbage Collection", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: false, maxGeofenceRadiusMeters: 100 },
  "Water Supply": { category: "Water Supply", requiredStages: ["BEFORE", "START", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: true, requiresInspection: true, maxGeofenceRadiusMeters: 50 },
  "Drainage": { category: "Drainage", requiredStages: ["BEFORE", "START", "DURING", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: true, requiresInspection: true, maxGeofenceRadiusMeters: 50 },
  "Sewage": { category: "Sewage", requiredStages: ["BEFORE", "START", "DURING", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: true, requiresInspection: true, maxGeofenceRadiusMeters: 50 },
  "Electricity": { category: "Electricity", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: true, maxGeofenceRadiusMeters: 30 },
  "Public Transport": { category: "Public Transport", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: true, maxGeofenceRadiusMeters: 100 },
  "Sanitation": { category: "Sanitation", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: false, maxGeofenceRadiusMeters: 100 },
  "Other": { category: "Other", requiredStages: ["BEFORE", "COMPLETION"], requiresGPS: true, requiresTimestamp: true, requiresMeasurement: false, requiresInspection: true, maxGeofenceRadiusMeters: 100 }
};

// ------------------------------------------------------------- Inspection

export type InspectionResult = "PASSED" | "FAILED";

export type InspectionFailureReason =
  | "Incomplete Work"
  | "Poor Workmanship"
  | "Wrong Material"
  | "Location Mismatch"
  | "Insufficient Quantity"
  | "Safety Issue"
  | "Quality Issue"
  | "Other";

export interface Inspection {
  id: string;
  workOrderId: string;
  result: InspectionResult;
  inspectedBy: string;
  inspectedByName: string;
  inspectionDate: string;
  notes: string;
  failureReasons?: InspectionFailureReason[];
  photoUrls?: string[];
  gpsLat?: number;
  gpsLng?: number;
}

// ------------------------------------------------------------- Measurement

export interface MeasurementItem {
  id: string;
  description: string;
  unit: string;
  plannedQuantity: number;
  executedQuantity: number;
  unitRate: number;
  amount: number;
}

export interface Measurement {
  id: string;
  workOrderId: string;
  items: MeasurementItem[];
  totalAmount: number;
  measuredBy: string;
  measuredByName: string;
  measurementDate: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedBy?: string;
  verifiedAt?: string;
  contractorAcknowledged: boolean;
  contractorAcknowledgedAt?: string;
}

// ------------------------------------------------------------- Bill

export type BillStatus = "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "APPROVED" | "REJECTED";

export interface Bill {
  id: string;
  workOrderId: string;
  contractorId: string;
  measurementId?: string;
  submittedAmount: number;
  approvedAmount?: number;
  deductions?: number;
  adjustmentNotes?: string;
  status: BillStatus;
  submittedBy: string;
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// ------------------------------------------------------------- Audit Log

export type AuditAction =
  | "COMPLAINT_ASSIGNED"
  | "WORK_PACKAGE_CREATED"
  | "CONTRACTOR_SELECTED"
  | "WORK_ORDER_CREATED"
  | "WORK_ORDER_STATUS_CHANGED"
  | "INSPECTION_RECORDED"
  | "MEASUREMENT_VERIFIED"
  | "BILL_APPROVED"
  | "CONTRACTOR_VERIFIED"
  | "CONTRACTOR_SUSPENDED"
  | "USER_ROLE_CHANGED"
  | "SLA_RULE_CHANGED"
  | "SYSTEM_SETTING_CHANGED"
  | "COMPLAINT_RESOLVED";

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: SystemRole;
  action: AuditAction;
  entityType: "complaint" | "work_package" | "work_order" | "contractor" | "user" | "sla" | "system";
  entityId: string;
  entityLabel: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  at: string;
}

// ------------------------------------------------------------- SLA Rule

export interface SLARule {
  id: string;
  category: IssueCategory;
  severity: Severity;
  responseHours: number;
  resolutionHours: number;
  escalationHours: number;
  active: boolean;
}

// ------------------------------------------------------------- Contractor Recommendation

export interface ContractorRecommendation {
  contractor: Contractor;
  score: number;
  breakdown: {
    specialization: number;
    geographicMatch: number;
    capacity: number;
    slaHistory: number;
    rating: number;
  };
  eligible: boolean;
  ineligibilityReason?: string;
}

export function scoreContractors(
  contractors: Contractor[],
  workPackage: WorkPackage,
  weights = { specialization: 40, geographic: 20, capacity: 15, sla: 15, rating: 10 },
): ContractorRecommendation[] {
  return contractors
    .map((c): ContractorRecommendation => {
      if (c.status !== "VERIFIED") {
        return {
          contractor: c,
          score: 0,
          breakdown: { specialization: 0, geographicMatch: 0, capacity: 0, slaHistory: 0, rating: 0 },
          eligible: false,
          ineligibilityReason: `Contractor status: ${c.status}`,
        };
      }
      const specMatch = c.specializationCategories.some(
        (s) => s === workPackage.category,
      )
        ? 100
        : c.specializationCategories.some((s) =>
              s.toLowerCase().includes((workPackage.category as string).toLowerCase().split(" ")[0]!)
            )
          ? 60
          : 20;
      const geoMatch = c.serviceAreas.includes(workPackage.cityId) ? 100 : 0;
      const capacity = Math.max(0, 100 - c.activeWorkCount * 12);
      const slaScore = c.slaScore;
      const ratingScore = (c.rating / 5) * 100;

      const score = Math.round(
        (specMatch * weights.specialization +
          geoMatch * weights.geographic +
          capacity * weights.capacity +
          slaScore * weights.sla +
          ratingScore * weights.rating) /
          100,
      );

      return {
        contractor: c,
        score,
        breakdown: {
          specialization: specMatch,
          geographicMatch: geoMatch,
          capacity,
          slaHistory: slaScore,
          rating: ratingScore,
        },
        eligible: geoMatch > 0,
        ...(geoMatch === 0 ? { ineligibilityReason: "Service area does not cover this city" } : {}),
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ------------------------------------------------------------- Civic Issue Domain

export type CivicIssueStatus = "OPEN" | "UNDER_REVIEW" | "WORK_IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface CivicIssue {
  id: string;
  issueCode?: string;
  title?: string;
  category: IssueCategory;
  subcategory?: string;
  description: string;
  lat: number;
  lng: number;
  ward?: string;
  area: string;
  city?: CityId;
  cityId?: string;
  status: CivicIssueStatus;
  priority?: Severity;
  severity: Severity;
  impactScore: number;
  reportCount: number;
  uniqueReporterCount: number;
  confirmationCount?: number;
  firstReportedAt?: string;
  lastReportedAt?: string;
  departmentId?: string;
  workPackageId?: string;
  workOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CivicIssueRelationshipType = "PRIMARY_REPORT" | "DUPLICATE" | "RELATED" | "CITIZEN_CONFIRMATION";

export interface CivicIssueReport {
  id: string;
  civicIssueId: string;
  complaintId: string;
  relationshipType: CivicIssueRelationshipType;
  matchConfidence: number;
  linkedAt: string;
  linkedBy: string;
}


export interface CivicRolePerformance {
  role: string;
  subject_name: string;
  score: number;
  metrics: Record<string, unknown>;
  achievements: Array<{ code: string; name: string; description: string; awarded_at?: string | null }>;
}


export interface MergeMember {
  id: string;
  public_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority?: string | null;
  risk_score: number;
  city_id: string;
  ward_number?: number | null;
  address_text?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
}

export interface MergeProposal {
  proposal_key: string;
  category: string;
  city_id: string;
  ward_number?: number | null;
  area_label?: string | null;
  complaint_count: number;
  complaint_ids: string[];
  members: MergeMember[];
  confidence_score: number;
  min_distance_meters?: number | null;
  existing_issue_ids: string[];
  explanation: string;
}

export interface MergeProposalResponse {
  city: string;
  city_id: string;
  scanned_count: number;
  proposals: MergeProposal[];
  threshold: number;
}

export interface MergeConfirmResponse {
  success: boolean;
  issue: unknown;
  complaint_ids: string[];
  operation: string;
  audit_action: string;
}
