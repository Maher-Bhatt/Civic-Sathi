import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/gamification')({
  component: GamificationComponent,
})

function GamificationComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gamification Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rules & Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Configure points logic, levels, and badges.</p>
        </CardContent>
      </Card>
    </div>
  )
}
