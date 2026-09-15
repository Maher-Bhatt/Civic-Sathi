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
  Network,
  Package,
  Settings,
  User,
  Zap,
  FileText,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";
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
  | "Collector"
  | "all";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  access: Designation[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, access: ["all"] },
  { to: "/ai-triage", label: "AI Triage", icon: AlertTriangle, access: ["Triage Officer", "Municipal Supervisor"] },
  { to: "/live-orchestration", label: "Live Orchestrator", icon: Zap, access: ["all"] },
  { to: "/map", label: "Civic Map", icon: Map, access: ["all"] },
  { to: "/civic-issues", label: "Civic Issues", icon: Zap, access: ["Field Inspector", "Ward Officer", "Triage Officer"] },
  { to: "/civic-hub", label: "Civic Hub Control", icon: Network, access: ["Commissioner", "Department Head"] },
  { to: "/complaints", label: "Complaints", icon: FileText, access: ["Ward Officer", "Field Inspector"] },
  { to: "/tenders", label: "Tenders & Packages", icon: Package, access: ["Chief Engineer", "Commissioner"] },
  { to: "/work-orders", label: "Work Orders", icon: ClipboardList, access: ["Chief Engineer", "Department Head"] },
  { to: "/bills", label: "Bills & Approvals", icon: FileText, access: ["Department Head", "Commissioner", "Chief Engineer"] },
  { to: "/disputes", label: "Dispute Resolution", icon: AlertTriangle, access: ["Commissioner", "Collector"] },
  { to: "/contractors", label: "Contractor Performance", icon: Building2, access: ["Chief Engineer", "Commissioner", "Department Head"] },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle, access: ["Ward Officer", "Triage Officer", "Municipal Supervisor"] },
  { to: "/departments", label: "Departments", icon: Building2, access: ["Municipal Supervisor", "Department Head"] },
  { to: "/areas", label: "Areas", icon: MapPin, access: ["Field Inspector", "Municipal Supervisor"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, access: ["Commissioner", "Collector"] },
  { to: "/settings", label: "Settings", icon: Settings, access: ["Commissioner"] },
  { to: "/administration", label: "Administration", icon: User, access: ["Collector"] },
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
  const { officer, signOut } = useMuniAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleNav = getVisibleNav(officer?.designation);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, onMobileClose]);

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
        role="dialog"
        aria-modal={mobileOpen ? "true" : undefined}
        aria-label={t('ui.municipality_navigation')}
        className={cn(
          "civic-heritage-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1rem))] flex-col border-r border-[var(--glass-border)] bg-[var(--glass-strong)] backdrop-blur-xl transition-all duration-300",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="civic-heritage-strip flex h-16 items-center justify-between border-b border-[var(--glass-border)] px-4">
          <div className={cn("flex min-w-0 items-center gap-2.5", collapsed && "mx-auto")}>
            <span className="civic-brand-lockup civic-brand-lockup--internal" aria-hidden="true"><img src="/brand/civic-sathi-symbol.png" alt="" /></span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="civic-brand-wordmark civic-brand-wordmark--internal"><span>Civic</span> <strong>Sathi</strong></p>
                <p className="truncate text-[0.65rem] text-muted-foreground">{t('ui.municipal_intelligence')}</p>
              </div>
            )}
          </div>

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
                    ? "!text-primary !bg-primary/8 border-l-[3px] border-primary rounded-l-none font-medium"
                    : "text-muted-foreground hover:bg-[var(--surface-elevated)] hover:text-foreground",
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
          <div className="p-4 border-t border-[var(--glass-border)]">
            <div className="group relative flex items-center gap-3 rounded-xl p-3 bg-[var(--surface-elevated)]/50 border border-[var(--glass-border)]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary border border-primary/20">
                {officer?.name?.charAt(0) || "M"}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="truncate text-[14px] font-[600] leading-tight text-[var(--foreground)]">
                  {officer?.name || "Officer"}
                </span>
                <span className="mt-1 w-max rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {officer?.designation || officer?.role || "MUNICIPALITY"}
                </span>
              </div>
              <button 
                type="button" 
                onClick={signOut}
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--muted-foreground)] hover:text-red-500"
                title={t('ui.sign_out')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

