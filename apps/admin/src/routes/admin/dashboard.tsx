import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Activity, ShieldAlert, CheckCircle2, Server, Database, Globe2, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/dashboard")({
  component: CommandCenterDashboard,
});

function CommandCenterDashboard() {
  const [health] = useState({
    municipal: { status: "online", ping: 42, uptime: "99.9%" },
    water: { status: "online", ping: 120, uptime: "98.5%" },
    road: { status: "degraded", ping: 450, uptime: "94.2%" },
    drainage: { status: "online", ping: 85, uptime: "99.1%" },
    contractor: { status: "online", ping: 60, uptime: "99.5%" },
  });

  return (
    <div className="muni-page-enter space-y-8 p-6 pb-24 max-w-7xl mx-auto">
      <header>
        <SectionLabel>National Command Center</SectionLabel>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Civic Sathi Integration Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Multi-city telemetry, cross-department routing, and SLA tracking across India.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5">
          <SectionLabel>Active Cases</SectionLabel>
          <p className="text-3xl font-bold mt-2">14,239</p>
          <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
        </GlassCard>
        <GlassCard className="p-5 border-[var(--critical)]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-[var(--critical)]/10 rounded-bl-xl text-[var(--critical)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <SectionLabel className="text-[var(--critical)]">SLA Breaches</SectionLabel>
          <p className="text-3xl font-bold mt-2 text-[var(--critical)]">412</p>
          <p className="text-xs text-[var(--critical)]/80 mt-1 font-medium">Require immediate escalation</p>
        </GlassCard>
        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-blue-500/10 rounded-bl-xl text-blue-500">
            <Globe2 className="h-5 w-5" />
          </div>
          <SectionLabel>Cross-Department Routing</SectionLabel>
          <p className="text-3xl font-bold mt-2">3,892</p>
          <p className="text-xs text-muted-foreground mt-1">Handled automatically by AI</p>
        </GlassCard>
        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-[var(--success)]/10 rounded-bl-xl text-[var(--success)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <SectionLabel>Duplicate Reports Blocked</SectionLabel>
          <p className="text-3xl font-bold mt-2 text-[var(--success)]">8,451</p>
          <p className="text-xs text-muted-foreground mt-1">Saved 12,000+ man-hours via ML matching</p>
        </GlassCard>
      </div>

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
    </div>
  );
}
