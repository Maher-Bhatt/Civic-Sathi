import { APIClient, Endpoints } from "@civicsathi/api-client";
import type { CityId } from "@/services/cities";
import type {
  ComplaintFilters,
  DashboardKPIs,
  DepartmentStats,
  LiveActivity,
  MuniAlert,
  MuniComplaint,
  MuniSettings,
  Officer,
  OfficerNotification,
  SavedView,
  SystemicIssue,
  Department,
  ComplaintStatus,
  alertPriority,
} from "./types";
import { DEFAULT_COMPLAINT_FILTERS } from "./types";
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
  fallbackDesignation?: string,
): Officer {
  const backendRole = String(userData?.role ?? "officer").toLowerCase();
  const role: Officer["role"] =
    backendRole === "admin"
      ? "Administrator"
      : backendRole === "supervisor"
        ? "Supervisor"
        : backendRole === "municipality"
          ? "Department Head"
          : "Officer";
  const city = String(userData?.city ?? fallbackCity).toLowerCase() as CityId;
  const designation = userData?.designation ?? fallbackDesignation;
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
    if (!["officer", "supervisor", "admin", "municipality"].includes(role)) {
      throw new Error("Access denied: this account does not have officer permissions");
    }

    const officer = normalizeOfficer(backendUser, input.city, input.designation);
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

export async function adminLogin(email: string, pass: string): Promise<any> {
  return {} as any;
}
export async function adminLogout(): Promise<void> {}
export async function getAdminUser(): Promise<any | null> {
  return null;
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
      if (me && ["officer", "supervisor", "admin", "municipality"].includes(roleLower)) {
        const officer = normalizeOfficer(me, cached?.city ?? "vadodara", cached?.designation);
        write(LS.officer, officer);
        return officer;
      }
    } catch {
      // ignore — use cached
    }
    return null;
  };

  if (cached) {
    const fresh = await refreshFromServer();
    return fresh ?? cached;
  }

  return refreshFromServer();
}

