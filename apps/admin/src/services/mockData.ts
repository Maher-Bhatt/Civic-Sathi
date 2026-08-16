import type { CityId } from "@/services/cities";
import { cityAreas } from "@/services/geography";

const RELATED_SAMPLES = [
  "No water supply since Monday.",
  "Water has stopped in our neighborhood.",
  "Our taps have been dry for three days.",
  "No municipal water reaching our apartment.",
  "Pothole on main road after rain.",
  "Garbage not collected for a week.",
  "Sewage overflow on street corner.",
  "Streetlights not working in sector B.",
];
import type {
  AreaOverview,
  DashboardKPIs,
  DepartmentStats,
  LiveActivity,
  MuniAlert,
  MuniComplaint,
  Officer,
  OfficerNotification,
  SystemicIssue,
} from "./types";

export const DEMO_OFFICER: Officer = {
  id: "off_001",
  name: "Priya Sharma",
  email: "priya.sharma@vmc.gov.in",
  department: "Municipal Water",
  role: "Officer",
  city: "vadodara",
  lastActive: new Date().toISOString(),
};

const now = Date.now();

export const DASHBOARD_KPIS: DashboardKPIs = {
  totalReports: 8421,
  critical: 37,
  active: 1248,
  resolved: 7136,
  emergingIssues: 12,
  areaHotspots: 8,
};

