import { safeFormat } from "@/lib/safe-format";
import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { COMPLAINT_STATUSES } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export function InvestigationTimeline({
  events,
  currentStatus,
}: {
  events: Array<{ label: string; at: string; actor?: string }>;
  currentStatus?: string;
}) {
    const { t } = useI18n();
  const statusIdx = currentStatus
    ? COMPLAINT_STATUSES.indexOf(currentStatus as (typeof COMPLAINT_STATUSES)[number])
    : -1;

  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>{t('ui.officer_activity_timeline')}</SectionLabel>
      <ol className="mt-5 space-y-0">
        {COMPLAINT_STATUSES.map((step, i) => {
          const event = events.find((e) =>
            e.label.toLowerCase().includes(step.toLowerCase().split(" ")[0] ?? ""),
          );
          const done = statusIdx >= i;
          return (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              {i < COMPLAINT_STATUSES.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[11px] top-6 h-full w-px",
                    done ? "bg-primary/40" : "bg-[var(--glass-border)]",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-medium transition-colors duration-300",
                  done
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={cn("text-sm font-medium", !done && "text-muted-foreground")}>
                  {step}
                </p>
                {event && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {safeFormat(event.at, "HH:mm")}
                      {event.actor && ` · ${event.actor}`}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}

export function FieldActionCard({
  area,
  priority,
  recommendations,
  onAssign,
  onAcknowledge,
  onStart,
  onComplete,
}: {
  area: string;
  priority: string;
  recommendations: string[];
  onAssign?: () => void;
  onAcknowledge?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}) {
    const { t } = useI18n();
  return (
    <GlassCard elevation="raised" className="p-6">
      <SectionLabel>{t('ui.field_action')}</SectionLabel>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('ui.area')}</span>
          <span className="font-medium">{area}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('ui.priority')}</span>
          <span className="font-medium text-critical">{priority}</span>
        </div>
        <div>
          <p className="label-xs mb-2">{t('ui.recommended')}</p>
          <ul className="space-y-1">
            {recommendations.map((r) => (
              <li key={r} className="text-sm text-muted-foreground">
                · {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {onAssign && (
          <button type="button" onClick={onAssign} className="action-btn">
            {t('ui.assign')}</button>
        )}
        {onAcknowledge && (
          <button type="button" onClick={onAcknowledge} className="action-btn">
            {t('ui.acknowledge')}</button>
        )}
        {onStart && (
          <button type="button" onClick={onStart} className="action-btn primary">
            {t('ui.start')}</button>
        )}
        {onComplete && (
          <button type="button" onClick={onComplete} className="action-btn">
            {t('ui.complete')}</button>
        )}
      </div>
    </GlassCard>
  );
}
