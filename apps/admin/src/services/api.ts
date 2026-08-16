/**
 * Municipality frontend API layer — mock data with localStorage persistence.
 * Replace function bodies with real fetch calls when backend is ready.
 */

import type { CityId } from "@/services/cities";
import type { ComplaintStatus, Department } from "./types";
import {
  DASHBOARD_KPIS,
  DEMO_OFFICER,
  DEPARTMENT_STATS,
  SEED_ALERTS,
  SEED_LIVE_ACTIVITY,
  SEED_MUNI_COMPLAINTS,
  SEED_NOTIFICATIONS,
  SEED_SYSTEMIC_ISSUES,
  TREND_ANALYSIS,
  HOTSPOT_RANKINGS,
  buildAreaOverviews,
} from "./mockData";
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
} from "./types";
import { DEFAULT_COMPLAINT_FILTERS } from "./types";

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

const STORAGE = {
  officer: "janmind_muni_officer",
  complaints: "janmind_muni_complaints",
  issues: "janmind_muni_issues",
  alerts: "janmind_muni_alerts",
  notifications: "janmind_muni_notifications",
  settings: "janmind_muni_settings",
  savedViews: "janmind_muni_saved_views",
  liveActivity: "janmind_muni_live",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_SETTINGS: MuniSettings = {
  theme: "system",
  compactMode: false,
  defaultCity: "vadodara",
  defaultMapMode: "health",
  notifications: { critical: true, assignments: true, riskChanges: true, dailyDigest: false },
};

/* -------------------------------------------------------------- auth */

export async function muniLogin(input: {
  email: string;
  password: string;
  city: CityId;
}): Promise<Officer> {
  await delay();
  if (!input.email.trim() || !input.password.trim()) {
    throw new Error("Invalid credentials");
  }
  const officer: Officer = { ...DEMO_OFFICER, email: input.email, city: input.city };
  write(STORAGE.officer, officer);
  return officer;
}

export async function muniLogout(): Promise<void> {
  await delay(120);
  localStorage.removeItem(STORAGE.officer);
}

export async function getMuniOfficer(): Promise<Officer | null> {
  await delay(80);
  return read<Officer | null>(STORAGE.officer, null);
}

/* ----------------------------------------------------------- dashboard */

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  await delay();
  return { ...DASHBOARD_KPIS };
}

export async function getLiveActivity(): Promise<LiveActivity[]> {
  await delay(150);
  return read(STORAGE.liveActivity, SEED_LIVE_ACTIVITY);
}

/* --------------------------------------------------------- systemic issues */

function getIssues(): SystemicIssue[] {
  return read(STORAGE.issues, SEED_SYSTEMIC_ISSUES);
}

export async function getSystemicIssues(city?: CityId): Promise<SystemicIssue[]> {
  await delay();
  const issues = getIssues();
  return city ? issues.filter((i) => i.city === city) : issues;
}

export async function getSystemicIssue(id: string): Promise<SystemicIssue | null> {
  await delay();
  return getIssues().find((i) => i.id === id) ?? null;
}

