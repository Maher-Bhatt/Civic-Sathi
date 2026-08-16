import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { PriorityBadge } from "@/components/municipality/status-badge";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import { useMuniAuth } from "@/lib/muni-auth";
import { acknowledgeAlert, getAlerts } from "@/services/api";
import { alertPriority, type MuniAlert } from "@/services/types";

export const Route = createFileRoute("/_auth/alerts")({
  head: () => ({ meta: [{ title: "Alerts — Municipal Intelligence" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const { officer } = useMuniAuth();
  const [alerts, setAlerts] = useState<MuniAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged">("all");

  useEffect(() => {
    getAlerts(officer?.city)
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, [officer?.city]);

  const filtered = alerts.filter((a) => {
    if (filter === "active") return !a.acknowledged;
    if (filter === "acknowledged") return a.acknowledged;
    return true;
  });

  async function handleAcknowledge(id: string) {
    const updated = await acknowledgeAlert(id);
    setAlerts((list) => list.map((a) => (a.id === id ? updated : a)));
    toast.success("Alert acknowledged");
  }

  if (loading) return <LoadingState message="Loading alerts..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>Operational Alerts</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">City-wide risk notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prototype Intelligence Data</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["all", "active", "acknowledged"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "press rounded-full border px-3 py-1.5 text-xs capitalize transition-all",
              filter === f
                ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground"
                : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No alerts" description="No alerts match the selected filter." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((alert) => (
            <GlassCard
              key={alert.id}
              elevation="raised"
              className={cn(
                "p-5 transition-opacity",
                alert.acknowledged && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={alertPriority(alert.riskScore)} />
                    <span className="text-sm font-medium">{alert.category}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {alert.area} · {alert.ward}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span>
                      <span className="text-muted-foreground">Reports </span>
                      <span className="font-semibold tabular-nums">{alert.complaintCount}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Risk </span>
                      <span className="font-semibold tabular-nums">{alert.riskScore}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Trend </span>
                      <span className="font-semibold tabular-nums">
                        {alert.trendPct >= 0 ? "+" : ""}
                        {alert.trendPct}%
                      </span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-subtle">
                    {format(new Date(alert.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {alert.issueId && (
                    <Link
                      to={"/issues/$id" as any}
                      params={{ id: alert.issueId } as any}
                      className="action-btn text-center"
                    >
                      View Issue
                    </Link>
                  )}
                  {!alert.acknowledged && (
                    <button
                      type="button"
                      onClick={() => void handleAcknowledge(alert.id)}
                      className="action-btn primary"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
