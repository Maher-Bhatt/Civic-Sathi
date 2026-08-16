import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { ClipboardList, ArrowUpRight, AlertCircle } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getWorkOrders } from "@/services/api";
import { workOrderStatusLabel, workOrderStatusColor, type WorkOrder } from "@/services/types";
import { cn } from "@/lib/utils";

const STATUS_COLOR_MAP: Record<string, string> = {
  success: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  warning: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  primary: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  muted: "text-[var(--muted-foreground)] bg-[var(--muted)]",
};

export const Route = createFileRoute("/_auth/work-orders/")({ 
  head: () => ({ meta: [{ title: "Work Orders — JANMIND" }] }), 
  component: WorkOrdersPage 
});

function WorkOrdersPage() {
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getWorkOrders({ cityId: city }).then(setOrders).finally(() => setLoading(false));
  }, [city]);

  if (loading) return <LoadingState message="Loading work orders..." />;

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const overdue = orders.filter(o => isPast(new Date(o.slaDeadline)) && o.status !== "CLOSED");

  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Work Orders</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">{orders.length} work order{orders.length !== 1 ? "s" : ""}</h1>
        </div>
        {overdue.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--critical)_30%,transparent)] bg-[color-mix(in_oklab,var(--critical)_8%,transparent)] px-3 py-2 text-sm">
            <AlertCircle className="h-4 w-4 text-[var(--critical)]" />
            <span className="text-[var(--critical)] font-medium">{overdue.length} overdue</span>
          </div>
        )}
      </header>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "IN_PROGRESS", "SUBMITTED_FOR_INSPECTION", "BILL_SUBMITTED", "CLOSED"].map(s => (
          <button key={s} type="button" onClick={() => setFilter(s)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === s ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "glass text-muted-foreground hover:text-foreground"
            )}>
            {s === "all" ? "All" : workOrderStatusLabel(s as any)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <GlassCard elevation="raised" className="p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
            <p className="mt-4 text-sm text-muted-foreground">No work orders found.</p>
          </GlassCard>
        ) : (
          filtered.map(wo => {
            const isOverdue = isPast(new Date(wo.slaDeadline)) && wo.status !== "CLOSED";
            const colorKey = workOrderStatusColor(wo.status);
            return (
              <Link key={wo.id} to={"/work-orders/$id" as any} params={{ id: wo.id } as any}>
                <GlassCard elevation="raised" className={cn("lift p-5 cursor-pointer", isOverdue && "border-[color-mix(in_oklab,var(--critical)_30%,transparent)]")}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR_MAP[colorKey] ?? STATUS_COLOR_MAP["muted"])}>
                          {workOrderStatusLabel(wo.status)}
                        </span>
                        {isOverdue && <span className="rounded-full bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--critical)]">OVERDUE</span>}
                        <span className="text-xs text-muted-foreground font-medium">{wo.priority}</span>
                      </div>
                      <p className="mt-1.5 font-semibold">{wo.title}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>{wo.contractorName}</span>
                        <span>{wo.ward}, {wo.area}</span>
                        <span>₹{(wo.approvedAmount ?? wo.estimatedCost).toLocaleString("en-IN")}</span>
                        <span>SLA: {isPast(new Date(wo.slaDeadline)) ? "Overdue" : formatDistanceToNow(new Date(wo.slaDeadline), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="label-xs">{wo.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{format(new Date(wo.createdAt), "dd MMM yyyy")}</p>
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
