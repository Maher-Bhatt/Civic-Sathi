import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { AlertTriangle, TrendingDown, Clock, ShieldCheck, Filter, Receipt } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/admin/sla-penalties/')({
  component: SLAPenaltiesPage,
});

function SLAPenaltiesPage() {
  const penalties = [
    { id: 'PEN-001', contractor: 'Vibrant Construct', reason: 'Delayed Pothole Filling by 4 Days', amount: 45000, date: '2026-08-20', status: 'Deducted' },
    { id: 'PEN-002', contractor: 'Apex Roads', reason: 'Failed Quality AI Audit (Asphalt Temp Low)', amount: 120000, date: '2026-08-22', status: 'Pending Review' },
    { id: 'PEN-003', contractor: 'City Builders', reason: 'Missed Milestone 2 Deadline', amount: 30000, date: '2026-08-25', status: 'Deducted' },
  ];

  return (
    <div className="admin-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Compliance Enforcement</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">SLA Penalties & Deductions</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Global view of automatically enforced liquidated damages across all cities.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <TrendingDown className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Total Penalties (YTD)</h3>
          </div>
          <p className="text-3xl font-bold">₹1.84 Crores</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Active Deductions</h3>
          </div>
          <p className="text-3xl font-bold">142</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-2 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Auto-Enforcement Rate</h3>
          </div>
          <p className="text-3xl font-bold">94.5%</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold">Penalty Ledger</h2>
          </div>
          <button className="action-btn outline flex items-center gap-2 py-1.5">
            <Filter className="w-4 h-4" /> Filter Records
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="pb-3 font-semibold pl-2">ID / Date</th>
                <th className="pb-3 font-semibold">Contractor</th>
                <th className="pb-3 font-semibold">Infraction</th>
                <th className="pb-3 font-semibold text-right">Amount Deducted</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {penalties.map((pen) => (
                <tr key={pen.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                  <td className="py-4 pl-2">
                    <p className="font-bold text-sm text-[var(--foreground)]">{pen.id}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{pen.date}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-semibold">{pen.contractor}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm">{pen.reason}</p>
                  </td>
                  <td className="py-4 text-right font-bold text-red-500">
                    -₹{pen.amount.toLocaleString()}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                      pen.status === 'Deducted' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
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
    </div>
  );
}
