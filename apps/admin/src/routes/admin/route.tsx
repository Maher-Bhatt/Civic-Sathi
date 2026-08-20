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
  Landmark,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

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
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Contractors", icon: Building2, to: "/admin/contractors/" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Work Orders", icon: ClipboardList, to: "/admin/work-orders-overview" },
      { label: "SLA Config", icon: Timer, to: "/admin/sla" },
      { label: "Audit Logs", icon: Shield, to: "/admin/audit-logs" },
    ],
  },
];

function AdminShell() {
  const { t } = useI18n();
  const { admin, signOut } = useAdminAuth();
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div className="admin-brand-mark" aria-hidden="true">
            <Landmark className="h-5 w-5" />
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
          <strong>2 cities</strong>
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
                    className="admin-nav-item"
                    activeProps={{ className: "admin-nav-item is-active" }}
                  >
                    <item.icon className="h-[17px] w-[17px]" />
                    <span>{item.label}</span>
                    <ChevronRight className="admin-nav-chevron h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="admin-nav-group admin-nav-group--last">
            <p className="admin-nav-label">Configuration</p>
            <Link
              to="/admin/settings" as any
              onClick={closeMobileMenu}
              className="admin-nav-item"
              activeProps={{ className: "admin-nav-item is-active" }}
            >
              <Settings className="h-[17px] w-[17px]" />
              <span>Settings</span>
              <ChevronRight className="admin-nav-chevron h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-card">
            <div className="admin-avatar">{admin?.name?.charAt(0) || "M"}</div>
            <div className="min-w-0 flex-1">
              <p className="admin-profile-name truncate">{admin?.name || "Super admin"}</p>
              <p className="admin-profile-email truncate">{admin?.email || "Private access"}</p>
            </div>
            <span className="admin-profile-role">ADMIN</span>
          </div>
          <button type="button" onClick={handleSignOut} className="admin-signout-button">
            <LogOut className="h-4 w-4" />
            {t("ui.sign_out")}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
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
            <span className="admin-topbar-date">Bengaluru · Vadodara</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
