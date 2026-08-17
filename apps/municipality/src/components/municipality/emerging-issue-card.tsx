import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import type { SystemicIssue } from "@/services/types";
import { riskLevel } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export function EmergingIssueCard({
  issue,
  className,
  delay = 0,
}: {
  issue: SystemicIssue;
  className?: string;
  delay?: number;
}) {
    const { t } = useI18n();
  const up = issue.trendPct >= 0;
  const level = riskLevel(issue.riskScore);

  return (
    <GlassCard
      elevation="raised"
      interactive
      className={cn("animate-rise group p-5", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <SectionLabel>{t('ui.emerging_systemic_issue')}</SectionLabel>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{issue.category}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {issue.areaName} · {issue.ward}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
            level === "Critical"
              ? "border-critical/40 bg-critical/10 text-critical"
              : level === "High"
                ? "border-[#a4503f]/40 bg-[#a4503f]/10 text-[#a4503f]"
                : "border-warning/40 bg-warning/10 text-warning",
          )}
        >
          {level}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="label-xs">{t('ui.reports')}</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums">{issue.complaintCount}</p>
        </div>
        <div>
          <p className="label-xs">{t('ui.risk')}</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums">{issue.riskScore}/100</p>
        </div>
        <div>
          <p className="label-xs">{t('ui.trend')}</p>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-1 text-xl font-semibold tabular-nums",
              up ? "text-[#a4503f]" : "text-primary",
            )}
          >
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {up ? "+" : ""}
            {issue.trendPct}%
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-[var(--glass-border)] pt-4">
        <div>
          <p className="label-xs">{t('ui.dominant_issue')}</p>
          <p className="text-sm text-foreground">{issue.dominantIssue}</p>
        </div>
        <div>
          <p className="label-xs">{t('ui.possible_cause')}</p>
          <p className="text-sm text-muted-foreground">{issue.possibleCause}</p>
        </div>
      </div>

      <GlassButton variant="glass" size="sm" className="mt-5 w-full" asChild>
        <Link to={"/issues/$id" as any} params={{ id: issue.id } as any}>
          {t('ui.view_intelligence')}<ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </GlassButton>
    </GlassCard>
  );
}
