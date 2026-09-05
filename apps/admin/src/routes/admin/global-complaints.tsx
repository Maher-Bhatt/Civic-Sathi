import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/admin/global-complaints')({
  component: GlobalComplaintsComponent,
})

function GlobalComplaintsComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Global Complaints Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search by Complaint ID, User, or Description..." />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No complaints found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