export async function updateSystemicIssue(
  id: string,
  patch: Partial<SystemicIssue>,
): Promise<SystemicIssue> {
  await delay();
  const issues = getIssues();
  const idx = issues.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Issue not found");
  issues[idx] = { ...issues[idx]!, ...patch, updatedAt: new Date().toISOString() };
  write(STORAGE.issues, issues);
  return issues[idx]!;
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

/* -------------------------------------------------------------- complaints */

function getComplaints(): MuniComplaint[] {
  return read(STORAGE.complaints, SEED_MUNI_COMPLAINTS);
}

export async function getMuniComplaints(filters?: Partial<ComplaintFilters>): Promise<MuniComplaint[]> {
  await delay();
  const f = { ...DEFAULT_COMPLAINT_FILTERS, ...filters };
  let list = getComplaints();

  if (f.city !== "all") list = list.filter((c) => c.city === f.city);
  if (f.area) list = list.filter((c) => c.area.toLowerCase().includes(f.area.toLowerCase()));
  if (f.ward) list = list.filter((c) => c.ward.toLowerCase().includes(f.ward.toLowerCase()));
  if (f.category !== "all") list = list.filter((c) => c.category === f.category);
  if (f.severity !== "all") list = list.filter((c) => c.severity === f.severity);
  if (f.department !== "all") list = list.filter((c) => c.department === f.department);
  if (f.status !== "all") list = list.filter((c) => c.status === f.status);
  if (f.search) {
    const q = f.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getMuniComplaint(id: string): Promise<MuniComplaint | null> {
  await delay();
  return getComplaints().find((c) => c.id === id) ?? null;
}

export async function updateMuniComplaint(
  id: string,
  patch: Partial<MuniComplaint>,
): Promise<MuniComplaint> {
  await delay();
  const list = getComplaints();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error("Complaint not found");
  list[idx] = { ...list[idx]!, ...patch, updatedAt: new Date().toISOString() };
  write(STORAGE.complaints, list);
  return list[idx]!;
}

export async function assignComplaint(
  id: string,
  input: { department: Department; team?: string; officer?: string },
): Promise<MuniComplaint> {
  return updateMuniComplaint(id, {
    status: "Assigned",
    department: input.department,
    assignedTo: input.officer ?? input.department,
    timeline: [
      ...(getComplaints().find((c) => c.id === id)?.timeline ?? []),
      {
        label: "Department assigned",
        at: new Date().toISOString(),
        actor: input.department,
      },
    ],
  });
}

export async function bulkUpdateComplaints(
  ids: string[],
  patch: { status?: ComplaintStatus; department?: Department },
): Promise<void> {
  await delay();
  const list = getComplaints();
  for (const id of ids) {
    const idx = list.findIndex((c) => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx]!, ...patch, updatedAt: new Date().toISOString() };
    }
  }
  write(STORAGE.complaints, list);
}

/* ---------------------------------------------------------------- alerts */

export async function getAlerts(city?: CityId): Promise<MuniAlert[]> {
  await delay();
  const alerts = read(STORAGE.alerts, SEED_ALERTS);
  return city ? alerts.filter((a) => a.city === city) : alerts;
}

export async function acknowledgeAlert(id: string): Promise<MuniAlert> {
  await delay();
  const alerts = read(STORAGE.alerts, SEED_ALERTS);
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx < 0) throw new Error("Alert not found");
  alerts[idx] = { ...alerts[idx]!, acknowledged: true };
  write(STORAGE.alerts, alerts);
  return alerts[idx]!;
}

/* ------------------------------------------------------------ departments */

export async function getDepartments(): Promise<DepartmentStats[]> {
  await delay();
  return DEPARTMENT_STATS;
}

export async function getDepartment(id: string): Promise<DepartmentStats | null> {
  await delay();
  return DEPARTMENT_STATS.find((d) => d.id === id) ?? null;
}

/* ------------------------------------------------------------------ areas */

export async function getAreaOverviews(city: CityId) {
  await delay();
  return buildAreaOverviews(city);
}

/* -------------------------------------------------------------- analytics */

export async function getTrendAnalysis() {
  await delay();
  return TREND_ANALYSIS;
}

export async function getHotspotRankings() {
  await delay();
  return HOTSPOT_RANKINGS;
}

