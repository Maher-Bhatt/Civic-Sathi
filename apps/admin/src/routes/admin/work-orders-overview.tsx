import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getWorkOrders } from "@/services/shared-store";
import type { WorkOrder } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/admin/work-orders-overview")({
  head: () => ({ meta: [{ title: "Work Orders Overview | Admin | JANMIND" }] }),
  component: WorkOrdersOverview,
});

function WorkOrdersOverview() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getWorkOrders();
        setWorkOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading platform overview..." />;

  // Aggregate status
  const statusCounts = workOrders.reduce((acc, wo) => {
    acc[wo.status] = (acc[wo.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    count
  }));

  return (
    <div className="space-y-6 muni-page-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Work Orders</h1>
        <p className="text-[var(--muted-foreground)]">Global view of all municipal work orders</p>
      </div>

      <GlassCard className="p-6">
        <SectionLabel>Global Work Order Distribution</SectionLabel>
        <div className="h-64 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'var(--surface-elevated)' }}
                contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--surface-elevated)]/50">
                <th className="py-3 px-4 font-medium">ID / Title</th>
                <th className="py-3 px-4 font-medium">Municipality</th>
                <th className="py-3 px-4 font-medium">Contractor</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">SLA Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-[var(--surface-elevated)]/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium">{wo.title}</div>
                    <div className="text-xs text-[var(--muted-foreground)] font-mono">{wo.id.substring(0, 8)}</div>
                  </td>
                  <td className="py-3 px-4">{wo.cityId} - {wo.department}</td>
                  <td className="py-3 px-4 text-xs">{wo.contractorName || wo.contractorId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded text-xs font-medium border border-[var(--glass-border)] bg-[var(--surface-elevated)]">
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] text-xs">
                    {wo.slaDeadline ? new Date(wo.slaDeadline).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)]">
                    No work orders found in the platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
