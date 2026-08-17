import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { ContractorAuthGate } from "@/lib/require-contractor-auth";
import { useContractorAuth } from "@/lib/contractor-auth";
import { LayoutDashboard, ClipboardList, TrendingUp, User, LogOut, FileText } from "lucide-react";
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
    { label: "Performance", icon: TrendingUp, to: "/contractor/performance" },
    { label: "Profile", icon: User, to: "/contractor/profile" },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--glass-border)] bg-[var(--surface)] flex flex-col glass z-10">
        <div className="h-16 flex items-center px-6 border-b border-[var(--glass-border)]">
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">{t('ui.janmind')}</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">{t('ui.contractor')}</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as any}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] [&.active]:text-[var(--foreground)] [&.active]:bg-[var(--surface-elevated)] [&.active]:border [&.active]:border-[var(--glass-border)]"
              activeProps={{ className: "active" }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--surface-elevated)]/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center font-semibold text-sm border border-[var(--primary)]/30">
              {contractor?.name?.substring(0, 2).toUpperCase() || 'CN'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{contractor?.name}</div>
              <div className="text-xs text-[var(--muted-foreground)] truncate">{contractor?.email}</div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--critical)] hover:bg-[var(--critical)]/10 rounded-md transition-colors"
          >
            <LogOut size={16} />
            {t('ui.sign_out')}</button>
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
