import { APIClient, Endpoints } from "@civicsathi/api-client";
import type { CityId } from "@/services/cities";
import type {
  ComplaintFilters,
  DashboardKPIs,
  DepartmentStats,
  MuniAlert,
  MuniComplaint,
  AreaOverview,
  MuniSettings,
  Officer,
  OfficerNotification,
  SavedView,
  SystemicIssue,
  Department,
  ComplaintStatus,
  WorkOrder,
  WorkOrderEvent,
  MergeProposalResponse,
  MergeConfirmResponse,
} from "./types";
import { DEFAULT_COMPLAINT_FILTERS, alertPriority } from "./types";
import { nearestArea } from "@/services/geography";
// Mocks removed

export function getApiBaseUrl(): string {
  const envUrl = ((import.meta.env as any)?.VITE_API_BASE_URL as string | undefined)?.trim();
  if (
    !envUrl ||
    envUrl.includes("civicsathi-backend.onrender.com") ||
    envUrl.includes("civicsathi.onrender.com") ||
    envUrl.includes("janmind.onrender.com") ||
    (typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      envUrl.startsWith("http://"))
  ) {
    return "https://civic-sathi-f7ml.onrender.com";
  }
  return envUrl;
}

export const API_BASE_URL = getApiBaseUrl();

const LS = {
  officer: "civicsathi_muni_officer",
  token: "civicsathi_muni_token",
};

export const client = new APIClient({
  baseUrl: API_BASE_URL,
  getToken: () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(LS.token);
  },
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LS.token);
      window.localStorage.removeItem(LS.officer);
      window.location.href = "/login";
    }
  },
});

export const api = new Endpoints(client);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeOfficer(
  userData: any,
  fallbackCity: CityId = "vadodara",
): Officer {
  const backendRole = String(userData?.role ?? "officer").toLowerCase();
  const role: Officer["role"] =
    backendRole === "admin"
      ? "Administrator"
      : backendRole === "supervisor"
        ? "Supervisor"
        : backendRole === "municipality"
          ? "Department Head"
            : backendRole === "collector"
              ? "Collector"
              : "Officer";
  const city = String(userData?.city ?? fallbackCity).toLowerCase() as CityId;
  const designation = userData?.designation ? String(userData.designation) : undefined;
  return {
    id: String(userData?.id ?? ""),
    name: String(userData?.name ?? ""),
    email: String(userData?.email ?? ""),
    department: (userData?.department as any) ?? "General",
    role,
    ...(designation ? { designation: String(designation) } : {}),
    city,
    lastActive: new Date().toISOString(),
  };
}

/* -------------------------------------------------------------- auth */

export async function muniLogin(input: {
  email: string;
  password: string;
  city: CityId;
  designation?: string;
}): Promise<Officer> {
  try {
    const res = await api.auth.loginOfficer({ ...input, designation: input.designation } as any);
    if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);

    // Backend returns { officer: {...} }, api-client normalizes to { user: {...} }
    const backendUser = res.user || (res as any).officer;
    if (!backendUser) {
      throw new Error("Login failed: no user data returned");
    }

    const role = (backendUser.role || "").toLowerCase();
    if (!["officer", "supervisor", "admin", "municipality", "collector"].includes(role)) {
      throw new Error("Access denied: this account does not have officer permissions");
    }

    const officer = normalizeOfficer(backendUser, input.city);
    write(LS.officer, officer);
    return officer;
  } catch (error: any) {
    throw error;
  }
}

export async function muniLogout(): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS.token);
    window.localStorage.removeItem(LS.officer);
  }
}

export async function getMuniOfficer(): Promise<Officer | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;

  // Return cached officer immediately so auth gate never bounces on slow network.
  const cached = read<Officer | null>(LS.officer, null);

  const refreshFromServer = async () => {
    try {
      const me = await api.auth.me();
      const roleLower = String((me as any)?.role || "").toLowerCase();
      if (me && ["officer", "supervisor", "admin", "municipality", "collector"].includes(roleLower)) {
        const officer = normalizeOfficer(me, cached?.city ?? "vadodara");
        write(LS.officer, officer);
        return officer;
      }
    } catch {
      // ignore — use cached
    }
    return null;
  };

  if (cached) {
    // Render the authenticated shell immediately. Refresh identity in the background
    // so a slow or temporarily unavailable backend cannot strand the dashboard.
    void refreshFromServer();
    return cached;
  }

  return refreshFromServer();
}

