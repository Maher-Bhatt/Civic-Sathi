import { APIClient, Endpoints } from '@janmind/api-client';
import type { User, Complaint, IssueCategory, Severity, LocationInfo, AnalysisResult, ImageAnalysis, NearbyReport, AppNotification } from './types';
import { CATEGORY_KEYWORDS, SEVERITY_KEYWORDS, DEMO_USER, NEARBY_REPORTS, SEED_NOTIFICATIONS, RELATED_SAMPLES, WARD_14 } from './mockData';

export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "https://janmind.onrender.com";

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
  const res = await api.auth.registerCitizen(input);
  if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
  write(LS.user, res.user);
  return res.user as any;
}

export async function loginUser(input: { email: string; password: string }): Promise<User> {
  const res = await api.auth.loginCitizen(input);
  if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
  write(LS.user, res.user);
  return res.user as any;
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(LS.token);
  if (!token) return null;
  // TODO: Add a real /me endpoint, for now return from cache
  return read<User | null>(LS.user, null);
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
  return await api.complaints.create(input) as any;
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const res = await api.complaints.list({ limit: 100 });
  return res.data || res;
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
      ? "JANMIND found other reports that may describe a similar civic issue nearby."
      : "JANMIND found a small number of comparable reports in this area.",
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
  if (n.includes("water") || n.includes("tap"))
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
  return read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any);
}

export async function markNotificationsRead(): Promise<AppNotification[]> {
  const list = read<AppNotification[]>(LS.notifications, SEED_NOTIFICATIONS as any).map((n) => ({
    ...n,
    read: true,
  }));
  write(LS.notifications, list);
  return list;
}

export async function detectDuplicateIssues(input: any) {
  return null;
}

export async function createCivicIssue(input: any) {
  return null;
}

export async function linkToCivicIssue(issueId: string, complaintId: string, relationshipType: string, matchConfidence: number, linkedBy: string) {
  return null;
}
