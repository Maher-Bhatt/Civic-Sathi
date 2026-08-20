import { APIClient, Endpoints } from "@civicsathi/api-client";
import type {
  User,
  Complaint,
  IssueCategory,
  Severity,
  ComplaintStatus,
  LocationInfo,
  AnalysisResult,
  ImageAnalysis,
  NearbyReport,
  AppNotification,
  ReputationMe,
  CivicProfileSummary,
} from "./types";
import {
  CATEGORY_KEYWORDS,
  SEVERITY_KEYWORDS,
} from "./mockData";

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
  user: "civicsathi.user",
  notifications: "civicsathi.notifications",
  token: "civicsathi.token",
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
      window.localStorage.removeItem(LS.user);
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
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function getPublicCityAggregate(city: "vadodara" | "bengaluru") {
  return client.get<{
    city: string;
    total_reports: number;
    last7_days: number;
    aggregate_points: number;
    daily_trends: Array<{ date: string; count: number }>;
    points: Array<{ id: string; lat: number; lng: number; category: string; health: string; days_ago: number; count: number; resolved: number }>;
  }>(`/api/v1/analytics/public-map?city=${encodeURIComponent(city)}&time=30d&issue=all&health=all`);
}

export async function listPublicContractors() {
  try {
    return await api.contractors.list();
  } catch {
    return [];
  }
}

export async function submitPublicRating(
  contractorId: string,
  rating: number,
  comment: string,
  category: string,
) {
  return await api.contractors.submitRating(contractorId, {
    rating,
    comment,
    category,
  });
}

