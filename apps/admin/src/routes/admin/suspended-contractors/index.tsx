import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { Ban, ShieldAlert, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

export const Route = createFileRoute('/admin/suspended-contractors/')({
  component: SuspendedContractorsPage,
});

function SuspendedContractorsPage() {
  const suspended = [
    { id: 'CON-004', name: 'Vibrant Construct', score: 1.8, reason: 'Trust score fell below minimum threshold (2.0)', date: '2026-08-15', city: 'Mumbai' },
    { id: 'CON-082', name: 'Global Infra Solutions', score: 1.4, reason: 'Multiple AI Quality Failures & Bribery Reports', date: '2026-07-22', city: 'Delhi' },
  ];

  return (
    <div className="admin-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Vendor Moderation</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Suspended Contractors</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Vendors automatically blacklisted from the Civic Sathi platform.</p>
        </div>
        <button className="action-btn outline flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Review Appeals
        </button>
      </header>

      <GlassCard className="p-6 border-red-500/20 bg-red-500/5 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-full text-red-600">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-red-600 text-lg">Platform Blacklist Policy</h2>
            <p className="text-sm text-red-600/80 mt-1">
              Any contractor whose Composite Tri-Party Trust Score falls below 2.0 is automatically suspended. 
              Suspended contractors cannot bid on new tenders across ANY city on the Civic Sathi network until an appeal is granted by the State Admin.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suspended.map(s => (
          <GlassCard key={s.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--foreground)]">{s.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--muted-foreground)]">ID: {s.id}</span>
                    <span className="text-xs font-bold text-[var(--primary)]">{s.city}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-red-500">{s.score}</span>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Final Score</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-1">Reason for Suspension</p>
                <p className="text-sm text-[var(--foreground)]">{s.reason}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2 py-1 bg-red-500/10 text-red-600 rounded border border-red-500/20 flex items-center gap-1">
                <Ban className="w-3 h-3" /> Suspended on {s.date}
              </span>
              <button className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Full Audit
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
