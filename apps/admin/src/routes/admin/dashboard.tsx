import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ShieldAlert, CheckCircle2, Globe2, AlertCircle, RefreshCw, Activity } from "lucide-react";
import { useState } from "react";
import { getCommandCenterSnapshot, getAuditLogs } from "@/services/shared-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  component: CommandCenterDashboard,
});

const COLORS = {
  primary: "var(--primary)",
  saffron: "var(--saffron)",
  success: "var(--success)",
  critical: "var(--critical)",
  warning: "var(--warning)",
  muted: "hsl(var(--muted-foreground))"
};

// Mock data for trends
const mockMonthlyTrend = [
  { name: 'Jan', filed: 4000, resolved: 2400 },
  { name: 'Feb', filed: 3000, resolved: 1398 },
  { name: 'Mar', filed: 2000, resolved: 9800 },
  { name: 'Apr', filed: 2780, resolved: 3908 },
  { name: 'May', filed: 1890, resolved: 4800 },
  { name: 'Jun', filed: 2390, resolved: 3800 },
];

const mockDepartmentLoad = [
  { name: 'Water', issues: 400 },
  { name: 'Road', issues: 300 },
  { name: 'Drainage', issues: 300 },
  { name: 'Sanitation', issues: 200 },
  { name: 'Electrical', issues: 100 },
];

