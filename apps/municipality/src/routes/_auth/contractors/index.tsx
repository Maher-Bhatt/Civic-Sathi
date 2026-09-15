import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { Building2, Star, TrendingUp, AlertTriangle, Filter, Eye } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/contractors/')({
  component: MuniContractorsPage,
});

function MuniContractorsPage() {
  const contractors = [
    { id: 'CON-001', name: 'Bharat Infra Ltd', score: 4.8, projects: 12, onTime: '98%', status: 'Excellent' },
    { id: 'CON-002', name: 'City Builders', score: 4.2, projects: 8, onTime: '85%', status: 'Good' },
    { id: 'CON-003', name: 'Apex Roads', score: 2.1, projects: 3, onTime: '40%', status: 'Warning' },
    { id: 'CON-004', name: 'Vibrant Construct', score: 1.8, projects: 2, onTime: '20%', status: 'Suspended' },
  ];

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Vendor Management</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Contractor Performance</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Monitor Tri-Party trust scores and compliance records for all vendors.</p>
        </div>
      </header>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold">Empaneled Contractors</h2>
          </div>
          <button className="action-btn outline flex items-center gap-2 py-1.5">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractors.map(c => (
            <div key={c.id} className="p-4 bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl hover:border-[var(--primary)] transition-colors flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">{c.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">ID: {c.id}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-orange-500 font-bold">
                    <Star className="w-4 h-4 fill-orange-500" />
                    {c.score}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">Trust Score</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Active/Completed</p>
                  <p className="font-bold text-sm">{c.projects} Projects</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">On-Time SLA</p>
                  <p className="font-bold text-sm text-emerald-600">{c.onTime}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                  c.score >= 4 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  c.score >= 3 ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                  c.score >= 2 ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                  'bg-red-500/10 text-red-600 border-red-500/20'
                }`}>
                  {c.status}
                </span>
                <button className="action-btn primary flex items-center gap-2 py-1.5 px-3 text-xs">
                  <Eye className="w-3 h-3" /> View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
