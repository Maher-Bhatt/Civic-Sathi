import type {
  AppNotification,
  Complaint,
  IssueCategory,
  LocationInfo,
  NearbyReport,
  Severity,
  TimelineEvent,
  
} from "./types";

/**
 * Centralised prototype data. Everything here is mock content used until the
 * Civic Sathi backend is connected. Do not scatter mock data across components.
 */

export const WARD_14: LocationInfo = {
  lat: 22.3072,
  lng: 73.1812,
  ward: "Ward 14",
  area: "Sarvodaya Nagar, Ward 14",
  city: "Vadodara",
};



export const RELATED_SAMPLES = [
  "No water supply since Monday.",
  "Water has stopped in our neighborhood.",
  "Our taps have been dry for three days.",
  "No municipal water reaching our apartment.",
];

export const CATEGORY_KEYWORDS: Array<{ category: IssueCategory; words: string[] }> = [
  {
    category: "Water Supply",
    words: ["water", "tap", "supply", "pipeline", "borewell", "dry"],
  },
  { category: "Road Damage", words: ["road", "pothole", "asphalt", "street surface", "crack"] },
  { category: "Garbage Collection", words: ["garbage", "trash", "waste", "bin", "dump", "litter"] },
  { category: "Drainage", words: ["drain", "waterlogging", "flood", "clogged", "overflow"] },
  { category: "Sewage", words: ["sewage", "sewer", "manhole", "septic", "smell"] },
  { category: "Street Lighting", words: ["light", "lamp", "streetlight", "dark", "pole"] },
  { category: "Electricity", words: ["electricity", "power", "outage", "transformer", "voltage"] },
  { category: "Public Transport", words: ["bus", "transport", "stop", "metro", "auto"] },
  { category: "Sanitation", words: ["toilet", "sanitation", "cleaning", "hygiene", "public wash"] },
];

export const SEVERITY_KEYWORDS: Array<{ severity: Severity; words: string[] }> = [
  { severity: "Critical", words: ["danger", "accident", "collapse", "emergency", "injury"] },
  { severity: "High", words: ["three days", "days", "week", "no water", "no power", "children"] },
  { severity: "Moderate", words: ["often", "sometimes", "slow", "delay"] },
];

function timeline(stage: number): TimelineEvent[] {
  const steps: Array<[string, string]> = [
    ["Submitted", "Your report was received by Civic Sathi."],
    ["Civic Sathi analyzed", "Category, severity and location pattern detected."],
    ["Municipality received", "Forwarded to the responsible civic department."],
    ["Officer assigned", "A field officer has been allocated."],
    ["In progress", "Work has started on the ground."],
    ["Resolved", "The civic department marked this issue resolved."],
  ];
  const base = Date.now() - 1000 * 60 * 60 * 26;
  return steps.map(([label, description], i) => ({
    label,
    description,
    done: i <= stage,
    at: i <= stage ? new Date(base + i * 1000 * 60 * 90).toISOString() : null,
  }));
}

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "JN-2026-00127",
    description: "There has been no water supply in our area for three days.",
    category: "Water Supply",
    severity: "High",
    location: WARD_14,
    photo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "Assigned",
    relatedCount: 127,
    nearbyCount: 23,
    relatedComplaints: [],
    matchingState: "complete",
    timeline: timeline(3),
  },
  {
    id: "JN-2026-00094",
    description: "Large pothole near the school gate, two-wheelers keep skidding.",
    category: "Road Damage",
    severity: "Moderate",
    location: { ...WARD_14, area: "Nehru Road, Ward 14" },
    photo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "In Progress",
    relatedCount: 18,
    nearbyCount: 6,
    relatedComplaints: [],
    matchingState: "complete",
    timeline: timeline(4),
  },
  {
    id: "JN-2026-00061",
    description: "Garbage has not been collected from our lane for over a week.",
    category: "Garbage Collection",
    severity: "Moderate",
    location: { ...WARD_14, ward: "Ward 12", area: "Kotharia Lane, Ward 12" },
    photo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    status: "Resolved",
    relatedCount: 41,
    nearbyCount: 9,
    relatedComplaints: [],
    matchingState: "complete",
    timeline: timeline(5),
  },
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf_1",
    title: "Officer assigned",
    body: "A field officer from the Water Works department was assigned to JN-2026-00127.",
    complaintId: "JN-2026-00127",
    at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    kind: "assigned",
    read: false,
  },
  {
    id: "ntf_2",
    title: "Pattern detected near you",
    body: "23 similar Water Supply reports were detected within approximately 500m of your report.",
    complaintId: "JN-2026-00127",
    at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    kind: "status",
    read: false,
  },
  {
    id: "ntf_3",
    title: "Status changed to In Progress",
    body: "Road resurfacing work has started for JN-2026-00094.",
    complaintId: "JN-2026-00094",
    at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    kind: "status",
    read: true,
  },
  {
    id: "ntf_4",
    title: "Complaint resolved",
    body: "JN-2026-00061 was marked resolved by the sanitation department.",
    complaintId: "JN-2026-00061",
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    kind: "resolution",
    read: true,
  },
];

/** Aggregated, de-identified nearby activity used by the schematic map. */
function seededReports(): NearbyReport[] {
  const out: NearbyReport[] = [];
  const hotspot = { x: 0.63, y: 0.42 };
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 0.03 + ((i * 37) % 11) / 220;
    out.push({
      id: `h${i}`,
      category: "Water Supply",
      severity: i % 4 === 0 ? "Critical" : "High",
      x: hotspot.x + Math.cos(a) * r * 1.5,
      y: hotspot.y + Math.sin(a) * r,
      ageHours: 2 + i * 3,
    });
  }
  const scatter: Array<[number, number, IssueCategory, Severity]> = [
    [0.16, 0.22, "Road Damage", "Moderate"],
    [0.27, 0.68, "Garbage Collection", "Low"],
    [0.38, 0.34, "Street Lighting", "Low"],
    [0.82, 0.74, "Drainage", "Moderate"],
    [0.72, 0.16, "Sanitation", "Low"],
    [0.46, 0.82, "Electricity", "Moderate"],
    [0.9, 0.36, "Public Transport", "Low"],
    [0.1, 0.52, "Sewage", "Moderate"],
  ];
  scatter.forEach(([x, y, category, severity], i) =>
    out.push({ id: `s${i}`, x, y, category, severity, ageHours: 12 + i * 9 }),
  );
  return out;
}

export const NEARBY_REPORTS: NearbyReport[] = seededReports();

export const HOTSPOT_CENTER = { x: 0.63, y: 0.42 };
