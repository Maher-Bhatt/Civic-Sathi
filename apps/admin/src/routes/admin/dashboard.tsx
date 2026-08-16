import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAuditLogs, getContractors, getWorkOrders, getAllEvidence } from "@/services/shared-store";
import type { Contractor, WorkOrder, AuditLog } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { Building2, ClipboardList, Shield, Timer, Users, AlertCircle, CheckCircle2, ShieldAlert, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | JANMIND" }] }),
  component: AdminDashboardContent,
});

function AdminDashboardContent() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, w, a, e] = await Promise.all([
          getContractors(),
          getWorkOrders(),
          getAuditLogs(),
          getAllEvidence()
        ]);
        setContractors(c);
        setWorkOrders(w);
        setAuditLogs(a.slice(0, 8)); // latest 8
        setEvidenceList(e);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading administrative intelligence..." />;

  const verifiedContractors = contractors.filter(c => c.status === "VERIFIED").length;
  const pendingContractors = contractors.filter(c => c.status === "PENDING_VERIFICATION").length;
  const activeWorkOrders = workOrders.filter(w => !["COMPLETED", "CANCELLED", "CLOSED"].includes(w.status)).length;

  const flaggedEvidenceCount = evidenceList.filter(e => e.status === "FLAGGED").length;
  const totalEvidenceCount = evidenceList.length;
  const evidenceHealthRate = totalEvidenceCount > 0 ? Math.round(((totalEvidenceCount - flaggedEvidenceCount) / totalEvidenceCount) * 100) : 100;
  
  // Calculate High Risk Contractors (those with score < 60)
  const highRiskContractors = contractors.filter(c => c.performanceScore !== undefined && c.performanceScore < 60).length;

  const chartData = contractors
    .filter(c => c.performanceScore !== undefined)
    .slice(0, 5)
    .map(c => ({
      name: c.companyName.substring(0, 15) + (c.companyName.length > 15 ? '...' : ''),
      score: c.performanceScore || 0
    }));

  return (
    <div className="space-y-8 muni-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Dashboard</h1>
          <p className="text-[var(--muted-foreground)]">Overview of system health and platform metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Contractors" value={contractors.length} icon={Building2} />
        <StatCard title="Pending Verif." value={pendingContractors} icon={AlertCircle} alert={pendingContractors > 0} />
        <StatCard title="High Risk Cont." value={highRiskContractors} icon={ShieldAlert} alert={highRiskContractors > 0} />
        <StatCard title="Active Work" value={activeWorkOrders} icon={ClipboardList} />
        <StatCard title="Total Evidence" value={totalEvidenceCount} icon={CheckCircle2} />
        <StatCard title="Evidence Health" value={evidenceHealthRate} suffix="%" icon={Activity} alert={evidenceHealthRate < 90} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <SectionLabel>Contractor Performance Distribution</SectionLabel>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--surface-elevated)' }}
                  contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="score" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col">
          <SectionLabel>Quick Actions</SectionLabel>
          <div className="mt-4 flex flex-col gap-3">
            <ActionLink to="/admin/contractors" icon={Building2} label="Manage Contractors" />
            <ActionLink to="/admin/sla" icon={Timer} label="Configure SLA Rules" />
            <ActionLink to="/admin/audit-logs" icon={Shield} label="Review Audit Logs" />
            <ActionLink to="/admin/work-orders-overview" icon={ClipboardList} label="Platform Work Orders" />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <SectionLabel>Recent System Activity</SectionLabel>
          <Link to={"/admin/audit-logs" as any} className="text-sm hover:underline text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)]">
                <th className="pb-3 px-4 font-medium">Time</th>
                <th className="pb-3 px-4 font-medium">Actor</th>
                <th className="pb-3 px-4 font-medium">Action</th>
                <th className="pb-3 px-4 font-medium">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-[var(--muted-foreground)]">
                    {new Date(log.at).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{log.actorName}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs border border-[var(--glass-border)] bg-[var(--surface-elevated)]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">{log.entityType} ({log.entityId.substring(0, 8)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function StatCard({ title, value, suffix = "", icon: Icon, alert }: { title: string, value: number, suffix?: string, icon: any, alert?: boolean }) {
  return (
    <GlassCard className={`p-6 ${alert ? 'border-[var(--warning)]/50 bg-[var(--warning)]/5' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}{suffix}</p>
        </div>
        <div className={`p-2 rounded-md ${alert ? 'bg-[var(--warning)]/20 text-[var(--warning)]' : 'bg-[var(--surface-elevated)] border border-[var(--glass-border)]'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </GlassCard>
  );
}

function ActionLink({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <Link 
      to={to as any} 
      className="flex items-center gap-3 p-3 rounded-md border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--background)] transition-colors lift"
    >
      <Icon className="w-5 h-5 text-[var(--muted-foreground)]" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
