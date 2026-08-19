import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getPlatformStats,
  listRealWorkOrders,
  getCachedPlatformStats,
  getCachedWorkOrders,
  createUser,
  createRealContractor,
  getCommandCenterSnapshot,
} from "@/services/shared-store";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import {
  Building2,
  ClipboardList,
  Shield,
  Timer,
  Users,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  FileText,
  MapPin,
  Plus,
  ArrowRight,
  Database,
  Server,
  Sparkles,
  RefreshCw,
  Network,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | Civic Sathi" }] }),
  component: AdminDashboardContent,
});

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#6c757d",
  PUBLISHED: "#3498db",
  "IN PROGRESS": "#f39c12",
  COMPLETED: "#27ae60",
  "INSPECTION PENDING": "#9b59b6",
  "INSPECTION FAILED": "#e74c3c",
  REWORK: "#e67e22",
  CANCELLED: "#95a5a6",
  CLOSED: "#1abc9c",
};

function AdminDashboardContent() {
  const { t } = useI18n();
  // Cached platform stats keep the shell useful while the live command center hydrates.
  const [stats, setStats] = useState<any>(() => getCachedPlatformStats());
  const [workOrders, setWOs] = useState<any[]>(() => (getCachedWorkOrders() || []).slice(0, 8));
  const [snapshot, setSnapshot] = useState<any>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(true);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  // Quick Action Modal states
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  // Officer form
  const [officerForm, setOfficerForm] = useState({
    name: "",
    email: "",
    password: "Janmind@2026",
    role: "officer",
    city: "vadodara",
    department: "Roads",
    phone: "",
  });

  // Contractor form
  const [contractorForm, setContractorForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    login_email: "",
    login_password: "Janmind@2026",
  });

  useEffect(() => {
    let isMounted = true;
    const loadBackground = async () => {
      setSnapshotLoading(true);
      try {
        const [liveSnapshot, liveWorkOrders] = await Promise.all([
          getCommandCenterSnapshot(),
          listRealWorkOrders(),
        ]);
        if (isMounted) {
          setSnapshot(liveSnapshot);
          if (liveSnapshot?.platform) setStats(liveSnapshot.platform);
          if (liveWorkOrders) setWOs(liveWorkOrders.slice(0, 8));
          setSnapshotError(null);
          setLastRefresh(new Date());
        }
      } catch (error: any) {
        if (isMounted) {
          setSnapshotError(error?.message ?? "Live command-center data is unavailable");
        }
      } finally {
        if (isMounted) setSnapshotLoading(false);
      }
    };
    loadBackground();
    const refreshTimer = window.setInterval(loadBackground, 30000);
    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, [refreshNonce]);

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerForm.name.trim() || !officerForm.email.trim()) {
      toast.error("Please fill in name and email");
      return;
    }
    setSavingUser(true);
    try {
      await createUser(officerForm);
      toast.success(`Officer ${officerForm.name} created successfully!`);
      setShowOfficerModal(false);
      setOfficerForm({
        name: "",
        email: "",
        password: "Janmind@2026",
        role: "officer",
        city: "vadodara",
        department: "Roads",
        phone: "",
      });
      // Refresh stats
      getPlatformStats()
        .then(setStats)
        .catch(() => {});
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create officer");
    } finally {
      setSavingUser(false);
    }
  };

  const handleCreateContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorForm.company_name.trim() || !contractorForm.email.trim()) {
      toast.error("Please fill in company name and email");
      return;
    }
    setSavingUser(true);
    try {
      await createRealContractor({
        ...contractorForm,
        login_email: contractorForm.login_email || contractorForm.email,
      });
      toast.success(`Contractor "${contractorForm.company_name}" registered successfully!`);
      setShowContractorModal(false);
      setContractorForm({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        login_email: "",
        login_password: "Janmind@2026",
      });
      getPlatformStats()
        .then(setStats)
        .catch(() => {});
    } catch (err: any) {
      toast.error(err.message ?? "Failed to register contractor");
    } finally {
      setSavingUser(false);
    }
  };

  const woStatusCounts = workOrders.reduce((acc: any, wo: any) => {
    acc[wo.status] = (acc[wo.status] ?? 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(snapshot?.work_order_status ?? woStatusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, " "),
    count: Number(count),
  }));
  const cityPulseData = (snapshot?.cities ?? []).map((city: any) => ({
    name: city.name,
    open: Number(city.open_complaints ?? 0),
    resolved: Number(city.resolved_complaints ?? 0),
    active: Number(city.active_work_orders ?? 0),
  }));
  const complaintStatusData = Object.entries(snapshot?.complaint_status ?? {}).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value: Number(value),
  }));
  const workflowData = snapshot?.workflow ?? [];

  return (
    <div className="space-y-8 muni-page-enter">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <SectionLabel>{t("ui.live_platform_data")}</SectionLabel>
          <h1 className="text-2xl font-bold tracking-tight">{t("ui.platform_dashboard")}</h1>
          <p className="text-[var(--muted-foreground)]">
            Real-time governance, officer provisioning & civic intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowOfficerModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Municipal Officer
          </button>
          <button
            onClick={() => setShowContractorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition"
          >
            <Building2 className="w-4 h-4" />
            Add Contractor
          </button>
          <Link
            to="/admin/users"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs font-semibold hover:bg-[var(--surface)] transition text-[var(--foreground)]"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard title={t("ui.total_users")} value={stats?.total_users ?? 0} icon={Users} />
        <StatCard title={t("ui.officers")} value={stats?.total_officers ?? 0} icon={Shield} />
        <StatCard
          title={t("ui.contractors")}
          value={stats?.total_contractors ?? 0}
          icon={Building2}
        />
        <StatCard
          title={t("ui.active_work")}
          value={stats?.active_work_orders ?? 0}
          icon={ClipboardList}
          accent="warning"
        />
        <StatCard
          title={t("ui.open_complaints")}
          value={stats?.open_complaints ?? 0}
          icon={FileText}
          alert={(stats?.open_complaints ?? 0) > 100}
        />
        <StatCard
          title={t("ui.cities")}
          value={stats?.total_cities ?? 0}
          icon={MapPin}
          accent="success"
        />
      </div>

      {/* Complaints breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t("ui.total_complaints")}</p>
          <p className="text-3xl font-bold mt-1">
            {(stats?.total_complaints ?? 0).toLocaleString("en-IN")}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t("ui.resolved")}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#27ae60" }}>
            {(stats?.resolved_complaints ?? 0).toLocaleString("en-IN")}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[var(--muted-foreground)] text-sm">{t("ui.civic_issues")}</p>
          <p className="text-3xl font-bold mt-1">
            {(stats?.total_issues ?? 0).toLocaleString("en-IN")}
          </p>
        </GlassCard>
      </div>

      {/* Private super-admin security boundary */}
      <GlassCard className="civic-admin-command-card p-6 border-[var(--civic-city-accent)]/35">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="civic-admin-signal-icon"><ShieldAlert className="h-5 w-5" /></div>
            <div>
              <SectionLabel>Private command center</SectionLabel>
              <h2 className="text-base font-semibold text-[var(--foreground)]">Super-admin controls are locked</h2>
              <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
                This surface is restricted to the configured super-admin allowlist. Credentials are never displayed here; every administrative mutation is authenticated, auditable, and tied to the live backend.
              </p>
            </div>
          </div>
          <span className="civic-admin-access-badge">ADMIN ONLY</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminSignal label="Authorization" value="JWT + allowlist" />
          <AdminSignal label="Audit trail" value="Persisted" />
          <AdminSignal label="Data source" value="Live backend" />
          <AdminSignal label="Scope" value="VMC + BBMP" />
        </div>
      </GlassCard>

      {snapshotError && (
        <GlassCard className="border-red-400/40 bg-red-950/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-300" />
              <div>
                <p className="text-sm font-semibold text-red-100">Live command-center data needs attention</p>
                <p className="text-xs text-red-100/70">{snapshotError}. Cached KPI values remain visible until the backend reconnects.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRefreshNonce((value) => value + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200/30 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-200/10"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry live data
            </button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <GlassCard className="civic-admin-command-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionLabel>City operations pulse</SectionLabel>
              <h2 className="text-lg font-semibold">Vadodara × Bengaluru live comparison</h2>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">Open complaints, resolved complaints, and active execution work orders.</p>
            </div>
            <div className="civic-admin-live-badge"><Activity className="h-3.5 w-3.5" /> LIVE</div>
          </div>
          <div className="mt-4 h-64">
            {snapshotLoading && !snapshot ? (
              <DataState icon={RefreshCw} title="Connecting to live telemetry" detail="Waiting for the backend command-center snapshot." />
            ) : cityPulseData.length === 0 ? (
              <DataState icon={MapPin} title="No city telemetry yet" detail="The backend returned no city aggregates for this scope." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityPulseData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--surface-elevated)", border: "1px solid var(--glass-border)", borderRadius: "10px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="open" name="Open complaints" fill="#C86B18" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#0E766E" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="active" name="Active work" fill="#234A84" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--glass-border)]/60 pt-3 text-[11px] text-[var(--muted-foreground)]">
            <span>{lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Awaiting first update"}</span>
            <button type="button" onClick={() => setRefreshNonce((value) => value + 1)} className="inline-flex items-center gap-1.5 font-semibold text-[var(--primary)] hover:underline"><RefreshCw className="h-3 w-3" /> Refresh</button>
          </div>
        </GlassCard>

        <GlassCard className="civic-admin-command-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionLabel>One civic thread</SectionLabel>
              <h2 className="text-lg font-semibold">Complaint to resolution trace</h2>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">A live, backend-backed view of the cross-portal operating chain.</p>
            </div>
            <Network className="h-5 w-5 text-[var(--civic-city-accent)]" />
          </div>
          <div className="mt-5 space-y-2">
            {workflowData.length === 0 ? (
              <DataState icon={Network} title="No workflow telemetry yet" detail="Stages will appear once the backend returns live aggregates." />
            ) : workflowData.map((stage: any, index: number) => (
              <div key={stage.id ?? index} className="civic-admin-flow-node">
                <div className="flex items-center gap-3">
                  <div className={`civic-admin-flow-dot civic-admin-flow-${stage.tone ?? "indigo"}`}><span>{index + 1}</span></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{stage.label}</p><p className="text-[11px] text-[var(--muted-foreground)]">{Number(stage.count ?? 0).toLocaleString("en-IN")} records</p></div>
                  {index < workflowData.length - 1 && <ArrowRight className="hidden h-4 w-4 text-[var(--muted-foreground)] sm:block" />}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_1.2fr]">
        <GlassCard className="p-5">
          <SectionLabel>Complaint telemetry</SectionLabel>
          <h2 className="text-lg font-semibold">Status distribution</h2>
          <div className="mt-3 h-52">
            {complaintStatusData.length === 0 ? <DataState icon={FileText} title="No complaint statuses" detail="No persisted complaint status aggregates were returned." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complaintStatusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none" fill="#0E766E" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--surface-elevated)", border: "1px solid var(--glass-border)", borderRadius: "10px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionLabel>Platform health</SectionLabel>
          <h2 className="text-lg font-semibold">Signals & dependencies</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(snapshot?.system_health ?? {}).map(([name, health]: [string, any]) => (
              <div key={name} className="flex items-center justify-between rounded-xl border border-[var(--glass-border)]/60 bg-[var(--surface)]/45 px-3 py-3">
                <div className="flex items-center gap-2.5"><div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-300">{name === "database" ? <Database className="h-4 w-4" /> : <Server className="h-4 w-4" />}</div><div><p className="text-xs font-semibold capitalize">{name.replace(/_/g, " ")}</p><p className="text-[10px] text-[var(--muted-foreground)]">{health?.source ?? "live signal"}</p></div></div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> {health?.status ?? "unknown"}</span>
              </div>
            ))}
            {!snapshot?.system_health && <DataState icon={Server} title="Health signals pending" detail="The command-center endpoint has not returned dependency health yet." />}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-start justify-between gap-3"><div><SectionLabel>Governance trail</SectionLabel><h2 className="text-lg font-semibold">Recent persisted events</h2></div><Sparkles className="h-5 w-5 text-[var(--civic-saffron-600)]" /></div>
          <div className="mt-4 space-y-2">
            {(snapshot?.recent_audit ?? []).length === 0 ? <DataState icon={Shield} title="No recent audit events" detail="Persisted admin activity will appear here as the ecosystem is used." /> : (snapshot.recent_audit as any[]).slice(0, 6).map((event: any) => (
              <div key={event.id} className="border-b border-[var(--glass-border)]/50 pb-2 last:border-0"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-semibold">{event.action?.replace(/_/g, " ")}</p><span className="whitespace-nowrap text-[10px] text-[var(--muted-foreground)]">{event.at ? new Date(event.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span></div><p className="truncate text-[10px] text-[var(--muted-foreground)]">{event.entity_label ?? event.entity_type ?? "Platform event"} · {event.actor_name ?? "System"}</p></div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Work order status chart + recent list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <SectionLabel>{t("ui.work_order_status_distribution")}</SectionLabel>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                <defs>
                  {chartData.map((entry, i) => (
                    <linearGradient key={entry.name} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={STATUS_COLORS[entry.name] ?? "#3d9970"}
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={STATUS_COLORS[entry.name] ?? "#3d9970"}
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
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
          <SectionLabel>{t("ui.recent_work_orders")}</SectionLabel>
          <div className="mt-3 space-y-2">
            {workOrders.length === 0 && (
              <p className="text-[var(--muted-foreground)] text-sm py-4 text-center">
                {t("ui.no_work_orders_yet")}
              </p>
            )}
            {workOrders.map((wo: any) => (
              <div
                key={wo.id}
                className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]/40 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{wo.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">
                    {wo.contractor_name} · {wo.city}
                  </p>
                </div>
                <span
                  className="ml-3 flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970"}20`,
                    color: STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970",
                    border: `1px solid ${STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970"}40`,
                  }}
                >
                  {wo.status?.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* QUICK ADD OFFICER MODAL */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold">Add Municipal Officer / Supervisor</h3>
              </div>
              <button
                onClick={() => setShowOfficerModal(false)}
                className="text-[var(--muted-foreground)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={officerForm.name}
                    onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Email (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@vmc.gov.in"
                    value={officerForm.email}
                    onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Role *
                  </label>
                  <select
                    value={officerForm.role}
                    onChange={(e) => setOfficerForm({ ...officerForm, role: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  >
                    <option value="officer">Officer</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="municipality">Municipality</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    City *
                  </label>
                  <select
                    value={officerForm.city}
                    onChange={(e) => setOfficerForm({ ...officerForm, city: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  >
                    <option value="vadodara">Vadodara</option>
                    <option value="bengaluru">Bengaluru</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Department
                  </label>
                  <select
                    value={officerForm.department}
                    onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  >
                    <option value="Roads">Roads</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Drainage">Drainage</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={officerForm.password}
                    onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98250 12345"
                    value={officerForm.phone}
                    onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {savingUser ? "Saving..." : "Create Officer Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD CONTRACTOR MODAL */}
      {showContractorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold">Add / Register Contractor</h3>
              </div>
              <button
                onClick={() => setShowContractorModal(false)}
                className="text-[var(--muted-foreground)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContractor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Civil Works Ltd"
                    value={contractorForm.company_name}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, company_name: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Shah"
                    value={contractorForm.contact_person}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, contact_person: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Company Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@apex.in"
                    value={contractorForm.email}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, email: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98254 99887"
                    value={contractorForm.phone}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, phone: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--glass-border)]">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Portal Login Email
                  </label>
                  <input
                    type="email"
                    placeholder="Leave empty to use company email"
                    value={contractorForm.login_email}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, login_email: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                    Portal Password
                  </label>
                  <input
                    type="password"
                    required
                    value={contractorForm.login_password}
                    onChange={(e) =>
                      setContractorForm({ ...contractorForm, login_password: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  onClick={() => setShowContractorModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {savingUser ? "Registering..." : "Register Contractor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  suffix = "",
  alert = false,
  accent = "default",
}: {
  title: string;
  value: number;
  icon: any;
  suffix?: string;
  alert?: boolean;
  accent?: string;
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
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ background: accentColor }}
      />
      <div className="flex items-center justify-between mb-2 pl-2">
        <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <div className="p-1.5 rounded-lg" style={{ background: `${accentColor}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-2xl font-bold pl-2" style={{ color: alert ? accentColor : undefined }}>
        {value.toLocaleString("en-IN")}
        {suffix}
      </p>
    </GlassCard>
  );
}


function AdminSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)]/70 bg-[var(--surface)]/45 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-1 text-xs font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function DataState({
  icon: Icon,
  title,
  detail,
}: {
  icon: any;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex h-full min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--glass-border)]/70 bg-[var(--surface)]/25 px-4 text-center">
      <Icon className="mb-2 h-5 w-5 text-[var(--civic-city-accent)]" />
      <p className="text-xs font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-[var(--muted-foreground)]">{detail}</p>
    </div>
  );
}
