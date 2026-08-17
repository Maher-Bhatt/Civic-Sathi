import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getWorkOrders } from "@/services/shared-store";
import type { WorkOrder } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/work-orders-overview")({
  head: () => ({ meta: [{ title: "Work Orders Overview | Admin | JANMIND" }] }),
  component: WorkOrdersOverview,
});

const WO_STATUS_COLORS: Record<string, string> = {
  "DRAFT":              "#74b9ff",
  "PUBLISHED":          "#0984e3",
  "IN_PROGRESS":        "#fdcb6e",
  "COMPLETED":          "#00b894",
  "INSPECTION_PENDING": "#a29bfe",
  "INSPECTION_FAILED":  "#d63031",
  "REWORK":             "#e17055",
  "CANCELLED":          "#636e72",
  "CLOSED":             "#55efc4",
};

function WorkOrdersOverview() {
    const { t } = useI18n();
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
        <h1 className="text-2xl font-bold tracking-tight">{t('ui.platform_work_orders')}</h1>
        <p className="text-[var(--muted-foreground)]">{t('ui.global_view_of_all_municipal_w')}</p>
      </div>

      <GlassCard className="p-6">
        <SectionLabel>{t('ui.global_work_order_distribution')}</SectionLabel>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">{t('ui.status_breakdown_across_all_ci')}</p>
        <div className="h-72 mt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <defs>
                {chartData.map((entry, i) => (
                  <linearGradient key={entry.name} id={`woGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={WO_STATUS_COLORS[entry.name] ?? "#3d9970"} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={WO_STATUS_COLORS[entry.name] ?? "#3d9970"} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.07)" />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "var(--surface-elevated)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                formatter={(value: any) => [value, "Work Orders"]}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.name} fill={`url(#woGrad${i})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--surface-elevated)]/50">
                <th className="py-3 px-4 font-medium">{t('ui.id_title')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.municipality')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.contractor')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.status')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.sla_deadline')}</th>
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
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                      background: `${WO_STATUS_COLORS[wo.status] ?? "#3d9970"}20`,
                      color: WO_STATUS_COLORS[wo.status] ?? "#3d9970",
                      border: `1px solid ${WO_STATUS_COLORS[wo.status] ?? "#3d9970"}40`,
                    }}>
                      {wo.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] text-xs">
                    {wo.slaDeadline ? new Date(wo.slaDeadline).toLocaleDateString('en-IN') : "N/A"}
                  </td>
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)]">
                    {t('ui.no_work_orders_found_in_the_pl')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

