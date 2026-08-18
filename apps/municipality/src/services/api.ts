import { APIClient, Endpoints } from '@janmind/api-client';
import type { CityId } from "@/services/cities";
import type {
  ComplaintFilters, DashboardKPIs, DepartmentStats, LiveActivity,
  MuniAlert, MuniComplaint, MuniSettings, Officer,
  OfficerNotification, SavedView, SystemicIssue, Department, ComplaintStatus
} from "./types";
import { DEFAULT_COMPLAINT_FILTERS } from "./types";
// Mocks removed

export function getApiBaseUrl(): string {
  const envUrl = ((import.meta.env as any)?.VITE_API_BASE_URL as string | undefined)?.trim();
  if (
    !envUrl ||
    envUrl.includes("janmind-backend.onrender.com") ||
    (typeof window !== "undefined" && window.location.protocol === "https:" && envUrl.startsWith("http://"))
  ) {
    return "https://janmind.onrender.com";
  }
  return envUrl;
}

export const API_BASE_URL = getApiBaseUrl();

const LS = {
  officer: "janmind_muni_officer",
  token: "janmind_muni_token",
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
      window.location.href = '/login';
    }
  }
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

/* -------------------------------------------------------------- auth */

export async function muniLogin(input: { email: string; password: string; city: CityId }): Promise<Officer> {
  try {
    const res = await api.auth.loginOfficer(input);
    if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);

    // Backend returns { officer: {...} }, api-client normalizes to { user: {...} }
    const backendUser = res.user || (res as any).officer;
    if (!backendUser) {
      throw new Error('Login failed: no user data returned');
    }

    const role = (backendUser.role || '').toLowerCase();
    if (!['officer', 'supervisor', 'admin', 'municipality'].includes(role)) {
      throw new Error('Access denied: this account does not have officer permissions');
    }

    const officer: Officer = {
      id: backendUser.id ?? "",
      name: backendUser.name ?? "",
      email: backendUser.email ?? "",
      department: (backendUser.department as any) ?? "General",
      role: "Officer",
      city: input.city,
      lastActive: new Date().toISOString(),
    };
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

export async function adminLogin(email: string, pass: string): Promise<any> { return {} as any; }
export async function adminLogout(): Promise<void> {}
export async function getAdminUser(): Promise<any | null> { return null; }

export async function getMuniOfficer(): Promise<Officer | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;

  // Return cached officer immediately so auth gate never bounces on slow network.
  const cached = read<Officer | null>(LS.officer, null);

  const refreshFromServer = async () => {
    try {
      const me = await api.auth.me();
      const roleLower = String((me as any)?.role || '').toLowerCase();
      if (me && ['officer', 'supervisor', 'admin', 'municipality'].includes(roleLower)) {
        const officer: Officer = {
          id: (me as any).id,
          name: (me as any).name,
          email: (me as any).email ?? "",
          department: ((me as any).department as any) ?? "General",
          role: "Officer",
          city: ((me as any).city as CityId) || "bengaluru",
          lastActive: new Date().toISOString(),
        };
        write(LS.officer, officer);
        return officer;
      }
    } catch {
      // ignore — use cached
    }
    return null;
  };

  if (cached) {
    // Refresh in background, don't await
    refreshFromServer();
    return cached;
  }

  return refreshFromServer();
}

