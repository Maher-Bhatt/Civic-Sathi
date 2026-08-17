import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import type { SystemicIssue } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export function ExplainabilityPanel({ issue }: { issue: SystemicIssue }) {
    const { t } = useI18n();
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>{t('ui.why_janmind_flagged_this')}</SectionLabel>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{issue.whyFlagged}</p>
      <p className="mt-2 text-xs text-muted-foreground">{t('ui.prototype_intelligence_data')}</p>

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
    const { t } = useI18n();
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>{t('ui.possible_root_cause')}</SectionLabel>
      <p className="mt-3 text-sm leading-relaxed">{issue.possibleCause}</p>
      <p className="mt-3 text-sm">
        <span className="text-muted-foreground">{t('ui.confidence')}</span>
        <span className="font-semibold tabular-nums">{issue.causeConfidence}%</span>
      </p>
      <p className="mt-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-xs leading-relaxed text-muted-foreground">
        {t('ui.inferred_candidate_based_on_co')}</p>
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
    const { t } = useI18n();
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>{t('ui.recommended_action')}</SectionLabel>
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
            {t('ui.start_investigation')}</button>
        )}
        {onAssign && (
          <button
            type="button"
            onClick={onAssign}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            {t('ui.assign_department')}</button>
        )}
        {onFieldAction && (
          <button
            type="button"
            onClick={onFieldAction}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            {t('ui.create_field_action')}</button>
        )}
        {onMarkInvestigating && (
          <button
            type="button"
            onClick={onMarkInvestigating}
            className="press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider"
          >
            {t('ui.mark_investigating')}</button>
        )}
      </div>
    </GlassCard>
  );
}
