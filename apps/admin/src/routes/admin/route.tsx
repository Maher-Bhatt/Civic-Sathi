import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { AdminAuthGate } from "@/lib/require-admin-auth";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Timer,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Activity,
  ChevronRight,
  Globe2,
  Search,
  Gamepad2,
  ShieldAlert,
  Brain,
  Network,
  Map,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAuthGate>
      <AdminShell />
    </AdminAuthGate>
  );
}

const navGroups = [
  {
    label: "Command center",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
      { label: "State Command Center", icon: Globe2, to: "/admin/state-command-center" },
      { label: "Global Complaints", icon: Search, to: "/admin/global-complaints" },
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Contractors", icon: Building2, to: "/admin/contractors/" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Work Orders", icon: ClipboardList, to: "/admin/work-orders-overview" },
      { label: "MDM Exceptions", icon: ShieldAlert, to: "/admin/exceptions" },
      { label: "SLA Config", icon: Timer, to: "/admin/sla" },
      { label: "Audit Logs", icon: Shield, to: "/admin/audit-logs" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Integration Hub", icon: Network, to: "/admin/integration-hub" },
      { label: "Master Data (MDM)", icon: Map, to: "/admin/mdm" },
      { label: "AI Oversight", icon: Brain, to: "/admin/ai-oversight" },
      { label: "Trust & Safety", icon: ShieldAlert, to: "/admin/trust-safety" },
      { label: "Gamification", icon: Gamepad2, to: "/admin/gamification" },
      { label: "Interoperability", icon: Network, to: "/admin/interoperability" },
    ],
  },
];

function AdminShell() {
  const { t } = useI18n();
  const { admin, signOut } = useAdminAuth();
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useTheme();
  const nextMode = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
  const themeLabel = mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '⚙️';

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    void navigate({ to: "/admin/login" as any, replace: true });
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="admin-app-shell">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="admin-sidebar-scrim lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`admin-sidebar ${mobileMenuOpen ? "is-open" : ""}`}>
        <div className="admin-brand-lockup">
          <div className="admin-brand-mark">
            <img src="/icon-192.png" alt="Civic Sathi logo" />
          </div>
          <div className="min-w-0">
            <p className="admin-brand-title">Civic Sathi</p>
            <p className="admin-brand-subtitle">Platform administration</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="admin-icon-button ml-auto lg:hidden"
            onClick={closeMobileMenu}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="admin-scope-strip">
          <span className="admin-status-dot" />
          <span>Live civic network</span>
          <strong>4 cities</strong>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-label">{group.label}</p>
              <div className="admin-nav-list">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] rounded-md transition-colors"
                    activeProps={{ className: "!text-primary !bg-primary/8 border-l-[3px] border-primary rounded-l-none font-medium" }}
                  >
                    <item.icon className="h-[17px] w-[17px]" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="admin-nav-group admin-nav-group--last">
            <p className="admin-nav-label">Configuration</p>
            <Link
              to="/admin/settings"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] rounded-md transition-colors"
              activeProps={{ className: "!text-primary !bg-primary/8 border-l-[3px] border-primary rounded-l-none font-medium" }}
            >
              <Settings className="h-[17px] w-[17px]" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={() => setMode(nextMode)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] rounded-md transition-colors capitalize mb-2"
            title={`Theme: ${mode} — click to switch to ${nextMode}`}
          >
            <span>{themeLabel}</span>
            <span className="capitalize">{mode} mode</span>
          </button>
          <div className="group relative flex items-center gap-3 rounded-xl p-3 bg-[var(--surface-elevated)]/50 border border-[var(--glass-border)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary border border-primary/20">
              {admin?.name?.charAt(0) || "M"}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="truncate text-[14px] font-[600] leading-tight text-[var(--foreground)]">
                {admin?.name || "Super admin"}
              </span>
              <span className="mt-1 w-max rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ADMIN
              </span>
            </div>
            <button 
              type="button" 
              onClick={handleSignOut} 
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--muted-foreground)] hover:text-red-500"
              title={t("ui.sign_out")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-brand lg:hidden" aria-label="Civic Sathi">
            <img src="/icon-192.png" alt="" />
            <span>Civic Sathi</span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              className="admin-icon-button lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="admin-breadcrumbs">
              <span>Private workspace</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <strong>Admin console</strong>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-topbar-scope"><Activity className="h-3.5 w-3.5" /> Backend connected</span>
            <span className="admin-topbar-date">Mumbai · Delhi · Bengaluru · Vadodara</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
