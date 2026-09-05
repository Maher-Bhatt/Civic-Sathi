import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/interoperability')({
  component: InteroperabilityComponent,
})

function InteroperabilityComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Interoperability (APIs)</h1>
      <Card>
        <CardHeader>
          <CardTitle>External System Sync</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage integrations with legacy municipal systems and APIs.</p>
        </CardContent>
      </Card>
    </div>
  )
}
