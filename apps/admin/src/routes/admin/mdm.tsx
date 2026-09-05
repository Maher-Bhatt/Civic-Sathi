import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/admin/mdm')({
  component: MdmComponent,
})

function MdmComponent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Master Data Management</h1>
      <Tabs defaultValue="zones">
        <TabsList>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <CardTitle>Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage zones here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wards">
          <Card>
            <CardHeader>
              <CardTitle>Wards</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage wards here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage departments here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
