import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureExplainerBannerProps {
  badge?: string;
  title: string;
  problem: string;
  solution: string;
  benefit: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function FeatureExplainerBanner({
  badge = "Plain-English Guide",
  title,
  problem,
  solution,
  benefit,
  defaultExpanded = true,
  className,
}: FeatureExplainerBannerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-4 transition-all duration-300 backdrop-blur-md shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {badge}
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-[0.68rem] text-muted-foreground">Easy to understand</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors"
          aria-expanded={expanded}
        >
          <span>{expanded ? "Hide guide" : "How does this help?"}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-amber-500/20 text-xs">
          {/* Problem */}
          <div className="space-y-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>The Everyday City Problem</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{problem}</p>
          </div>

          {/* Solution */}
          <div className="space-y-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>What Civic Sathi Does</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{solution}</p>
          </div>

          {/* Taxpayer / Citizen Benefit */}
          <div className="space-y-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <PiggyBank className="h-3.5 w-3.5 shrink-0" />
              <span>Why It Matters (Your Benefit)</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{benefit}</p>
          </div>
        </div>
      )}
    </div>
  );
}