/* ----------------------------------------------------------- dashboard */

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const data = await client.get<any>("/api/v1/analytics/summary");
  if (data) {
    const total = data.total_complaints || 0;
    const statusDist = data.status_distribution || {};
    return {
      totalReports: total,
      critical: data.critical_issues || Math.round(total * 0.03),
      active: data.unresolved_complaints || total - (statusDist.resolved || 0),
      resolved: statusDist.resolved || 0,
      emergingIssues: data.total_issues || 0,
      areaHotspots: data.hotspot_count || 0,
    };
  }
  return {
    totalReports: 0,
    critical: 0,
    active: 0,
    resolved: 0,
    emergingIssues: 0,
    areaHotspots: 0,
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
    const res = await client.get<SystemicIssue[]>("/api/v1/issues" + (city ? `?city=${city}` : ""));
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function getSystemicIssue(id: string): Promise<SystemicIssue | null> {
  return client.get<SystemicIssue>(`/api/v1/issues/${id}`);
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
    const res = await client.get<any[]>(`/api/v1/issues${city ? `?city=${encodeURIComponent(city)}` : ""}`);
    if (Array.isArray(res) && res.length > 0) return res;
  } catch {
    // Fall through to complaint-backed map points when issue clustering is empty.
  }

  try {
    const complaints = await getMuniComplaints(city ? { city } : undefined);
    const impactBySeverity: Record<string, number> = {
      Critical: 100,
      High: 80,
      Moderate: 60,
      Low: 35,
    };
    return complaints.map((complaint) => ({
      id: complaint.id,
      title: `${complaint.category} issue near ${complaint.area}`,
      description: complaint.description,
      category: complaint.category,
      severity: complaint.severity,
      status: complaint.status,
      reportCount: 1,
      impactScore: impactBySeverity[complaint.severity] ?? 35,
      firstReportedAt: complaint.createdAt,
      createdAt: complaint.createdAt,
      ward: complaint.ward,
      area: complaint.area,
      lat: complaint.lat,
      lng: complaint.lng,
    }));
  } catch {
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
};

function isComplaintInCity(raw: any, city: CityId): boolean {
  const requested = String(city).toLowerCase().replace(/[_-]+/g, " ").trim();
  if (requested === "all") return true;
  const address = String(raw?.address_text ?? raw?.area ?? raw?.title ?? "").toLowerCase();
  const lat = Number(raw?.lat);
  const lng = Number(raw?.lng);
  const isBengaluru = requested === "bengaluru" || requested === "bangalore";
  const isVadodara = requested === "vadodara" || requested === "baroda";
  const bengaluruAddress = /bengaluru|bangalore|indiranagar|yelahanka|electronic city|whitefield|hsr layout|jayanagar|basavanagudi|vijayanagar|marathahalli|btm layout|malleshwaram|hebbal|peenya|bommanahalli|kengeri|rajajinagar|shivajinagar|bellandur|banaswadi|mahadevapura|koramangala/.test(address);
  const vadodaraAddress = /vadodara|baroda|gotri|manjalpur|bhayli|atladara|vasna|fatehgunj|sevasi|sayajigunj|karelibaug|alkapuri|makarpura|waghodia|akota|tarsali|harni|ajwa/.test(address);
  const bengaluruCoordinates = Number.isFinite(lat) && Number.isFinite(lng) && lat >= 12.70 && lat <= 13.25 && lng >= 77.30 && lng <= 77.85;
  const vadodaraCoordinates = Number.isFinite(lat) && Number.isFinite(lng) && lat >= 21.95 && lat <= 22.55 && lng >= 72.85 && lng <= 73.55;
  if (isBengaluru) return !vadodaraAddress && !vadodaraCoordinates;
  if (isVadodara) return !bengaluruAddress && !bengaluruCoordinates;
  return true;
}

function normalizeMuniComplaint(raw: any, fallbackCity: CityId): MuniComplaint {
  const score = Number(raw.severity_score ?? raw.risk_score ?? 0);
  const severity =
    raw.severity ||
    (score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 35 ? "Moderate" : "Low");
  const statusMap: Record<string, ComplaintStatus> = {
    received: "Received",
    in_review: "Under Review",
    investigating: "Under Review",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Closed",
  };
  const rawStatus = String(raw.status || "received").toLowerCase();
  const createdAt = raw.createdAt || raw.created_at || new Date().toISOString();
  const ward = raw.ward || (raw.ward_number ? `Ward ${raw.ward_number}` : "Unassigned");
  const city = (raw.city || fallbackCity) as CityId;

  return {
    id: raw.public_id || raw.id,
    description: raw.description || raw.title || "No description provided",
    category: (raw.category || "Sanitation") as MuniComplaint["category"],
    severity: severity as MuniComplaint["severity"],
    area: raw.area || raw.address_text || city,
    ward,
    city,
    department: (raw.department || "Municipal Water") as MuniComplaint["department"],
    status: statusMap[rawStatus] || (raw.status as ComplaintStatus) || "Received",
    lat: Number(raw.lat ?? 0),
    lng: Number(raw.lng ?? 0),
    createdAt,
    updatedAt: raw.updatedAt || raw.updated_at || createdAt,
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline
      : [{ label: "Report Received", at: createdAt }],
    ...(raw.analysis
      ? {
          aiAnalysis: {
            category: (raw.category || "Sanitation") as MuniComplaint["category"],
            severity: severity as MuniComplaint["severity"],
            sentiment: "Neutral" as const,
            similarity: Number(raw.analysis.confidence_score ?? 0),
          },
        }
      : {}),
  };
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
  if (filters?.category && filters.category !== "all") query["category"] = filters.category;
  if (filters?.status && filters.status !== "all")
    query["status"] = STATUS_TO_BACKEND[filters.status] || filters.status;

  const res = await api.complaints.list(query);
  const items = res?.items ?? res?.data ?? res;
  const requestedCity = (filters?.city && filters.city !== "all" ? filters.city : "all") as CityId;
  const cityScopedItems = (Array.isArray(items) ? items : []).filter((item) =>
    isComplaintInCity(item, requestedCity),
  );
  const normalized = cityScopedItems.map((item) =>
    normalizeMuniComplaint(
      item,
      (filters?.city === "all" ? "vadodara" : filters?.city || "vadodara") as CityId,
    ),
  );

  if (!filters?.search) return normalized;
  const term = filters.search.toLowerCase();
  return normalized.filter((item) =>
    `${item.id} ${item.description} ${item.area} ${item.ward}`.toLowerCase().includes(term),
  );
}

export async function getMuniComplaint(id: string): Promise<MuniComplaint | null> {
  try {
    const raw = await api.complaints.get(id);
    return raw ? normalizeMuniComplaint(raw, "vadodara" as CityId) : null;
  } catch {
    return null;
  }
}

export async function updateMuniComplaint(
  id: string,
  patch: Partial<MuniComplaint>,
): Promise<MuniComplaint> {
  if (patch.status) {
    return api.complaints.updateStatus(id, patch.status) as any;
  }
  return client.patch<MuniComplaint>(`/api/v1/complaints/${id}`, patch);
}

export async function assignComplaint(
  id: string,
  input: { department: Department; team?: string; officer?: string },
): Promise<MuniComplaint> {
  return updateMuniComplaint(id, { status: "Assigned", department: input.department } as any);
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
  return await api.tenders.create(data);
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

export async function getWorkOrders(params?: any) {
  const officer = await getMuniOfficer();
  const rawCity = String(params?.cityId || officer?.city || "vadodara");
  return await api.workOrders.list(await resolveCityId(rawCity));
}

export async function getWorkOrder(id: string) {
  return await api.workOrders.get(id);
}

export async function updateWorkOrderStatus(
  id: string,
  status: string,
  byId?: string,
  byName?: string,
  role?: string,
) {
  return await api.workOrders.updateStatus(id, status);
}

export async function getWorkOrderEvents(id: string) {
  return [];
}
export async function getEvidence(id: string) {
  return [];
}
export async function submitMeasurement(data: any, byId: string, byName: string) {
  return null;
}
export async function getMeasurement(id: string) {
  return null;
}
export async function getBill(id: string) {
  return null;
}
export async function approveBill(
  billId: string,
  woId: string,
  byId: string,
  byName: string,
  amount: number,
) {
  return null;
}
export async function recordInspection(data: any, byId: string, byName: string) {
  return null;
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
    const [area, category] = key.split("|");
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
export async function getAreaOverviews(city: CityId) {
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
      activity: risk >= 85 ? "Critical" : risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low",
      reports: rows.length,
      critical,
      trendPct: 0,
      topIssue,
      risk,
      health: risk >= 85 ? "critical" : risk >= 70 ? "high" : risk >= 40 ? "moderate" : "low",
    };
  });
}

/* -------------------------------------------------------------- analytics */
export async function getTrendAnalysis() {
  return [];
}
export async function getHotspotRankings() {
  const officer = await getMuniOfficer();
  if (!officer?.city) return [];
  const areas = await getAreaOverviews(officer.city);
  return areas.filter((area: any) => area.risk >= 40).sort((a: any, b: any) => b.risk - a.risk);
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
  return { complaints: [], issues: [], areas: [] };
}
export function startLiveSimulation(onUpdate: (activity: LiveActivity[]) => void) {}
export function stopLiveSimulation() {}
