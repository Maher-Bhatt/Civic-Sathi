import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { FileText, CheckCircle2, AlertCircle, Clock, Banknote, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const Route = createFileRoute('/_auth/bills/')({
  component: MunicipalityBillsPage,
});

function MunicipalityBillsPage() {
  const queryClient = useQueryClient();

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['officer-pending-bills'],
    queryFn: () => api.officer.listPendingBills(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.officer.approveBill(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['officer-pending-bills'] });
      toast.success(`Invoice ${id} has been approved for payment.`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve invoice');
    }
  });

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Financial Control</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Bills & Approvals</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Review, approve, and disburse payments for contractor milestones.</p>
        </div>
      </header>

      <GlassCard className="p-6">
        <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--accent)]" />
          Pending Approvals
        </h2>
        
        {isLoading ? (
          <div className="text-center p-8 text-sm text-[var(--muted-foreground)]">Loading pending bills...</div>
        ) : bills.length === 0 ? (
          <div className="text-center p-8 text-sm text-[var(--muted-foreground)]">
            No pending bills require approval at this time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Work Order</th>
                  <th className="px-4 py-3">Contractor ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--accent)]/5 transition-colors">
                    <td className="px-4 py-4 font-mono font-medium">{inv.id}</td>
                    <td className="px-4 py-4">{inv.work_order_id}</td>
                    <td className="px-4 py-4">{inv.contractor_id}</td>
                    <td className="px-4 py-4 font-bold">₹{inv.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {new Date(inv.created_at || new Date()).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => approveMutation.mutate(inv.id)}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-medium transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
