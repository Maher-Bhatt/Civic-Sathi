import type { AnalysisResult, IssueCategory, LocationInfo, Severity } from "@/services/types";
import type { CityId } from "@/services/cities";

export interface ReportDraft {
  description: string;
  location: LocationInfo | null;
  marker: { lat: number; lng: number } | null;
  city: CityId;
  photo: string | null;
  category: IssueCategory | null;
  severity: Severity | null;
  analysis: AnalysisResult | null;
  complaintId?: string;
}

const KEY = "janmind.draft";

export const emptyDraft: ReportDraft = {
  description: "",
  location: null,
  marker: null,
  city: "vadodara",
  photo: null,
  category: null,
  severity: null,
  analysis: null,
};

export function loadDraft(): ReportDraft {
  if (typeof window === "undefined") return emptyDraft;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...emptyDraft, ...(JSON.parse(raw) as ReportDraft) } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

export function saveDraft(draft: ReportDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* quota exceeded — photo too large */
  }
}

export function clearDraft() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(KEY);
}
