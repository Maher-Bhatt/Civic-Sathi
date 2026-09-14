import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { ContractorAuthGate } from "@/lib/require-contractor-auth";
import { useContractorAuth } from "@/lib/contractor-auth";
import { LayoutDashboard, ClipboardList, TrendingUp, User, LogOut, FileText, IndianRupee } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contractor")({
  component: ContractorLayoutRoute,
});

function ContractorLayoutRoute() {
    const { t } = useI18n();
  return (
    <ContractorAuthGate>
      <ContractorLayout>
        <Outlet />
      </ContractorLayout>
    </ContractorAuthGate>
  );
}

function ContractorLayout({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
  const { contractor, signOut } = useContractorAuth();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/contractor/dashboard" },
    { label: "Tenders & Bids", icon: FileText, to: "/contractor/tenders" },
    { label: "Work Orders", icon: ClipboardList, to: "/contractor/work-orders" },
    { label: "Bills & Payments", icon: IndianRupee, to: "/contractor/bills" },
    { label: "Performance", icon: TrendingUp, to: "/contractor/performance" },
    { label: "Profile", icon: User, to: "/contractor/profile" },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--glass-border)] bg-[var(--surface)] flex flex-col glass z-10">
        <div className="h-16 flex items-center px-6 border-b border-[var(--glass-border)]">
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">{t('ui.civicsathi')}</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">{t('ui.contractor')}</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              activeProps={{ className: "!text-primary !bg-primary/8 border-l-[3px] border-primary rounded-l-none font-medium" }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="group relative flex items-center gap-3 rounded-xl p-3 bg-[var(--surface-elevated)]/50 border border-[var(--glass-border)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary border border-primary/20">
              {contractor?.name?.substring(0, 2).toUpperCase() || 'CN'}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="truncate text-[14px] font-[600] leading-tight text-[var(--foreground)]">
                {contractor?.name || "Contractor"}
              </span>
              <span className="mt-1 w-max rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                CONTRACTOR
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => signOut()}
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--muted-foreground)] hover:text-red-500"
              title={t('ui.sign_out')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-[var(--glass-border)] bg-[var(--surface)]/80 backdrop-blur-md flex items-center px-6 shrink-0 z-10 glass-strong">
          <div className="text-sm font-medium text-[var(--muted-foreground)]">{t('ui.contractor_portal')}</div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
