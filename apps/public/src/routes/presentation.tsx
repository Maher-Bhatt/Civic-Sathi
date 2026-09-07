import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  Building2,
  Database,
  Lock,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Server,
  Radio,
  FileCheck,
  RotateCcw,
} from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Architecture & Pitch Deck — Civic Sathi x SIH26129" },
      {
        name: "description",
        content:
          "Official Hackathon pitch deck and architectural deep-dive for Govt. of Maharashtra Problem Statement SIH26129.",
      },
    ],
  }),
  component: PresentationDeckPage,
});

const SLIDES = [
  {
    id: "silo-problem",
    badge: "The Problem · SIH26129",
    title: "Isolated Department Silos & Systemic Infrastructure Failures",
    subtitle: "Why India's Smart Cities suffer from chronic road cave-ins and uncoordinated civic works.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase text-rose-600 dark:text-rose-400 block">
              Silo 1: Fragmented Citizen Portals
            </span>
            <h4 className="text-base font-bold text-foreground">Credential Fatigue</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Citizens are forced to re-register on separate portals for Water Supply, PWD Roads,
              Municipal Corporation, and Power. Grievances fall into black holes between departments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase text-amber-600 dark:text-amber-400 block">
              Silo 2: Zero Inter-Agency Handoffs
            </span>
            <h4 className="text-base font-bold text-foreground">The Pave-and-Dig Trap</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PWD paves a brand new road. 3 days later, the Water Board digs a trench across it to fix
              an unmapped conduit. Taxpayer funds are wasted on repetitive excavations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
            <span className="text-[0.65rem] font-bold uppercase text-blue-600 dark:text-blue-400 block">
              Silo 3: Data Incompatibility
            </span>
            <h4 className="text-base font-bold text-foreground">Schema Babel</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Departments store conflicting formats (Aaple Sarkar vs MCGM SAP vs Water Oracle).
              Officials lack a single pane of glass to diagnose systemic municipal collapse.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface/80 border border-border/50 text-xs text-foreground/80 flex items-center justify-between">
          <span>
            <strong>Problem Statement Mandate:</strong> Establish dynamic inter-departmental
            interoperability across Govt. of Maharashtra digital platforms without rewriting legacy
            backend databases.
          </span>
          <span className="font-mono text-orange-600 dark:text-orange-400 font-bold shrink-0 ml-4">
            SIH26129
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "architecture-paradigm",
    badge: "The Solution · Sathi Setu",
    title: "Standalone Macro Interoperability Middleware",
    subtitle:
      "Inspired by India Stack (API Setu, DEPA, MeriPehchaan) and Estonia's Sovereign X-Road.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <strong className="text-orange-600 dark:text-orange-400 font-bold block mb-1">
                Data-Blind Security Server Model
              </strong>
              Sathi Setu never centralizes or hoards private departmental databases. It acts as an
              encrypted, distributed message switchboard routing sovereign envelopes.
            </div>

            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30">
              <strong className="text-teal-600 dark:text-teal-400 font-bold block mb-1">
                Canonical Common Data Model (CDM)
              </strong>
              Zero-code JSON transformation layer mapping heterogeneous legacy schemas into canonical
              Civic Sathi envelopes in &lt; 35 milliseconds.
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <strong className="text-blue-600 dark:text-blue-400 font-bold block mb-1">
                Cryptographic Timeline Digest
              </strong>
              Every inter-agency handoff produces a tamper-proof SHA-256 audit entry on the Digital
              Case Passport.
            </div>
          </div>

          {/* Mini Flow Diagram */}
          <div className="p-5 rounded-2xl bg-surface-elevated border border-border/60 space-y-3 font-mono text-xs text-center">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-600 dark:text-blue-400 font-bold">
              [Citizen Intake] Mobile / WhatsApp Portal
            </div>
            <div className="text-muted-foreground text-xs">▼ (REST / JSON Payload)</div>
            <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold">
              [Civic Sathi Core] AI Decomposer &amp; Master Case
            </div>
            <div className="text-muted-foreground text-xs">▼ (MeitY API Setu Standard)</div>
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-600 dark:text-amber-400 font-bold">
              [Sathi Setu Sovereign Switchboard]
            </div>
            <div className="text-muted-foreground text-xs">
              ▼ (Autonomous Fan-Out with Dependency Locking)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 font-bold text-[0.68rem]">
                Water Board (Lead)
              </div>
              <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold text-[0.68rem]">
                PWD Roads (Held Blocked)
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "innovation-trifecta",
    badge: "Key Innovations",
    title: "The Innovation Trifecta",
    subtitle: "Three technical breakthroughs separating Civic Sathi from traditional grievance portals.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-orange-500/10 to-surface border border-orange-500/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="text-sm font-bold text-foreground">
            Autonomous Dependency Sequencing Engine
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Downstream work orders (e.g. road resurfacing) are automatically locked in a{" "}
            <code>WAITING (BLOCKED)</code> state until the upstream utility (water pipe welding) emits
            a verified completion webhook. No manual coordination phone calls required.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-500/10 to-surface border border-rose-500/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="text-sm font-bold text-foreground">
            &quot;What Happens If We Don&apos;t Fix This?&quot; AI
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Predictive systemic failure simulator linking spatial proximity of water leaks to sub-base
            soil cavitation. Proves a <strong>12.3× financial penalty</strong> (₹1.25L vs ₹15.37L) and
            42,500 affected citizens if delayed past 36 hours.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-teal-500/10 to-surface border border-teal-500/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="text-sm font-bold text-foreground">
            DEPA Citizen Consent &amp; MDM Queue
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Compliant with DPDP Act 2023. Zero silent data leakage between government departments.
            Citizens grant or revoke inter-agency data sharing permissions with cryptographic audit
            receipts.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "roi-impact",
    badge: "Measurable Impact",
    title: "Quantifiable Taxpayer ROI & SLA Compression",
    subtitle: "Real metrics measured across Maharashtra's 27 Municipal Corporations.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
            <span className="text-[0.65rem] font-bold uppercase text-emerald-700 dark:text-emerald-300">
              Taxpayer Savings
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₹4.82 Cr
            </div>
            <span className="text-[0.68rem] text-muted-foreground block">
              Via Sequential Repair Coordination
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-1">
            <span className="text-[0.65rem] font-bold uppercase text-blue-700 dark:text-blue-300">
              SLA Compression
            </span>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">14d ➔ 36h</div>
            <span className="text-[0.68rem] text-muted-foreground block">
              Inter-Agency Coordination Cycle
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center space-y-1">
            <span className="text-[0.65rem] font-bold uppercase text-orange-700 dark:text-orange-300">
              Switchboard Latency
            </span>
            <div className="text-3xl font-black text-orange-600 dark:text-orange-400">34.2 ms</div>
            <span className="text-[0.68rem] text-muted-foreground block">
              Average Message Envelope Transit
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-1">
            <span className="text-[0.65rem] font-bold uppercase text-teal-700 dark:text-teal-300">
              MDM Match Accuracy
            </span>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400">91.5%</div>
            <span className="text-[0.68rem] text-muted-foreground block">
              Golden Record Deduplication
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface/70 border border-border/50 p-4 text-xs text-muted-foreground leading-relaxed">
          <strong>Statewide Projection:</strong> Scaling across all 27 Municipal Corporations and 391
          urban local bodies in Maharashtra will save an estimated <strong>₹140+ Crores annually</strong>{" "}
          by eliminating duplicated contractor mobilization and premature road resurfacing.
        </div>
      </div>
    ),
  },
  {
    id: "live-tour",
    badge: "Evaluation Tour",
    title: "Experience the Platform Live",
    subtitle: "Click any screen below or use the floating Demo Controller HUD to begin the evaluator journey.",
    content: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          {
            title: "1. AI Case Composer",
            url: "/submit",
            desc: "1-Click multi-dept triage scan & 5-stage animated modal",
          },
          {
            title: "2. Case Passport",
            url: "/case/MH-MCGM-2026-DEMO",
            desc: "Milestone timeline & 12.3x predictive risk card",
          },
          {
            title: "3. Systems Hub",
            url: "/integration-hub",
            desc: "6 sovereign agencies, live pings & CDM schema mapper",
          },
          {
            title: "4. Live Orchestrator",
            url: "/live-orchestration",
            desc: "Animated visual node graph with particle pulse transit",
          },
          {
            title: "5. Command Center",
            url: "/state-command-center",
            desc: "27 Corporations Digital Twin & ₹4.82 Cr savings",
          },
          {
            title: "6. DEPA Consent",
            url: "/consent",
            desc: "DPDP Act 2023 citizen consent management portal",
          },
          {
            title: "7. MDM Exceptions",
            url: "/exceptions",
            desc: "Side-by-side data conflict merge to Golden Record",
          },
          {
            title: "8. Live Civic Map",
            url: "/map",
            desc: "Public citizen heatmap & cluster explorer",
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.url as any}
            className="p-4 rounded-2xl bg-surface border border-border/50 hover:border-orange-500/50 hover:shadow-lg transition-all space-y-1.5 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h5>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[0.68rem] text-muted-foreground leading-tight">{item.desc}</p>
            </div>
            <span className="text-[0.65rem] font-mono text-orange-600 dark:text-orange-400 font-semibold">
              Open Route ➔
            </span>
          </Link>
        ))}
      </div>
    ),
  },
];