/* ----------------------------------------------------------- dashboard */

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const [summaryResult, issuesResult, hotspotsResult] = await Promise.allSettled([
    client.get<any>("/api/v1/analytics/summary"),
    getSystemicIssues(),
    getHotspotRankings(),
  ]);
  const data = summaryResult.status === "fulfilled" ? summaryResult.value : null;
  const issues = issuesResult.status === "fulfilled" && Array.isArray(issuesResult.value)
    ? issuesResult.value
    : [];
  const hotspots = hotspotsResult.status === "fulfilled" && Array.isArray(hotspotsResult.value)
    ? hotspotsResult.value
    : [];

  const total = Number(data?.total_complaints ?? 0);
  const statusDist = data?.status_distribution || {};
  const resolved = Number(statusDist.resolved ?? 0);
  const active = Number(data?.unresolved_complaints ?? Math.max(0, total - resolved));
  const openIssues = issues.filter((issue: any) => {
    const status = String(issue?.status ?? "open").toLowerCase();
    return status !== "resolved" && status !== "closed";
  }).length;

  return {
    totalReports: total,
    critical: Number(data?.risk_distribution?.critical ?? data?.critical_issues ?? 0),
    active,
    resolved,
    emergingIssues: Math.max(Number(data?.total_issues ?? 0), openIssues),
    areaHotspots: Math.max(Number(data?.hotspot_count ?? 0), hotspots.length),
  };
}

