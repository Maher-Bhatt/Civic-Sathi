import { APIClient, Endpoints } from '@janmind/api-client';
import type { CityId } from "@/services/cities";
import type { User } from '@janmind/api-client';


export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:3001";

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
  const res = await api.auth.loginCitizen({ email: input.email, password: input.password });
  if (res.user.role !== 'contractor') {
    throw new Error('User is not a contractor');
  }
  if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
  write(LS.contractor, res.user);
  return res.user;
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

export async function getContractorUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;
  return read<User | null>(LS.contractor, null);
}

// For compatibility with old components
export const muniLogin = contractorLogin;
export const muniLogout = contractorLogout;
export const getMuniOfficer = getContractorUser;

/* -------------------------------------------------------------- tenders & bids */
export async function getEligibleTenders(cityId: string) {
  return await api.tenders.list(cityId);
}

export async function getTenderDetails(id: string) {
  return await api.tenders.get(id);
}

export async function submitBid(tenderId: string, quotedAmount: number, technicalProposal: string) {
  return await api.tenders.submitBid(tenderId, { quoted_amount: quotedAmount, technical_proposal: technicalProposal });
}

export async function getWorkOrders(cityId?: string) {
  const user = await getContractorUser();
  const cid = cityId || user?.city || "11111111-1111-1111-1111-111111111111";
  return await api.workOrders.list(cid);
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

/* -------------------------------------------------------------- mock data for unimplemented */
export async function getDashboardKPIs() {
  return { openWorkOrders: 12, pendingInspections: 4, recentPayments: 0 };
}
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
export async function markNotificationRead() { return null; }
export async function getMuniSettings() { return { theme: 'system' }; }
export async function saveMuniSettings() { return null; }
export async function getSavedViews() { return []; }
export async function officerSearch() { return { complaints: [], issues: [], areas: [] }; }
export function startLiveSimulation() {}
export function stopLiveSimulation() {}

export async function getWorkOrderEvents(id: string) { return []; }
export async function submitMeasurement(data: any, contractorId: string, contractorName: string) { return null; }
export async function submitBill(data: any, contractorId: string, contractorName: string) { return null; }
export async function getBill(workOrderId: string) { return null; }
export async function getContractor(id: string) { return null; }
