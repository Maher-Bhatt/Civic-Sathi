import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  Map,
  MapPin,
  Package,
  Settings,
  User,
  Zap,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-triage", label: "AI Triage", icon: AlertTriangle },
  { to: "/map", label: "Civic Map", icon: Map },
  { to: "/civic-issues", label: "Civic Issues", icon: Zap },
  { to: "/complaints", label: "Complaints", icon: FileText },
  { to: "/work-packages", label: "Work Packages", icon: Package },
  { to: "/work-orders", label: "Work Orders", icon: ClipboardList },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/areas", label: "Areas", icon: MapPin },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MuniSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--glass-border)] bg-[var(--glass-strong)] backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[4.5rem]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--glass-border)] px-4">
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-tight">JANMIND</p>
              <p className="text-[0.65rem] text-muted-foreground">Municipal Intelligence</p>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="press hidden rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground lg:flex"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Municipality navigation">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to as any}
                onClick={onMobileClose}
                className={cn(
                  "press flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                  active
                    ? "bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-[var(--glass-border)] p-4">
            <p className="text-[0.65rem] text-muted-foreground">Prototype Intelligence Data</p>
          </div>
        )}
      </aside>
    </>
  );
}