function CommandCenterDashboard() {
  const { data: snapshot } = useQuery({
    queryKey: ["command-center-snapshot"],
    queryFn: getCommandCenterSnapshot,
    refetchInterval: 30000,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => getAuditLogs({ limit: 5 }),
    refetchInterval: 60000,
  });

  const [health] = useState({
    municipal: { status: "online", ping: 42, uptime: "99.9%" },
    water: { status: "online", ping: 120, uptime: "98.5%" },
    road: { status: "degraded", ping: 450, uptime: "94.2%" },
    drainage: { status: "online", ping: 85, uptime: "99.1%" },
    contractor: { status: "online", ping: 60, uptime: "99.5%" },
  });

  const cityData = snapshot?.cities ?? [];
  const statusData = snapshot?.complaint_status ? [
    { name: 'Assigned', value: snapshot.complaint_status.assigned ?? 0 },
    { name: 'Resolved', value: snapshot.complaint_status.resolved ?? 0 },
    { name: 'In Progress', value: snapshot.complaint_status.in_progress ?? 0 },
  ] : [];

  const resolutionRate = snapshot?.platform?.total_complaints 
    ? ((snapshot.platform.resolved_complaints ?? 0) / snapshot.platform.total_complaints * 100).toFixed(1)
    : "0";

  return (
    <div className="muni-page-enter space-y-8 p-6 pb-24 max-w-7xl mx-auto">
      <header>
        <SectionLabel>National Command Center</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Civic Sathi Integration Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Multi-city telemetry, cross-department routing, and SLA tracking across India.</p>
      </header>

      {/* 1. KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5">
          <SectionLabel>Total Complaints</SectionLabel>
          <p className="text-3xl font-bold mt-2">{snapshot?.platform?.total_complaints?.toLocaleString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-1">Live from API</p>
        </GlassCard>
        
        <GlassCard className="p-5 border-[var(--critical)]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-[var(--critical)]/10 rounded-bl-xl text-[var(--critical)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <SectionLabel className="text-[var(--critical)]">SLA Breaches</SectionLabel>
          <p className="text-3xl font-bold mt-2 text-[var(--critical)]">{(snapshot?.complaint_status?.assigned ?? 0).toLocaleString()}</p>
          <p className="text-xs text-[var(--critical)]/80 mt-1 font-medium">Require immediate escalation</p>
        </GlassCard>

        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-[var(--success)]/10 rounded-bl-xl text-[var(--success)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <SectionLabel>Resolution Rate</SectionLabel>
          <p className="text-3xl font-bold mt-2 text-[var(--success)]">{resolutionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Platform wide</p>
        </GlassCard>

        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-blue-500/10 rounded-bl-xl text-blue-500">
            <Globe2 className="h-5 w-5" />
          </div>
          <SectionLabel>Active Cities</SectionLabel>
          <p className="text-3xl font-bold mt-2">{snapshot?.platform?.total_cities?.toLocaleString() ?? "0"}</p>
          <p className="text-xs text-muted-foreground mt-1">Integrated nodes</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. City-Wise Breakdown */}
        <GlassCard className="p-5">
          <SectionLabel>City-Wise Breakdown</SectionLabel>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--glass-border)' }} />
                <Legend />
                <Bar dataKey="open" stackId="a" fill="var(--saffron)" name="Open" />
                <Bar dataKey="in_progress" stackId="a" fill="var(--warning)" name="In Progress" />
                <Bar dataKey="resolved" stackId="a" fill="var(--success)" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 3. Complaint Status Distribution */}
        <GlassCard className="p-5">
          <SectionLabel>Status Distribution</SectionLabel>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => {
                    const colors = [COLORS.critical, COLORS.success, COLORS.warning];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--glass-border)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 4. Monthly Trend Line */}
        <GlassCard className="p-5">
          <SectionLabel>Monthly Trends</SectionLabel>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--glass-border)' }} />
                <Legend />
                <Line type="monotone" dataKey="filed" stroke="var(--critical)" name="Filed" />
                <Line type="monotone" dataKey="resolved" stroke="var(--success)" name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* 5. Department-wise Load */}
        <GlassCard className="p-5">
          <SectionLabel>Department-wise Load</SectionLabel>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDepartmentLoad} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" stroke="currentColor" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="currentColor" fontSize={12} width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--glass-border)' }} />
                <Bar dataKey="issues" fill="var(--primary)" name="Active Issues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* 6. System Health */}
      <section>
        <SectionLabel>System Integration Dashboard (API Status)</SectionLabel>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(health).map(([system, data]) => (
            <GlassCard key={system} className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold capitalize">{system} API</span>
                {data.status === "online" ? <CheckCircle2 className="h-4 w-4 text-[var(--success)]" /> : <AlertCircle className="h-4 w-4 text-orange-500 animate-pulse" />}
              </div>
              <div className="space-y-1 mt-2 bg-[var(--surface-elevated)]/50 p-2 rounded-md">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Sync Status</span>
                  <span className={data.status === "online" ? "text-[var(--success)] font-semibold" : "text-orange-500 font-semibold"}>{data.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Latency</span>
                  <span className="font-mono">{data.ping}ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Uptime</span>
                  <span className="font-mono">{data.uptime}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 7. Live Cross-Department AI Routing */}
      <section>
        <SectionLabel>Live Cross-Department AI Routing Pipeline</SectionLabel>
        <GlassCard className="mt-4 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-[var(--surface-elevated)] text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Unified Case ID</th>
                  <th className="px-4 py-3 font-semibold">Original Citizen Report</th>
                  <th className="px-4 py-3 font-semibold">AI Routing Decision (Multi-Dept)</th>
                  <th className="px-4 py-3 font-semibold">API Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                <tr className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                  <td className="px-4 py-4 font-mono font-medium text-xs">MH-2026-000842</td>
                  <td className="px-4 py-4 max-w-[250px] truncate" title="Water pipe burst destroying main road near station">Water pipe burst destroying main road...</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Water Dept API</span>
                      <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Road Dept API</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" /> SYNCED TO ALL
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                  <td className="px-4 py-4 font-mono font-medium text-xs">MH-2026-000843</td>
                  <td className="px-4 py-4 max-w-[250px] truncate" title="Open drainage overflowing into municipal park">Open drainage overflowing into muni...</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Drainage API</span>
                      <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Municipal Portal</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> SYNCING (RETRIES: 1)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                  <td className="px-4 py-4 font-mono font-medium text-xs">MH-2026-000844</td>
                  <td className="px-4 py-4 max-w-[250px] truncate" title="Multiple potholes near market square causing traffic">Multiple potholes near market squar...</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Road Dept API</span>
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">Contractor System</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" /> SYNCED TO ALL
                    </span>
                  </td>
                </tr>
                
                 <tr className="hover:bg-[var(--surface-elevated)]/50 transition-colors opacity-60">
                  <td className="px-4 py-4 font-mono font-medium text-xs">MH-2026-000845</td>
                  <td className="px-4 py-4 max-w-[250px] truncate" title="Garbage dump burning next to school">Garbage dump burning next to school</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 px-2 py-0.5 rounded text-[11px] font-semibold">Municipal Portal</span>
                      <span className="bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 px-2 py-0.5 rounded text-[11px] font-semibold">Fire Dept API</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      <AlertCircle className="h-3.5 w-3.5" /> FAILED: FIRE API DOWN
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* 8. Recent Activity Feed */}
      <section>
        <SectionLabel>Recent Activity Feed</SectionLabel>
        <div className="mt-4 space-y-3">
          {auditLogs?.length ? auditLogs.map((log) => (
            <GlassCard key={log.id} className="p-4 flex gap-4 items-start">
              <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{log.actorName}</span> ({log.actorRole}) performed <span className="font-medium text-[var(--primary)]">{log.action}</span> on {log.entityType} <span className="font-mono text-xs">{log.entityId}</span>
                </p>
                {log.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {log.reason}</p>}
                <p className="text-xs text-muted-foreground mt-1">{new Date(log.at).toLocaleString()}</p>
              </div>
            </GlassCard>
          )) : (
            <GlassCard className="p-4 text-sm text-muted-foreground">
              No recent activity found.
            </GlassCard>
          )}
        </div>
      </section>
    </div>
  );
}