export function detectCategory(text: string): IssueCategory {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const ranked = CATEGORY_KEYWORDS.map((entry, index) => ({
    category: entry.category,
    index,
    score: entry.words.reduce((acc, word) => acc + (normalized.includes(word) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  // Do not invent a road issue when no signal exists. Sanitation is the
  // neutral municipal intake category used for genuinely ambiguous reports.
  return ranked[0]?.score ? ranked[0].category : "Sanitation";
}

export function detectSeverity(text: string): Severity {
  const t = text.toLowerCase();
  for (const entry of SEVERITY_KEYWORDS) {
    if (entry.words.some((w) => t.includes(w))) return entry.severity;
  }
  return "Moderate";
}

export async function registerUser(input: any): Promise<User> {
  try {
    const res = await api.auth.registerCitizen(input);
    if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);

    // Normalize response - backend sends 'citizen' but api-client normalizes to 'user'
    const userData = res.user || res.citizen || (res as any).citizen;
    if (!userData) {
      console.error("No user data in registration response:", res);
      throw new Error("Registration succeeded but no user data returned");
    }

    write(LS.user, userData);
    return userData as any;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(input: { email: string; password: string }): Promise<User> {
  try {
    const res = await api.auth.loginCitizen(input);
    if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);

    // Normalize response - backend sends 'citizen' but api-client normalizes to 'user'
    const userData = res.user || res.citizen || (res as any).citizen;
    if (!userData) {
      console.error("No user data in login response:", res);
      throw new Error("Login succeeded but no user data returned");
    }

    write(LS.user, userData);
    return userData as any;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;

  // Return cached user immediately so auth gate never bounces on slow network.
  // Then refresh from /me in background and update the cache.
  const cached = read<User | null>(LS.user, null);

  const refreshFromServer = async () => {
    try {
      const me = await api.auth.me();
      const user: User = {
        id: (me as any).id,
        name: (me as any).name,
        email: (me as any).email ?? "",
        phone: (me as any).phone ?? "",
        ward: (me as any).ward ?? "Unassigned",
        notifyStatus: true,
        notifyNearby: true,
      };
      write(LS.user, user);
      return user;
    } catch {
      window.localStorage.removeItem(LS.token);
      window.localStorage.removeItem(LS.user);
      return null;
    }
  };

  if (cached) {
    // Refresh in background, don't await
    refreshFromServer();
    return cached;
  }

  // No cache — must wait for server
  return refreshFromServer();
}

export async function logoutUser(): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS.token);
    window.localStorage.removeItem(LS.user);
  }
}

export async function updateProfile(patch: Partial<User>): Promise<User> {
  const current = await getCurrentUser();
  if (!current) throw new Error("You must be signed in to update your profile.");
  const next = { ...current, ...patch };
  write(LS.user, next);
  return next;
}

export async function changePassword(): Promise<void> {}

function normalizeComplaint(raw: any, fallbackInput?: any): Complaint {
  const source = raw?.data || raw;
  if (!source) return null as any;

  const sourceLocation = source.location || {};
  const fallbackLocation = fallbackInput?.location || {};
  const lat =
    source.lat ?? source.location_lat ?? sourceLocation.lat ?? fallbackLocation.lat ?? 22.3072;
  const lng =
    source.lng ?? source.location_lng ?? sourceLocation.lng ?? fallbackLocation.lng ?? 73.1812;
  const ward =
    sourceLocation.ward ||
    (source.ward_number ? `Ward ${source.ward_number}` : fallbackLocation.ward || "Ward 14");
  const area = sourceLocation.area || source.address_text || fallbackLocation.area || "Vadodara";
  const statusMap: Record<string, ComplaintStatus> = {
    received: "Received",
    submitted: "Received",
    under_review: "Under Review",
    investigating: "Under Review",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  const rawStatus = String(source.status || "received")
    .toLowerCase()
    .replace(/\s+/g, "_");
  const score = Number(source.severity_score ?? 0);
  const severity: Severity =
    source.severity ||
    (score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 35 ? "Moderate" : "Low");
  const createdAt = source.createdAt || source.created_at || new Date().toISOString();
  const complaintId = source.public_id || source.id || `CMP-${Date.now()}`;
  const timeline =
    Array.isArray(source.timeline) && source.timeline.length > 0
      ? source.timeline
      : [
          {
            label: "Report Received",
            description: "Your report has been received.",
            at: createdAt,
            done: true,
          },
        ];

  return {
    ...source,
    id: complaintId,
    public_id: source.public_id || complaintId,
    description: source.description || fallbackInput?.description || "",
    category: source.category || fallbackInput?.category || "Water Supply",
    severity,
    location: {
      lat,
      lng,
      ward,
      area,
      city: sourceLocation.city || fallbackLocation.city || source.city,
    },
    createdAt,
    status: statusMap[rawStatus] || (source.status as ComplaintStatus) || "Received",
    relatedCount: Number(
      source.relatedCount ?? source.related_count ?? source.analysis?.similar_count ?? 0,
    ),
    nearbyCount: Number(source.nearbyCount ?? source.nearby_count ?? 0),
    timeline,
  } as Complaint;
}

export async function createComplaint(input: any): Promise<Complaint> {
  try {
    const res = await api.complaints.create(input);
    const created = ((res as any).data || res) as any;

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      complaintId: created.public_id || created.id,
      kind: "received",
      title: `Complaint Registered: ${created.public_id || "Civic Sathi"}`,
      body: `Your complaint "${created.title || input.title || "Civic issue"}" has been received.`,
      at: new Date().toISOString(),
      read: false,
    };
    const existing = read<AppNotification[]>(LS.notifications, []);
    write(LS.notifications, [notif, ...existing]);

    return normalizeComplaint(created, input);
  } catch (err) {
    console.error("Complaint creation failed:", err);
    throw err instanceof Error
      ? err
      : new Error("We couldn't submit your report. Please try again.");
  }
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const res = await api.complaints.list({ limit: 100 });
  const list = res?.items ?? res?.data ?? res;
  return (Array.isArray(list) ? list : []).map((c) => normalizeComplaint(c));
}

export async function getComplaint(id: string): Promise<Complaint> {
  const res = await api.complaints.get(id);
  return normalizeComplaint(res);
}

const BACKEND_CATEGORY_TO_UI: Record<string, IssueCategory> = {
  road_damage: "Road Damage",
  water_supply: "Water Supply",
  garbage_collection: "Garbage Collection",
  drainage: "Drainage",
  street_lighting: "Street Lighting",
  electricity: "Electricity",
  sanitation: "Sanitation",
};

function backendSeverity(score: unknown, priority?: string): Severity {
  const value = Number(score ?? 0);
  if (value >= 9 || priority === "urgent") return "Critical";
  if (value >= 7 || priority === "high") return "High";
  if (value >= 5 || priority === "medium") return "Moderate";
  return "Low";
}

export async function analyzeComplaint(input: any): Promise<AnalysisResult> {
  const description = String(input.description ?? "").trim();
  const location = input.location ?? {
    lat: 22.3072,
    lng: 73.1812,
    ward: "Ward 14",
    area: "Vadodara",
    city: "Vadodara",
  };
  const response = await api.ai.analyzeComplaint({
    title: input.title || "Civic report",
    description,
    category_hint: input.imageCategory || null,
    language: input.language || null,
  });
  const category = BACKEND_CATEGORY_TO_UI[String(response.category || "sanitation")] || "Sanitation";
  const severity = backendSeverity(response.severity_score, response.priority);
  const confidence = response.source === "model" ? "High" : "Medium";
  return {
    category,
    severity,
    confidence,
    location,
    relatedCount: 0,
    nearbyCount: 0,
    radiusMeters: 500,
    hotspot: false,
    relatedSamples: [],
    summary: String(response.summary || `${category} report classified by Civic Sathi backend analysis.`),
    recommendedAction: String(response.suggested_action || `Route to the ${category.toLowerCase()} department for field verification.`),
    interpretedText: String(response.interpreted_text || response.summary || "The municipality will review the report details."),
    language: String(response.language || input.language || "en"),
  } as AnalysisResult;
}

export async function uploadComplaintPhoto(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We couldn't read that image."));
    reader.readAsDataURL(file);
  });
}

export async function analyzeComplaintPhoto(dataUrl: string, description?: string): Promise<ImageAnalysis> {
  const response = await api.ai.analyzeImage({ data_url: dataUrl, description });
  return {
    detected: String(response.detected || "Image received; manual municipal verification required"),
    category: BACKEND_CATEGORY_TO_UI[String(response.category || "sanitation")] || "Sanitation",
    confidence: (response.confidence === "High" || response.confidence === "Medium" ? response.confidence : "Low"),
    evidence: String(response.evidence || "No visual evidence note was returned."),
    safetyNote: String(response.safety_note || "Field verification is required."),
    source: String(response.source || "backend"),
  } as ImageAnalysis;
}

export async function analyzeImage(
  file: File,
): Promise<{ detected: string; category: string; confidence: string }> {
  const dataUrl = await uploadComplaintPhoto(file);
  return analyzeComplaintPhoto(dataUrl);
}

export async function getNearbyComplaints(location?: LocationInfo): Promise<NearbyReport[]> {
  try {
    const res = await api.complaints.list({ limit: 100, city: location?.city });
    const list = res?.items ?? res?.data ?? res;
    const lat = Number(location?.lat ?? 22.3072);
    const lng = Number(location?.lng ?? 73.1812);
    return (Array.isArray(list) ? list : [])
      .map((raw: any) => normalizeComplaint(raw))
      .filter((complaint) => complaint.location.lat !== 0 && complaint.location.lng !== 0)
      .map((complaint) => ({
        id: complaint.id,
        category: complaint.category,
        severity: complaint.severity,
        x: Math.max(0, Math.min(1, 0.5 + (complaint.location.lng - lng) * 18)),
        y: Math.max(0, Math.min(1, 0.5 - (complaint.location.lat - lat) * 18)),
        ageHours: Math.max(0, Math.round((Date.now() - new Date(complaint.createdAt).getTime()) / 3_600_000)),
      }));
  } catch {
    return [];
  }
}

export async function getNotifications(): Promise<AppNotification[]> {
  const stored = read<AppNotification[]>(LS.notifications, []);
  if (stored.length === 0) return [];

  // Notifications are local presentation records, but a notification is only
  // valid when its complaint is still readable by the signed-in citizen. This
  // removes legacy seed links and prevents an infinite-loading detail route.
  const checks = await Promise.all(
    stored.map(async (notification) => {
      try {
        await api.complaints.get(notification.complaintId);
        return notification;
      } catch {
        return null;
      }
    }),
  );
  const valid = checks.filter((notification): notification is AppNotification => Boolean(notification));
  if (valid.length !== stored.length) write(LS.notifications, valid);
  return valid;
}

export async function markNotificationsRead(): Promise<AppNotification[]> {
  const list = read<AppNotification[]>(LS.notifications, []).map((n) => ({
    ...n,
    read: true,
  }));
  write(LS.notifications, list);
  return list;
}

export async function detectDuplicateIssues(input: any): Promise<any[]> {
  return [];
}

export async function createCivicIssue(input: any): Promise<any> {
  return {
    id: `ISS-${Date.now()}`,
    ...input,
  };
}

export async function linkToCivicIssue(
  issueId: string,
  complaintId: string,
  relationshipType: string,
  matchConfidence: number,
  linkedBy: string,
): Promise<any> {
  return { success: true };
}


export async function getMyCivicReputation(): Promise<ReputationMe> {
  return client.get<ReputationMe>("/api/v1/reputation/me");
}

export async function updateCivicReputationPreferences(patch: Partial<CivicProfileSummary>): Promise<CivicProfileSummary> {
  return client.patch<CivicProfileSummary>("/api/v1/reputation/me/preferences", patch);
}

export async function confirmComplaintResolution(complaintId: string) {
  return client.post<{
    success: boolean;
    xp_awarded: number;
    impact_awarded: number;
    message: string;
    profile: CivicProfileSummary;
  }>(`/api/v1/reputation/complaints/${encodeURIComponent(complaintId)}/confirm-resolution`, {});
}

export async function getCityCivicImpact(city: string) {
  return client.get<{
    city: import("./types").CityImpact;
    top_contributors: Array<{ display_name: string; impact_score: number; reputation_score: number }>;
  }>(`/api/v1/reputation/city/${encodeURIComponent(city)}`);
}