export const SEED_SYSTEMIC_ISSUES: SystemicIssue[] = [
  {
    id: "sys_water_vad_14",
    category: "Water Supply",
    areaId: "vad-sarvodaya",
    areaName: "Sarvodaya Nagar",
    ward: "Ward 14",
    city: "vadodara",
    complaintCount: 127,
    riskScore: 91,
    trendPct: 38,
    dominantIssue: "Water Supply",
    possibleCause: "Localized infrastructure-related issue suspected.",
    causeConfidence: 91,
    recommendedActions: [
      "Inspect affected infrastructure",
      "Verify water pressure",
      "Dispatch maintenance team",
      "Monitor complaints for 24 hours",
    ],
    whyFlagged:
      "127 reports are concentrated in this area, share strong semantic similarity, and have increased during the current monitoring period.",
    evidence: [
      {
        label: "Complaint Volume",
        value: "127 reports",
        detail: "94th percentile for this ward in the last 30 days",
      },
      {
        label: "Geographic Concentration",
        value: "89% within 520m",
        detail: "Reports cluster in a tight geographic band",
      },
      {
        label: "Semantic Similarity",
        value: "91% match",
        detail: "Complaints describe similar water supply failures",
      },
      {
        label: "Recent Growth",
        value: "+38% this week",
        detail: "Accelerating trend over 7-day window",
      },
    ],
    riskFactors: {
      complaintVolume: 94,
      geographicConcentration: 89,
      semanticSimilarity: 91,
      recentGrowth: 88,
      severity: 85,
      overall: 91,
    },
    status: "Emerging",
    relatedComplaintIds: ["JN-2026-00127", "JN-2026-00128", "JN-2026-00129"],
    createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "sys_road_vad_9",
    category: "Road Damage",
    areaId: "vad-alkapuri",
    areaName: "Alkapuri",
    ward: "Ward 9",
    city: "vadodara",
    complaintCount: 83,
    riskScore: 76,
    trendPct: 12,
    dominantIssue: "Road Damage",
    possibleCause: "Repeated surface deterioration pattern detected in high-traffic corridor.",
    causeConfidence: 78,
    recommendedActions: [
      "Schedule road inspection",
      "Assess traffic load impact",
      "Plan resurfacing intervention",
    ],
    whyFlagged:
      "83 reports share location proximity and describe pothole-related damage with increasing frequency.",
    evidence: [
      { label: "Complaint Volume", value: "83 reports", detail: "Above ward average" },
      { label: "Geographic Concentration", value: "72%", detail: "Along main arterial road" },
      { label: "Semantic Similarity", value: "84%", detail: "Pothole and surface damage language" },
      { label: "Recent Growth", value: "+12%", detail: "Steady increase over 14 days" },
    ],
    riskFactors: {
      complaintVolume: 78,
      geographicConcentration: 72,
      semanticSimilarity: 84,
      recentGrowth: 65,
      severity: 70,
      overall: 76,
    },
    status: "Investigating",
    department: "Public Works",
    relatedComplaintIds: ["JN-2026-00094"],
    createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "sys_garbage_vad_6",
    category: "Garbage Collection",
    areaId: "vad-karelibaug",
    areaName: "Karelibaug",
    ward: "Ward 6",
    city: "vadodara",
    complaintCount: 61,
    riskScore: 64,
    trendPct: 4,
    dominantIssue: "Garbage Collection",
    possibleCause: "Collection schedule disruption suspected in residential lanes.",
    causeConfidence: 72,
    recommendedActions: [
      "Verify collection route adherence",
      "Deploy additional pickup crew",
      "Notify residents of schedule",
    ],
    whyFlagged:
      "61 reports indicate missed collection cycles with moderate geographic spread.",
    evidence: [
      { label: "Complaint Volume", value: "61 reports", detail: "Moderate for ward size" },
      { label: "Geographic Concentration", value: "58%", detail: "Spread across 3 lanes" },
      { label: "Semantic Similarity", value: "79%", detail: "Missed pickup descriptions" },
      { label: "Recent Growth", value: "+4%", detail: "Stable with slight uptick" },
    ],
    riskFactors: {
      complaintVolume: 62,
      geographicConcentration: 58,
      semanticSimilarity: 79,
      recentGrowth: 45,
      severity: 55,
      overall: 64,
    },
    status: "Assigned",
    department: "Sanitation",
    relatedComplaintIds: ["JN-2026-00061"],
    createdAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "sys_drain_vad_11",
    category: "Drainage",
    areaId: "vad-manjalpur",
    areaName: "Manjalpur",
    ward: "Ward 11",
    city: "vadodara",
    complaintCount: 54,
    riskScore: 71,
    trendPct: 31,
    dominantIssue: "Drainage",
    possibleCause: "Blockage pattern in storm drain network suspected.",
    causeConfidence: 80,
    recommendedActions: [
      "Inspect storm drains",
      "Clear blockages",
      "Monitor waterlogging after rain",
    ],
    whyFlagged:
      "54 reports with +31% growth, concentrated near low-lying intersections.",
    evidence: [
      { label: "Complaint Volume", value: "54 reports", detail: "Rising quickly" },
      { label: "Geographic Concentration", value: "81%", detail: "Low-lying intersections" },
      { label: "Semantic Similarity", value: "86%", detail: "Waterlogging descriptions" },
      { label: "Recent Growth", value: "+31%", detail: "Post-monsoon spike" },
    ],
    riskFactors: {
      complaintVolume: 70,
      geographicConcentration: 81,
      semanticSimilarity: 86,
      recentGrowth: 82,
      severity: 68,
      overall: 71,
    },
    status: "Emerging",
    relatedComplaintIds: [],
    createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "sys_light_vad_3",
    category: "Street Lighting",
    areaId: "vad-gotri",
    areaName: "Gotri",
    ward: "Ward 3",
    city: "vadodara",
    complaintCount: 38,
    riskScore: 52,
    trendPct: -3,
    dominantIssue: "Street Lighting",
    possibleCause: "Multiple non-functional street lights in residential sector.",
    causeConfidence: 68,
    recommendedActions: ["Survey street light inventory", "Replace faulty units", "Test circuit"],
    whyFlagged: "38 reports describe dark streets with moderate clustering.",
    evidence: [
      { label: "Complaint Volume", value: "38 reports", detail: "Below critical threshold" },
      { label: "Geographic Concentration", value: "65%", detail: "Residential sector B" },
      { label: "Semantic Similarity", value: "77%", detail: "Non-functional light descriptions" },
      { label: "Recent Growth", value: "-3%", detail: "Slight decrease" },
    ],
    riskFactors: {
      complaintVolume: 48,
      geographicConcentration: 65,
      semanticSimilarity: 77,
      recentGrowth: 35,
      severity: 42,
      overall: 52,
    },
    status: "Monitoring",
    relatedComplaintIds: [],
    createdAt: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function generateComplaints(city: CityId): MuniComplaint[] {
  const areas = cityAreas(city);
  const categories = [
    "Water Supply",
    "Road Damage",
    "Garbage Collection",
    "Drainage",
    "Street Lighting",
    "Electricity",
    "Sanitation",
  ] as const;
  const severities = ["Low", "Moderate", "High", "Critical"] as const;
  const statuses = [
    "Received",
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed",
  ] as const;
  const departments = [
    "Municipal Water",
    "Public Works",
    "Sanitation",
    "Drainage",
    "Electrical",
    "Transport",
  ] as const;

  const complaints: MuniComplaint[] = [];
  for (let i = 0; i < 80; i++) {
    const area = areas[i % areas.length]!;
    const cat = categories[i % categories.length]!;
    const sev = severities[i % severities.length]!;
    const status = statuses[i % statuses.length]!;
    const dept =
      cat === "Water Supply"
        ? "Municipal Water"
        : cat === "Road Damage"
          ? "Public Works"
          : cat === "Garbage Collection" || cat === "Sanitation"
            ? "Sanitation"
            : cat === "Drainage"
              ? "Drainage"
              : cat === "Electricity" || cat === "Street Lighting"
                ? "Electrical"
                : "Transport";

    complaints.push({
      id: `JN-2026-${String(i + 1).padStart(5, "0")}`,
      description: RELATED_SAMPLES[i % RELATED_SAMPLES.length] ?? `Civic issue report #${i + 1}`,
      category: cat,
      severity: sev,
      area: area.name,
      ward: area.admin.division ?? "Ward —",
      city,
      department: dept,
      status,
      lat: area.center[0] + (Math.random() - 0.5) * 0.008,
      lng: area.center[1] + (Math.random() - 0.5) * 0.008,
      createdAt: new Date(now - 1000 * 60 * 60 * (i * 3 + 1)).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 30 * i).toISOString(),
      ...(i < 5 ? { clusterId: "sys_water_vad_14" } : {}),
      ...(i < 5 ? { similarity: 92 - i * 2 } : {}),
      aiAnalysis: {
        category: cat,
        severity: sev,
        sentiment: sev === "Critical" ? "Urgent" : "Negative",
        similarity: 75 + (i % 20),
        ...(i < 5 ? { cluster: "Water Supply cluster — Sarvodaya Nagar" } : {}),
      },
      timeline: [
        { label: "Received", at: new Date(now - 1000 * 60 * 60 * (i * 3 + 1)).toISOString() },
        {
          label: "AI classification complete",
          at: new Date(now - 1000 * 60 * 60 * (i * 3 + 1) + 120000).toISOString(),
        },
        ...(status !== "Received"
          ? [
              {
                label: "Assigned",
                at: new Date(now - 1000 * 60 * 60 * i).toISOString(),
                actor: dept,
              },
            ]
          : []),
        ...(status === "In Progress" || status === "Resolved" || status === "Closed"
          ? [{ label: "In Progress", at: new Date(now - 1000 * 60 * 30 * i).toISOString() }]
          : []),
        ...(status === "Resolved" || status === "Closed"
          ? [{ label: "Resolved", at: new Date(now - 1000 * 60 * 15 * i).toISOString() }]
          : []),
      ],
    });
  }
  return complaints;
}

export const SEED_MUNI_COMPLAINTS: MuniComplaint[] = [
  ...generateComplaints("vadodara"),
  ...generateComplaints("bengaluru").map((c, i) => ({
    ...c,
    id: `JN-2026-B${String(i + 1).padStart(4, "0")}`,
  })),
];

export const SEED_ALERTS: MuniAlert[] = SEED_SYSTEMIC_ISSUES.filter((s) => s.riskScore >= 40).map(
  (s, i) => ({
    id: `alert_${s.id}`,
    priority: s.riskScore >= 85 ? "Critical" : s.riskScore >= 70 ? "High" : "Moderate",
    category: s.category,
    area: s.areaName,
    ward: s.ward,
    city: s.city,
    complaintCount: s.complaintCount,
    riskScore: s.riskScore,
    trendPct: s.trendPct,
    issueId: s.id,
    acknowledged: i > 1,
    createdAt: s.updatedAt,
  }),
);

export const DEPARTMENT_STATS: DepartmentStats[] = [
  {
    id: "dept_water",
    name: "Municipal Water",
    open: 342,
    critical: 12,
    inProgress: 89,
    resolved: 1847,
    avgResponseDays: 2.4,
    emergingIssues: 3,
    categoryBreakdown: { "Water Supply": 312, Sewage: 30 },
  },
  {
    id: "dept_works",
    name: "Public Works",
    open: 278,
    critical: 8,
    inProgress: 67,
    resolved: 1523,
    avgResponseDays: 3.1,
    emergingIssues: 2,
    categoryBreakdown: { "Road Damage": 245, "Public Transport": 33 },
  },
  {
    id: "dept_sanitation",
    name: "Sanitation",
    open: 198,
    critical: 5,
    inProgress: 45,
    resolved: 1204,
    avgResponseDays: 1.8,
    emergingIssues: 2,
    categoryBreakdown: { "Garbage Collection": 156, Sanitation: 42 },
  },
  {
    id: "dept_drainage",
    name: "Drainage",
    open: 156,
    critical: 6,
    inProgress: 38,
    resolved: 987,
    avgResponseDays: 2.7,
    emergingIssues: 2,
    categoryBreakdown: { Drainage: 134, Sewage: 22 },
  },
  {
    id: "dept_electrical",
    name: "Electrical",
    open: 134,
    critical: 4,
    inProgress: 32,
    resolved: 876,
    avgResponseDays: 2.2,
    emergingIssues: 1,
    categoryBreakdown: { Electricity: 89, "Street Lighting": 45 },
  },
  {
    id: "dept_transport",
    name: "Transport",
    open: 89,
    critical: 2,
    inProgress: 21,
    resolved: 543,
    avgResponseDays: 3.5,
    emergingIssues: 1,
    categoryBreakdown: { "Public Transport": 89 },
  },
];

export function buildAreaOverviews(city: CityId): AreaOverview[] {
  return cityAreas(city).map((a, i) => {
    const reports = 20 + (i * 17) % 180;
    const critical = Math.floor(reports * 0.08);
    const risk = Math.min(100, Math.round(reports * 0.5 + critical * 3));
    const health =
      risk >= 85 ? "critical" : risk >= 62 ? "high" : risk >= 35 ? "moderate" : "low";
    return {
      id: a.id,
      name: a.name,
      ward: a.admin.division ?? "—",
      city,
      activity:
        health === "critical"
          ? "Critical"
          : health === "high"
            ? "High"
            : health === "moderate"
              ? "Moderate"
              : "Low",
      reports,
      critical,
      trendPct: -12 + (i * 7) % 45,
      topIssue: (["Water Supply", "Road Damage", "Garbage Collection", "Drainage"] as const)[
        i % 4
      ]!,
      risk,
      health,
    };
  });
}

export const SEED_NOTIFICATIONS: OfficerNotification[] = [
  {
    id: "n1",
    title: "New critical issue detected",
    body: "Water Supply hotspot in Sarvodaya Nagar — Risk 91",
    kind: "critical",
    read: false,
    at: new Date(now - 1000 * 60 * 5).toISOString(),
    link: "/issues/sys_water_vad_14",
  },
  {
    id: "n2",
    title: "Issue risk increased",
    body: "Drainage issue in Manjalpur: Risk 68 → 71",
    kind: "risk_increase",
    read: false,
    at: new Date(now - 1000 * 60 * 45).toISOString(),
    link: "/issues/sys_drain_vad_11",
  },
  {
    id: "n3",
    title: "Complaint cluster formed",
    body: "23 new Water Supply reports clustered in Ward 14",
    kind: "cluster",
    read: true,
    at: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n4",
    title: "Department assigned",
    body: "Road Damage issue assigned to Public Works",
    kind: "assignment",
    read: true,
    at: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "n5",
    title: "Investigation overdue",
    body: "Garbage Collection issue in Karelibaug — 48h without update",
    kind: "overdue",
    read: false,
    at: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export const SEED_LIVE_ACTIVITY: LiveActivity[] = [
  {
    id: "la1",
    type: "new_report",
    title: "NEW REPORT",
    subtitle: "Water Supply — Sarvodaya Nagar",
    detail: "Just now",
    at: new Date(now - 1000 * 30).toISOString(),
  },
  {
    id: "la2",
    type: "issue_updated",
    title: "SYSTEMIC ISSUE UPDATED",
    subtitle: "127 → 128 reports",
    detail: "Risk: 91 → 92",
    at: new Date(now - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "la3",
    type: "assignment",
    title: "DEPARTMENT ASSIGNED",
    subtitle: "Road Damage — Alkapuri",
    detail: "Public Works",
    at: new Date(now - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "la4",
    type: "alert",
    title: "CRITICAL ALERT",
    subtitle: "Drainage — Manjalpur",
    detail: "Risk 71 — +31% this week",
    at: new Date(now - 1000 * 60 * 15).toISOString(),
  },
];

export const TREND_ANALYSIS = [
  { category: "Water", change: 18 },
  { category: "Road", change: -7 },
  { category: "Garbage", change: 4 },
  { category: "Drainage", change: 31 },
  { category: "Lighting", change: -2 },
  { category: "Electricity", change: 6 },
];

export const HOTSPOT_RANKINGS = SEED_SYSTEMIC_ISSUES.slice()
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 8)
  .map((s, i) => ({
    rank: i + 1,
    category: s.category,
    area: s.areaName,
    reports: s.complaintCount,
    risk: s.riskScore,
    trend: s.trendPct,
    issueId: s.id,
  }));

/* ================================================================
   PHASE 4: New Seed Data — Contractors, Work Execution, Admin
   ================================================================ */

import type {
  AdminUser,
  AuditLog,
  Bill,
  Contractor,
  ContractorDocument,
  FieldProgress,
  Inspection,
  Measurement,
  SLARule,
  WorkOrder,
  WorkOrderEvent,
  WorkPackage,
} from "./types";

// ---------------------------------------------------------------- Admin User

export const DEMO_ADMIN_USER: AdminUser = {
  id: "admin_001",
  name: "Kavya Reddy",
  email: "kavya.reddy@janmind.gov.in",
  role: "admin",
  createdAt: new Date(now - 1000 * 60 * 60 * 24 * 90).toISOString(),
  lastActive: new Date().toISOString(),
};

// ---------------------------------------------------------------- Contractors

export const SEED_CONTRACTORS: Contractor[] = [
  {
    id: "CTR-001",
    companyName: "Bharat Infrastructure Pvt Ltd",
    registrationNumber: "GJ-REG-2018-00847",
    contactPerson: "Suresh Patel",
    email: "suresh.patel@bharatinfra.in",
    phone: "+91 98250 11234",
    address: "Plot 14, GIDC Makarpura, Vadodara, Gujarat 390010",
    gstin: "24AABCB1234F1Z5",
    pan: "AABCB1234F",
    status: "VERIFIED",
    verificationStatus: "VERIFIED",
    registrationDate: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3).toISOString(),
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 365 * 2).toISOString(),
    specializationCategories: ["Road Damage", "General Civil", "Drainage"],
    serviceAreas: ["vadodara", "bengaluru"],
    performanceScore: 94,
    slaScore: 96,
    inspectionPassRate: 91,
    onTimeCompletionRate: 94,
    reworkRate: 7,
    rating: 4.6,
    activeWorkCount: 2,
    totalCompleted: 47,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "CTR-002",
    companyName: "Sigma Civil Works",
    registrationNumber: "GJ-REG-2020-01293",
    contactPerson: "Ramesh Joshi",
    email: "ramesh@sigmacivil.co.in",
    phone: "+91 99099 55678",
    address: "12-A Industrial Area, Waghodia, Vadodara, Gujarat 391760",
    gstin: "24BBBCS9876G1Z2",
    pan: "BBBCS9876G",
    status: "VERIFIED",
    verificationStatus: "VERIFIED",
    registrationDate: new Date(now - 1000 * 60 * 60 * 24 * 365 * 1.5).toISOString(),
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 365).toISOString(),
    specializationCategories: ["Water Supply", "Drainage", "Sewage"],
    serviceAreas: ["vadodara"],
    performanceScore: 78,
    slaScore: 74,
    inspectionPassRate: 82,
    onTimeCompletionRate: 76,
    reworkRate: 16,
    rating: 3.9,
    activeWorkCount: 5,
    totalCompleted: 23,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 1.5).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "CTR-003",
    companyName: "Pioneer Constructions",
    registrationNumber: "GJ-REG-2022-02141",
    contactPerson: "Manish Shah",
    email: "manish@pioneerconstructions.in",
    phone: "+91 95101 77890",
    address: "56 New VIP Road, Baroda City, Gujarat 390021",
    gstin: "24CCCP2345H1Z8",
    pan: "CCCP2345H",
    status: "VERIFIED",
    verificationStatus: "VERIFIED",
    registrationDate: new Date(now - 1000 * 60 * 60 * 24 * 365 * 0.8).toISOString(),
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 180).toISOString(),
    specializationCategories: ["Garbage Collection", "Sanitation", "General Civil"],
    serviceAreas: ["vadodara"],
    performanceScore: 61,
    slaScore: 65,
    inspectionPassRate: 71,
    onTimeCompletionRate: 68,
    reworkRate: 24,
    rating: 3.4,
    activeWorkCount: 1,
    totalCompleted: 8,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 0.8).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "CTR-004",
    companyName: "Apex Road Solutions Pvt Ltd",
    registrationNumber: "KA-REG-2019-03389",
    contactPerson: "Arjun Nair",
    email: "arjun@apexroads.in",
    phone: "+91 98448 23456",
    address: "48 Industrial Layout, Peenya Phase 1, Bengaluru, Karnataka 560058",
    gstin: "29AAAPA7890I1Z1",
    pan: "AAAPA7890I",
    status: "VERIFIED",
    verificationStatus: "VERIFIED",
    registrationDate: new Date(now - 1000 * 60 * 60 * 24 * 365 * 2.5).toISOString(),
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 365 * 1.5).toISOString(),
    specializationCategories: ["Road Damage", "General Civil"],
    serviceAreas: ["bengaluru"],
    performanceScore: 88,
    slaScore: 90,
    inspectionPassRate: 88,
    onTimeCompletionRate: 91,
    reworkRate: 9,
    rating: 4.4,
    activeWorkCount: 3,
    totalCompleted: 34,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 2.5).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "CTR-005",
    companyName: "NovaTech Utilities",
    registrationNumber: "GJ-REG-2023-04567",
    contactPerson: "Priti Mehta",
    email: "priti@novatech-util.com",
    phone: "+91 97270 34567",
    address: "Unit 7, Synergy Business Park, Vadodara, Gujarat 390009",
    gstin: "24BBBCN5678J1Z3",
    pan: "BBBCN5678J",
    status: "PENDING_VERIFICATION",
    verificationStatus: "PENDING",
    registrationDate: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 335).toISOString(),
    specializationCategories: ["Street Lighting", "Electricity"],
    serviceAreas: ["vadodara"],
    performanceScore: 0,
    slaScore: 0,
    inspectionPassRate: 0,
    onTimeCompletionRate: 0,
    reworkRate: 0,
    rating: 0,
    activeWorkCount: 0,
    totalCompleted: 0,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

