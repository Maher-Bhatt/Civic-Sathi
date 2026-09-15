import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { AlertTriangle, Clock, ShieldCheck, Receipt } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const Route = createFileRoute('/admin/sla-penalties/')({
  component: SLAPenaltiesPage,
});

function SLAPenaltiesPage() {
  const { data: penalties = [], isLoading } = useQuery({
    queryKey: ['sla-penalties'],
    queryFn: () => api.admin.listSLAPenalties(),
  });

  return (
    <div className="admin-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Compliance Enforcement</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">SLA Penalties & Deductions</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Global view of automatically enforced liquidated damages across all cities.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400">Loading penalties...</div>
      ) : penalties.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No SLA penalties found.</div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3">Penalty ID</th>
                  <th className="px-4 py-3">Work Order</th>
                  <th className="px-4 py-3">Delay (Days)</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {penalties.map((pen: any) => (
                  <tr key={pen.id} className="border-t border-[var(--border)]/50 hover:bg-slate-800/30">
                    <td className="px-4 py-4 font-mono text-xs">{pen.id}</td>
                    <td className="px-4 py-4 font-medium">{pen.work_order_id}</td>
                    <td className="px-4 py-4 text-rose-400 font-bold">{pen.delay_days}</td>
                    <td className="px-4 py-4">{pen.penalty_rate_pct}%</td>
                    <td className="px-4 py-4 font-bold">₹{pen.penalty_amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        pen.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                        pen.status === 'WAIVED' ? 'bg-slate-500/10 text-slate-500' : 
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {pen.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
