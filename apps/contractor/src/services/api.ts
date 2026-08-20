import { APIClient, Endpoints } from "@civicsathi/api-client";
import type { CityId } from "@/services/cities";
import type { User } from "@civicsathi/api-client";

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
  contractor: "civicsathi_contractor_user",
  token: "civicsathi_contractor_token",
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
      window.localStorage.removeItem(LS.contractor);
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

/* -------------------------------------------------------------- auth */
export async function contractorLogin(input: {
  email: string;
  password: string;
  city: CityId;
}): Promise<User> {
  try {
    const res = await client.post<{
      access_token: string;
      user?: any;
      citizen?: any;
      contractor?: any;
    }>("/api/v1/auth/contractor-login", { email: input.email, password: input.password, city: input.city });

    // Accept the shared client's canonical user shape as well as legacy aliases.
    const userData = res.user || res.contractor || res.citizen;
    if (!userData) {
      throw new Error("Login failed: no user data returned");
    }

    if (userData.role !== "contractor") {
      throw new Error("Access denied: this account is not registered as a contractor");
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

export async function adminLogin(email: string, pass: string): Promise<any> {
  return {} as any;
}
export async function adminLogout(): Promise<void> {}
export async function getAdminUser(): Promise<any | null> {
  return null;
}

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
      if (me && (me as any).role === "contractor") {
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
  const uuid =
    cityIdOrName.includes("-") && cityIdOrName.length === 36
      ? cityIdOrName
      : ((await resolveCityUuid(cityIdOrName)) ?? cityIdOrName);
  return await api.tenders.list(uuid);
}

export async function getTenderDetails(id: string) {
  return await api.tenders.get(id);
}

export async function submitBid(tenderId: string, quotedAmount: number, technicalProposal: string) {
  return await api.tenders.submitBid(tenderId, {
    quoted_amount: quotedAmount,
    technical_proposal: technicalProposal,
  });
}

export async function getWorkOrders(cityIdOrName?: string) {
  const user = await getContractorUser();
  const raw = cityIdOrName || user?.city || "vadodara";
  // If it's already a UUID, use directly; otherwise resolve to UUID
  const uuid = raw.includes("-") && raw.length === 36 ? raw : ((await resolveCityUuid(raw)) ?? raw);
  return await api.workOrders.list(uuid);
}

export async function getWorkOrder(id: string) {
  return await api.workOrders.get(id);
}

export async function submitFieldEvidence(
  workOrderId: string,
  photoUrl: string,
  description: string,
) {
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
    const uuid =
      rawCity.includes("-") && rawCity.length === 36
        ? rawCity
        : ((await resolveCityUuid(rawCity)) ?? rawCity);

    const orders = await api.workOrders.list(uuid);
    const all = Array.isArray(orders) ? orders : ((orders as any)?.data ?? []);

    const openWorkOrders = all.filter(
      (w: any) => !["COMPLETED", "CANCELLED", "CLOSED"].includes(w.status),
    ).length;
    const pendingInspections = all.filter((w: any) => w.status === "INSPECTION_PENDING").length;
    const completedWorkOrders = all.filter((w: any) => w.status === "COMPLETED").length;

    return { openWorkOrders, pendingInspections, recentPayments: 0, completedWorkOrders };
  } catch {
    return { openWorkOrders: 0, pendingInspections: 0, recentPayments: 0, completedWorkOrders: 0 };
  }
}

/* -------------------------------------------------------------- stubs for unused municipality-facing functions */
export async function getLiveActivity() {
  return [];
}
export async function getSystemicIssues() {
  return [];
}
export async function getSystemicIssue() {
  return null;
}
export async function updateSystemicIssue() {
  return null;
}
export async function startInvestigation() {
  return null;
}
export async function assignIssueDepartment() {
  return null;
}
export async function getMuniComplaints() {
  return [];
}
export async function getMuniComplaint() {
  return null;
}
export async function updateMuniComplaint() {
  return null;
}
export async function assignComplaint() {
  return null;
}
export async function bulkUpdateComplaints() {
  return null;
}
export async function getAlerts() {
  return [];
}
export async function acknowledgeAlert() {
  return null;
}
export async function getDepartments() {
  return [];
}
export async function getDepartment() {
  return null;
}
export async function getAreaOverviews() {
  return [];
}
export async function getTrendAnalysis() {
  return [];
}
export async function getHotspotRankings() {
  return [];
}
export async function getAnalyticsData() {
  return null;
}
export async function getOfficerNotifications() {
  return [];
}
export async function markNotificationRead(id?: string) {
  return null;
}
export async function getMuniSettings() {
  return { theme: "system" };
}
export async function saveMuniSettings(patch?: any) {
  return null;
}
export async function getSavedViews() {
  return [];
}
export async function officerSearch(query?: string) {
  return {
    complaints: [] as { id: string; category: string }[],
    issues: [] as { id: string; category: string; areaName: string }[],
    areas: [] as any[],
  };
}
export function startLiveSimulation() {}
export function stopLiveSimulation() {}

export async function getWorkOrderEvents(id: string) {
  return [];
}
export async function submitMeasurement(data: any, contractorId: string, contractorName: string) {
  return null;
}
export async function getContractor(id: string) {
  const list = await api.contractors.list();
  const user = await getContractorUser();
  const current = (list || []).find((item: any) => String(item?.id) === id)
    || (list || []).find((item: any) => item?.email === user?.email);
  if (!current) return null;
  const registrations = Array.isArray(current.registrations) ? current.registrations : [];
  const approved = registrations.find((registration: any) => registration?.status === "APPROVED") ?? registrations[0] ?? {};
  const categories = registrations.flatMap((registration: any) => Array.isArray(registration?.approved_categories) ? registration.approved_categories : []);
  return {
    id: String(current.id),
    companyName: current.company_name ?? current.companyName ?? user?.name ?? "Unknown contractor",
    registrationNumber: approved.registration_number ?? "—",
    contactPerson: current.contact_person ?? user?.name ?? "",
    email: current.email ?? user?.email ?? "",
    phone: current.phone ?? user?.phone ?? "",
    address: "—",
    gstin: "—",
    pan: "—",
    status: registrations.some((registration: any) => registration?.status === "APPROVED") ? "VERIFIED" : "PENDING_VERIFICATION",
    verificationStatus: registrations.some((registration: any) => registration?.status === "APPROVED") ? "VERIFIED" : "PENDING",
    registrationDate: "",
    expiryDate: "",
    specializationCategories: Array.from(new Set(categories)),
    serviceAreas: Array.from(new Set(registrations.map((registration: any) => registration?.city_name).filter(Boolean))),
    performanceScore: Number(current.performance_score ?? 0),
    slaScore: Number(current.sla_score ?? 0),
    inspectionPassRate: Number(current.inspection_pass_rate ?? 0),
    onTimeCompletionRate: Number(current.on_time_completion_rate ?? 0),
    reworkRate: Number(current.rework_rate ?? 0),
    rating: Number(current.public_rating ?? 0),
    activeWorkCount: Number(current.active_work_count ?? 0),
    totalCompleted: Number(current.total_completed ?? 0),
    createdAt: current.created_at ?? "",
    updatedAt: current.updated_at ?? current.created_at ?? "",
  };
}

export async function getContractorPerformance() {
  try {
    const list = await api.contractors.list();
    const user = await getContractorUser();
    const current = (list || []).find((c: any) => c.email === user?.email) || (list || [])[0];
    if (current) {
      let reviews = [];
      try {
        reviews = await api.contractors.getRatings(current.id);
      } catch {}
      return { ...current, reviews };
    }
    throw new Error("No live contractor performance record is available for this account yet.");
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("The contractor performance service is unavailable. Please retry.");
  }
}


export async function getMyCivicRolePerformance() {
  return client.get<import("./types").CivicRolePerformance>("/api/v1/reputation/performance/me");
}
