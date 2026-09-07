import { useState } from "react";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import {
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Layers,
  Presentation,
  CheckCircle2,
  Radio,
  Building2,
  Shield,
  Database,
  Cpu,
  Zap,
} from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { resetDemoState } from "@/services/api";
import { cn } from "@/lib/utils";

const DEMO_STEPS = [
  {
    step: 1,
    title: "Single Citizen Complaint",
    route: "/submit",
    badge: "1. Complaint",
    description: "Report once — AI alerts all involved departments",
  },
  {
    step: 2,
    title: "Unified Tracking Passport",
    route: "/case/MH-MCGM-2026-DEMO",
    badge: "2. Tracking",
    description: "1 ID for all depts + prevents costly road collapse",
  },
  {
    step: 3,
    title: "Connected Departments",
    route: "/integration-hub",
    badge: "3. Connected",
    description: "6 government bodies linked in real-time",
  },
  {
    step: 4,
    title: "Smart Coordination",
    route: "/live-orchestration",
    badge: "4. No Re-Digging",
    description: "Pipes repaired first, roads paved second",
  },
  {
    step: 5,
    title: "Taxpayer Money Saved",
    route: "/state-command-center",
    badge: "5. ₹4.82 Cr Saved",
    description: "27 cities monitored & ₹4.82 Cr public funds saved",
  },
  {
    step: 6,
    title: "Your Privacy & Consent",
    route: "/consent",
    badge: "6. Privacy",
    description: "Personal details shared only with your permission",
  },
  {
    step: 7,
    title: "Profile Record Sync",
    route: "/exceptions",
    badge: "7. Sync",
    description: "Fix mismatched phone and address records in 1 click",
  },
];

export function DemoControllerHUD() {
  const [collapsed, setCollapsed] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Determine current step based on pathname
  const currentStepIndex = DEMO_STEPS.findIndex((s) =>
    s.route.includes("$id")
      ? pathname.startsWith("/case/")
      : pathname === s.route || (s.route !== "/" && pathname.startsWith(s.route))
  );

  const currentStep = currentStepIndex !== -1 ? DEMO_STEPS[currentStepIndex] : DEMO_STEPS[0];

  const handleNext = () => {
    const nextIdx = currentStepIndex < DEMO_STEPS.length - 1 ? currentStepIndex + 1 : 0;
    navigate({ to: DEMO_STEPS[nextIdx].route as any });
  };

  const handlePrev = () => {
    const prevIdx = currentStepIndex > 0 ? currentStepIndex - 1 : DEMO_STEPS.length - 1;
    navigate({ to: DEMO_STEPS[prevIdx].route as any });
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      await resetDemoState();
      setToastMessage("✓ Demo State Pristine: Cases, Consents & Exceptions Reset");
    } catch {
      setToastMessage("✓ Demo Reset (Simulated)");
    } finally {
      setResetting(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <aside
      aria-label="SIH26129 Evaluator Demonstration Toolbar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 rounded-full py-1 px-4 shadow-lg animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Mini Collapsed Pill */}
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/40 bg-background/90 text-foreground font-bold text-xs shadow-xl backdrop-blur-xl hover:border-orange-500 transition-all hover:scale-105"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-spin" />
          <span>SIH26129 Evaluator HUD</span>
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      ) : (
        /* Full Expanded Dock */
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl border border-orange-500/40 bg-background/95 shadow-2xl backdrop-blur-2xl text-xs max-w-[95vw] sm:max-w-2xl overflow-x-auto">
          {/* Badge & Step indicator */}
          <div className="flex items-center gap-2 shrink-0 border-r border-border/50 pr-2.5">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <div className="space-y-0.5 hidden sm:block">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                SIH26129 Tour ({currentStepIndex + 1}/{DEMO_STEPS.length})
              </span>
              <span className="font-bold text-foreground block truncate max-w-[130px]">
                {currentStep.title}
              </span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-surface-elevated border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
              title="Previous Demo Step"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-surface-elevated border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
              title="Next Demo Step"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Jump Buttons for Evaluators */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {DEMO_STEPS.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              return (
                <Link
                  key={step.step}
                  to={step.route as any}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[0.68rem] font-bold whitespace-nowrap transition-all border",
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-sm"
                      : "bg-surface/60 text-muted-foreground hover:text-foreground border-border/40 hover:bg-surface-elevated"
                  )}
                >
                  {step.badge}
                </Link>
              );
            })}
          </div>

          {/* 1-Click Reset Demo State */}
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-elevated border border-border/50 text-muted-foreground hover:text-foreground transition-all shrink-0 font-semibold text-[0.7rem]"
            title="Reset tickets, locks, consents and exceptions to initial state"
          >
            <RotateCcw className={cn("h-3.5 w-3.5 text-orange-500", resetting && "animate-spin")} />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* Collapse Button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors shrink-0"
            title="Minimize HUD"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
}
