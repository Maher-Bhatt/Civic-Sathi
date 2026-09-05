import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/ai-oversight')({
  component: AIOversightComponent,
})

function AIOversightComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Oversight</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Decisions Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Review automatic categorizations and assignments made by AI.</p>
        </CardContent>
      </Card>
    </div>
  )
}
