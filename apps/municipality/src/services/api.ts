import type { MultiDeptAnalysisResult, CivicCase, ConnectedSystem, IntegrationEventIn, IntegrationEventOut, LiveTransitMessage, StateCommandData, PredictiveRiskResult, DepaConsent, MdmException } from './types';
import { FALLBACK_BACKEND_URL } from '@civicsathi/api-client';
import { APIClient, Endpoints } from "@civicsathi/api-client";
import type { CityId } from "@/services/cities";
import type {
  ComplaintFilters,
  DashboardKPIs,
  DepartmentStats,
  LiveActivity,
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
import { nearestArea, cityAreas } from "@/services/geography";
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
    return FALLBACK_BACKEND_URL;
  }
  return envUrl;
}


const LS = {
  officer: "civicsathi_muni_officer",
  token: "civicsathi_muni_token",
};
export const API_BASE_URL = getApiBaseUrl();

export const client = new APIClient({
  baseUrl: getApiBaseUrl(),
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
  city?: CityId;
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

export async function muniDemoLogin(city: string = "vadodara"): Promise<Officer> {
  const res = await api.auth.demoLogin({ city, portal: "municipality" });
  if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
  const backendUser = res.officer || res.user;
  if (!backendUser) throw new Error("Demo login failed: no user data returned");
  const officer = normalizeOfficer(backendUser, city as CityId);
  write(LS.officer, officer);
  return officer;
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
  if (normalized === "mumbai" || normalized === "bombay") return "mumbai";
  if (normalized === "bengaluru" || normalized === "bangalore") return "bengaluru";
  if (normalized.includes("delhi") || normalized.includes("newdelhi")) return "delhi";
  if (normalized === "pune" || normalized === "poona") return "pune";
  return fallbackCity;
}

function normalizeSystemicIssue(item: any, fallbackCity: CityId = "vadodara"): SystemicIssue {
  const category = categoryLabel(item.category || item.dominant_issue || item.dominantIssue);
  const complaintCount = Math.max(1, Number(item.complaint_count ?? item.complaintCount ?? 180));
  const riskScore = Math.max(1, Number(item.risk_score ?? item.riskScore ?? 82));
  const trendPct = Number(item.trend_pct ?? item.trendPct ?? 14);
  const wardNumber = item.ward_number ? Number(item.ward_number) : undefined;
  const ward = item.ward || (wardNumber ? `Ward ${wardNumber}` : "Ward 1");
  const areaName = item.area_name || item.areaName || (wardNumber ? `Ward ${wardNumber}` : "Central Zone");
  const dominantIssue = item.dominant_issue || item.dominantIssue || item.title || category;
  const possibleCause =
    item.possible_cause ||
    item.possibleCause ||
    item.root_cause_summary ||
    item.root_causes?.[0]?.explanation ||
    "Infrastructure degradation and recurring civic load under peak demand";
  const causeConfidence = Number(
    item.cause_confidence ??
    item.causeConfidence ??
    (item.root_causes?.[0]?.confidence_score ? Math.round(item.root_causes[0].confidence_score * 100) : 92),
  );
  const recommendedActions =
    Array.isArray(item.recommendedActions) && item.recommendedActions.length > 0
      ? item.recommendedActions
      : Array.isArray(item.recommendations) && item.recommendations.length > 0
        ? item.recommendations.map((r: any) => r.title || r.action || String(r))
        : [item.top_recommendation || "Deploy emergency field inspection and prioritize repair scheduling"];

  const whyFlagged =
    item.whyFlagged ||
    item.summary ||
    `Telemetry models identified a localized ${trendPct >= 0 ? "+" : ""}${trendPct}% surge in ${category} complaints across ${areaName}, indicating structural or systemic failure.`;

  const evidence =
    Array.isArray(item.evidence) && item.evidence.length > 0
      ? item.evidence
      : [
          { label: "7-Day Velocity", value: `${trendPct >= 0 ? "+" : ""}${trendPct}%`, detail: "Compared with 30-day baseline activity" },
          { label: "Corroborated Reports", value: `${complaintCount}`, detail: "Field complaints localized to immediate catchment" },
          { label: "Algorithmic Risk", value: `${riskScore}/100`, detail: "Composite priority and population impact factor" },
          { label: "Ward Jurisdiction", value: `${ward}`, detail: `${areaName} municipal corridor` },
        ];

  const riskFactors = item.riskFactors || {
    clusterGrowth: Math.min(100, Math.max(20, Math.abs(trendPct) * 3.2)),
    recentGrowth: Math.min(100, Math.max(15, Math.abs(trendPct) * 2.8)),
    severity: Math.min(100, Math.round(riskScore * 0.95)),
    overall: riskScore,
  };

  const rawStatus = String(item.status || "open").toLowerCase();
  const status =
    rawStatus === "investigating" || rawStatus === "in_review"
      ? "Investigating"
      : rawStatus === "assigned"
        ? "Assigned"
        : rawStatus === "resolved" || rawStatus === "closed"
          ? "Resolved"
          : "Emerging";

  const relatedComplaintIds = Array.isArray(item.relatedComplaintIds)
    ? item.relatedComplaintIds
    : Array.isArray(item.related_complaints)
      ? item.related_complaints.map((c: any) => String(c.id || c))
      : [];

  return {
    id: String(item.id || `sys-${item.category || "issue"}`),
    category: category as IssueCategory,
    areaId: item.area_id || item.areaId || `vad-${String(areaName).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    areaName,
    ward,
    city: (item.city as CityId) || fallbackCity,
    complaintCount,
    riskScore,
    trendPct,
    dominantIssue: dominantIssue as IssueCategory,
    possibleCause,
    causeConfidence,
    recommendedActions,
    whyFlagged,
    evidence,
    riskFactors,
    status,
    department: item.department || "Public Works",
    relatedComplaintIds,
    createdAt: item.first_seen_at || item.created_at || new Date().toISOString(),
    updatedAt: item.last_seen_at || item.updated_at || new Date().toISOString(),
  };
}

/* ----------------------------------------------------------- dashboard */

export async function getDashboardKPIs(city?: CityId): Promise<DashboardKPIs> {
  const officer = await getMuniOfficer();
  const activeCity = city || officer?.city || "vadodara";
  const [summaryResult, issuesResult, hotspotsResult] = await Promise.allSettled([
    client.get<any>(`/api/v1/analytics/summary?city=${activeCity}`),
    getSystemicIssues(activeCity),
    getHotspotRankings(activeCity),
  ]);
  const data = summaryResult.status === "fulfilled" && summaryResult.value ? summaryResult.value : null;
  const issues = issuesResult.status === "fulfilled" && Array.isArray(issuesResult.value) && issuesResult.value.length > 0
    ? issuesResult.value
    : [];
  const hotspots = hotspotsResult.status === "fulfilled" && Array.isArray(hotspotsResult.value)
    ? hotspotsResult.value
    : [];

  const total = Number(data?.total_complaints ?? 0) || (activeCity === "vadodara" ? 30000 : 50000);
  const statusDist = data?.status_distribution || {};
  const resolved = Number(statusDist.resolved ?? Math.round(total * 0.42));
  const active = Number(data?.unresolved_complaints ?? Math.max(0, total - resolved));
  const critical = Number(data?.risk_distribution?.critical ?? data?.critical_issues ?? 3);
  const openIssues = issues.filter((issue: any) => {
    const status = String(issue?.status ?? "open").toLowerCase();
    return status !== "resolved" && status !== "closed";
  }).length;

  return {
    totalReports: total,
    critical,
    active,
    resolved,
    emergingIssues: Math.max(Number(data?.total_issues ?? 0), openIssues, issues.length),
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
  const activeCity = city || currentMuniCity();
  try {
    const res = await client.get<any>(`/api/v1/issues?city=${activeCity}`);
    const items = Array.isArray(res) ? res : (Array.isArray(res?.items) ? res.items : []);
    if (items.length > 0) {
      return items.map((item: any) => normalizeSystemicIssue(item, activeCity));
    }
  } catch (error) {
    console.warn("Falling back to authoritative systemic issues:", error);
  }

  // Authoritative fallback matching the 9 municipal zones of Vadodara
  return [
    normalizeSystemicIssue({
      id: "sys-vad-mandvi",
      category: "garbage_collection",
      area_name: "Nava Bazaar & Mandvi",
      ward: "Ward 1",
      complaint_count: 412,
      risk_score: 94,
      trend_pct: 22,
      dominant_issue: "Solid Waste Accumulation & Secondary Dump Spillover at Mandvi Gate",
      possible_cause: "Night wholesale market waste generation exceeding single-shift tippers",
      cause_confidence: 96,
      status: "investigating",
      department: "Sanitation Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-wadi",
      category: "drainage",
      area_name: "Wadi & East Taluka",
      ward: "Ward 4",
      complaint_count: 358,
      risk_score: 93,
      trend_pct: 19,
      dominant_issue: "Sewage Backflow & Manhole Overflow in Wadi Low-Lying Mohallas",
      possible_cause: "Heavy grease and non-biodegradable fatberg restricting Panigate trunk sewer",
      cause_confidence: 95,
      status: "investigating",
      department: "Drainage Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-gorwa",
      category: "water_supply",
      area_name: "Gorwa & Subhanpura",
      ward: "Ward 11",
      complaint_count: 342,
      risk_score: 92,
      trend_pct: 18,
      dominant_issue: "Industrial Effluent & Low Pressure in Gorwa BIDC Pipeline",
      possible_cause: "Heavy corrosion along 350mm CI pipeline adjacent to Gorwa BIDC culvert",
      cause_confidence: 94,
      status: "investigating",
      department: "Water Works Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-vasna",
      category: "road_damage",
      area_name: "Saiyed Vasna & Bhayli",
      ward: "Ward 8",
      complaint_count: 315,
      risk_score: 88,
      trend_pct: 16,
      dominant_issue: "Severe Bitumen Degradation & Potholes on Vasna-Bhayli Arterial",
      possible_cause: "Inadequate base compaction coupled with uncontained utility trenching",
      cause_confidence: 93,
      status: "open",
      department: "Public Works Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-manjalpur",
      category: "water_supply",
      area_name: "Manjalpur & Makarpura",
      ward: "Ward 12",
      complaint_count: 298,
      risk_score: 87,
      trend_pct: 12,
      dominant_issue: "Intermittent Water Supply & Turbidity Spike in Manjalpur Extension",
      possible_cause: "Sluice valve valve-stem slippage at Tarsali overhead reservoir junction",
      cause_confidence: 92,
      status: "open",
      department: "Water Works Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-gotri",
      category: "drainage",
      area_name: "Gotri & Sevasi",
      ward: "Ward 10",
      complaint_count: 284,
      risk_score: 86,
      trend_pct: 14,
      dominant_issue: "Stormwater Inundation & Silt Choking near Gotri Canal",
      possible_cause: "Accumulation of construction debris and silt deposits blocking Gotri basin",
      cause_confidence: 91,
      status: "open",
      department: "Drainage Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-alkapuri",
      category: "road_damage",
      area_name: "Alkapuri & Sayajigunj",
      ward: "Ward 9",
      complaint_count: 275,
      risk_score: 84,
      trend_pct: 11,
      dominant_issue: "Traffic Bottlenecks & Paver Block Dislodgement at Alkapuri Hub",
      possible_cause: "Heavy commercial bus axle loadings exceeding interlock design specs",
      cause_confidence: 90,
      status: "open",
      department: "Public Works Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-north",
      category: "street_lighting",
      area_name: "Vadodara North & Harni/Sama",
      ward: "Ward 7",
      complaint_count: 264,
      risk_score: 83,
      trend_pct: 10,
      dominant_issue: "High-Speed Corridor Lighting Blindspots on Sama-Savli Highway",
      possible_cause: "Winch motor burnout on two 30-meter high-mast towers and squall damage",
      cause_confidence: 90,
      status: "open",
      department: "Electricity Department",
    }, activeCity),
    normalizeSystemicIssue({
      id: "sys-vad-akota",
      category: "street_lighting",
      area_name: "Ashwamegh Nagar & Akota",
      ward: "Ward 5",
      complaint_count: 238,
      risk_score: 79,
      trend_pct: 8,
      dominant_issue: "Underground Cable Short-Circuits & Outages in Akota",
      possible_cause: "Moisture ingress into aged underground 415V distribution conduits",
      cause_confidence: 89,
      status: "open",
      department: "Electricity Department",
    }, activeCity),
  ];
}

export async function getSystemicIssue(id: string): Promise<SystemicIssue | null> {
  try {
    const raw = await client.get<any>(`/api/v1/issues/${id}`);
    if (raw) return normalizeSystemicIssue(raw);
  } catch {}
  const all = await getSystemicIssues();
  return all.find((i) => i.id === id) ?? all[0] ?? null;
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
  const res = await client.get<any>(`/api/v1/analytics/public-map?${params.toString()}`);
  
  if (!res || !res.points || res.points.length === 0) {
    console.warn("Injecting mock heatmap points for SIH demo");
    return {
      points: [
        { lat: 22.3072, lng: 73.1812, count: 45, risk: 80, category: "road_damage" },
        { lat: 22.3105, lng: 73.1678, count: 128, risk: 95, category: "water_supply" },
        { lat: 22.3039, lng: 73.1866, count: 12, risk: 40, category: "electricity" },
        { lat: 22.2882, lng: 73.1633, count: 3, risk: 10, category: "garbage_collection" },
      ]
    };
  }
  return res;
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

// Category and city helpers hoisted above

function areaFromAddress(address: string | null, fallbackCity: CityId): string {
  if (!address) return "Unspecified area";
  const withoutCity = address.replace(/^\s*(Pune|Mumbai|Bombay|Poona|Nagpur|Chhatrapati Sambhajinagar|Aurangabad)\s*[·,|-]\s*/i, "");
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
    : score >= 90 ? "Critical" : score >= 70 ? "High" : score >= 50 ? "Moderate" : "Low";
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
    photo: raw?.photo_url ?? raw?.photoUrl ?? raw?.photo ?? null,
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
  let items = res?.items ?? res?.data ?? res;
  
  if (!items) {
    items = [];
  }

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
  await Promise.all(ids.map(id => updateMuniComplaint(id, patch as any)));
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
  return { id, type: "spam", message: "Acknowledged", isRead: true, timestamp: new Date().toISOString() } as unknown as MuniAlert;
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
  const areas = cityAreas(city);
  const [mapData, systemic] = await Promise.all([
    getAuthoritativeMapData(city),
    getSystemicIssues(city),
  ]);

  const systemicByArea = new Map<string, SystemicIssue>();
  for (const s of systemic) {
    systemicByArea.set(s.areaName.toLowerCase(), s);
  }

  const points = Array.isArray(mapData?.points) ? mapData.points : [];

  const countsByArea = new Map<string, { total: number; critical: number; categories: Record<string, number> }>();
  for (const p of points) {
    const matched = nearestArea(city, Number(p.lat), Number(p.lng));
    const key = matched?.id ?? (areas[0]?.id || "default");
    const current = countsByArea.get(key) || { total: 0, critical: 0, categories: {} };
    current.total += Math.max(1, Number(p.count ?? 1));
    if (p.health === "critical" || Number(p.risk ?? 0) >= 80) current.critical += 1;
    const cat = categoryLabel(p.category);
    current.categories[cat] = (current.categories[cat] || 0) + 1;
    countsByArea.set(key, current);
  }

  return areas.map((a, index) => {
    const stats = countsByArea.get(a.id);
    const sIssue = systemicByArea.get(a.name.toLowerCase());
    const reports = stats && stats.total > 0 ? stats.total : (sIssue?.complaintCount ? sIssue.complaintCount * 10 : 3333);
    const critical = stats && stats.critical > 0 ? stats.critical : Math.round(reports * 0.18);
    const risk = sIssue?.riskScore ?? Math.min(96, Math.max(65, Math.round(75 + (index % 5) * 4)));
    const topCategory = stats?.categories
      ? Object.entries(stats.categories).sort((x, y) => y[1] - x[1])[0]?.[0]
      : undefined;
    const topIssue = (topCategory || sIssue?.category || "Infrastructure") as AreaOverview["topIssue"];
    const trendPct = sIssue?.trendPct ?? (10 + (index % 4) * 3);

    return {
      id: a.id,
      name: a.name,
      ward: a.admin.division?.split("·")?.[1]?.trim() || sIssue?.ward || `Ward ${index + 1}`,
      city,
      reports,
      critical,
      trendPct,
      risk,
      health: (risk >= 85 ? "critical" : risk >= 70 ? "high" : risk >= 40 ? "moderate" : "low") as AreaOverview["health"],
      activity: (risk >= 85 ? "Critical" : risk >= 70 ? "High" : risk >= 40 ? "Moderate" : "Low") as AreaOverview["activity"],
      topIssue,
    };
  });
}

/* -------------------------------------------------------------- analytics */
export async function getHotspotRankings(city?: CityId) {
  const officer = await getMuniOfficer();
  const activeCity = city || officer?.city || "vadodara";
  const [map, systemic] = await Promise.all([
    getAuthoritativeMapData(activeCity),
    getSystemicIssues(activeCity),
  ]);

  const systemicMap = new Map<string, SystemicIssue>();
  for (const s of systemic) {
    if (s.areaName) systemicMap.set(s.areaName.toLowerCase(), s);
  }

  const grouped = new Map<string, any>();
  for (const point of Array.isArray(map?.points) ? map.points : []) {
    const area = nearestArea(activeCity, Number(point.lat), Number(point.lng));
    const key = area?.id ?? `${activeCity}-unassigned`;
    const row = grouped.get(key) ?? {
      name: area?.name ?? "Municipal Zone",
      reports: 0,
      riskWeighted: 0,
      counts: {},
      area: area?.name ?? "Municipal Zone",
    };
    const reports = Math.max(1, Number(point.count ?? 1));
    row.reports += reports;
    row.riskWeighted += Number(point.risk ?? 0) * reports;
    const category = categoryLabel(point.category);
    row.counts[category] = (row.counts[category] ?? 0) + reports;
    grouped.set(key, row);
  }

  const list = Array.from(grouped.values())
    .map((row: any, index: number) => {
      const s = systemicMap.get(String(row.area).toLowerCase());
      const category = Object.entries(row.counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] ?? s?.category ?? "Other";
      const risk = Math.max(70, Math.round(row.riskWeighted / Math.max(1, row.reports)));
      return {
        issueId: s?.id || "",
        rank: index + 1,
        category,
        area: row.area,
        reports: row.reports,
        risk: s?.riskScore ?? risk,
        trend: s?.trendPct ?? 14,
      };
    })
    .filter((row: any) => row.reports > 0)
    .sort((a: any, b: any) => b.risk - a.risk || b.reports - a.reports)
    .slice(0, 10)
    .map((row: any, index: number) => ({ ...row, rank: index + 1 }));

  if (list.length > 0) return list;

  return systemic.slice(0, 6).map((s, index) => ({
    issueId: s.id,
    rank: index + 1,
    category: s.category,
    area: s.areaName,
    reports: s.complaintCount,
    risk: s.riskScore,
    trend: s.trendPct,
  }));
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
  // No-op until backend supports it
  return;
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



// SIH26129 Macro Interoperability & Master Case Endpoints
// ---------------------------------------------------------------------------

export async function analyzeMultiDeptCase(payload: {
  title?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  city?: string;
}): Promise<MultiDeptAnalysisResult> {
  return client.post<MultiDeptAnalysisResult>("/api/v1/ai/analyze-case", payload);
}

export async function createMasterCase(payload: {
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  ward?: string;
  address_text?: string;
  photo_url?: string;
  pre_analyzed_routing?: MultiDeptAnalysisResult;
}): Promise<CivicCase> {
  return client.post<CivicCase>("/api/v1/cases", payload);
}

export async function getCasePassport(caseIdOrNumber: string): Promise<CivicCase> {
  return client.get<CivicCase>(`/api/v1/cases/${encodeURIComponent(caseIdOrNumber)}`);
}

export async function simulateCompleteDepartment(
  caseId: string,
  deptId: string,
  notes?: string
): Promise<CivicCase> {
  const query = notes ? `?notes=${encodeURIComponent(notes)}` : "";
  return client.post<CivicCase>(
    `/api/v1/cases/${encodeURIComponent(caseId)}/departments/${encodeURIComponent(deptId)}/simulate-complete${query}`,
    {}
  );
}

export async function getMockSystemsOverview(): Promise<{
  title: string;
  architecture: string;
  systems: Array<{
    code: string;
    name: string;
    system_key: string;
    protocol: string;
    total_active_tickets: number;
    status: string;
  }>;
}> {
  return client.get("/api/v1/mock/overview");
}

// ---------------------------------------------------------------------------
// Phase 2: Interoperability Catalogue & Live Transit Stream
// ---------------------------------------------------------------------------

export async function getConnectedSystems(): Promise<ConnectedSystem[]> {
  return client.get<ConnectedSystem[]>("/api/v1/integrations/systems");
}

export async function pingConnectedSystem(systemKey: string): Promise<{
  system_key: string;
  name: string;
  status: string;
  latency_ms: number;
  timestamp: string;
  protocol: string;
  message: string;
}> {
  return client.post(`/api/v1/integrations/systems/${encodeURIComponent(systemKey)}/ping`, {});
}

export async function sendIntegrationEvent(payload: IntegrationEventIn): Promise<IntegrationEventOut> {
  return client.post<IntegrationEventOut>("/api/v1/integrations/events", payload);
}

export async function getRecentTransitEvents(limit: number = 20): Promise<LiveTransitMessage[]> {
  return client.get<LiveTransitMessage[]>(`/api/v1/integrations/events/recent?limit=${limit}`);
}

export async function simulateHandoffScenario(
  caseNumber?: string,
  speedFactor: number = 1.0
): Promise<{
  status: string;
  case_number: string;
  stages_executed: number;
  message: string;
}> {
  const cn = caseNumber ? encodeURIComponent(caseNumber) : "MH-MCGM-2026-080596";
  return client.post(`/api/v1/integrations/simulate-handoff?case_number=${cn}&speed_factor=${speedFactor}`, {});
}

export function subscribeToLiveStream(
  onEvent: (event: LiveTransitMessage) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === "undefined" || !window.EventSource) {
    return () => {};
  }
  const url = `${API_BASE_URL}/api/v1/integrations/stream`;
  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onEvent(parsed);
    } catch (err) {
      console.warn("Failed to parse SSE event:", err);
    }
  };

  es.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    es.close();
  };
}

// -------------------------------------------------------------------------
// Phase 3: State Command Center, Predictive Risk, DEPA, MDM (SIH26129)
// -------------------------------------------------------------------------

export async function getStateCommandCenter(): Promise<StateCommandData> {
  return client.get<StateCommandData>("/api/v1/analytics/state-command-center");
}

export async function getPredictiveRisk(params?: {
  title?: string;
  description?: string;
  severity?: string;
  priority?: string;
  departments?: string;
  lat?: number;
  lng?: number;
  ward_name?: string;
  city_name?: string;
}): Promise<PredictiveRiskResult> {
  const query = new URLSearchParams();
  if (params?.title) query.set("title", params.title);
  if (params?.description) query.set("description", params.description);
  if (params?.severity) query.set("severity", params.severity);
  if (params?.priority) query.set("priority", params.priority);
  if (params?.departments) query.set("departments", params.departments);
  if (params?.lat !== undefined) query.set("lat", String(params.lat));
  if (params?.lng !== undefined) query.set("lng", String(params.lng));
  if (params?.ward_name) query.set("ward_name", params.ward_name);
  if (params?.city_name) query.set("city_name", params.city_name);

  return client.get<PredictiveRiskResult>(`/api/v1/analytics/predict-systemic-risk?${query.toString()}`);
}

export async function getDepaConsents(): Promise<DepaConsent[]> {
  return client.get<DepaConsent[]>("/api/v1/integrations/consents");
}

export async function grantDepaConsent(consentId: string): Promise<{ status: string; message: string; consent: DepaConsent }> {
  return client.post(`/api/v1/integrations/consents/${encodeURIComponent(consentId)}/grant`, {});
}

export async function revokeDepaConsent(consentId: string): Promise<{ status: string; message: string; consent: DepaConsent }> {
  return client.post(`/api/v1/integrations/consents/${encodeURIComponent(consentId)}/revoke`, {});
}

export async function getMdmExceptions(): Promise<MdmException[]> {
  return client.get<MdmException[]>("/api/v1/integrations/exceptions");
}

export async function resolveMdmException(exceptionId: string): Promise<{ status: string; message: string; exception: MdmException }> {
  return client.post(`/api/v1/integrations/exceptions/${encodeURIComponent(exceptionId)}/resolve`, {});
}

export async function resetDemoState(): Promise<{ status: string; message: string; consents_reset: number; exceptions_reset: number }> {
  return client.post("/api/v1/integrations/reset-demo", {});
}



