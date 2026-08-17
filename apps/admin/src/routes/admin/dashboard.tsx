import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPlatformStats, listRealWorkOrders } from "@/services/shared-store";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import {
  Building2, ClipboardList, Shield, Timer, Users, AlertCircle,
  CheckCircle2, ShieldAlert, Activity, FileText, MapPin,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | JANMIND" }] }),
  component: AdminDashboardContent,
});

const STATUS_COLORS: Record<string, string> = {
  "DRAFT":              "#6c757d",
  "PUBLISHED":          "#3498db",
  "IN PROGRESS":        "#f39c12",
  "COMPLETED":          "#27ae60",
  "INSPECTION PENDING": "#9b59b6",
  "INSPECTION FAILED":  "#e74c3c",
  "REWORK":             "#e67e22",
  "CANCELLED":          "#95a5a6",
  "CLOSED":             "#1abc9c",
};

function AdminDashboardContent() {
    const { t } = useI18n();
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
        {t('ui.make_sure_you_are_logged_in_wi')}</p>
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
          <SectionLabel>{t('ui.live_platform_data')}</SectionLabel>
          <h1 className="text-2xl font-bold tracking-tight">{t('ui.platform_dashboard')}</h1>
          <p className="text-[var(--muted-foreground)]">{t('ui.real_time_overview_from_the_ba')}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard title={t('ui.total_users')}      value={stats?.total_users ?? 0}         icon={Users} />
        <StatCard title={t('ui.officers')}         value={stats?.total_officers ?? 0}      icon={Shield} />
        <StatCard title={t('ui.contractors')}      value={stats?.total_contractors ?? 0}   icon={Building2} />
        <StatCard title={t('ui.active_work')}      value={stats?.active_work_orders ?? 0}  icon={ClipboardList} accent="warning" />
        <StatCard title={t('ui.open_complaints')}  value={stats?.open_complaints ?? 0}     icon={FileText} alert={(stats?.open_complaints ?? 0) > 100} />
        <StatCard title={t('ui.cities')}           value={stats?.total_cities ?? 0}        icon={MapPin} accent="success" />
      </div>

      {/* Complaints breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t('ui.total_complaints')}</p>
          <p className="text-3xl font-bold mt-1">{(stats?.total_complaints ?? 0).toLocaleString('en-IN')}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t('ui.resolved')}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#27ae60" }}>{(stats?.resolved_complaints ?? 0).toLocaleString('en-IN')}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t('ui.civic_issues')}</p>
          <p className="text-3xl font-bold mt-1">{(stats?.total_issues ?? 0).toLocaleString('en-IN')}</p>
        </GlassCard>
      </div>

      {/* Work order status chart + recent list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <SectionLabel>{t('ui.work_order_status_distribution')}</SectionLabel>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                <defs>
                  {chartData.map((entry, i) => (
                    <linearGradient key={entry.name} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={STATUS_COLORS[entry.name] ?? "#3d9970"} stopOpacity={1} />
                      <stop offset="100%" stopColor={STATUS_COLORS[entry.name] ?? "#3d9970"} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {chartData.map((entry, i) => (
                    <Cell key={entry.name} fill={`url(#barGrad${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionLabel>{t('ui.recent_work_orders')}</SectionLabel>
          <div className="mt-3 space-y-2">
            {workOrders.length === 0 && (
              <p className="text-[var(--muted-foreground)] text-sm py-4 text-center">{t('ui.no_work_orders_yet')}</p>
            )}
            {workOrders.map((wo: any) => (
              <div key={wo.id} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]/40 last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{wo.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{wo.contractor_name} · {wo.city}</p>
                </div>
                <span className="ml-3 flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{
                  background: `${STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970"}20`,
                  color: STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970",
                  border: `1px solid ${STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970"}40`,
                }}>
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

function StatCard({ title, value, icon: Icon, suffix = "", alert = false, accent = "default" }: {
  title: string; value: number; icon: any; suffix?: string; alert?: boolean; accent?: string;
}) {
    const { t } = useI18n();
  const accentColor = alert
    ? "var(--critical)"
    : accent === "success"
    ? "#27ae60"
    : accent === "warning"
    ? "#f39c12"
    : "var(--primary)";

  return (
    <GlassCard className="p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: accentColor }} />
      <div className="flex items-center justify-between mb-2 pl-2">
        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{title}</p>
        <div className="p-1.5 rounded-lg" style={{ background: `${accentColor}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-2xl font-bold pl-2" style={{ color: alert ? accentColor : undefined }}>
        {value.toLocaleString('en-IN')}{suffix}
      </p>
    </GlassCard>
  );
}