export async function getLiveActivity(): Promise<LiveActivity[]> {
  try {
    const data = await client.get<any>("/api/v1/analytics/summary?days=7");
    return (data?.daily_trends ?? []).map((item: any, index: number) => ({
      id: `daily-${item.date ?? index}`,
      type: "new_report" as const,
      title: "Daily civic reports received",
      subtitle: `${Number(item.count ?? 0).toLocaleString("en-IN")} reports recorded`,
      at: item.date ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

/* --------------------------------------------------------- systemic issues */

export async function getSystemicIssues(city?: CityId): Promise<SystemicIssue[]> {
  try {
    const res = await client.get<SystemicIssue[] | { items?: SystemicIssue[] }>("/api/v1/issues" + (city ? `?city=${city}` : ""));
    if (Array.isArray(res)) return res;
    return Array.isArray(res?.items) ? res.items : [];
  } catch {
    return [];
  }
}

export async function getSystemicIssue(id: string): Promise<SystemicIssue | null> {
  return client.get<SystemicIssue>(`/api/v1/issues/${id}`);
}

export async function materializeCivicIssue(id: string): Promise<any> {
  return client.post<any>(`/api/v1/issues/materialize/${encodeURIComponent(id)}`, {});
}

export async function proposeAiMergeGroups(complaintIds: string[] = [], maxGroups = 50): Promise<MergeProposalResponse> {
  return client.post<MergeProposalResponse>("/api/v1/issues/merge-proposals", {
    complaint_ids: complaintIds,
    max_groups: maxGroups,
  });
}

export async function confirmAiMergeGroup(
  proposalKey: string,
  complaintIds: string[],
): Promise<MergeConfirmResponse> {
  return client.post<MergeConfirmResponse>("/api/v1/issues/merge-proposals/confirm", {
    proposal_key: proposalKey,
    complaint_ids: complaintIds,
  });
}

export async function updateSystemicIssue(
  id: string,
  patch: Partial<SystemicIssue>,
): Promise<SystemicIssue> {
  return client.patch<SystemicIssue>(`/api/v1/issues/${id}`, patch);
}

export async function startInvestigation(id: string): Promise<SystemicIssue> {
  return updateSystemicIssue(id, { status: "Investigating" });
}

export async function assignIssueDepartment(
  id: string,
  department: Department,
): Promise<SystemicIssue> {
  return updateSystemicIssue(id, { status: "Assigned", department });
}

export async function getAuthoritativeMapData(
  city: CityId,
  filters: { time?: string; issue?: string; health?: string } = {},
): Promise<any> {
  const params = new URLSearchParams({
    city,
    time: filters.time || "30d",
    issue: filters.issue || "all",
    health: filters.health || "all",
  });
  return client.get<any>(`/api/v1/analytics/public-map?${params.toString()}`);
}

export async function getCivicIssues(city?: CityId): Promise<any[]> {
  try {
    const res = await client.get<any[] | { items?: any[] }>(`/api/v1/issues${city ? `?city=${encodeURIComponent(city)}` : ""}`);
    if (Array.isArray(res)) return res;
    return Array.isArray(res?.items) ? res.items : [];
  } catch {
    // An empty or failed issue query must remain distinguishable from complaint intake.
    // Do not fabricate one Civic Issue per complaint; grouping requires officer review.
    return [];
  }
}

/* -------------------------------------------------------------- complaints */

async function resolveCityId(cityIdOrName: string): Promise<string> {
  const value = cityIdOrName.trim();
  if (!value || (value.includes("-") && value.length === 36)) return value;
  try {
    const cities = await client.get<Array<{ id: string; name: string }>>("/api/v1/cities");
    const normalized = value.toLowerCase().replace(/[_-]+/g, " ").trim();
    const match = cities.find((city) => {
      const name = String(city.name || "").toLowerCase().replace(/[_-]+/g, " ").trim();
      return name === normalized || name.replace(/\s+/g, "") === normalized.replace(/\s+/g, "");
    });
    return match?.id || value;
  } catch {
    return value;
  }
}

const STATUS_TO_BACKEND: Record<string, string> = {
  Received: "received",
  "Under Review": "in_review",
  Assigned: "assigned",
  "In Progress": "in_progress",
  Resolved: "resolved",
  Closed: "resolved",
  Rejected: "rejected",
};

const CATEGORY_LABELS: Record<string, MuniComplaint["category"]> = {
  water_supply: "Water Supply",
  road_damage: "Road Damage",
  garbage_collection: "Garbage Collection",
  drainage: "Drainage",
  sewage: "Sewage",
  street_lighting: "Street Lighting",
  electricity: "Electricity",
  public_transport: "Public Transport",
  sanitation: "Sanitation",
  other: "Other",
};

function categoryLabel(rawCategory: unknown): MuniComplaint["category"] {
  const key = String(rawCategory ?? "other").trim().toLowerCase().replace(/[ -]+/g, "_");
  return CATEGORY_LABELS[key] ?? (String(rawCategory ?? "Other").trim() || "Other") as MuniComplaint["category"];
}

function categoryQueryValue(value: string): string {
  const key = value.trim().toLowerCase().replace(/[ -]+/g, "_");
  return CATEGORY_LABELS[key] ? key : Object.entries(CATEGORY_LABELS).find(([, label]) => label.toLowerCase() === value.trim().toLowerCase())?.[0] ?? value;
}

function cityIdFromValue(value: unknown, fallbackCity: CityId): CityId {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "vadodara" || normalized === "baroda") return "vadodara";
  if (normalized === "bengaluru" || normalized === "bangalore") return "bengaluru";
  return fallbackCity;
}

function areaFromAddress(address: string | null, fallbackCity: CityId): string {
  if (!address) return "Unspecified area";
  const withoutCity = address.replace(/^\s*(Vadodara|Bengaluru|Bangalore|Baroda)\s*[·,|-]\s*/i, "");
  const area = withoutCity.split(/\s*\(\s*Ward\b/i)[0]?.trim();
  return area || fallbackCity;
}

function normalizeMuniComplaint(raw: any, fallbackCity: CityId): MuniComplaint {
  const severityScore = Number(raw?.severity_score ?? 0);
  const riskScore = Number(raw?.risk_score ?? severityScore);
  const score = Number.isFinite(severityScore) ? severityScore : riskScore;
  const severityValue = String(raw?.severity ?? "").toLowerCase();
  const severity = (severityValue === "critical" || severityValue === "high" || severityValue === "moderate" || severityValue === "low")
    ? severityValue[0]!.toUpperCase() + severityValue.slice(1)
    : score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 35 ? "Moderate" : "Low";
  const statusMap: Record<string, ComplaintStatus> = {
    received: "Received",
    in_review: "Under Review",
    investigating: "Under Review",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
    rejected: "Rejected",
  };
  const rawStatus = String(raw?.status ?? "received").toLowerCase();
  const createdAt = raw?.createdAt || raw?.created_at || new Date().toISOString();
  const addressText = raw?.address_text ?? raw?.addressText ?? null;
  const ward = raw?.ward || (raw?.ward_number ? `Ward ${raw.ward_number}` : addressText?.match(/ward\s*[-#]?\s*\d+/i)?.[0] ?? "Unassigned");
  const city = cityIdFromValue(raw?.city ?? raw?.city_name, fallbackCity);
  const categoryKey = String(raw?.category ?? "other").trim().toLowerCase().replace(/[ -]+/g, "_");
  const analysis = raw?.analysis && typeof raw.analysis === "object" ? raw.analysis : null;
  const confidenceScore = analysis?.confidence_score == null ? null : Number(analysis.confidence_score);
  const timeline = Array.isArray(raw?.timeline)
    ? raw.timeline.map((event: any) => ({
        label: String(event?.label ?? "Status updated"),
        at: event?.at ?? createdAt,
        actor: event?.actor,
        reason: event?.reason,
      }))
    : [];

  return {
    id: String(raw?.public_id ?? raw?.id ?? ""),
    backendId: raw?.id ? String(raw.id) : undefined,
    publicId: raw?.public_id ? String(raw.public_id) : undefined,
    title: String(raw?.title ?? raw?.description ?? "Untitled complaint"),
    description: String(raw?.description ?? ""),
    category: categoryLabel(raw?.category),
    categoryKey,
    severity: severity as MuniComplaint["severity"],
    priority: String(raw?.priority ?? "unassigned"),
    severityScore: Number.isFinite(severityScore) ? severityScore : 0,
    riskScore: Number.isFinite(riskScore) ? riskScore : 0,
    area: String(raw?.area ?? areaFromAddress(addressText, fallbackCity)),
    ward,
    city,
    department: String(raw?.department ?? "Unassigned department"),
    addressText,
    status: statusMap[rawStatus] || (raw?.status as ComplaintStatus) || "Received",
    rawStatus,
    assignedOfficerId: raw?.assigned_officer_id ?? raw?.assignedOfficerId ?? null,
    assignedOfficerName: raw?.assigned_officer_name ?? raw?.assignedOfficerName ?? null,
    assignedAt: raw?.assigned_at ?? raw?.assignedAt ?? null,
    assignmentNotes: raw?.assignment_notes ?? raw?.assignmentNotes ?? null,
    rejectionReason: raw?.rejection_reason ?? raw?.rejectionReason ?? null,
    rejectedByName: raw?.rejected_by_name ?? raw?.rejectedByName ?? null,
    rejectedAt: raw?.rejected_at ?? raw?.rejectedAt ?? null,
    lat: Number(raw?.lat ?? 0),
    lng: Number(raw?.lng ?? 0),
    submittedByName: raw?.submitted_by_name ?? raw?.submittedByName ?? null,
    submittedByPhone: raw?.submitted_by_phone ?? raw?.submittedByPhone ?? null,
    privacyStatus: raw?.privacy_status ?? undefined,
    createdAt,
    updatedAt: raw?.updatedAt || raw?.updated_at || createdAt,
    language: raw?.language || analysis?.language || undefined,
    interpretedText: raw?.interpreted_text || analysis?.interpreted_text || undefined,
    suggestedAction: raw?.suggested_action || analysis?.suggested_action || undefined,
    analysisDetails: analysis
      ? {
          language: analysis.language ?? null,
          keywords: Array.isArray(analysis.keywords) ? analysis.keywords.map(String) : [],
          entities: Array.isArray(analysis.entities) ? analysis.entities : [],
          similarCount: Number(analysis.similar_count ?? 0),
          possibleDuplicate: Boolean(analysis.possible_duplicate),
          confidenceScore,
        }
      : undefined,
    timeline,
    ...(analysis
      ? {
          aiAnalysis: {
            category: categoryLabel(raw?.category),
            severity: severity as MuniComplaint["severity"],
            sentiment: "Neutral" as const,
            similarity: Number(raw?.similarity ?? 0),
            confidenceScore,
          },
        }
      : {}),
  };
}

function currentMuniCity(): CityId {
  return read<Officer | null>(LS.officer, null)?.city ?? "vadodara";
}

export async function getMuniComplaints(
  filters?: Partial<ComplaintFilters>,
): Promise<MuniComplaint[]> {
  const query: Record<string, string | number> = { limit: 100 };
  if (filters?.city && filters.city !== "all") query["city"] = await resolveCityId(filters.city);
  if (filters?.ward) {
    const wardNumber = Number(String(filters.ward).replace(/\D/g, ""));
    if (Number.isFinite(wardNumber) && wardNumber > 0) query["ward"] = wardNumber;
  }
  if (filters?.category && filters.category !== "all") query["category"] = categoryQueryValue(filters.category);
  if (filters?.status && filters.status !== "all")
    query["status"] = STATUS_TO_BACKEND[filters.status] || filters.status;

  const res = await api.complaints.list(query);
  const items = res?.items ?? res?.data ?? res;
  // The backend applies authoritative city scoping from the authenticated
  // officer. Do not re-filter by address text or coordinates in the browser:
  // those heuristics can discard legitimate records and cannot identify the
  // city reliably for an administrator viewing multiple cities.
  const fallbackCity = (filters?.city && filters.city !== "all" ? filters.city : currentMuniCity()) as CityId;
  const normalized = (Array.isArray(items) ? items : []).map((item) =>
    normalizeMuniComplaint(item, fallbackCity),
  );

  if (!filters?.search) return normalized;
  const term = filters.search.toLowerCase();
  return normalized.filter((item) =>
    `${item.id} ${item.description} ${item.area} ${item.ward}`.toLowerCase().includes(term),
  );
}

export async function getMuniComplaint(id: string): Promise<MuniComplaint | null> {
  const raw = await api.complaints.get(id);
  return raw ? normalizeMuniComplaint(raw, currentMuniCity()) : null;
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  notes?: string,
): Promise<MuniComplaint> {
  const raw = await api.complaints.updateStatus(id, STATUS_TO_BACKEND[status] || status, notes);
  return normalizeMuniComplaint(raw, currentMuniCity());
}

export async function updateMuniComplaint(
  id: string,
  patch: Partial<MuniComplaint>,
): Promise<MuniComplaint> {
  if (patch.status) return updateComplaintStatus(id, patch.status);
  const raw = await client.patch<any>(`/api/v1/complaints/${id}`, patch);
  return normalizeMuniComplaint(raw, currentMuniCity());
}

export async function assignComplaint(
  id: string,
  input: { department: string; team?: string; officer?: string; notes?: string },
): Promise<MuniComplaint> {
  if (!input.officer) {
    throw new Error("Select a municipal officer before assigning this complaint");
  }
  const raw = await client.patch<any>(`/api/v1/complaints/${id}/assignment`, {
    officer_id: input.officer,
    notes: input.notes || undefined,
  });
  return normalizeMuniComplaint(raw, currentMuniCity());
}

export async function bulkUpdateComplaints(
  ids: string[],
  patch: { status?: ComplaintStatus; department?: Department },
): Promise<void> {
  for (const id of ids) {
    await updateMuniComplaint(id, patch as any);
  }
}

/* ------------------------------------------------------------- procurement & work orders */

export async function listTenders(cityIdOrName: string) {
  let cityId = cityIdOrName;
  if (!cityIdOrName.includes("-") || cityIdOrName.length !== 36) {
    try {
      const cities = await client.get<Array<{ id: string; name: string }>>("/api/v1/cities");
      const match = cities.find((c) => c.name.toLowerCase() === cityIdOrName.toLowerCase());
      if (match) cityId = match.id;
    } catch {
      // keep original value if lookup fails
    }
  }
  return await api.tenders.list(cityId);
}
export async function getTender(id: string) {
  return await api.tenders.get(id);
}
export async function createTender(data: any) {
  const payload = { ...data };
  if (payload.city_id && (!String(payload.city_id).includes("-") || String(payload.city_id).length !== 36)) {
    payload.city_id = await resolveCityId(String(payload.city_id));
  }
  return await api.tenders.create(payload);
}
export async function publishTender(id: string) {
  return await client.post<any>(`/api/v1/procurement/tenders/${id}/publish`, {});
}
export async function listBids(tenderId: string) {
  return await api.tenders.listBids(tenderId);
}
export async function awardBid(tenderId: string, bidId: string) {
  return await api.tenders.awardBid(tenderId, bidId);
}

export async function inspectWorkOrder(workOrderId: string, result: string, feedback: string = "") {
  return await api.workOrders.inspect(workOrderId, { result, feedback });
}

const BACKEND_WORK_ORDER_TO_UI: Record<string, WorkOrder["status"]> = {
  ISSUED: "PENDING_ACCEPTANCE",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  INSPECTION_PENDING: "SUBMITTED_FOR_INSPECTION",
  INSPECTION_FAILED: "INSPECTION_FAILED",
  REWORK: "REWORK",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  CANCELLED: "CLOSED",
};

const UI_WORK_ORDER_TO_BACKEND: Record<string, string> = {
  PENDING_ACCEPTANCE: "ISSUED",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED_FOR_INSPECTION: "INSPECTION_PENDING",
  INSPECTION_FAILED: "INSPECTION_FAILED",
  REWORK: "REWORK",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
};

function normalizeWorkOrder(raw: any): WorkOrder {
  const backendStatus = String(raw?.status ?? "ISSUED").toUpperCase();
  const createdAt = raw?.created_at ?? new Date().toISOString();
  const department = String(raw?.department ?? raw?.department_id ?? "Public Works") as Department;
  const cost = Number(raw?.estimated_budget ?? raw?.award_value ?? 0);
  return {
    id: String(raw?.id ?? ""),
    workPackageId: String(raw?.tender_id ?? ""),
    contractorId: String(raw?.contractor_id ?? ""),
    contractorName: String(raw?.contractor_name ?? "Assigned contractor"),
    departmentId: String(raw?.department_id ?? ""),
    department,
    title: String(raw?.title ?? "Municipal work order"),
    description: String(raw?.description ?? "No work-order description provided."),
    cityId: String(raw?.city_id ?? ""),
    ward: String(raw?.ward ?? "Unassigned"),
    area: String(raw?.area ?? "City execution site"),
    lat: Number(raw?.lat ?? 0),
    lng: Number(raw?.lng ?? 0),
    priority: String(raw?.risk_level ?? "Moderate").toLowerCase() === "critical" ? "Critical" : String(raw?.risk_level ?? "").toLowerCase() === "high" ? "High" : "Moderate",
    estimatedCost: cost,
    startDate: createdAt,
    expectedCompletionDate: raw?.target_completion_date ?? createdAt,
    slaDeadline: raw?.target_completion_date ?? createdAt,
    status: BACKEND_WORK_ORDER_TO_UI[backendStatus] ?? "PENDING_ACCEPTANCE",
    boqItems: [],
    createdBy: "Municipal procurement",
    createdAt,
    updatedAt: raw?.updated_at ?? createdAt,
    contractorReportedProgress: Number(raw?.reported_progress_pct ?? 0),
    engineerVerifiedProgress: Number(raw?.verified_progress_pct ?? 0),
    officialProgress: Number(raw?.verified_progress_pct ?? 0),
  };
}

export async function getWorkOrders(params?: any) {
  const officer = await getMuniOfficer();
  const rawCity = String(params?.cityId || officer?.city || "vadodara");
  const rows = await api.workOrders.list(await resolveCityId(rawCity));
  return (Array.isArray(rows) ? rows : []).map(normalizeWorkOrder);
}

export async function getWorkOrder(id: string): Promise<WorkOrder> {
  return normalizeWorkOrder(await api.workOrders.get(id));
}

export async function updateWorkOrderStatus(
  id: string,
  status: string,
  byId?: string,
  byName?: string,
  role?: string,
) {
  const backendStatus = UI_WORK_ORDER_TO_BACKEND[status] ?? status;
  return normalizeWorkOrder(await api.workOrders.updateStatus(id, backendStatus));
}

export async function getWorkOrderEvents(id: string): Promise<WorkOrderEvent[]> {
  const [workOrder, evidence, inspections] = await Promise.all([
    getWorkOrder(id),
    client.get<any[]>(`/api/v1/procurement/work-orders/${id}/evidence`),
    client.get<any[]>(`/api/v1/procurement/work-orders/${id}/inspections`),
  ]);
  const events: WorkOrderEvent[] = [{
    id: `${id}-created`,
    workOrderId: id,
    eventType: "STATUS_CHANGE",
    toStatus: workOrder.status,
    title: "Work order issued",
    description: `${workOrder.title} entered the municipal execution register.`,
    actorId: "system",
    actorName: "Civic Sathi procurement",
    actorRole: "department_head",
    at: workOrder.createdAt,
  }];
  for (const item of Array.isArray(evidence) ? evidence : []) {
    events.push({
      id: String(item.id),
      workOrderId: id,
      eventType: "PHOTO_UPLOADED",
      title: "Field evidence uploaded",
      description: String(item.description ?? "Contractor submitted field evidence."),
      actorId: workOrder.contractorId,
      actorName: workOrder.contractorName,
      actorRole: "contractor",
      photoUrls: item.photo_url ? [item.photo_url] : [],
      at: item.created_at ?? workOrder.updatedAt,
    });
  }
  for (const item of Array.isArray(inspections) ? inspections : []) {
    const result = String(item.result ?? "").toUpperCase();
    events.push({
      id: String(item.id),
      workOrderId: id,
      eventType: "INSPECTION",
      title: result === "PASS" ? "Inspection passed" : result === "REWORK" ? "Rework requested" : "Inspection failed",
      description: String(item.feedback ?? "Municipal inspection recorded."),
      actorId: String(item.inspector_id ?? "municipality"),
      actorName: "Municipal inspector",
      actorRole: "supervisor",
      at: item.created_at ?? workOrder.updatedAt,
    });
  }
  return events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export async function getEvidence(id: string) {
  const rows = await client.get<any[]>(`/api/v1/procurement/work-orders/${id}/evidence`);
  return (Array.isArray(rows) ? rows : []).map((item) => ({
    id: String(item.id),
    fileUrl: item.photo_url,
    stage: "FIELD",
    captureTimestamp: item.created_at,
    status: "PENDING",
    description: item.description,
  }));
}
export async function submitMeasurement(_data: unknown, _byId: string, _byName: string): Promise<never> {
  throw new Error("Measurement submission is unavailable until the backend measurement contract is implemented");
}
export async function getMeasurement(_id: string) {
  return null;
}
export async function getBill(_id: string) {
  return null;
}
export async function approveBill(
  _billId: string,
  _woId: string,
  _byId: string,
  _byName: string,
  _amount: number,
): Promise<never> {
  throw new Error("Bill approval is unavailable until the backend billing contract is implemented");
}

/* ---------------------------------------------------------------- alerts */
export async function getAlerts(city?: CityId): Promise<MuniAlert[]> {
  const officer = await getMuniOfficer();
  const targetCity = city ?? officer?.city ?? "vadodara";
  const complaints = await getMuniComplaints({ city: targetCity });
  const grouped = new Map<string, MuniComplaint[]>();
  for (const complaint of complaints.filter((row) => row.severity !== "Low")) {
    const key = `${complaint.area}|${complaint.category}`;
    grouped.set(key, [...(grouped.get(key) ?? []), complaint]);
  }
  return Array.from(grouped.entries()).map(([key, rows]) => {
    const [area = "Unspecified area", category = "Other"] = key.split("|");
    const score = Math.max(...rows.map((row) => row.severity === "Critical" ? 90 : row.severity === "High" ? 70 : 45));
    return {
      id: `alert-${targetCity}-${area}-${category}`,
      priority: alertPriority(score),
      category: category as MuniAlert["category"],
      area,
      ward: rows[0]?.ward ?? "Unassigned",
      city: targetCity,
      complaintCount: rows.length,
      riskScore: score,
      trendPct: 0,
      acknowledged: false,
      createdAt: rows[0]?.createdAt ?? new Date().toISOString(),
    };
  });
}
export async function acknowledgeAlert(id: string): Promise<MuniAlert> {
  throw new Error("Alert acknowledgement is unavailable until the backend alert store is enabled");
}

/* ------------------------------------------------------------ departments */
export async function getDepartments(): Promise<DepartmentStats[]> {
  const officer = await getMuniOfficer();
  if (!officer?.city) return [];
  const complaints = await getMuniComplaints({ city: officer.city });
  const grouped = new Map<string, MuniComplaint[]>();
  for (const complaint of complaints) {
    const name = complaint.department || "General";
    grouped.set(name, [...(grouped.get(name) ?? []), complaint]);
  }
  return Array.from(grouped.entries()).map(([name, rows], index) => {
    const categoryBreakdown = rows.reduce<Record<string, number>>((result, row) => {
      result[row.category] = (result[row.category] ?? 0) + 1;
      return result;
    }, {});
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `dept-${index}`,
      name: name as DepartmentStats["name"],
      open: rows.filter((row) => ["Received", "Under Review", "Assigned"].includes(row.status)).length,
      inProgress: rows.filter((row) => row.status === "In Progress").length,
      resolved: rows.filter((row) => ["Resolved", "Closed"].includes(row.status)).length,
      critical: rows.filter((row) => row.severity === "Critical").length,
      emergingIssues: 0,
      avgResponseDays: 0,
      slaAdherencePct: 0,
      satisfactionPct: 0,
      activeStaff: 0,
      categoryBreakdown,
    } as DepartmentStats;
  });
}
export async function getDepartment(id: string): Promise<DepartmentStats | null> {
  const depts = await getDepartments();
  return depts.find((d: any) => d.id === id) ?? null;
}

/* ------------------------------------------------------------------ areas */
export async function getAreaOverviews(city: CityId): Promise<AreaOverview[]> {
  const complaints = await getMuniComplaints({ city });
  const grouped = new Map<string, MuniComplaint[]>();
  for (const complaint of complaints) {
    const name = complaint.area || "Unassigned area";
    const current = grouped.get(name) ?? [];
    current.push(complaint);
    grouped.set(name, current);
  }
  return Array.from(grouped.entries()).map(([name, rows], index) => {
    const critical = rows.filter((row) => row.severity === "Critical").length;
    const high = rows.filter((row) => row.severity === "High").length;
    const risk = Math.min(100, Math.round((critical * 90 + high * 70 + rows.length * 10) / Math.max(1, rows.length)));
    const top = rows.reduce<Record<string, number>>((counts, row) => {
      counts[row.category] = (counts[row.category] ?? 0) + 1;
      return counts;
    }, {});
    const topIssue = Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Other";
    return {
      id: `${city}-${index}-${name}`,
      name,
      ward: rows[0]?.ward ?? "Unassigned",
      city,
      reports: rows.length,
      critical,
      trendPct: 0,
      risk,
      health: (risk >= 85 ? "critical" : risk >= 70 ? "high" : risk >= 40 ? "moderate" : "low") as AreaOverview["health"],
      activity: (risk >= 85 ? "Critical" : risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low") as AreaOverview["activity"],
      topIssue: topIssue as AreaOverview["topIssue"],
    };
  });
}

/* -------------------------------------------------------------- analytics */
export async function getHotspotRankings() {
  const officer = await getMuniOfficer();
  if (!officer?.city) return [];
  const map = await getAuthoritativeMapData(officer.city);
  const grouped = new Map<string, any>();
  for (const point of Array.isArray(map?.points) ? map.points : []) {
    const area = nearestArea(officer.city, Number(point.lat), Number(point.lng));
    const key = area?.id ?? `${officer.city}-unassigned`;
    const row = grouped.get(key) ?? { name: area?.name ?? "Unassigned area", reports: 0, riskWeighted: 0, counts: {}, area: area?.name ?? "Unassigned area" };
    const reports = Math.max(1, Number(point.count ?? 1));
    row.reports += reports;
    row.riskWeighted += Number(point.risk ?? 0) * reports;
    const category = String(point.category ?? "Other");
    row.counts[category] = (row.counts[category] ?? 0) + reports;
    grouped.set(key, row);
  }
  return Array.from(grouped.values())
    .map((row: any, index: number) => ({
      issueId: "",
      rank: index + 1,
      category: Object.entries(row.counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ?? "Other",
      area: row.area,
      reports: row.reports,
      risk: Math.round(row.riskWeighted / Math.max(1, row.reports)),
      trend: 0,
    }))
    .filter((row: any) => row.reports > 0)
    .sort((a: any, b: any) => b.risk - a.risk || b.reports - a.reports)
    .slice(0, 10)
    .map((row: any, index: number) => ({ ...row, rank: index + 1 }));
}
export async function getAnalyticsData(city: CityId) {
  const data = await client.get<any>("/api/v1/analytics/summary?days=30");
  const trend = Array.isArray(data?.daily_trends)
    ? data.daily_trends.map((item: any) => ({
        month: String(item.date ?? "").slice(5, 10),
        total: Number(item.count ?? 0),
        critical: 0,
      }))
    : [];
  const risk = data?.risk_distribution ?? {};
  const severityTrend = [{
    month: "Current",
    low: Number(risk.low ?? 0),
    moderate: Number(risk.medium ?? 0),
    high: Number(risk.high ?? 0),
    critical: Number(risk.critical ?? 0),
  }];
  const departmentDistribution = (data?.department_distribution ?? []).map((item: any) => ({
    name: item.name,
    value: Number(item.count ?? item.value ?? 0),
  }));
  const categoryDistribution = (data?.category_distribution ?? []).map((item: any) => ({
    name: String(item.name ?? "Other").replace(/_/g, " "),
    value: Number(item.count ?? item.value ?? 0),
  }));
  const status = data?.status_distribution ?? {};
  const resolutionStatus = Object.entries(status).map(([name, value]) => ({ name, value }));
  return {
    complaintTrend: trend,
    severityTrend,
    departmentDistribution,
    categoryDistribution,
    resolutionStatus,
    emergingTrend: [],
    responseTime: [],
    city,
  };
}

/* --------------------------------------------------------- notifications */
export async function getOfficerNotifications(): Promise<OfficerNotification[]> {
  const alerts = await getAlerts();
  return alerts.map((alert) => ({
    id: alert.id,
    title: `${alert.priority} civic risk in ${alert.area}`,
    body: `${alert.complaintCount} ${alert.category} report${alert.complaintCount === 1 ? "" : "s"} require attention.`,
    kind: alert.priority === "Critical" ? "critical" : "risk_increase",
    read: alert.acknowledged,
    at: alert.createdAt,
    link: `/complaints?area=${encodeURIComponent(alert.area)}`,
  }));
}
export async function markNotificationRead(id: string): Promise<void> {
  throw new Error("Notification acknowledgement is unavailable until the backend alert store is enabled");
}

/* -------------------------------------------------------------- settings */
const DEFAULT_SETTINGS: MuniSettings = {
  theme: "system",
  compactMode: false,
  defaultCity: "vadodara",
  defaultMapMode: "health",
  notifications: { critical: true, assignments: true, riskChanges: true, dailyDigest: false },
};
export async function getMuniSettings(): Promise<MuniSettings> {
  return read("civicsathi_muni_settings", DEFAULT_SETTINGS);
}
export async function saveMuniSettings(patch: Partial<MuniSettings>): Promise<MuniSettings> {
  const current = await getMuniSettings();
  const next = { ...current, ...patch };
  write("civicsathi_muni_settings", next);
  return next;
}

export async function getSavedViews(): Promise<SavedView[]> {
  return [];
}
export async function officerSearch(query: string) {
  const term = query.trim();
  if (!term) return { complaints: [], issues: [], areas: [] };

  const officer = await getMuniOfficer();
  if (!officer?.city) return { complaints: [], issues: [], areas: [] };

  const normalizedTerm = term.toLowerCase();
  const [complaints, issues, areas] = await Promise.all([
    getMuniComplaints({ city: officer.city, search: term }),
    getSystemicIssues(officer.city),
    getAreaOverviews(officer.city),
  ]);

  return {
    complaints: complaints.map(({ id, category }) => ({ id, category })),
    issues: issues
      .filter((issue) =>
        `${issue.id} ${issue.category} ${issue.areaName}`.toLowerCase().includes(normalizedTerm),
      )
      .map(({ id, category, areaName }) => ({ id, category, areaName })),
    areas: areas.filter((area) =>
      `${area.name} ${area.ward}`.toLowerCase().includes(normalizedTerm),
    ),
  };
}


export async function getMyCivicRolePerformance() {
  return client.get<import("./types").CivicRolePerformance>("/api/v1/reputation/performance/me");
}


/* -------------------------------- collector administration */
export interface MunicipalityOfficerRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  department?: string | null;
  designation?: string | null;
  ward?: string | null;
  created_at: string;
}

export interface MunicipalityContractorRecord {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  auth_user_id?: string | null;
  city: string;
  registration_id: string;
  registration_number: string;
  registration_status: string;
}

export async function listMunicipalityOfficers(): Promise<MunicipalityOfficerRecord[]> {
  return client.get<MunicipalityOfficerRecord[]>("/api/v1/municipality/officers");
}

export async function createMunicipalityOfficer(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "officer" | "supervisor" | "municipality";
  department: string;
  designation: string;
  ward?: string;
}): Promise<MunicipalityOfficerRecord> {
  return client.post<MunicipalityOfficerRecord>("/api/v1/municipality/officers", input);
}

export async function listMunicipalityContractors(): Promise<MunicipalityContractorRecord[]> {
  return client.get<MunicipalityContractorRecord[]>("/api/v1/municipality/contractors");
}

export async function createMunicipalityContractor(input: {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  login_email: string;
  login_password: string;
  registration_class?: string;
  approved_categories?: string[];
  registration_number?: string;
}): Promise<MunicipalityContractorRecord> {
  return client.post<MunicipalityContractorRecord>("/api/v1/municipality/contractors", input);
}
