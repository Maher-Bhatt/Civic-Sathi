import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  Zap,
  Clock,
  Layers,
  Loader2,
  Building2,
  Droplets,
  Construction,
  Waves,
  Cpu,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput, GlassTextarea } from "@/components/ui/glass-input";
import { analyzeMultiDeptCase, createMasterCase } from "@/services/api";
import type { MultiDeptAnalysisResult } from "@/services/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { FeatureExplainerBanner } from "@/components/feature-explainer-banner";

export const Route = createFileRoute("/admin/smart-composer")({
  head: () => ({
    meta: [
      { title: "AI Multi-Department Case Composer — Civic Sathi" },
      {
        name: "description",
        content:
          "AI-driven macro interoperability platform for Government of Maharashtra (SIH26129). Automatically sequences multi-departmental civic emergencies.",
      },
    ],
  }),
  component: SubmitPage,
});

const DEMO_PRESETS = [
  {
    label: "Water Main Burst & Road Cave-in",
    city: "Mumbai",
    location: "SV Road, Near Bandra Station West, Mumbai",
    lat: 19.0596,
    lng: 72.8397,
    title: "High-Pressure Water Conduit Rupture Causing Road Subsidence",
    description:
      "A massive 300mm underground municipal water main has burst beneath the asphalt on SV Road outside Bandra Station. High-pressure drinking water is gushing onto the carriageway, causing sub-base soil erosion, a 4-foot deep crater, and severe asphalt subsidence. PWD road repairs cannot be initiated until the Water Supply Board excavates the utility trench, replaces the ductile iron pipe sleeve, and executes pressure testing.",
    icon: Droplets,
    badge: "Dual Dept: Water + Roads",
  },
  {
    label: "Storm Drain Choke & Power Outage",
    city: "Mumbai",
    location: "Dadar TT Circle, Dr. Ambedkar Road, Mumbai",
    lat: 19.0178,
    lng: 72.8478,
    title: "Choked Culvert Inundating Carriageway and Streetlight Junction",
    description:
      "Heavy silt and plastic debris have completely choked the primary stormwater culvert at Dadar TT Circle. Waterlogging has risen above 1.5 feet across the roadway, flooding the underground MSEDCL streetlight junction feeder box. Risk of electrical grounding hazard. SWD Drainage must deploy super-sucker de-silting machines before MSEDCL technicians can safely inspect the submerged feeder.",
    icon: Waves,
    badge: "Multi Dept: Drainage + Power + Roads",
  },
  {
    label: "Pipe Joint Rupture & Pavement Collapse",
    city: "Pune",
    location: "FC Road, Deccan Gymkhana, Shivajinagar, Pune",
    lat: 18.5204,
    lng: 73.8567,
    title: "Drinking Water Pipeline Leakage with Footpath Erosion",
    description:
      "Continuous underground distribution pipe leak has undermined the pedestrian pavement along FC Road. Interlocking concrete tiles have collapsed into an eroded void. Water Supply Department must seal the distribution joint before PWD road engineers can reconstitute the pedestrian walkway.",
    icon: Construction,
    badge: "Dual Dept: Water + Roads (Pune)",
  },
];

const TRIAGE_STAGES = [
  {
    step: 1,
    title: "Geospatial & Incident Telemetry",
    desc: "Resolving municipal jurisdiction, ward boundaries, and GIS coordinates...",
  },
  {
    step: 2,
    title: "AI Macro Cross-Department Diagnosis",
    desc: "Groq LLM reasoning engine identifying root cause and cascading infrastructure damage...",
  },
  {
    step: 3,
    title: "Interoperability Dependency Sequencing",
    desc: "Calculating blocking relationships (e.g. Water Board repair -> PWD asphalt paving)...",
  },
  {
    step: 4,
    title: "Broadcasting Sovereign Department Tickets",
    desc: "Generating external work orders across Water Board (WS-Setu) and PWD Roads APIs...",
  },
  {
    step: 5,
    title: "Minting Maharashtra Digital Case Passport",
    desc: "Cryptographically stamping master case passport for transparent citizen tracking...",
  },
];

function SubmitPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [locationText, setLocationText] = useState("");
  const [lat, setLat] = useState<number | undefined>(19.0596);
  const [lng, setLng] = useState<number | undefined>(72.8397);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  );

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MultiDeptAnalysisResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Animated triage submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTriageStep, setActiveTriageStep] = useState(1);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const applyPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setCity(preset.city);
    setLocationText(preset.location);
    setLat(preset.lat);
    setLng(preset.lng);
    setScanResult(null);
    setScanError(null);
  };

  const handleRunAiScan = async () => {
    if (!description.trim() || description.length < 10) {
      setScanError("Please enter a detailed description (at least 10 characters) to run AI analysis.");
      return;
    }
    setIsScanning(true);
    setScanError(null);
    try {
      const res = await analyzeMultiDeptCase({
        title: title.trim() || undefined,
        description: description.trim(),
        city,
        latitude: lat,
        longitude: lng,
        image_url: photoUrl || undefined,
      });
      setScanResult(res);
      if (!title.trim() && res.title) {
        setTitle(res.title);
      }
    } catch (err: any) {
      setScanError(err?.message || "Failed to analyze case. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmitCase = async () => {
    if (!description.trim()) {
      setScanError("Description is required.");
      return;
    }

    setIsSubmitting(true);
    setActiveTriageStep(1);
    setSubmissionError(null);

    // Step-by-step visual animation timer
    const interval = setInterval(() => {
      setActiveTriageStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 650);

    try {
      const created = await createMasterCase({
        title: title.trim() || scanResult?.title || "Civic Infrastructure Incident",
        description: description.trim(),
        city,
        address_text: locationText.trim() || undefined,
        latitude: lat,
        longitude: lng,
        photo_url: photoUrl || undefined,
        pre_analyzed_routing: scanResult || undefined,
      });

      // Ensure all 5 stages display cleanly before redirecting
      setActiveTriageStep(5);
      setTimeout(() => {
        clearInterval(interval);
        navigate({ to: `/case/${created.case_number}` });
      }, 1000);
    } catch (err: any) {
      clearInterval(interval);
      setIsSubmitting(false);
      setSubmissionError(err?.message || "Failed to create Master Case. Please check your connection.");
    }
  };

  return (
    <div className="p-6">
      {/* Top Protocol Header */}
      <div className="mx-auto max-w-4xl mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
          <Cpu className="h-3.5 w-3.5" />
          <span>Govt. of Maharashtra · Problem Statement SIH26129</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          AI Multi-Department Smart Composer
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground">
          Break sovereign departmental silos. Automatically detect cascading municipal failures, sequence
          inter-agency dependencies, and dispatch unified tickets to Water Board, PWD Roads, SWD, and MSEDCL.
        </p>
      </div>

      {/* Friendly Plain-English Explainer Banner */}
      <div className="mx-auto max-w-4xl mb-8">
        <FeatureExplainerBanner
          title="Single Citizen Complaint (AI Multi-Department Fan-Out)"
          problem="If a water pipe bursts and ruins a road, you usually have to figure out who to call, file 2 separate complaints with different offices, and neither department takes responsibility."
          solution="Describe what happened once. Civic Sathi uses AI to automatically detect all involved departments (e.g. Water Board + PWD Roads) and creates linked tasks for each agency."
          benefit="Zero guesswork for citizens, no duplicate reports, and accountability for every department involved."
        />
      </div>

      {/* Demo Preset Buttons */}
      <div className="mx-auto max-w-4xl mb-8">
        <GlassCard className="p-4 sm:p-5 border-orange-500/20 bg-orange-500/[0.03]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              1-Click Live Test Scenarios (SIH26129 Demonstration)
            </span>
            <span className="text-[0.7rem] text-muted-foreground hidden sm:inline">
              Select a scenario to populate dual-department telemetry
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DEMO_PRESETS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="flex flex-col text-left p-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-foreground">{p.label}</span>
                  </div>
                  <span className="text-[0.68rem] text-muted-foreground line-clamp-2 mb-2">
                    {p.location}
                  </span>
                  <span className="mt-auto inline-block text-[0.62rem] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/10 rounded px-1.5 py-0.5 w-fit">
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Main Composer Workspace */}
      <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard elevation="raised" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Incident Telemetry & Intake
              </h2>
              <span className="text-xs text-muted-foreground">Standardized Protocol</span>
            </div>

            {/* City & Ward */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Municipal Authority
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-border/70 bg-surface/60 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Mumbai">Mumbai (MCGM / BMC)</option>
                  <option value="Pune">Pune (PMC)</option>
                  <option value="Nagpur">Nagpur (NMC)</option>
                  <option value="Nashik">Nashik (NMC)</option>
                  <option value="Thane">Thane (TMC)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Corridor / Ward Location
                </label>
                <GlassInput
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. SV Road, Bandra West"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Case Title */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Incident Title
              </label>
              <GlassInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pipeline rupture causing road subsidence"
                className="text-sm font-medium"
              />
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground">
                  Detailed Grievance Description
                </label>
                <span className="text-[0.68rem] text-muted-foreground">
                  {description.length} characters
                </span>
              </div>
              <GlassTextarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the condition in detail: note if water is leaking, if the road is cave-in, if electrical poles are affected..."
                className="text-sm leading-relaxed"
              />
            </div>

            {/* Photo Evidence URL preview */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Visual Evidence Link (Street Telemetry)
              </label>
              <div className="flex gap-2 items-center">
                <GlassInput
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="text-xs"
                />
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt="Evidence Preview"
                    className="h-9 w-9 rounded-lg object-cover border border-border shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Error Message */}
            {scanError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{scanError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <GlassButton
                type="button"
                onClick={handleRunAiScan}
                disabled={isScanning}
                className="flex-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/40 text-foreground font-semibold hover:border-orange-500"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    AI Analyzing Multi-Dept Breakdown...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
                    Run AI Pre-Triage Scan
                  </>
                )}
              </GlassButton>

              <GlassButton
                type="button"
                onClick={handleSubmitCase}
                disabled={isSubmitting || !description.trim()}
                className="flex-1 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:brightness-105"
              >
                Dispatch Master Case
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: AI Decomposition Output */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard elevation="raised" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-orange-500" />
                AI Triage & Dependency Map
              </h2>
              <span className="text-[0.7rem] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {scanResult ? scanResult.source : "Awaiting Scan"}
              </span>
            </div>

            {!scanResult ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Cpu className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  No Multi-Department Scan Run Yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Click <strong>"Run AI Pre-Triage Scan"</strong> or choose a demo scenario to see
                  Groq LLM identify root causes and automatically sequence sovereign department
                  dependencies.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Severity & SLA Header */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-border/50 bg-surface/50 p-3">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Assessed Severity
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-bold uppercase",
                          scanResult.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                            : scanResult.severity === "HIGH"
                            ? "bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                            : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        )}
                      >
                        {scanResult.severity}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Priority {scanResult.priority}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-surface/50 p-3">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Estimated Combined SLA
                    </span>
                    <div className="flex items-center gap-1.5 text-foreground font-bold text-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{scanResult.estimated_total_sla_hours} Hours</span>
                    </div>
                  </div>
                </div>

                {/* Root Cause Card */}
                <div className="rounded-xl border border-orange-500/25 bg-orange-500/[0.04] p-3.5 space-y-1.5">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    Diagnosed Primary Root Cause
                  </span>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {scanResult.root_cause}
                  </p>
                </div>

                {/* Preventive Warning */}
                {scanResult.preventive_warning && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Preventive Escalation Warning
                    </span>
                    <p className="text-[0.72rem] text-amber-900 dark:text-amber-200 leading-snug">
                      {scanResult.preventive_warning}
                    </p>
                  </div>
                )}

                {/* Sequenced Department Routing List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground block">
                    Sequenced Departmental Actions ({scanResult.departments.length} Sovereign Depts)
                  </span>

                  <div className="space-y-2">
                    {scanResult.departments.map((dept, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-xl border p-3 text-xs transition-all",
                          dept.sequence_order === 1
                            ? "border-emerald-500/40 bg-emerald-500/[0.05]"
                            : "border-border/60 bg-surface/40"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/10 text-[0.65rem]">
                              {dept.sequence_order}
                            </span>
                            {dept.department_name}
                          </span>
                          {dept.depends_on ? (
                            <span className="text-[0.65rem] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              🔒 Blocked: Waiting for {dept.depends_on}
                            </span>
                          ) : (
                            <span className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              ⚡ Primary Lead Dept
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-[0.75rem] leading-relaxed">
                          {dept.action_required}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[0.68rem] text-subtle">
                          <span>Connector: {dept.external_system_key || dept.department_code}</span>
                          <span>·</span>
                          <span>Target SLA: {dept.sla_hours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* 5-STAGE ANIMATED TRIAGE MODAL */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <GlassCard
            elevation="raised"
            className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-orange-500/30 bg-background/95 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Cpu className="h-7 w-7 animate-spin [animation-duration:3s]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                Sathi Setu Interoperability Engine Active
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Orchestrating sovereign department systems under Govt. of Maharashtra SIH26129
                standards.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(activeTriageStep / 5) * 100}%` }}
              />
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              {TRIAGE_STAGES.map((s) => {
                const isComplete = activeTriageStep > s.step;
                const isCurrent = activeTriageStep === s.step;

                return (
                  <div
                    key={s.step}
                    className={cn(
                      "flex items-start gap-3 p-2.5 rounded-xl transition-all",
                      isCurrent && "bg-orange-500/10 border border-orange-500/25",
                      isComplete && "opacity-80"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                        isComplete
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-orange-500 text-white animate-pulse"
                          : "bg-border text-muted-foreground"
                      )}
                    >
                      {isComplete ? <Check className="h-3.5 w-3.5" /> : s.step}
                    </div>
                    <div className="space-y-0.5">
                      <h4
                        className={cn(
                          "text-xs font-bold",
                          isCurrent
                            ? "text-orange-600 dark:text-orange-400"
                            : isComplete
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {s.title}
                      </h4>
                      <p className="text-[0.7rem] text-muted-foreground leading-snug">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {submissionError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                {submissionError}
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
