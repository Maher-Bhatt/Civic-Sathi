import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getWorkOrders } from "@/services/api";
import { WorkOrder, workOrderStatusLabel, workOrderStatusColor } from "@/services/types";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { MapPin, Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/contractor/work-orders/")({
  head: () => ({ meta: [{ title: "Work Orders - Contractor Portal" }] }),
  component: ContractorWorkOrders,
});

type FilterStatus = "ALL" | "PENDING_ACCEPTANCE" | "IN_PROGRESS" | "SUBMITTED_FOR_INSPECTION" | "COMPLETED";

function ContractorWorkOrders() {
  const { contractor } = useContractorAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  useEffect(() => {
    async function loadData() {
      if (!contractor?.contractorId) return;
      try {
        const data = await getWorkOrders();
        setWorkOrders(data as any[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contractor]);

  if (loading) return <LoadingState message="Loading work orders..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading work orders."} />;

  const filteredOrders = workOrders.filter(wo => {
    if (filter === "ALL") return true;
    if (filter === "PENDING_ACCEPTANCE") return wo.status === "PENDING_ACCEPTANCE";
    if (filter === "IN_PROGRESS") return wo.status === "IN_PROGRESS" || wo.status === "MOBILIZATION" || wo.status === "REWORK";
    if (filter === "SUBMITTED_FOR_INSPECTION") return wo.status === "SUBMITTED_FOR_INSPECTION" || wo.status === "RESUBMITTED" || wo.status === "MEASUREMENT_PENDING";
    if (filter === "COMPLETED") return wo.status === "COMPLETED" || wo.status === "CLOSED";
    return true;
  });

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending Acceptance", value: "PENDING_ACCEPTANCE" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Submitted/Inspection", value: "SUBMITTED_FOR_INSPECTION" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="space-y-6 animate-fade">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-4">Work Orders</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterTabs.map(tab => (
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
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--muted-foreground)] bg-[var(--surface)] rounded-xl border border-[var(--glass-border)]">
            No work orders found for the selected filter.
          </div>
        ) : (
          filteredOrders.map(wo => (
            <Link 
              key={wo.id} 
              to={"/contractor/work-orders/$id" as any} 
              params={{ id: wo.id } as any}
              className="block group"
            >
              <GlassCard className="p-5 glass-strong h-full flex flex-col gap-4 lift transition-all hover:border-[var(--primary)]/40 hover:shadow-md">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-xs px-2 py-1 bg-[var(--surface-elevated)] rounded border border-[var(--glass-border)] text-[var(--muted-foreground)]">
                    {wo.id}
                  </span>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface)]" 
                    style={{ color: workOrderStatusColor(wo.status) }}
                  >
                    {workOrderStatusLabel(wo.status)}
                  </span>
                </div>
                
                <h3 className="font-medium text-lg leading-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {wo.title}
                </h3>
                
                <div className="space-y-2 mt-auto pt-4 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 opacity-70" />
                    <span className="truncate">{wo.ward ? `${wo.ward}, ${wo.area}` : `${(wo as any).location?.ward ?? ""}, ${(wo as any).location?.zone ?? ""}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="shrink-0 opacity-70" />
                    <span>Issued: {new Date(wo.createdAt || (wo as any).issueDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="shrink-0 opacity-70" />
                    <span className={new Date(wo.slaDeadline) < new Date() ? "text-[var(--critical)]" : ""}>
                      Deadline: {new Date(wo.slaDeadline).toLocaleDateString()}
                    </span>
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
