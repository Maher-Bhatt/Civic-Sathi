import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import type { SystemicIssue } from "@/services/types";

export function ExplainabilityPanel({ issue }: { issue: SystemicIssue }) {
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>Why JANMIND Flagged This</SectionLabel>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{issue.whyFlagged}</p>
      <p className="mt-2 text-xs text-muted-foreground">Prototype Intelligence Data</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {issue.evidence.map((e) => (
          <GlassCard key={e.label} elevation="flat" className="p-4">
            <p className="label-xs">{e.label}</p>
            <p className="mt-1 text-lg font-semibold">{e.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
          </GlassCard>
        ))}
      </div>
    </GlassCard>
  );
}

export function RootCausePanel({ issue }: { issue: SystemicIssue }) {
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>Possible Root Cause</SectionLabel>
      <p className="mt-3 text-sm leading-relaxed">{issue.possibleCause}</p>
      <p className="mt-3 text-sm">
        <span className="text-muted-foreground">Confidence: </span>
        <span className="font-semibold tabular-nums">{issue.causeConfidence}%</span>
      </p>
      <p className="mt-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-xs leading-relaxed text-muted-foreground">
        Inferred candidate based on complaint patterns. Not a confirmed physical
        infrastructure failure.
      </p>
    </GlassCard>
  );
}

export function RecommendedActionsPanel({
  actions,
  onStartInvestigation,
  onAssign,
  onFieldAction,
  onMarkInvestigating,
}: {
  actions: string[];
  onStartInvestigation?: () => void;
  onAssign?: () => void;
  onFieldAction?: () => void;
  onMarkInvestigating?: () => void;
}) {
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>Recommended Action</SectionLabel>
      <ol className="mt-4 space-y-2">
        {actions.map((a, i) => (
          <li key={a} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-xs font-medium">
              {i + 1}
            </span>
            <span className="pt-0.5 text-foreground">{a}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        {onStartInvestigation && (
          <button
            type="button"
            onClick={onStartInvestigation}
            className="press rounded-xl bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground"
          >
            Start Investigation
          </button>
        )}
        {onAssign && (
          <button
            type="button"
            onClick={onAssign}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            Assign Department
          </button>
        )}
        {onFieldAction && (
          <button
            type="button"
            onClick={onFieldAction}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            Create Field Action
          </button>
        )}
        {onMarkInvestigating && (
          <button
            type="button"
            onClick={onMarkInvestigating}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            Mark Investigating
          </button>
        )}
      </div>
    </GlassCard>
  );
}
