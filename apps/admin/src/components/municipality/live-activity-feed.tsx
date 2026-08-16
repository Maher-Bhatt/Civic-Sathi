import { cn } from "@/lib/utils";
import type { LiveActivity } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { formatDistanceToNow } from "date-fns";

export function LiveActivityFeed({
  activities,
  className,
}: {
  activities: LiveActivity[];
  className?: string;
}) {
  return (
    <GlassCard elevation="raised" className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <SectionLabel>Live Activity</SectionLabel>
        <span className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Prototype simulation
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {activities.slice(0, 6).map((a, i) => (
          <li
            key={a.id}
            className="animate-rise rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="label-xs">{a.title}</p>
            <p className="mt-1 text-sm font-medium">{a.subtitle}</p>
            {a.detail && <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>}
            <p className="mt-1 text-[0.65rem] text-subtle">
              {formatDistanceToNow(new Date(a.at), { addSuffix: true })}
            </p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
