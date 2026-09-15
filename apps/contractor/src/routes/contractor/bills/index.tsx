import { createFileRoute } from '@tanstack/react-router';
import { GlassCard } from '@/components/ui/glass-card';
import { IndianRupee, Clock, CheckCircle2, FileText, AlertCircle, Plus, Printer, X, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const Route = createFileRoute('/contractor/bills/')({
  component: BillsPage,
});

function BillsPage() {
  const queryClient = useQueryClient();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['contractor-bills'],
    queryFn: () => api.bills.list(),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => api.bills.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bills'] });
      toast.success('Invoice submitted successfully');
      setShowInvoiceModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit invoice');
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID': return { icon: CheckCircle2, class: 'text-emerald-400 bg-emerald-400/10' };
      case 'SUBMITTED':
      case 'VERIFIED': return { icon: Clock, class: 'text-amber-400 bg-amber-400/10' };
      case 'REJECTED': return { icon: AlertCircle, class: 'text-rose-400 bg-rose-400/10' };
      default: return { icon: FileText, class: 'text-slate-400 bg-slate-400/10' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 print-wrapper">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-wrapper, .print-wrapper * {
            visibility: visible !important;
          }
          .print-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          aside, nav, header, button, .toast-container, .print-hide {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Billing & Invoices
          </h1>
          <p className="text-slate-400 mt-1">Manage and track your submitted claims</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700 print-hide"
          >
            <Printer className="h-4 w-4" />
            Print Log
          </button>
          <button 
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors print-hide"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400">Loading invoices...</div>
      ) : bills.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No invoices submitted yet.</div>
      ) : (
        <div className="grid gap-4">
          {bills.map((bill: any) => {
            const statusConfig = getStatusConfig(bill.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <GlassCard key={bill.id} className="p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between border-slate-800/50 hover:border-slate-700 transition-all group page-break-inside-avoid">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                      {bill.id}
                    </span>
                    <h3 className="font-medium text-slate-200">Work Order: {bill.work_order_id}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Submitted: {new Date(bill.created_at || new Date()).toLocaleDateString()}
                    </div>
                  </div>

                  {bill.status === 'REJECTED' && bill.feedback && (
                    <div className="text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p>{bill.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:min-w-[140px]">
                  <div className="text-2xl font-bold text-white flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {bill.amount?.toLocaleString('en-IN')}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {bill.status.replace('_', ' ')}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {showInvoiceModal && (
        <CreateInvoiceModal 
          onClose={() => setShowInvoiceModal(false)}
          onSubmit={(data) => submitMutation.mutate(data)}
        />
      )}
    </div>
  );
}

function CreateInvoiceModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    work_order_id: '',
    amount: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print-hide">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Create New Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Work Order ID</label>
            <input 
              type="text" 
              placeholder="e.g. MH-WO-12345"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.work_order_id}
              onChange={e => setFormData({...formData, work_order_id: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Total Claim Amount (₹)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit({ work_order_id: formData.work_order_id, amount: Number(formData.amount) })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            disabled={!formData.work_order_id || !formData.amount}
          >
            <Save className="h-4 w-4" />
            Submit Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
