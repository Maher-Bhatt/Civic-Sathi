import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { client } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/ai-triage')({
  component: AITriageDashboard,
})

function AITriageDashboard() {
  const [pendingTriage, setPendingTriage] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    try {
      setLoading(true)
      const res = await client.get<any>('/api/v1/ai/triage/pending')
      setPendingTriage(res.pending_triage || [])
    } catch (err) {
      console.error('Failed to fetch triage items', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (complaintId: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(complaintId)
      await client.post(`/api/v1/ai/triage/${complaintId}/${action}`, {})
      // Remove from list
      setPendingTriage(prev => prev.filter(item => item.complaint.id !== complaintId))
    } catch (err) {
      console.error(`Failed to ${action} triage item`, err)
      alert(`Error: Could not ${action} item.`)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Triage Queue</h1>
          <p className="text-muted-foreground">
            Review incoming complaints flagged by JANMIND AI as potentially related to existing civic issues.
          </p>
        </div>
        <Badge variant="secondary" className="text-lg py-1 px-4">
          {pendingTriage.length} Pending
        </Badge>
      </div>

      {pendingTriage.length === 0 ? (
        <Card className="flex h-64 flex-col items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center text-center">
            <Check className="mb-4 h-12 w-12 text-green-500" />
            <p className="text-xl font-semibold">All caught up!</p>
            <p className="text-muted-foreground">No pending complaints require human review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pendingTriage.map((item) => (
            <Card key={item.analysis_id} className="flex flex-col border-yellow-500/20 shadow-md">
              <CardHeader className="bg-yellow-500/5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-background text-yellow-600 border-yellow-600">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Needs Review
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {(item.duplicate_score * 100).toFixed(0)}% Match
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {item.complaint.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {item.complaint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="rounded-md bg-muted p-4 border border-border/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Candidate Civic Issue
                  </p>
                  <p className="font-medium text-sm mb-1">{item.candidate_issue.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {item.candidate_issue.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Badge variant="secondary" className="font-mono">{item.candidate_issue.id.split('-')[0]}</Badge>
                    <span className="text-muted-foreground">•</span>
                    <span>{item.candidate_issue.complaint_count} existing complaints</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-0 pb-4 border-t px-6 mt-auto">
                <Button 
                  className="flex-1" 
                  onClick={() => handleAction(item.complaint.id, 'approve')}
                  disabled={processing === item.complaint.id}
                >
                  {processing === item.complaint.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Merge (Duplicate)
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(item.complaint.id, 'reject')}
                  disabled={processing === item.complaint.id}
                >
                  {processing === item.complaint.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                  Split (Unique)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
