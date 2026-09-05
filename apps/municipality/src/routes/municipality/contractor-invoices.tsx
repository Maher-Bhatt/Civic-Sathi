import { createFileRoute } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getWorkOrders } from '@/services/api';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

export const Route = createFileRoute('/municipality/contractor-invoices')({
  component: ContractorInvoicesComponent,
});

function ContractorInvoicesComponent() {
  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['work_orders'],
    queryFn: () => getWorkOrders(),
  });

  // Mock filtering: In a real scenario, we'd query an invoices/bills endpoint
  // Simulating bills associated with work orders
  const pendingInvoices = workOrders?.filter((wo) => wo.status === 'COMPLETED' || wo.status === 'IN_PROGRESS')
    .map(wo => ({
      id: `INV-${wo.id.substring(0, 8)}`,
      workOrderId: wo.id,
      title: `Milestone Payment for ${wo.title}`,
      contractorName: wo.contractorName,
      amount: wo.estimatedCost * 0.5,
      status: 'PENDING_APPROVAL',
      submittedAt: wo.updatedAt,
    })) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractor Invoices</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve milestone bills and final invoices from contractors.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : pendingInvoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 text-muted/50" />
            <p>No pending invoices to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingInvoices.map(inv => (
            <Card key={inv.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">
                      {inv.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{inv.id}</span>
                  </div>
                  <h3 className="font-semibold">{inv.title}</h3>
                  <p className="text-sm text-muted-foreground">{inv.contractorName}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">₹{inv.amount.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground mb-2">Submitted: {new Date(inv.submittedAt).toLocaleDateString()}</p>
                  <div className="flex gap-2 justify-end">
                    <button className="text-xs flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle className="h-3 w-3" /> Approve
                    </button>
                    <button className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50 px-2 py-1 rounded">
                      <XCircle className="h-3 w-3" /> Reject
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
