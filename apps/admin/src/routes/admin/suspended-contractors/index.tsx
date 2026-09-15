import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { Ban, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const Route = createFileRoute('/admin/suspended-contractors/')({
  component: SuspendedContractorsPage,
});

function SuspendedContractorsPage() {
  const { data: suspended = [], isLoading } = useQuery({
    queryKey: ['suspended-contractors'],
    queryFn: () => api.admin.listSuspendedContractors(),
  });

  return (
    <div className="admin-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Vendor Moderation</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Suspended Contractors</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Vendors automatically blacklisted from the Civic Sathi platform.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400">Loading suspended contractors...</div>
      ) : suspended.length === 0 ? (
        <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-emerald-500/50" />
          <p>No contractors are currently suspended.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {suspended.map((con: any) => (
            <GlassCard key={con.id} className="p-5 border-rose-500/20 bg-rose-500/5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Ban className="w-24 h-24 text-rose-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px] font-bold uppercase border border-rose-500/20">Blacklisted</span>
                  <span className="text-xs font-mono text-[var(--muted-foreground)]">{con.id}</span>
                </div>
                <h3 className="text-xl font-semibold">{con.company_name}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <span className="text-rose-200">Suspended due to critical violations or low trust score.</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
