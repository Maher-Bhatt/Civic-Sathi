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
import { useI18n } from "@/lib/i18n";
import { useMuniAuth } from "@/lib/muni-auth";

/**
 * Role-based access matrix.
 * Each nav item lists which designations can see it.
 * "all" = visible to every designation.
 */
type Designation =
  | "Ward Officer"
  | "Field Inspector"
  | "Triage Officer"
  | "Municipal Supervisor"
  | "Chief Engineer"
  | "Commissioner"
  | "Department Head"
  | "all";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  access: Designation[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, access: ["all"] },
  { to: "/ai-triage", label: "AI Triage", icon: AlertTriangle, access: ["Triage Officer", "Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/map", label: "Civic Map", icon: Map, access: ["all"] },
  { to: "/civic-issues", label: "Civic Issues", icon: Zap, access: ["Field Inspector", "Triage Officer", "Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/complaints", label: "Complaints", icon: FileText, access: ["all"] },
  { to: "/tenders", label: "Tenders & Packages", icon: Package, access: ["Chief Engineer", "Commissioner", "Department Head"] },
  { to: "/work-orders", label: "Work Orders", icon: ClipboardList, access: ["Chief Engineer", "Commissioner", "Department Head"] },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle, access: ["Ward Officer", "Triage Officer", "Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/departments", label: "Departments", icon: Building2, access: ["Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/areas", label: "Areas", icon: MapPin, access: ["Field Inspector", "Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, access: ["Chief Engineer", "Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/settings", label: "Settings", icon: Settings, access: ["Municipal Supervisor", "Commissioner", "Department Head"] },
  { to: "/profile", label: "Profile", icon: User, access: ["all"] },
];

function getVisibleNav(designation?: string): NavItem[] {
  if (!designation) return NAV; // fallback: show everything
  return NAV.filter(
    (item) =>
      item.access.includes("all") ||
      item.access.includes(designation as Designation),
  );
}

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
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleNav = getVisibleNav(officer?.designation);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label={t('ui.close_navigation')}
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
              <p className="text-sm font-semibold tracking-tight">{t('ui.civicsathi')}</p>
              <p className="text-[0.65rem] text-muted-foreground">{t('ui.municipal_intelligence')}</p>
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

        {/* Show designation badge when sidebar is expanded */}
        {!collapsed && officer?.designation && (
          <div className="border-b border-[var(--glass-border)] px-4 py-2">
            <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">Role</p>
            <p className="text-xs font-medium text-foreground truncate">{officer.designation}</p>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label={t('ui.municipality_navigation')}>
          {visibleNav.map(({ to, label, icon: Icon }) => {
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
            <p className="text-[0.65rem] text-muted-foreground">{t('ui.prototype_intelligence_data')}</p>
          </div>
        )}
      </aside>
    </>
  );
}