// ---------------------------------------------------------------- Contractor Documents

export const SEED_CONTRACTOR_DOCUMENTS: ContractorDocument[] = [
  {
    id: "doc_001",
    contractorId: "CTR-001",
    documentType: "Registration Certificate",
    documentName: "Company Registration — Bharat Infrastructure",
    fileUrl: "/documents/ctr001_reg.pdf",
    status: "VERIFIED",
    uploadedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3).toISOString(),
    verifiedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3 + 1000 * 60 * 60 * 24).toISOString(),
    verifiedBy: "admin_001",
  },
  {
    id: "doc_002",
    contractorId: "CTR-001",
    documentType: "GST Certificate",
    documentName: "GST Registration — Bharat Infrastructure",
    fileUrl: "/documents/ctr001_gst.pdf",
    status: "VERIFIED",
    uploadedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3).toISOString(),
    verifiedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3 + 1000 * 60 * 60 * 24).toISOString(),
    verifiedBy: "admin_001",
    expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 365 * 2).toISOString(),
  },
  {
    id: "doc_003",
    contractorId: "CTR-001",
    documentType: "Experience Certificate",
    documentName: "Road Construction Experience — 3 Years",
    fileUrl: "/documents/ctr001_exp.pdf",
    status: "VERIFIED",
    uploadedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 2).toISOString(),
    verifiedAt: new Date(now - 1000 * 60 * 60 * 24 * 365 * 2 + 1000 * 60 * 60 * 48).toISOString(),
    verifiedBy: "admin_001",
  },
  {
    id: "doc_004",
    contractorId: "CTR-005",
    documentType: "Registration Certificate",
    documentName: "Company Registration — NovaTech Utilities",
    fileUrl: "/documents/ctr005_reg.pdf",
    status: "PENDING",
    uploadedAt: new Date(now - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: "doc_005",
    contractorId: "CTR-005",
    documentType: "GST Certificate",
    documentName: "GST Registration — NovaTech Utilities",
    fileUrl: "/documents/ctr005_gst.pdf",
    status: "PENDING",
    uploadedAt: new Date(now - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
];

// ---------------------------------------------------------------- Work Packages

export const SEED_WORK_PACKAGES: WorkPackage[] = [
  {
    id: "WP-2026-00001",
    title: "Road Repair — Ward 14, Sarvodaya Nagar",
    description:
      "Pothole patching and road resurfacing on the stretch between Sarvodaya Nagar main road and the school junction. Multiple complaints indicate surface failure over a 400m stretch.",
    category: "Road Damage",
    department: "Public Works",
    cityId: "vadodara",
    ward: "Ward 14",
    area: "Sarvodaya Nagar",
    lat: 22.3072,
    lng: 73.1812,
    relatedComplaintIds: ["JN-2026-00094", "JN-2026-00095", "JN-2026-00096", "JN-2026-00097"],
    estimatedCost: 850000,
    priority: "High",
    scope:
      "1. Pothole patching (approx. 40 potholes, avg depth 8cm)\n2. Surface milling and relaying for 400m × 7m carriageway\n3. Edge repair and kerb restoration\n4. Road marking reinstatement",
    status: "IN_EXECUTION",
    workOrderId: "WO-2026-00001",
    createdBy: "off_001",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "WP-2026-00002",
    title: "Drainage Clearance — Ward 11, Manjalpur",
    description:
      "Storm drain network inspection and clearance in Manjalpur area. 54 complaints of waterlogging indicate systemic blockage.",
    category: "Drainage",
    department: "Drainage",
    cityId: "vadodara",
    ward: "Ward 11",
    area: "Manjalpur",
    lat: 22.2793,
    lng: 73.1932,
    relatedComplaintIds: [],
    relatedSystemicIssueId: "sys_drain_vad_11",
    estimatedCost: 320000,
    priority: "High",
    scope:
      "1. CCTV inspection of 600m drain network\n2. Manual desilting and clearance\n3. Manhole covers inspection and replacement\n4. Junction chamber cleaning",
    status: "CONTRACTOR_SELECTION",
    createdBy: "off_001",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "WP-2026-00003",
    title: "Garbage Collection Route Restoration — Ward 6",
    description: "Resumption and regularization of garbage collection schedule in Karelibaug.",
    category: "Garbage Collection",
    department: "Sanitation",
    cityId: "vadodara",
    ward: "Ward 6",
    area: "Karelibaug",
    lat: 22.3262,
    lng: 73.1994,
    relatedComplaintIds: ["JN-2026-00061"],
    estimatedCost: 180000,
    priority: "Moderate",
    scope: "1. Additional pickup vehicle deployment for 30 days\n2. Route optimization\n3. Resident communication",
    status: "OPEN",
    createdBy: "off_001",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ---------------------------------------------------------------- Work Orders

export const SEED_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-2026-00001",
    workPackageId: "WP-2026-00001",
    contractorId: "CTR-001",
    contractorName: "Bharat Infrastructure Pvt Ltd",
    assignedEngineerId: "off_001",
    assignedEngineerName: "Priya Sharma",
    departmentId: "dept_works",
    department: "Public Works",
    title: "Road Repair — Ward 14, Sarvodaya Nagar (WO)",
    description:
      "Pothole patching and road resurfacing — 400m stretch, Ward 14. Reference Work Package WP-2026-00001.",
    cityId: "vadodara",
    ward: "Ward 14",
    area: "Sarvodaya Nagar",
    lat: 22.3072,
    lng: 73.1812,
    priority: "High",
    estimatedCost: 850000,
    approvedAmount: 820000,
    startDate: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    expectedCompletionDate: new Date(now + 1000 * 60 * 60 * 24 * 10).toISOString(),
    actualStartDate: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    slaDeadline: new Date(now + 1000 * 60 * 60 * 24 * 14).toISOString(),
    status: "IN_PROGRESS",
    boqItems: [
      {
        id: "boq_1",
        description: "Pothole patching with bituminous macadam",
        unit: "sqm",
        quantity: 280,
        unitRate: 1200,
        amount: 336000,
      },
      {
        id: "boq_2",
        description: "Road milling and surface relaying",
        unit: "sqm",
        quantity: 2800,
        unitRate: 180,
        amount: 504000,
      },
      {
        id: "boq_3",
        description: "Road marking reinstatement",
        unit: "m",
        quantity: 400,
        unitRate: 100,
        amount: 40000,
      },
    ],
    terms:
      "Work to be completed within 14 days of acceptance. Daily progress reports required. Inspection by municipal engineer prior to payment.",
    relatedComplaintIds: ["JN-2026-00094", "JN-2026-00095", "JN-2026-00096", "JN-2026-00097"],
    createdBy: "off_001",
    approvedBy: "off_001",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ---------------------------------------------------------------- Work Order Events (Demo timeline)

export const SEED_WORK_ORDER_EVENTS: WorkOrderEvent[] = [
  {
    id: "evt_001",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    toStatus: "DRAFT",
    title: "Work Order Created",
    description: "Work order created and assigned to Bharat Infrastructure Pvt Ltd.",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    at: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "evt_002",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    fromStatus: "DRAFT",
    toStatus: "APPROVED",
    title: "Work Order Approved",
    description: "Work order reviewed and approved. Approved amount: ₹8,20,000.",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "supervisor",
    metadata: { approvedAmount: 820000 },
    at: new Date(now - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 30).toISOString(),
  },
  {
    id: "evt_003",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    fromStatus: "APPROVED",
    toStatus: "PENDING_ACCEPTANCE",
    title: "Sent to Contractor for Acceptance",
    description: "Work order dispatched to Bharat Infrastructure Pvt Ltd for review and acceptance.",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    at: new Date(now - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60).toISOString(),
  },
  {
    id: "evt_004",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    fromStatus: "PENDING_ACCEPTANCE",
    toStatus: "ACCEPTED",
    title: "Work Order Accepted",
    description: "Bharat Infrastructure Pvt Ltd has accepted the work order.",
    actorId: "CTR-001",
    actorName: "Suresh Patel",
    actorRole: "contractor",
    at: new Date(now - 1000 * 60 * 60 * 24 * 3.5).toISOString(),
  },
  {
    id: "evt_005",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    fromStatus: "ACCEPTED",
    toStatus: "MOBILIZATION",
    title: "Mobilization Started",
    description: "Equipment and material mobilization begun at site.",
    actorId: "CTR-001",
    actorName: "Suresh Patel",
    actorRole: "contractor",
    gpsLat: 22.3075,
    gpsLng: 73.1815,
    at: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "evt_006",
    workOrderId: "WO-2026-00001",
    eventType: "STATUS_CHANGE",
    fromStatus: "MOBILIZATION",
    toStatus: "IN_PROGRESS",
    title: "Work Started",
    description: "Pothole patching work commenced on Sarvodaya Nagar main road.",
    actorId: "CTR-001",
    actorName: "Suresh Patel",
    actorRole: "contractor",
    gpsLat: 22.3072,
    gpsLng: 73.1812,
    at: new Date(now - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "evt_007",
    workOrderId: "WO-2026-00001",
    eventType: "PROGRESS_UPDATE",
    title: "Progress Update: 35% complete",
    description: "Pothole patching 60% done. Road milling starting tomorrow.",
    actorId: "CTR-001",
    actorName: "Suresh Patel",
    actorRole: "contractor",
    metadata: { percentComplete: 35 },
    gpsLat: 22.3072,
    gpsLng: 73.1812,
    at: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ---------------------------------------------------------------- Seed Inspections (empty — to be created in demo)

export const SEED_INSPECTIONS: Inspection[] = [];

// ---------------------------------------------------------------- Seed Measurements (empty)

export const SEED_MEASUREMENTS: Measurement[] = [];

// ---------------------------------------------------------------- Seed Bills (empty)

export const SEED_BILLS: Bill[] = [];

// ---------------------------------------------------------------- Seed Field Progress

export const SEED_FIELD_PROGRESS: FieldProgress[] = [
  {
    id: "fp_001",
    workOrderId: "WO-2026-00001",
    progressType: "START",
    percentComplete: 0,
    description: "Work commenced at site. Equipment mobilized. Team of 12 workers deployed.",
    photoUrls: [],
    gpsLat: 22.3072,
    gpsLng: 73.1812,
    submittedBy: "Suresh Patel",
    submittedAt: new Date(now - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "fp_002",
    workOrderId: "WO-2026-00001",
    progressType: "PROGRESS",
    percentComplete: 35,
    description: "Pothole patching complete on 60% of affected stretch. Road milling equipment arriving tomorrow.",
    photoUrls: [],
    gpsLat: 22.3072,
    gpsLng: 73.1812,
    materialUsed: "Bituminous Macadam Mix: 4.2 MT used",
    submittedBy: "Suresh Patel",
    submittedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// ---------------------------------------------------------------- Audit Logs

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit_001",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    action: "COMPLAINT_ASSIGNED",
    entityType: "complaint",
    entityId: "JN-2026-00094",
    entityLabel: "JN-2026-00094 — Road Damage",
    previousValue: "Received",
    newValue: "Assigned — Public Works",
    at: new Date(now - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "audit_002",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    action: "WORK_PACKAGE_CREATED",
    entityType: "work_package",
    entityId: "WP-2026-00001",
    entityLabel: "WP-2026-00001 — Road Repair Ward 14",
    at: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "audit_003",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    action: "CONTRACTOR_SELECTED",
    entityType: "work_order",
    entityId: "WO-2026-00001",
    entityLabel: "WO-2026-00001",
    newValue: "Bharat Infrastructure Pvt Ltd",
    at: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "audit_004",
    actorId: "off_001",
    actorName: "Priya Sharma",
    actorRole: "officer",
    action: "WORK_ORDER_CREATED",
    entityType: "work_order",
    entityId: "WO-2026-00001",
    entityLabel: "WO-2026-00001 — Road Repair Ward 14",
    at: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "audit_005",
    actorId: "admin_001",
    actorName: "Kavya Reddy",
    actorRole: "admin",
    action: "CONTRACTOR_VERIFIED",
    entityType: "contractor",
    entityId: "CTR-001",
    entityLabel: "Bharat Infrastructure Pvt Ltd",
    at: new Date(now - 1000 * 60 * 60 * 24 * 365 * 3 + 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "audit_006",
    actorId: "admin_001",
    actorName: "Kavya Reddy",
    actorRole: "admin",
    action: "SLA_RULE_CHANGED",
    entityType: "sla",
    entityId: "sla_road_high",
    entityLabel: "Road Damage / High",
    previousValue: "72 hours",
    newValue: "48 hours",
    at: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

// ---------------------------------------------------------------- SLA Rules

export const SEED_SLA_RULES: SLARule[] = [
  { id: "sla_water_critical", category: "Water Supply", severity: "Critical", responseHours: 4, resolutionHours: 24, escalationHours: 12, active: true },
  { id: "sla_water_high", category: "Water Supply", severity: "High", responseHours: 8, resolutionHours: 48, escalationHours: 24, active: true },
  { id: "sla_water_moderate", category: "Water Supply", severity: "Moderate", responseHours: 24, resolutionHours: 72, escalationHours: 48, active: true },
  { id: "sla_water_low", category: "Water Supply", severity: "Low", responseHours: 48, resolutionHours: 120, escalationHours: 96, active: true },
  { id: "sla_road_critical", category: "Road Damage", severity: "Critical", responseHours: 4, resolutionHours: 24, escalationHours: 12, active: true },
  { id: "sla_road_high", category: "Road Damage", severity: "High", responseHours: 12, resolutionHours: 48, escalationHours: 24, active: true },
  { id: "sla_road_moderate", category: "Road Damage", severity: "Moderate", responseHours: 24, resolutionHours: 96, escalationHours: 48, active: true },
  { id: "sla_road_low", category: "Road Damage", severity: "Low", responseHours: 72, resolutionHours: 168, escalationHours: 120, active: true },
  { id: "sla_garbage_critical", category: "Garbage Collection", severity: "Critical", responseHours: 8, resolutionHours: 24, escalationHours: 16, active: true },
  { id: "sla_garbage_high", category: "Garbage Collection", severity: "High", responseHours: 24, resolutionHours: 48, escalationHours: 36, active: true },
  { id: "sla_garbage_moderate", category: "Garbage Collection", severity: "Moderate", responseHours: 48, resolutionHours: 72, escalationHours: 60, active: true },
  { id: "sla_garbage_low", category: "Garbage Collection", severity: "Low", responseHours: 72, resolutionHours: 120, escalationHours: 96, active: true },
  { id: "sla_drain_critical", category: "Drainage", severity: "Critical", responseHours: 4, resolutionHours: 24, escalationHours: 8, active: true },
  { id: "sla_drain_high", category: "Drainage", severity: "High", responseHours: 12, resolutionHours: 72, escalationHours: 36, active: true },
  { id: "sla_drain_moderate", category: "Drainage", severity: "Moderate", responseHours: 24, resolutionHours: 96, escalationHours: 48, active: true },
  { id: "sla_drain_low", category: "Drainage", severity: "Low", responseHours: 72, resolutionHours: 168, escalationHours: 120, active: true },
  { id: "sla_light_critical", category: "Street Lighting", severity: "Critical", responseHours: 4, resolutionHours: 48, escalationHours: 24, active: true },
  { id: "sla_light_high", category: "Street Lighting", severity: "High", responseHours: 24, resolutionHours: 72, escalationHours: 48, active: true },
  { id: "sla_light_moderate", category: "Street Lighting", severity: "Moderate", responseHours: 48, resolutionHours: 120, escalationHours: 72, active: true },
  { id: "sla_light_low", category: "Street Lighting", severity: "Low", responseHours: 72, resolutionHours: 168, escalationHours: 120, active: true },
  { id: "sla_elec_critical", category: "Electricity", severity: "Critical", responseHours: 2, resolutionHours: 12, escalationHours: 6, active: true },
  { id: "sla_elec_high", category: "Electricity", severity: "High", responseHours: 8, resolutionHours: 48, escalationHours: 24, active: true },
  { id: "sla_elec_moderate", category: "Electricity", severity: "Moderate", responseHours: 24, resolutionHours: 72, escalationHours: 48, active: true },
  { id: "sla_elec_low", category: "Electricity", severity: "Low", responseHours: 48, resolutionHours: 120, escalationHours: 96, active: true },
  { id: "sla_san_critical", category: "Sanitation", severity: "Critical", responseHours: 4, resolutionHours: 24, escalationHours: 12, active: true },
  { id: "sla_san_high", category: "Sanitation", severity: "High", responseHours: 24, resolutionHours: 48, escalationHours: 36, active: true },
  { id: "sla_san_moderate", category: "Sanitation", severity: "Moderate", responseHours: 48, resolutionHours: 96, escalationHours: 72, active: true },
  { id: "sla_san_low", category: "Sanitation", severity: "Low", responseHours: 72, resolutionHours: 168, escalationHours: 120, active: true },
];

