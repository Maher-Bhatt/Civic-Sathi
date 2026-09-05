import { createFileRoute } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getMuniComplaints } from '@/services/api';
import { MessageSquare, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

export const Route = createFileRoute('/municipality/citizen-feedback')({
  component: CitizenFeedbackComponent,
});

function CitizenFeedbackComponent() {
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['muni_complaints'],
    queryFn: () => getMuniComplaints(),
  });

  // Mock filtering: In a real scenario, we'd query a feedback endpoint
  // Simulating feedback based on resolved complaints
  const feedbackItems = complaints?.filter((c) => c.status === 'Resolved' || c.status === 'Closed')
    .slice(0, 15)
    .map(c => {
      const isPositive = Math.random() > 0.3;
      return {
        id: `FB-${c.id}`,
        complaintId: c.id,
        complaintTitle: c.title,
        citizenName: c.submittedByName || 'Anonymous Citizen',
        rating: isPositive ? 5 : Math.floor(Math.random() * 3) + 1,
        comment: isPositive 
          ? "Great job, issue was resolved quickly."
          : "Took too long and the fix is temporary.",
        submittedAt: c.updatedAt,
      };
    }) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Citizen Feedback</h1>
        <p className="text-muted-foreground mt-2">
          Monitor citizen satisfaction ratings and comments on resolved issues.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : feedbackItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 text-muted/50" />
            <p>No citizen feedback available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feedbackItems.map(fb => (
            <Card key={fb.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  {fb.rating >= 4 ? (
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <ThumbsUp className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      <ThumbsDown className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{fb.citizenName}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-medium text-foreground">{fb.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">"{fb.comment}"</p>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                    <Badge variant="outline">{fb.complaintId}</Badge>
                    <span>{fb.complaintTitle}</span>
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