export async function getAnalyticsData(city: CityId) {
  await delay(350);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return {
    complaintTrend: months.map((m, i) => ({
      month: m,
      total: 980 + i * 120 + Math.floor(Math.random() * 80),
      critical: 20 + i * 3,
    })),
    severityTrend: months.map((m, i) => ({
      month: m,
      low: 400 + i * 20,
      moderate: 300 + i * 15,
      high: 180 + i * 10,
      critical: 30 + i * 2,
    })),
    departmentDistribution: DEPARTMENT_STATS.map((d) => ({
      name: d.name.replace("Municipal ", "").replace("Public ", ""),
      value: d.open + d.resolved,
    })),
    categoryDistribution: [
      { name: "Water", value: 1842 },
      { name: "Road", value: 1523 },
      { name: "Garbage", value: 987 },
      { name: "Drainage", value: 756 },
      { name: "Lighting", value: 432 },
      { name: "Other", value: 881 },
    ],
    resolutionStatus: [
      { name: "Resolved", value: 7136 },
      { name: "In Progress", value: 456 },
      { name: "Assigned", value: 312 },
      { name: "Under Review", value: 280 },
      { name: "Received", value: 237 },
    ],
    emergingTrend: months.map((m, i) => ({ month: m, count: 8 + i * 2 })),
    responseTime: months.map((m, i) => ({ month: m, days: 2.8 - i * 0.1 })),
    city,
  };
}

/* --------------------------------------------------------- notifications */

export async function getOfficerNotifications(): Promise<OfficerNotification[]> {
  await delay();
  return read(STORAGE.notifications, SEED_NOTIFICATIONS);
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(80);
  const list = read(STORAGE.notifications, SEED_NOTIFICATIONS);
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx]!, read: true };
    write(STORAGE.notifications, list);
  }
}

/* -------------------------------------------------------------- settings */

export async function getMuniSettings(): Promise<MuniSettings> {
  await delay(80);
  return read(STORAGE.settings, DEFAULT_SETTINGS);
}

export async function saveMuniSettings(patch: Partial<MuniSettings>): Promise<MuniSettings> {
  await delay();
  const current = read(STORAGE.settings, DEFAULT_SETTINGS);
  const next = { ...current, ...patch };
  write(STORAGE.settings, next);
  return next;
}

/* ------------------------------------------------------------- saved views */

export async function getSavedViews(): Promise<SavedView[]> {
  await delay(80);
  return read(STORAGE.savedViews, [
    { id: "sv1", name: "My critical areas", filters: { severity: "Critical" } },
    { id: "sv2", name: "Water issues", filters: { category: "Water Supply" } },
    { id: "sv3", name: "Ward alerts", filters: { ward: "Ward 14" } },
    { id: "sv4", name: "High-risk issues", filters: { riskMin: "70" } },
  ]);
}

/* -------------------------------------------------------------- search */

export async function officerSearch(query: string) {
  await delay(200);
  const q = query.trim().toLowerCase();
  if (!q) return { complaints: [], issues: [], areas: [] };

  const complaints = getComplaints()
    .filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    )
    .slice(0, 5);

  const issues = getIssues()
    .filter(
      (i) =>
        i.areaName.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.ward.toLowerCase().includes(q),
    )
    .slice(0, 5);

  return { complaints, issues, areas: [] };
}

/* ---------------------------------------------------- live simulation */

let liveTimer: ReturnType<typeof setInterval> | null = null;

export function startLiveSimulation(onUpdate: (activity: LiveActivity[]) => void) {
  if (liveTimer) return;
  liveTimer = setInterval(() => {
    const current = read(STORAGE.liveActivity, SEED_LIVE_ACTIVITY);
    const event: LiveActivity = {
      id: `la_${Date.now()}`,
      type: "new_report",
      title: "NEW REPORT",
      subtitle: `${["Water Supply", "Road Damage", "Garbage Collection"][Math.floor(Math.random() * 3)]} — ${["Sarvodaya Nagar", "Alkapuri", "Manjalpur"][Math.floor(Math.random() * 3)]}`,
      detail: "Just now",
      at: new Date().toISOString(),
    };
    const next = [event, ...current].slice(0, 12);
    write(STORAGE.liveActivity, next);
    onUpdate(next);

    const issues = getIssues();
    const water = issues.find((i) => i.id === "sys_water_vad_14");
    if (water && Math.random() > 0.6) {
      water.complaintCount += 1;
      water.riskScore = Math.min(100, water.riskScore + 1);
      write(STORAGE.issues, issues);
    }
  }, 18000);
}

export function stopLiveSimulation() {
  if (liveTimer) {
    clearInterval(liveTimer);
    liveTimer = null;
  }
}