/* ----------------------------------------------------------- dashboard */

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const data = await client.get<any>('/api/v1/analytics/summary');
  if (data) {
    return {
      totalReports: data.total_complaints || 0,
      critical: data.critical_issues || 0,
      active: data.unresolved_complaints || 0,
      resolved: data.status_distribution?.resolved || 0,
      emergingIssues: data.total_issues || 0,
      areaHotspots: 0,
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
  return [];
}

/* --------------------------------------------------------- systemic issues */

export async function getSystemicIssues(city?: CityId): Promise<SystemicIssue[]> {
  try {
    const res = await client.get<SystemicIssue[]>('/api/v1/issues' + (city ? `?city=${city}` : ''));
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function getSystemicIssue(id: string): Promise<SystemicIssue | null> {
  return client.get<SystemicIssue>(`/api/v1/issues/${id}`);
}

export async function updateSystemicIssue(id: string, patch: Partial<SystemicIssue>): Promise<SystemicIssue> {
  return client.patch<SystemicIssue>(`/api/v1/issues/${id}`, patch);
}

export async function startInvestigation(id: string): Promise<SystemicIssue> {
  return updateSystemicIssue(id, { status: "Investigating" });
}

export async function assignIssueDepartment(id: string, department: Department): Promise<SystemicIssue> {
  return updateSystemicIssue(id, { status: "Assigned", department });
}

export async function getCivicIssues(): Promise<any[]> {
  try {
    const res = await client.get<any[]>('/api/v1/issues');
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------- complaints */

export async function getMuniComplaints(filters?: Partial<ComplaintFilters>): Promise<MuniComplaint[]> {
  const res = await api.complaints.list(filters);
  return res.data || res;
}

export async function getMuniComplaint(id: string): Promise<MuniComplaint | null> {
  return api.complaints.get(id) as any;
}

export async function updateMuniComplaint(id: string, patch: Partial<MuniComplaint>): Promise<MuniComplaint> {
  if (patch.status) {
    return api.complaints.updateStatus(id, patch.status) as any;
  }
  return client.patch<MuniComplaint>(`/api/v1/complaints/${id}`, patch);
}

export async function assignComplaint(id: string, input: { department: Department; team?: string; officer?: string }): Promise<MuniComplaint> {
  return updateMuniComplaint(id, { status: "Assigned", department: input.department } as any);
}

export async function bulkUpdateComplaints(ids: string[], patch: { status?: ComplaintStatus; department?: Department }): Promise<void> {
  for (const id of ids) {
    await updateMuniComplaint(id, patch as any);
  }
}

/* ------------------------------------------------------------- procurement & work orders */

export async function listTenders(cityIdOrName: string) {
  let cityId = cityIdOrName;
  if (!cityIdOrName.includes('-') || cityIdOrName.length !== 36) {
    try {
      const cities = await client.get<Array<{ id: string; name: string }>>('/api/v1/cities');
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
  const rawCity = params?.cityId || officer?.city || "vadodara";
  // If it's already a UUID, use directly; otherwise resolve via cities API
  let cityId = rawCity;
  if (!rawCity.includes('-') || rawCity.length !== 36) {
    try {
      const cities = await client.get<Array<{ id: string; name: string }>>('/api/v1/cities');
      const match = cities.find((c) => c.name.toLowerCase() === rawCity.toLowerCase());
      if (match) cityId = match.id;
    } catch {
      // keep rawCity as-is if lookup fails
    }
  }
  return await api.workOrders.list(cityId);
}

export async function getWorkOrder(id: string) {
  return await api.workOrders.get(id);
}

export async function updateWorkOrderStatus(id: string, status: string, byId?: string, byName?: string, role?: string) {
  return await api.workOrders.updateStatus(id, status);
}

export async function getWorkOrderEvents(id: string) { return []; }
export async function getEvidence(id: string) { return []; }
export async function submitMeasurement(data: any, byId: string, byName: string) { return null; }
export async function getMeasurement(id: string) { return null; }
export async function getBill(id: string) { return null; }
export async function approveBill(billId: string, woId: string, byId: string, byName: string, amount: number) { return null; }
export async function recordInspection(data: any, byId: string, byName: string) { return null; }

/* ---------------------------------------------------------------- alerts */
export async function getAlerts(city?: CityId): Promise<MuniAlert[]> { return []; }
export async function acknowledgeAlert(id: string): Promise<MuniAlert> { return {} as any; }

/* ------------------------------------------------------------ departments */
export async function getDepartments(): Promise<DepartmentStats[]> { 
  const data = await client.get<any>('/api/v1/analytics/summary');
  return data?.department_distribution || []; 
}
export async function getDepartment(id: string): Promise<DepartmentStats | null> { 
  const depts = await getDepartments();
  return depts.find((d: any) => d.id === id) ?? null; 
}

/* ------------------------------------------------------------------ areas */
export async function getAreaOverviews(city: CityId) { return []; }

/* -------------------------------------------------------------- analytics */
export async function getTrendAnalysis() { return []; }
export async function getHotspotRankings() { return []; }
export async function getAnalyticsData(city: CityId) {
  const data = await client.get<any>('/api/v1/analytics/summary?days=30');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    complaintTrend: data?.daily_trends || [],
    severityTrend: [],
    departmentDistribution: data?.department_distribution || [],
    categoryDistribution: [],
    resolutionStatus: [],
    emergingTrend: months.map((m, i) => ({ month: m, count: 8 + i * 2 })),
    responseTime: months.map((m, i) => ({ month: m, days: 2.8 - i * 0.1 })),
    city,
  };
}

/* --------------------------------------------------------- notifications */
export async function getOfficerNotifications(): Promise<OfficerNotification[]> { return []; }
export async function markNotificationRead(id: string): Promise<void> {}

/* -------------------------------------------------------------- settings */
const DEFAULT_SETTINGS: MuniSettings = {
  theme: "system", compactMode: false, defaultCity: "vadodara",
  defaultMapMode: "health", notifications: { critical: true, assignments: true, riskChanges: true, dailyDigest: false },
};
export async function getMuniSettings(): Promise<MuniSettings> { return read("janmind_muni_settings", DEFAULT_SETTINGS); }
export async function saveMuniSettings(patch: Partial<MuniSettings>): Promise<MuniSettings> {
  const current = await getMuniSettings();
  const next = { ...current, ...patch };
  write("janmind_muni_settings", next);
  return next;
}

export async function getSavedViews(): Promise<SavedView[]> { return []; }
export async function officerSearch(query: string) { return { complaints: [], issues: [], areas: [] }; }
export function startLiveSimulation(onUpdate: (activity: LiveActivity[]) => void) {}
export function stopLiveSimulation() {}
