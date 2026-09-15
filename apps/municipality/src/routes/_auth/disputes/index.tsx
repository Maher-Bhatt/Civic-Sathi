import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { AlertTriangle, Clock, MessageSquare, Scale, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/disputes/')({
  component: DisputesPage,
});

function DisputesPage() {
  const [filter, setFilter] = useState('active');

  const disputes = [
    { id: 'DSP-2026-441', contractor: 'Bharat Infra Ltd', wo: 'MH-WO-D4E5F6', reason: 'Unfair Penalty on Site Clearance', status: 'Under Review', date: '2026-08-23' },
    { id: 'DSP-2026-302', contractor: 'City Builders', wo: 'GJ-WO-B9C8D7', reason: 'Payment Delayed Beyond SLA', status: 'Resolved', date: '2026-07-15' },
    { id: 'DSP-2026-198', contractor: 'Apex Roads', wo: 'DL-WO-A1B2C3', reason: 'Disputed AI Inspection Failure', status: 'Pending Arbitration', date: '2026-08-24' },
  ];

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Legal & Compliance</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Dispute Resolution</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Manage contractor grievances, payment disputes, and SLA arbitrations.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 border-l-4 border-l-orange-500">
          <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Active Disputes</h3>
          <p className="text-3xl font-bold">12</p>
        </GlassCard>
        <GlassCard className="p-6 border-l-4 border-l-red-500">
          <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Pending Arbitration</h3>
          <p className="text-3xl font-bold">4</p>
        </GlassCard>
        <GlassCard className="p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Resolved (30 Days)</h3>
          <p className="text-3xl font-bold">28</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold">Dispute Ledger</h2>
          </div>
          <select 
            className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="active">Active Disputes</option>
            <option value="resolved">Resolved</option>
            <option value="all">All Records</option>
          </select>
        </div>

        <div className="space-y-4">
          {disputes.map(d => (
            <div key={d.id} className="p-4 bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl flex items-center justify-between hover:border-[var(--primary)] transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">{d.reason}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="font-bold">{d.contractor}</span>
                    <span>•</span>
                    <span>WO: {d.wo}</span>
                    <span>•</span>
                    <span>Filed: {d.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-[var(--surface)] border border-[var(--glass-border)] rounded">
                  {d.status}
                </span>
                <button className="action-btn outline flex items-center gap-2 py-1.5 px-3">
                  <MessageSquare className="w-3 h-3" /> View Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
