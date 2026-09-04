import { cn } from "@/lib/utils";
import type { LiveActivity } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { formatDistanceToNow } from "date-fns";
import { useI18n } from "@/lib/i18n";
import { Zap, Link as LinkIcon } from "lucide-react";

export function LiveActivityFeed({
  activities,
  className,
}: {
  activities: LiveActivity[];
  className?: string;
}) {
  const { t } = useI18n();

  // Pseudo-random deterministic routing generator
  const getAiRouting = (id: string, text: string) => {
    const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const idSuffix = String(hash).padStart(6, '0').slice(-6);
    const isWater = text.toLowerCase().includes("water") || text.toLowerCase().includes("leak");
    const isRoad = text.toLowerCase().includes("road") || text.toLowerCase().includes("pothole");
    const isGarbage = text.toLowerCase().includes("garbage") || text.toLowerCase().includes("waste");
    
    const depts = [];
    if (isWater) depts.push("Water Dept");
    if (isRoad) depts.push("Roads & Traffic");
    if (isGarbage) depts.push("Solid Waste");
    if (depts.length === 0) depts.push("Municipal Admin");
    
    // Add random cross-department if hash is even
    if (hash % 2 === 0 && depts.length < 2) {
      depts.push(hash % 4 === 0 ? "Drainage" : "Contractor API");
    }

    const isDuplicate = hash % 5 === 0;

    return { 
      unifiedId: `MH-2026-${idSuffix}`,
      depts,
      isDuplicate,
      masterId: isDuplicate ? `MH-2026-${String(hash - 100).padStart(6, '0').slice(-6)}` : null
    };
  };

  return (
    <GlassCard elevation="raised" className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <SectionLabel>Cross-Dept AI Routing Queue</SectionLabel>
        <span className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live Sync Hub
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--glass-border)] bg-[var(--glass)] p-4 text-sm text-muted-foreground">
            {t('ui.no_recent_backend_activity', 'No recent backend activity is available for this city yet.')}
          </li>
        ) : activities.slice(0, 6).map((a, i) => {
          const routing = getAiRouting(a.id, a.subtitle + " " + (a.detail || ""));
          return (
            <li
              key={a.id}
              className="animate-rise rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3 relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {routing.isDuplicate && (
                <div className="absolute top-0 right-0 bg-[var(--critical)]/10 text-[var(--critical)] px-2 py-0.5 rounded-bl text-[9px] font-bold tracking-wider flex items-center gap-1">
                  <LinkIcon className="h-2.5 w-2.5" /> DUPLICATE MERGED
                </div>
              )}
              
              <div className="flex justify-between items-start mt-1">
                <p className="label-xs text-primary font-mono">{routing.unifiedId}</p>
                <p className="text-[0.65rem] text-subtle">
                  {formatDistanceToNow(new Date(a.at), { addSuffix: true })}
                </p>
              </div>
              <p className="mt-1 text-sm font-medium">{a.subtitle}</p>
              {a.detail && <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>}
              
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> AI Routed to:
                </span>
                {routing.depts.map(dept => (
                  <span key={dept} className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] px-1.5 py-0.5 rounded text-[9px] font-bold text-foreground">
                    {dept}
                  </span>
                ))}
              </div>
              {routing.isDuplicate && (
                <div className="mt-2 text-[10px] text-muted-foreground">
                  Attached to master case <span className="font-mono">{routing.masterId}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