export function PresentationDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <PageShell className="pt-24 sm:pt-28 pb-20 max-w-6xl">
      {/* Top Header & Slide Navigation */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Presentation className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-bold text-foreground">
              SIH26129 Architectural Pitch Deck
            </span>
            <span className="text-xs text-muted-foreground">
              (Slide {currentSlide + 1} of {SLIDES.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton
              size="sm"
              variant="glass"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </GlassButton>
            <GlassButton
              size="sm"
              onClick={handleNext}
              disabled={currentSlide === SLIDES.length - 1}
              className="bg-orange-500 text-white font-bold text-xs hover:bg-orange-600"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </GlassButton>
          </div>
        </div>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all flex-1",
                currentSlide === idx ? "bg-orange-500 shadow-sm" : "bg-border/60 hover:bg-border"
              )}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* ACTIVE SLIDE CARD */}
      <GlassCard
        elevation="raised"
        className="p-6 sm:p-10 border-2 border-orange-500/30 min-h-[500px] flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400">
              {slide.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{slide.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">{slide.subtitle}</p>
          </div>

          <div className="pt-2">{slide.content}</div>
        </div>

        {/* Slide Footer */}
        <div className="pt-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            <span>Govt. of Maharashtra · SIH26129 Macro Interoperability Standard</span>
          </div>

          <div className="hidden sm:inline">Use Left/Right arrow keys to navigate slides</div>
        </div>
      </GlassCard>
    </PageShell>
  );
}
