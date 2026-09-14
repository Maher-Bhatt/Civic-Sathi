import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { safeFormat } from "@/lib/safe-format";
import { ClipboardList, ArrowUpRight, AlertCircle } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getWorkOrders } from "@/services/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

// Backend WorkOrderStatus enum values — kept in sync with models/procurement.py
const STATUS_LABEL: Record<string, string> = {
  ISSUED: "Issued",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  INSPECTION_PENDING: "Pending Inspection",
  INSPECTION_FAILED: "Inspection Failed",
  REWORK: "Rework",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

const STATUS_CHIP: Record<string, string> = {
  ISSUED: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  ACCEPTED: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  IN_PROGRESS: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  INSPECTION_PENDING: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  INSPECTION_FAILED: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
  REWORK: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
  COMPLETED: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  CLOSED: "text-[var(--muted-foreground)] bg-[var(--muted)]",
};

export const Route = createFileRoute("/_auth/work-orders/")({
  head: () => ({ meta: [{ title: "Work Orders — Civic Sathi" }] }),
  component: WorkOrdersPage,
});

function WorkOrdersPage() {
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [filter, setFilter] = useState("all");

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["muni-work-orders", city],
    queryFn: () => getWorkOrders({ cityId: city }),
    enabled: !!city,
  });

  if (loading) return <LoadingState message="Loading work orders..." />;

  // Filter uses actual backend status values
  const filtered =
    filter === "all" ? orders : orders.filter((o: any) => o.status === filter);

  // Overdue = has a target completion date in the past and is not terminal
  const overdue = orders.filter(
    (o: any) =>
      o.target_completion_date &&
      isPast(new Date(o.target_completion_date)) &&
      !["COMPLETED", "CLOSED"].includes(o.status),
  );

  const filterTabs = [
    "all",
    "ISSUED",
    "IN_PROGRESS",
    "INSPECTION_PENDING",
    "REWORK",
    "COMPLETED",
    "CLOSED",
  ];

  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>{t('ui.work_orders')}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">
            {orders.length} {t('ui.work_order')}{orders.length !== 1 ? "s" : ""}
          </h1>
        </div>
        {overdue.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--critical)_30%,transparent)] bg-[color-mix(in_oklab,var(--critical)_8%,transparent)] px-3 py-2 text-sm">
            <AlertCircle className="h-4 w-4 text-[var(--critical)]" />
            <span className="text-[var(--critical)] font-medium">{overdue.length} {t('ui.overdue')}</span>
          </div>
        )}
      </header>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === s
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "all" ? "All" : (STATUS_LABEL[s] ?? s)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <GlassCard elevation="raised" className="p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
            <p className="mt-4 text-sm text-muted-foreground">{t('ui.no_work_orders_found')}</p>
          </GlassCard>
        ) : (
          (filtered as any[]).map((wo) => {
            const isOverdue =
              wo.target_completion_date &&
              isPast(new Date(wo.target_completion_date)) &&
              !["COMPLETED", "CLOSED"].includes(wo.status);

            return (
              <Link
                key={wo.id}
                to={"/work-orders/$id" as any}
                params={{ id: wo.id } as any}
              >
                <GlassCard
                  elevation="raised"
                  className={cn(
                    "lift p-5 cursor-pointer",
                    isOverdue &&
                      "border-[color-mix(in_oklab,var(--critical)_30%,transparent)]",
                  )}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            STATUS_CHIP[wo.status] ?? STATUS_CHIP["CLOSED"],
                          )}
                        >
                          {STATUS_LABEL[wo.status] ?? wo.status}
                        </span>
                        {isOverdue && (
                          <span className="rounded-full bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--critical)]">
                            {t('ui.overdue')}</span>
                        )}
                        {wo.risk_level && wo.risk_level !== "LOW" && (
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {wo.risk_level} {t('ui.risk')}</span>
                        )}
                      </div>

                      {/* Title — enriched from Tender via backend _enrich_work_order */}
                      <p className="mt-1.5 font-semibold">
                        {wo.title ?? `Work Order – ${wo.id}`}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {/* Contractor name enriched from Contractor model */}
                        {wo.contractor_name && <span>{wo.contractor_name}</span>}
                        {/* Budget from Tender.estimated_budget */}
                        <span>
                          ₹
                          {(wo.estimated_budget ?? wo.award_value ?? 0).toLocaleString("en-IN")}
                        </span>
                        {wo.target_completion_date && (
                          <span>
                            {t('ui.due')}{" "}
                            {isOverdue
                              ? "Overdue"
                              : formatDistanceToNow(new Date(wo.target_completion_date), {
                                  addSuffix: true,
                                })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="label-xs font-mono text-[0.65rem] text-muted-foreground">
                        {wo.id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {safeFormat(wo.created_at, "dd MMM yyyy")}
                      </p>
                      <ArrowUpRight className="mt-2 ml-auto h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
