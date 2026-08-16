import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import type { RiskFactors, RiskLevel } from "@/services/types";
import { riskLevel } from "@/services/types";

const LEVEL_COLORS: Record<RiskLevel, string> = {
  Low: "text-primary",
  Moderate: "text-warning",
  High: "text-[#a4503f]",
  Critical: "text-critical",
};

function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums text-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--glass)]">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function RiskScorePanel({
  score,
  factors,
  className,
}: {
  score: number;
  factors?: RiskFactors;
  className?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const level = riskLevel(score);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setAnimated(Math.round(score * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <GlassCard elevation="raised" className={cn("p-6", className)}>
      <SectionLabel>JANMIND Prototype Risk Score</SectionLabel>
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg width="140" height="140" viewBox="0 0 120 120" aria-hidden>
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--glass-border)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums">{animated}</span>
            <span className={cn("text-xs font-medium", LEVEL_COLORS[level])}>{level}</span>
          </div>
        </div>
        {factors && (
          <div className="w-full flex-1 space-y-3">
            <FactorBar label="Complaint Volume" value={factors.complaintVolume} />
            <FactorBar label="Geographic Concentration" value={factors.geographicConcentration} />
            <FactorBar label="Semantic Similarity" value={factors.semanticSimilarity} />
            <FactorBar label="Recent Growth" value={factors.recentGrowth} />
            <FactorBar label="Severity" value={factors.severity} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
