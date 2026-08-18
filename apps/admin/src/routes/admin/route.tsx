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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
    const { t } = useI18n();
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  );
}


const navItems = [
  { label: "Dashboard",   icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Users",       icon: Users,           to: "/admin/users" },
  { label: "Contractors", icon: Building2,        to: "/admin/contractors/" },
  { label: "Work Orders", icon: ClipboardList,    to: "/admin/work-orders-overview" },
  { label: "SLA Config",  icon: Timer,            to: "/admin/sla" },
  { label: "Audit Logs",  icon: Shield,           to: "/admin/audit-logs" },
  { label: "Settings",    icon: Settings,         to: "/admin/settings" },
];

function AdminDashboard() {
    const { t } = useI18n();
  const { admin, signOut } = useAdminAuth();
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    void navigate({ to: "/admin/login" as any, replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-[var(--glass-border)]
        transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-[var(--glass-border)]">
          <Shield className="w-6 h-6 mr-3 text-[var(--foreground)]" />
          <span className="font-bold tracking-wide text-lg">{t('ui.civicsathi_admin')}</span>
          <button 
            className="ml-auto lg:hidden p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--surface-elevated)]"
              activeProps={{
                className: "bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--foreground)]",
              }}
              inactiveProps={{
                className: "text-[var(--muted-foreground)]",
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)] mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center">
              <span className="text-xs font-bold">{admin?.name?.charAt(0) || "A"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 justify-center px-4 py-2 text-sm text-[var(--critical)] hover:bg-[var(--critical)]/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('ui.sign_out')}</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen relative">
        <header className="h-16 glass sticky top-0 z-40 border-b border-[var(--glass-border)] flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden p-2 mr-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-elevated)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1"></div>
        </header>

        <div className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
