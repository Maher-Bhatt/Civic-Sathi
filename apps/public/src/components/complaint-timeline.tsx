import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export function ComplaintTimeline({ events }: { events: TimelineEvent[] }) {
    const { t } = useI18n();
  return (
    <ol className="relative space-y-0">
      {events.map((e, i) => {
        const last = i === events.length - 1;
        const current = !e.done && (i === 0 || !!events[i - 1]?.done);
        return (
          <li
            key={e.label}
            className="animate-rise relative flex gap-4 pb-7 last:pb-0"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {!last && (
              <span
                aria-hidden
                className="absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-px"
                style={{
                  background: e.done
                    ? "color-mix(in oklab, var(--primary) 45%, transparent)"
                    : "var(--border)",
                }}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                e.done
                  ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary"
                  : current
                    ? "border-primary bg-[var(--glass-strong)] text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_12%,transparent)]"
                    : "border-border bg-[var(--glass)] text-subtle",
              )}
            >
              {e.done ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  e.done || current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {e.label}
                {current && (
                  <span className="ml-2 rounded-full border border-[color-mix(in_oklab,var(--primary)_45%,transparent)] px-2 py-0.5 text-[0.6rem] tracking-[0.12em] text-primary uppercase">
                    {t('ui.current')}</span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-subtle">{e.description}</p>
              {e.at && (
                <p className="mt-1 text-[0.68rem] tracking-[0.08em] text-subtle uppercase">
                  {new Date(e.at).toLocaleString(undefined, {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
