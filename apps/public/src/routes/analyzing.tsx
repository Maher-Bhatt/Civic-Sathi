import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles, MapPin, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { ErrorState } from "@/components/ui/states";
import { ClientCityMap } from "@/components/city-map-panel";
import { analyzeComplaint, createComplaint, detectDuplicateIssues, createCivicIssue, linkToCivicIssue } from "@/services/api";
import { clustersForCity, nearestCity } from "@/services/cities";
import type { AnalysisResult, Complaint } from "@/services/types";
import { clearDraft, loadDraft } from "@/lib/report-draft";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyzing")({
  head: () => ({
    meta: [
      { title: "Analyzing your report — JANMIND" },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/report">
      <AnalyzingPage />
    </AuthGate>
  ),
});

const STAGES = [
  "Understanding complaint",
  "Detecting civic category",
  "Evaluating severity",
  "Checking location",
  "Scanning for duplicate reports",
  "Preparing your report",
];

function AnalyzingPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [draftData, setDraftData] = useState<any>(null);
  const [error, setError] = useState(false);
  const started = useRef(false);

  async function run() {
    setError(false);
    setStage(0);
    const draft = loadDraft();
    if (!draft.description) {
      navigate({ to: "/report" });
      return;
    }
    
    setDraftData(draft);

    const timer = window.setInterval(
      () => setStage((s) => Math.min(STAGES.length - 2, s + 1)), // stop before the last stage
      450,
    );
    try {
      const analysis = await analyzeComplaint({
        description: draft.description,
        location: draft.location,
        imageCategory: draft.category,
      });
      setResult(analysis);

      // Call detect duplicate issues
      if (draft.location) {
        const matches = await detectDuplicateIssues({
          lat: draft.location.lat,
          lng: draft.location.lng,
          category: analysis.category,
          description: draft.description,
        });

        if (matches.length > 0) {
          window.clearInterval(timer);
          setStage(4); // Scanning for duplicates
          setDuplicates(matches);
          return; // Pause here! Wait for user input.
        }
      }

      // No duplicates found, proceed automatically
      await proceedWithNewIssue(draft, analysis);
      window.clearInterval(timer);
    } catch (err) {
      console.error(err);
      window.clearInterval(timer);
      setError(true);
    }
  }

  async function proceedWithNewIssue(draft: any, analysis: AnalysisResult) {
    setStage(STAGES.length - 1);
    const created = await createComplaint({
      description: draft.description,
      category: analysis.category,
      severity: analysis.severity,
      location: analysis.location,
      photo: draft.photo,
      relatedCount: analysis.relatedCount,
      nearbyCount: analysis.nearbyCount,
    });
    
    // Create new CivicIssue
    const issue = await createCivicIssue({
      title: `${analysis.category} at ${analysis.location.ward}`,
      category: analysis.category,
      description: draft.description,
      lat: analysis.location.lat,
      lng: analysis.location.lng,
      ward: analysis.location.ward,
      area: analysis.location.area,
      cityId: "vadodara",
      status: "OPEN",
      priority: analysis.severity,
      severity: analysis.severity,
      impactScore: 10,
      reportCount: 0,
      uniqueReporterCount: 0,
      confirmationCount: 0,
      firstReportedAt: new Date().toISOString(),
      lastReportedAt: new Date().toISOString(),
    });

    // Link it
    await linkToCivicIssue(issue.id, created.id, "PRIMARY_REPORT", 100, "Citizen");

    setComplaint(created);
    setStage(STAGES.length);
    clearDraft();
  }

  async function handleLinkExisting(match: any) {
    setStage(STAGES.length - 1);
    setDuplicates([]);
    const created = await createComplaint({
      description: draftData.description,
      category: result!.category,
      severity: result!.severity,
      location: result!.location,
      photo: draftData.photo,
      relatedCount: result!.relatedCount,
      nearbyCount: result!.nearbyCount,
    });
    
    await linkToCivicIssue(match.issue.id, created.id, "DUPLICATE", match.confidence, "Citizen");
    
    setComplaint(created);
    setStage(STAGES.length);
    clearDraft();
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <PageShell className="max-w-2xl">
        <ErrorState
          title="We couldn't analyze your report right now."
          description="Your description is safe. Try again in a moment."
          onRetry={() => void run()}
        />
      </PageShell>
    );
  }

  // --- STAGE 2: DUPLICATES FOUND UI ---
  if (duplicates.length > 0 && result) {
    return (
      <PageShell className="max-w-3xl">
        <div className="animate-rise space-y-2">
          <SectionLabel className="text-warning">Wait a moment</SectionLabel>
          <h1 className="text-2xl font-semibold sm:text-3xl">Similar issues found nearby</h1>
          <p className="text-muted-foreground">JANMIND has detected existing active reports in this exact location that match your description. Are you reporting the same problem?</p>
        </div>
        
        <div className="animate-rise mt-8 space-y-4">
          {duplicates.map(match => (
            <GlassCard key={match.issue.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-[color-mix(in_oklab,var(--primary)_30%,transparent)]">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={match.issue.severity} />
                  <span className="text-sm font-medium text-foreground">{match.issue.category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{match.distance}m away</span>
                </div>
                <p className="text-sm text-subtle line-clamp-2">{match.issue.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {match.issue.reportCount} other reports</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {match.issue.ward}</span>
                </div>
              </div>
              <div className="sm:border-l border-border sm:pl-5 sm:ml-2">
                <GlassButton variant="primary" className="w-full sm:w-auto" onClick={() => handleLinkExisting(match)}>
                  Yes, I'm also affected
                </GlassButton>
              </div>
            </GlassCard>
          ))}
          
          <div className="pt-6 border-t border-border flex flex-col items-center justify-center">
            <p className="text-sm text-subtle mb-3">Is your issue completely different?</p>
            <GlassButton variant="ghost" onClick={() => proceedWithNewIssue(draftData, result)}>
              No, report as a new issue
            </GlassButton>
          </div>
        </div>
      </PageShell>
    );
  }

  // --- STAGE 3: SUCCESS UI ---
  if (result && complaint && stage === STAGES.length) {
    return (
      <PageShell className="max-w-3xl">
        <div className="animate-rise space-y-2">
          <SectionLabel>Your report</SectionLabel>
          <h1 className="text-2xl font-semibold sm:text-3xl">Analysis complete</h1>
        </div>

        <GlassCard elevation="raised" className="animate-rise mt-6 space-y-6 p-5 sm:p-7">
          <p className="text-[0.98rem] leading-relaxed">{complaint.description}</p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="label-xs">AI-suggested category</dt>
              <dd className="mt-1.5 text-sm font-medium">{result.category}</dd>
            </div>
            <div>
              <dt className="label-xs">Severity</dt>
              <dd className="mt-1.5">
                <SeverityBadge severity={result.severity} />
              </dd>
            </div>
            <div>
              <dt className="label-xs">Location</dt>
              <dd className="mt-1.5 text-sm font-medium">{result.location.ward}</dd>
            </div>
          </dl>
        </GlassCard>

        <GlassCard elevation="raised" className="animate-rise mt-5 space-y-5 p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <SectionLabel>Complaint received</SectionLabel>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your report is now on record and routed for review.
              </p>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-4">
            <div>
              <dt className="label-xs">Complaint ID</dt>
              <dd className="mt-1.5 text-sm font-medium tabular-nums">{complaint.id}</dd>
            </div>
            <div>
              <dt className="label-xs">Category</dt>
              <dd className="mt-1.5 text-sm font-medium">{complaint.category}</dd>
            </div>
            <div>
              <dt className="label-xs">Location</dt>
              <dd className="mt-1.5 text-sm font-medium">{complaint.location.ward}</dd>
            </div>
            <div>
              <dt className="label-xs">Status</dt>
              <dd className="mt-1.5">
                <StatusBadge status={complaint.status} />
              </dd>
            </div>
          </dl>
          <GlassButton asChild>
            <Link to="/complaint/$id" params={{ id: complaint.id }}>
              Track complaint
            </Link>
          </GlassButton>
        </GlassCard>
      </PageShell>
    );
  }

  // --- STAGE 1: LOADING UI ---
  return (
    <PageShell className="max-w-xl">
      <GlassCard elevation="raised" className="animate-rise p-7 sm:p-9">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 animate-pulse text-primary" aria-hidden />
          <SectionLabel>JANMIND Intelligence</SectionLabel>
        </div>
        <h1 className="mt-4 text-xl font-semibold">Analyzing your report...</h1>
        <ul className="mt-7 space-y-3.5" aria-live="polite">
          {STAGES.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300",
                  i < stage
                    ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary"
                    : "border-border text-subtle",
                )}
              >
                {i < stage ? (
                  <Check className="h-3.5 w-3.5" />
                ) : i === stage ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-current" />
                )}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors duration-300",
                  i < stage ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-7 h-1 overflow-hidden rounded-full bg-[var(--glass-strong)]">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${(stage / STAGES.length) * 100}%` }}
          />
        </div>
      </GlassCard>
    </PageShell>
  );
}
