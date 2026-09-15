import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { FileText, CheckCircle2, AlertCircle, Clock, Banknote, Filter, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_auth/bills/')({
  component: MunicipalityBillsPage,
});

const MOCK_INVOICES = [
  { id: 'INV-2026-081', contractor: 'Bharat Infra Ltd', workOrder: 'MH-WO-A1B2C3', desc: 'Foundation Completion - Ward 14 Road', amount: 450000, date: '2026-08-10', status: 'approved' },
  { id: 'INV-2026-092', contractor: 'Bharat Infra Ltd', workOrder: 'MH-WO-X7Y8Z9', desc: 'Material Procurement (Phase 1)', amount: 1250000, date: '2026-08-20', status: 'pending' },
  { id: 'INV-2026-093', contractor: 'City Builders', workOrder: 'GJ-WO-B9C8D7', desc: 'Park Fencing & Lighting', amount: 320000, date: '2026-08-21', status: 'pending' },
  { id: 'INV-2026-094', contractor: 'Bharat Infra Ltd', workOrder: 'MH-WO-D4E5F6', desc: 'Site Clearance & Leveling', amount: 85000, date: '2026-08-22', status: 'rejected' },
];

function MunicipalityBillsPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [filter, setFilter] = useState('all');

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: action === 'approve' ? 'approved' : 'rejected' } : inv));
    toast.success(`Invoice ${id} has been ${action === 'approve' ? 'approved for payment' : 'rejected'}.`);
  };

  const filtered = invoices.filter(inv => filter === 'all' || inv.status === filter);

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Financial Control</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Bills & Approvals</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Review, approve, and disburse payments for contractor milestones.</p>
        </div>
        <div className="flex gap-4">
          <GlassCard className="px-4 py-2 flex items-center gap-2 border-emerald-500/20 bg-emerald-500/5">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-[10px] font-bold uppercase text-emerald-600/70">Disbursed (YTD)</p>
              <p className="font-bold text-emerald-700">₹4.2 Crores</p>
            </div>
          </GlassCard>
        </div>
      </header>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-bold">Pending Invoices</h2>
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Invoices</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="action-btn outline flex items-center gap-2 py-1.5">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="pb-3 font-semibold pl-2">Invoice / WO</th>
                <th className="pb-3 font-semibold">Contractor</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                  <td className="py-4 pl-2">
                    <p className="font-bold text-sm text-[var(--foreground)]">{inv.id}</p>
                    <p className="text-[10px] font-semibold text-[var(--muted-foreground)] mt-0.5">{inv.workOrder}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-semibold">{inv.contractor}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm">{inv.desc}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Submitted: {inv.date}</p>
                  </td>
                  <td className="py-4 text-right font-bold text-[var(--foreground)]">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div className="flex justify-center">
                      {inv.status === 'approved' && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {inv.status === 'rejected' && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      {inv.status === 'pending' && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-600 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-right pr-2">
                    {inv.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleAction(inv.id, 'approve')} className="p-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded transition" title="Approve">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction(inv.id, 'reject')} className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded transition" title="Reject">
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 justify-end w-full">
                        <Eye className="w-3 h-3" /> View Log
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                    No invoices found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
