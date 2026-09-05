import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/admin/trust-safety')({
  component: TrustSafetyComponent,
})

function TrustSafetyComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Trust & Safety</h1>
      <Card>
        <CardHeader>
          <CardTitle>Flagged Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#123</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Spam</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">Approve</Button>
                  <Button variant="destructive" size="sm">Ban User</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
