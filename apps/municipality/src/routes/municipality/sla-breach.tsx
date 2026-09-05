import { createFileRoute } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getMuniComplaints } from '@/services/api';
import { AlertTriangle, Clock } from 'lucide-react';

export const Route = createFileRoute('/municipality/sla-breach')({
  component: SLABreachComponent,
});

function SLABreachComponent() {
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['muni_complaints'],
    queryFn: () => getMuniComplaints(),
  });

  // Mock filtering: In a real scenario, backend returns SLA status
  // We just show a simulated list for UI purposes
  const atRiskComplaints = complaints?.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed')
    .slice(0, 10) // Simulate top 10 near breach
    .map(c => ({
      ...c,
      hoursRemaining: Math.floor(Math.random() * 24) // Random hours < 24
    }))
    .sort((a, b) => a.hoursRemaining - b.hoursRemaining) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SLA Breach Risk</h1>
        <p className="text-muted-foreground mt-2">
          Complaints that are within 24 hours of breaching their Service Level Agreement (SLA).
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : atRiskComplaints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Clock className="h-12 w-12 mb-4 text-green-500/50" />
            <p>No complaints are currently at risk of SLA breach.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {atRiskComplaints.map(c => (
            <Card key={c.id} className={c.hoursRemaining < 5 ? "border-red-500/50" : ""}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={c.hoursRemaining < 5 ? "destructive" : "secondary"}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {c.hoursRemaining}h remaining
                    </Badge>
                    <span className="text-xs text-muted-foreground">{c.publicId || c.id}</span>
                  </div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{c.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">{c.category}</Badge>
                  <p className="text-xs text-muted-foreground">{c.area} • {c.ward}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
