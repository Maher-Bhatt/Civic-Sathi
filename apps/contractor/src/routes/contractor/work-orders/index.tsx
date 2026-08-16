import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getWorkOrders } from "@/services/api";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/contractor/work-orders/")({
  head: () => ({ meta: [{ title: "Work Orders - Contractor Portal" }] }),
  component: ContractorWorkOrders,
});

// Status values that come back from the backend WorkOrderStatus enum
type FilterStatus = "ALL" | "ISSUED" | "ACCEPTED" | "IN_PROGRESS" | "INSPECTION_PENDING" | "REWORK" | "COMPLETED" | "CLOSED";

const STATUS_LABEL: Record<string, string> = {
  ISSUED: "Issued",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  INSPECTION_PENDING: "Awaiting Inspection",
  INSPECTION_FAILED: "Inspection Failed",
  REWORK: "Rework",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

const STATUS_COLOR: Record<string, string> = {
  ISSUED: "var(--primary)",
  ACCEPTED: "var(--primary)",
  IN_PROGRESS: "var(--warning)",
  INSPECTION_PENDING: "var(--warning)",
  INSPECTION_FAILED: "var(--critical)",
  REWORK: "var(--critical)",
  COMPLETED: "var(--success)",
  CLOSED: "var(--muted-foreground)",
};

function ContractorWorkOrders() {
  const { contractor } = useContractorAuth();
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const {
    data: workOrders = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["contractor-work-orders", contractor?.id],
    queryFn: () => getWorkOrders(),
    // contractor.id is populated after real backend login — no more contractorId dependency
    enabled: !!contractor?.id,
  });

  if (loading) return <LoadingState message="Loading work orders..." />;
  if (error) return <ErrorState description={(error as Error).message ?? "Error loading work orders."} />;

  const filterGroups: Record<FilterStatus, string[]> = {
    ALL: [],
    ISSUED: ["ISSUED"],
    ACCEPTED: ["ACCEPTED"],
    IN_PROGRESS: ["IN_PROGRESS", "REWORK"],
    INSPECTION_PENDING: ["INSPECTION_PENDING", "INSPECTION_FAILED"],
    REWORK: ["REWORK"],
    COMPLETED: ["COMPLETED"],
    CLOSED: ["CLOSED"],
  };

  const filtered =
    filter === "ALL"
      ? workOrders
      : workOrders.filter((wo: any) => filterGroups[filter]?.includes(wo.status));

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Issued", value: "ISSUED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Awaiting Inspection", value: "INSPECTION_PENDING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Closed", value: "CLOSED" },
  ];

  return (
    <div className="space-y-6 animate-fade">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-4">Work Orders</h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                filter === tab.value
                  ? "bg-[var(--surface-elevated)] border-[var(--primary)]/50 text-[var(--foreground)] shadow-sm"
                  : "bg-[var(--surface)] border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--muted-foreground)] bg-[var(--surface)] rounded-xl border border-[var(--glass-border)]">
            No work orders found for the selected filter.
          </div>
        ) : (
          filtered.map((wo: any) => (
            <Link
              key={wo.id}
              to={"/contractor/work-orders/$id" as any}
              params={{ id: wo.id } as any}
              className="block group"
            >
              <GlassCard className="p-5 glass-strong h-full flex flex-col gap-4 lift transition-all hover:border-[var(--primary)]/40 hover:shadow-md">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-xs px-2 py-1 bg-[var(--surface-elevated)] rounded border border-[var(--glass-border)] text-[var(--muted-foreground)] truncate max-w-[120px]">
                    {wo.id}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface)] shrink-0"
                    style={{ color: STATUS_COLOR[wo.status] ?? "var(--foreground)" }}
                  >
                    {STATUS_LABEL[wo.status] ?? wo.status}
                  </span>
                </div>

                <h3 className="font-medium text-lg leading-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {wo.title ?? "Work Order"}
                </h3>

                <div className="space-y-2 mt-auto pt-4 text-sm text-[var(--muted-foreground)] border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 opacity-70" />
                    <span className="truncate">{wo.department_id ? `Dept: ${wo.department_id}` : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="shrink-0 opacity-70" />
                    <span>
                      Issued:{" "}
                      {wo.created_at ? new Date(wo.created_at).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  {wo.target_completion_date && (
                    <div className="flex items-center gap-2">
                      <Clock
                        size={14}
                        className={`shrink-0 ${new Date(wo.target_completion_date) < new Date() ? "text-[var(--critical)]" : "opacity-70"}`}
                      />
                      <span
                        className={
                          new Date(wo.target_completion_date) < new Date()
                            ? "text-[var(--critical)]"
                            : ""
                        }
                      >
                        Due: {new Date(wo.target_completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      ₹{(wo.award_value ?? 0).toLocaleString("en-IN")}
                    </span>
                    {wo.risk_level && (
                      <span
                        className={`ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          wo.risk_level === "HIGH" || wo.risk_level === "CRITICAL"
                            ? "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_10%,transparent)]"
                            : "text-[var(--muted-foreground)] bg-[var(--surface-elevated)]"
                        }`}
                      >
                        {wo.risk_level} risk
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
