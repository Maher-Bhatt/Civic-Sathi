import { APIClient, Endpoints } from '@janmind/api-client';
import type { CityId } from "@/services/cities";
import type { User } from '@janmind/api-client';


export function getApiBaseUrl(): string {
  const envUrl = ((import.meta.env as any)?.VITE_API_BASE_URL as string | undefined)?.trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    if (!envUrl || envUrl.startsWith("http://")) {
      return "https://janmind.onrender.com";
    }
  }
  return envUrl || "https://janmind.onrender.com";
}

export const API_BASE_URL = getApiBaseUrl();

const LS = {
  contractor: "janmind_contractor_user",
  token: "janmind_contractor_token",
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
export async function contractorLogin(input: { email: string; password: string; city: CityId }): Promise<User> {
  try {
    const res = await api.auth.loginCitizen({ email: input.email, password: input.password });

    // Normalize response - backend sends 'citizen' but api-client normalizes to 'user'
    const userData = res.user || res.citizen || (res as any).citizen;
    if (!userData) {
      throw new Error('Login failed: no user data returned');
    }

    if (userData.role !== 'contractor') {
      throw new Error('Access denied: this account is not registered as a contractor');
    }

    if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
    write(LS.contractor, userData);
    return userData;
  } catch (error: any) {
    throw error;
  }
}

export async function contractorLogout(): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS.token);
    window.localStorage.removeItem(LS.contractor);
  }
}

export async function adminLogin(email: string, pass: string): Promise<any> { return {} as any; }
export async function adminLogout(): Promise<void> {}
export async function getAdminUser(): Promise<any | null> { return null; }

export type ContractorUser = User & { city?: string; contractorId?: string };

export async function getContractorUser(): Promise<ContractorUser | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;

  // Return cached user immediately so auth gate never bounces on slow network.
  const cached = read<ContractorUser | null>(LS.contractor, null);

  const refreshFromServer = async () => {
    try {
      const me = await api.auth.me();
      if (me && (me as any).role === 'contractor') {
        write(LS.contractor, me);
        return me as ContractorUser;
      }
    } catch {
      // ignore — use cached
    }
    return null;
  };

  if (cached) {
    refreshFromServer(); // background refresh, don't await
    return cached;
  }

  return refreshFromServer();
}

// For compatibility with old components
export const muniLogin = contractorLogin;
export const muniLogout = contractorLogout;
export const getMuniOfficer = getContractorUser as () => Promise<any>;

/* -------------------------------------------------------------- city UUID resolution
   The backend uses UUID primary keys for cities. We resolve the frontend city
   name slug (e.g. "vadodara") to the backend UUID once and cache it.        */

const cityUuidCache: Map<string, string> = new Map();

export async function resolveCityUuid(cityNameOrSlug: string): Promise<string | null> {
  const key = cityNameOrSlug.toLowerCase();
  if (cityUuidCache.has(key)) return cityUuidCache.get(key)!;
  try {
    const cities = await api.cities.list();
    for (const c of cities) {
      cityUuidCache.set(c.name.toLowerCase(), c.id);
    }
    return cityUuidCache.get(key) ?? null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------- tenders & bids */
export async function getEligibleTenders(cityIdOrName: string) {
  // If it looks like a UUID already, use directly; otherwise resolve
  const uuid = cityIdOrName.includes('-') && cityIdOrName.length === 36
    ? cityIdOrName
    : (await resolveCityUuid(cityIdOrName)) ?? cityIdOrName;
  return await api.tenders.list(uuid);
}

export async function getTenderDetails(id: string) {
  return await api.tenders.get(id);
}

export async function submitBid(tenderId: string, quotedAmount: number, technicalProposal: string) {
  return await api.tenders.submitBid(tenderId, { quoted_amount: quotedAmount, technical_proposal: technicalProposal });
}

export async function getWorkOrders(cityIdOrName?: string) {
  const user = await getContractorUser();
  const raw = cityIdOrName || user?.city || "vadodara";
  // If it's already a UUID, use directly; otherwise resolve to UUID
  const uuid = raw.includes('-') && raw.length === 36
    ? raw
    : (await resolveCityUuid(raw)) ?? raw;
  return await api.workOrders.list(uuid);
}

export async function getWorkOrder(id: string) {
  return await api.workOrders.get(id);
}

export async function submitFieldEvidence(workOrderId: string, photoUrl: string, description: string) {
  return await api.workOrders.submitEvidence(workOrderId, { photo_url: photoUrl, description });
}

export async function updateWorkOrderStatus(id: string, status: string) {
  return await api.workOrders.updateStatus(id, status);
}

/* -------------------------------------------------------------- real contractor dashboard KPIs */
export async function getDashboardKPIs() {
  try {
    const user = await getContractorUser();
    const rawCity = user?.city || "vadodara";
    const uuid = rawCity.includes('-') && rawCity.length === 36
      ? rawCity
      : (await resolveCityUuid(rawCity)) ?? rawCity;

    const orders = await api.workOrders.list(uuid);
    const all = Array.isArray(orders) ? orders : (orders as any)?.data ?? [];

    const openWorkOrders      = all.filter((w: any) => !["COMPLETED","CANCELLED","CLOSED"].includes(w.status)).length;
    const pendingInspections  = all.filter((w: any) => w.status === "INSPECTION_PENDING").length;
    const completedWorkOrders = all.filter((w: any) => w.status === "COMPLETED").length;

    return { openWorkOrders, pendingInspections, recentPayments: 0, completedWorkOrders };
  } catch {
    return { openWorkOrders: 0, pendingInspections: 0, recentPayments: 0, completedWorkOrders: 0 };
  }
}

/* -------------------------------------------------------------- stubs for unused municipality-facing functions */
export async function getLiveActivity() { return []; }
export async function getSystemicIssues() { return []; }
export async function getSystemicIssue() { return null; }
export async function updateSystemicIssue() { return null; }
export async function startInvestigation() { return null; }
export async function assignIssueDepartment() { return null; }
export async function getMuniComplaints() { return []; }
export async function getMuniComplaint() { return null; }
export async function updateMuniComplaint() { return null; }
export async function assignComplaint() { return null; }
export async function bulkUpdateComplaints() { return null; }
export async function getAlerts() { return []; }
export async function acknowledgeAlert() { return null; }
export async function getDepartments() { return []; }
export async function getDepartment() { return null; }
export async function getAreaOverviews() { return []; }
export async function getTrendAnalysis() { return []; }
export async function getHotspotRankings() { return []; }
export async function getAnalyticsData() { return null; }
export async function getOfficerNotifications() { return []; }
export async function markNotificationRead(id?: string) { return null; }
export async function getMuniSettings() { return { theme: 'system' }; }
export async function saveMuniSettings(patch?: any) { return null; }
export async function getSavedViews() { return []; }
export async function officerSearch(query?: string) { return { complaints: [] as {id: string, category: string}[], issues: [] as {id: string, category: string, areaName: string}[], areas: [] as any[] }; }
export function startLiveSimulation() {}
export function stopLiveSimulation() {}

export async function getWorkOrderEvents(id: string) { return []; }
export async function submitMeasurement(data: any, contractorId: string, contractorName: string) { return null; }
export async function submitBill(data: any, contractorId: string, contractorName: string) { return null; }
export async function getBill(workOrderId: string) { return null; }
export async function getContractor(id: string) { return null; }
