import { APIClient, Endpoints } from '@janmind/api-client';
import type { User, Complaint, IssueCategory, Severity, LocationInfo, AnalysisResult, ImageAnalysis, NearbyReport, AppNotification } from './types';
import { CATEGORY_KEYWORDS, SEVERITY_KEYWORDS, DEMO_USER, NEARBY_REPORTS, SEED_NOTIFICATIONS, RELATED_SAMPLES, WARD_14 } from './mockData';

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
  user: "janmind.user",
  notifications: "janmind.notifications",
  token: "janmind.token",
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
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function detectCategory(text: string): IssueCategory {
  const t = text.toLowerCase();
  let best: { category: IssueCategory; score: number } = { category: "Water Supply", score: 0 };
  for (const entry of CATEGORY_KEYWORDS) {
    const score = entry.words.reduce((acc, w) => acc + (t.includes(w) ? 1 : 0), 0);
    if (score > best.score) best = { category: entry.category, score };
  }
  return best.category;
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
      console.error('No user data in registration response:', res);
      throw new Error('Registration succeeded but no user data returned');
    }
    
    write(LS.user, userData);
    return userData as any;
  } catch (error: any) {
    console.error('Registration error:', error);
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
      console.error('No user data in login response:', res);
      throw new Error('Login succeeded but no user data returned');
    }
    
    write(LS.user, userData);
    return userData as any;
  } catch (error: any) {
    console.error('Login error:', error);
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
  const current = await getCurrentUser() ?? DEMO_USER;
  const next = { ...current, ...patch };
  write(LS.user, next);
  return next;
}

export async function changePassword(): Promise<void> {}

export async function createComplaint(input: any): Promise<Complaint> {
  try {
    const res = await api.complaints.create(input);
    const created = ((res as any).data || res) as any;
    
    // Automatically generate registered notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      complaintId: created.public_id || created.id,
      kind: "received",
      title: `Complaint Registered: ${created.public_id || "JN-2026"}`,
      body: `Your complaint "${created.title || input.title || 'Civic issue'}" has been received and indexed by Municipal Triage.`,
      at: new Date().toISOString(),
      read: false,
    };
    const existing = read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any);
    write(LS.notifications, [notif, ...existing]);
    
    return created;
  } catch (err) {
    console.warn("Backend complaint creation fallback to optimistic local record:", err);
    const trackingSuffix = Math.floor(100000 + Math.random() * 900000);
    const publicId = `JN-2026-${trackingSuffix}`;
    const fallbackComplaint: Complaint = {
      id: `CMP-${trackingSuffix}`,
      trackingId: `TRK-${trackingSuffix}`,
      public_id: publicId,
      category: input.category || "General",
      severity: input.severity || "Moderate",
      status: "UNDER_REVIEW",
      description: input.description,
      location: input.location || { lat: 22.3072, lng: 73.1812, ward: "Ward 14", area: "Vadodara" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photo: input.photo,
      estimatedResolution: "48-72 hours",
      timeline: [
        {
          id: `TL-${Date.now()}`,
          stage: "SUBMITTED",
          title: "Report Received",
          description: "Your report has been received and indexed by JANMIND AI triage.",
          at: new Date().toISOString(),
        },
      ],
    } as any;
    
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      complaintId: publicId,
      kind: "received",
      title: `Complaint Registered: ${publicId}`,
      body: `Your complaint has been submitted to Municipal Triage. Status: Under Review.`,
      at: new Date().toISOString(),
      read: false,
    };
    const existing = read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any);
    write(LS.notifications, [notif, ...existing]);
    
    return fallbackComplaint;
  }
}

export async function getMyComplaints(): Promise<Complaint[]> {
  try {
    const res = await api.complaints.list({ limit: 100 });
    return res.data || res;
  } catch {
    return [];
  }
}

export async function getComplaint(id: string): Promise<Complaint> {
  return await api.complaints.get(id) as any;
}

// Keep mock AI capabilities for demo purposes as they don't have backend equivalents yet
export async function analyzeComplaint(input: any): Promise<AnalysisResult> {
  const category = input.imageCategory ?? detectCategory(input.description);
  const severity = detectSeverity(input.description);
  const location = input.location ?? WARD_14;
  const isDemo = category === "Water Supply";
  return {
    category,
    severity,
    confidence: "High",
    location,
    relatedCount: isDemo ? 127 : 34,
    nearbyCount: isDemo ? 23 : 7,
    radiusMeters: 500,
    hotspot: isDemo,
    relatedSamples: isDemo ? RELATED_SAMPLES : RELATED_SAMPLES.slice(0, 2),
    summary: isDemo
      ? "127 reports in 30 days clustered near RC Dutt Road. Pattern indicates systemic main pipeline pressure failure rather than isolated domestic leaks."
      : "Low frequency pattern. Standard municipal workflow applies.",
    recommendedAction: isDemo
      ? "Dispatch zonal water engineer to inspect pressure valve assembly at Sector 4 junction."
      : "Standard inspection scheduled.",
  } as any;
}

export async function uploadComplaintPhoto(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We couldn't read that image."));
    reader.readAsDataURL(file);
  });
}

export async function analyzeComplaintPhoto(fileName: string): Promise<ImageAnalysis> {
  const n = fileName.toLowerCase();
  if (n.includes("garbage") || n.includes("waste"))
    return { detected: "Garbage accumulation", category: "Garbage Collection", confidence: "High" } as any;
  if (n.includes("water") || n.includes("tap") || n.includes("leak"))
    return { detected: "Water leak / supply issue", category: "Water Supply", confidence: "High" } as any;
  return {
    detected: "Road surface damage / pothole",
    category: "Road Damage",
    confidence: "High",
  } as any;
}

export async function analyzeImage(file: File): Promise<{ detected: string; category: string; confidence: string }> {
  const name = file.name.toLowerCase();
  if (name.includes("garbage") || name.includes("waste"))
    return { detected: "Overflowing waste container", category: "Garbage Collection", confidence: "High" } as any;
  if (name.includes("water") || name.includes("leak"))
    return { detected: "Dry public water point", category: "Water Supply", confidence: "Medium" } as any;
  return {
    detected: "Possible road surface damage",
    category: "Road Damage",
    confidence: "High",
  } as any;
}

export async function getNearbyComplaints(): Promise<NearbyReport[]> {
  return NEARBY_REPORTS as any;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const stored = read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any);
  return stored;
}

export async function markNotificationsRead(): Promise<AppNotification[]> {
  const list = read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any).map((n) => ({
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

export async function linkToCivicIssue(issueId: string, complaintId: string, relationshipType: string, matchConfidence: number, linkedBy: string): Promise<any> {
  return { success: true };
}
