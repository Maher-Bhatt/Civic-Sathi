import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPlatformStats, listRealWorkOrders } from "@/services/shared-store";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import {
  Building2, ClipboardList, Shield, Timer, Users, AlertCircle,
  CheckCircle2, ShieldAlert, Activity, FileText, MapPin,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | JANMIND" }] }),
  component: AdminDashboardContent,
});

function AdminDashboardContent() {
  const [stats, setStats]       = useState<any>(null);
  const [workOrders, setWOs]    = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, w] = await Promise.all([getPlatformStats(), listRealWorkOrders()]);
        setStats(s);
        setWOs(w.slice(0, 8));
      } catch (e: any) {
        setError(e.message ?? "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading administrative intelligence..." />;
  if (error)   return (
    <div className="p-8 text-center text-[var(--critical)]">
      <AlertCircle className="w-8 h-8 mx-auto mb-3" />
      <p className="font-semibold">{error}</p>
      <p className="text-sm text-[var(--muted-foreground)] mt-2">
        Make sure you are logged in with an admin account.
      </p>
    </div>
  );

  const woStatusCounts = workOrders.reduce((acc: any, wo: any) => {
    acc[wo.status] = (acc[wo.status] ?? 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(woStatusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, " "),
    count,
  }));

  return (
    <div className="space-y-8 muni-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <SectionLabel>Live Platform Data</SectionLabel>
          <h1 className="text-2xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="text-[var(--muted-foreground)]">Real-time overview from the backend database</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard title="Total Users"      value={stats?.total_users ?? 0}         icon={Users} />
        <StatCard title="Officers"         value={stats?.total_officers ?? 0}      icon={Shield} />
        <StatCard title="Contractors"      value={stats?.total_contractors ?? 0}   icon={Building2} />
        <StatCard title="Active Work"      value={stats?.active_work_orders ?? 0}  icon={ClipboardList} />
        <StatCard title="Open Complaints"  value={stats?.open_complaints ?? 0}     icon={FileText} alert={(stats?.open_complaints ?? 0) > 100} />
        <StatCard title="Cities"           value={stats?.total_cities ?? 0}        icon={MapPin} />
      </div>

      {/* Complaints breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">Total Complaints</p>
          <p className="text-3xl font-bold mt-1">{(stats?.total_complaints ?? 0).toLocaleString()}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">Resolved</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{(stats?.resolved_complaints ?? 0).toLocaleString()}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">Civic Issues</p>
          <p className="text-3xl font-bold mt-1">{(stats?.total_issues ?? 0).toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Work order status chart + recent list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <SectionLabel>Work Order Status Distribution</SectionLabel>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionLabel>Recent Work Orders</SectionLabel>
          <div className="mt-3 space-y-2">
            {workOrders.length === 0 && (
              <p className="text-[var(--muted-foreground)] text-sm py-4 text-center">No work orders yet</p>
            )}
            {workOrders.map((wo: any) => (
              <div key={wo.id} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]/40 last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{wo.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{wo.contractor_name} · {wo.city}</p>
                </div>
                <span className={`ml-3 flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded uppercase border ${
                  wo.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                  wo.status === "IN_PROGRESS" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                  "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border-[var(--glass-border)]"
                }`}>
                  {wo.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, suffix = "", alert = false }: {
  title: string; value: number; icon: any; suffix?: string; alert?: boolean;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{title}</p>
        <Icon className={`w-4 h-4 ${alert ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}`} />
      </div>
      <p className={`text-2xl font-bold ${alert ? "text-[var(--critical)]" : ""}`}>
        {value.toLocaleString()}{suffix}
      </p>
    </GlassCard>
  );
}


