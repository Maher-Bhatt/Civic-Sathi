import { createFileRoute } from '@tanstack/react-router';
import { GlassCard } from '@/components/ui/glass-card';
import { IndianRupee, Clock, CheckCircle2, FileText, AlertCircle, Plus, Printer, X, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/contractor/bills/')({
  component: BillsPage,
});

function BillsPage() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [bills, setBills] = useState([
    {
      id: 'INV-2026-081',
      workOrder: 'MH-WO-A1B2C3',
      title: 'Foundation Completion - Ward 14 Road',
      amount: 450000,
      status: 'APPROVED',
      dateSubmitted: '2026-08-10',
      expectedPayout: '2026-08-25',
      items: [
        { desc: 'Raw Material (Cement & Steel)', cost: 300000 },
        { desc: 'Labor Wages', cost: 100000 },
        { desc: 'Machinery Rent', cost: 50000 }
      ]
    },
    {
      id: 'INV-2026-092',
      workOrder: 'MH-WO-X7Y8Z9',
      title: 'Material Procurement (Phase 1)',
      amount: 1250000,
      status: 'PENDING_INSPECTION',
      dateSubmitted: '2026-08-20',
      expectedPayout: 'TBD',
      items: [
        { desc: 'Raw Material (Asphalt)', cost: 1250000 }
      ]
    },
    {
      id: 'INV-2026-094',
      workOrder: 'MH-WO-D4E5F6',
      title: 'Site Clearance & Leveling',
      amount: 85000,
      status: 'REJECTED',
      dateSubmitted: '2026-08-22',
      expectedPayout: '-',
      rejectionReason: 'Milestone 1 Inspection failed due to debris left on site.',
      items: [
        { desc: 'Labor Wages', cost: 60000 },
        { desc: 'Dump Truck Rent', cost: 25000 }
      ]
    },
  ]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newWorkOrder, setNewWorkOrder] = useState('MH-WO-A1B2C3');
  const [materialsCost, setMaterialsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [machineryCost, setMachineryCost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle || !materialsCost) return toast.error('Please fill required fields');
    
    const matC = Number(materialsCost) || 0;
    const labC = Number(laborCost) || 0;
    const macC = Number(machineryCost) || 0;
    const total = matC + labC + macC;

    const newBill = {
      id: `INV-2026-${Math.floor(Math.random()*900 + 100)}`,
      workOrder: newWorkOrder,
      title: newItemTitle,
      amount: total,
      status: 'PENDING_INSPECTION',
      dateSubmitted: new Date().toISOString().split('T')[0],
      expectedPayout: 'TBD',
      items: [
        { desc: 'Raw Materials', cost: matC },
        { desc: 'Labor', cost: labC },
        { desc: 'Machinery/Equipment', cost: macC }
      ].filter(i => i.cost > 0)
    };

    setBills([newBill, ...bills]);
    setShowInvoiceModal(false);
    setNewItemTitle('');
    setMaterialsCost('');
    setLaborCost('');
    setMachineryCost('');
    toast.success('Invoice submitted successfully for approval.');
  };

  const handlePrint = (billId: string) => {
    toast.success(`Preparing invoice ${billId} for printing...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:bg-white print:text-black">
      <div className="print:hidden flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Bills & Payments</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Track your invoices, pending payments, and submit milestone claims.
          </p>
        </div>
        <button 
          onClick={() => setShowInvoiceModal(true)}
          className="action-btn primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="print:hidden grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Cleared Payments (YTD)</h3>
          </div>
          <p className="text-3xl font-bold">₹24,50,000</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Pending Approvals</h3>
          </div>
          <p className="text-3xl font-bold">₹{bills.filter(b => b.status === 'PENDING_INSPECTION').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-sm font-semibold">SLA Penalties Deducted</h3>
          </div>
          <p className="text-3xl font-bold text-red-500">-₹15,000</p>
        </GlassCard>
      </div>

      <div className="space-y-4 print:mt-0">
        <h2 className="text-lg font-bold text-[var(--foreground)] print:hidden">Invoice Ledger</h2>
        
        {bills.map((bill) => (
          <GlassCard key={bill.id} className="p-0 overflow-hidden print:shadow-none print:border-b print:rounded-none print:mb-8">
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex p-3 bg-[var(--surface-elevated)] rounded-xl border border-[var(--glass-border)] print:hidden">
                  <FileText className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)] text-lg">{bill.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--primary)] print:text-black">{bill.workOrder}</span>
                    <span>•</span>
                    <span>Invoice: {bill.id}</span>
                    <span>•</span>
                    <span>Submitted: {bill.dateSubmitted}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-xl font-bold text-[var(--foreground)] print:text-black">
                  ₹{bill.amount.toLocaleString()}
                </p>
                <div className="print:hidden">
                  {bill.status === 'APPROVED' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded">
                      Approved
                    </span>
                  )}
                  {bill.status === 'PENDING_INSPECTION' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-1 bg-orange-500/10 text-orange-600 rounded">
                      Pending Inspection
                    </span>
                  )}
                  {bill.status === 'REJECTED' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-1 bg-red-500/10 text-red-600 rounded">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <div className="bg-[var(--surface-elevated)] rounded-lg p-4 border border-[var(--glass-border)] print:border-none print:p-0">
                <h4 className="text-xs font-bold uppercase text-[var(--muted-foreground)] mb-3">Itemized Breakdown</h4>
                <ul className="space-y-2">
                  {bill.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-[var(--foreground)]">{item.desc}</span>
                      <span className="font-semibold">₹{item.cost.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {bill.rejectionReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg print:hidden">
                  <p className="text-xs text-red-600 font-semibold">{bill.rejectionReason}</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-end print:hidden">
                <button 
                  onClick={() => handlePrint(bill.id)}
                  className="action-btn outline flex items-center gap-2 text-xs py-1.5"
                >
                  <Printer className="w-3 h-3" /> Print Invoice
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Invoice Submission Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-[var(--civic-paper)] w-full max-w-lg rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)] bg-[var(--surface-elevated)]">
              <h2 className="font-bold text-lg">Create Milestone Invoice</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="p-1 hover:bg-black/10 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">Invoice Title (Milestone Name)</label>
                <input 
                  type="text" required
                  value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                  placeholder="e.g. Phase 2 Completon"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">Associated Work Order</label>
                <select 
                  value={newWorkOrder} onChange={e => setNewWorkOrder(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="MH-WO-A1B2C3">MH-WO-A1B2C3 - Ward 14 Road</option>
                  <option value="MH-WO-X7Y8Z9">MH-WO-X7Y8Z9 - Material Supply</option>
                </select>
              </div>

              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase text-[var(--muted-foreground)] mb-3">Itemized Costs (₹)</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="w-1/2 text-sm text-[var(--foreground)]">Raw Materials Cost</label>
                    <input 
                      type="number" min="0" required
                      value={materialsCost} onChange={e => setMaterialsCost(e.target.value)}
                      className="w-1/2 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-1/2 text-sm text-[var(--foreground)]">Labor Wages</label>
                    <input 
                      type="number" min="0"
                      value={laborCost} onChange={e => setLaborCost(e.target.value)}
                      className="w-1/2 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-1/2 text-sm text-[var(--foreground)]">Machinery & Equipment</label>
                    <input 
                      type="number" min="0"
                      value={machineryCost} onChange={e => setMachineryCost(e.target.value)}
                      className="w-1/2 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)] uppercase font-bold">Total Claim Amount</p>
                  <p className="text-xl font-bold text-[var(--primary)]">
                    ₹{((Number(materialsCost)||0) + (Number(laborCost)||0) + (Number(machineryCost)||0)).toLocaleString()}
                  </p>
                </div>
                <button type="submit" className="action-btn primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Submit Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS to hide sidebars when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          nav, aside, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
          body { background: white !important; }
        }
      `}} />
    </div>
  );
}
