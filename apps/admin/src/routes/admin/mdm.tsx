import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { useState } from 'react'
import { Plus, MapPin, Building, LandPlot, X, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMdmZones,
  createMdmZone,
  getMdmWards,
  createMdmWard,
  getMdmDepartments,
  createMdmDepartment,
  listAdminCities,
} from '@/services/shared-store'

export const Route = createFileRoute('/admin/mdm')({
  component: MasterDataManagementPage,
})

function MasterDataManagementPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'zones' | 'wards' | 'departments'>('zones')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form states
  const [zoneName, setZoneName] = useState('')
  const [zoneCityId, setZoneCityId] = useState('')

  const [wardNumber, setWardNumber] = useState<number>(1)
  const [wardName, setWardName] = useState('')
  const [wardCityId, setWardCityId] = useState('')
  const [wardZoneId, setWardZoneId] = useState('')

  const [deptName, setDeptName] = useState('')
  const [deptSlug, setDeptSlug] = useState('')
  const [deptEmail, setDeptEmail] = useState('')

  // Queries
  const { data: zones = [], isLoading: loadingZones } = useQuery({
    queryKey: ['mdm-zones'],
    queryFn: () => getMdmZones(),
  })

  const { data: wards = [], isLoading: loadingWards } = useQuery({
    queryKey: ['mdm-wards'],
    queryFn: () => getMdmWards(),
  })

  const { data: departments = [], isLoading: loadingDepts } = useQuery({
    queryKey: ['mdm-departments'],
    queryFn: () => getMdmDepartments(),
  })

  const { data: cities = [] } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: () => listAdminCities(),
  })

  // Mutations
  const zoneMutation = useMutation({
    mutationFn: createMdmZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mdm-zones'] })
      setIsModalOpen(false)
      setZoneName('')
    },
  })

  const wardMutation = useMutation({
    mutationFn: createMdmWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mdm-wards'] })
      setIsModalOpen(false)
      setWardName('')
      setWardNumber(1)
    },
  })

  const deptMutation = useMutation({
    mutationFn: createMdmDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mdm-departments'] })
      setIsModalOpen(false)
      setDeptName('')
      setDeptSlug('')
      setDeptEmail('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'zones') {
      const city = zoneCityId || (cities[0]?.id ? String(cities[0].id) : 'Mumbai')
      zoneMutation.mutate({ name: zoneName, city_id: city })
    } else if (activeTab === 'wards') {
      const city = wardCityId || (cities[0]?.id ? String(cities[0].id) : 'Mumbai')
      wardMutation.mutate({
        ward_number: Number(wardNumber),
        name: wardName,
        city_id: city,
        zone_id: wardZoneId || undefined,
      })
    } else if (activeTab === 'departments') {
      deptMutation.mutate({
        name: deptName,
        slug: deptSlug.toLowerCase().replace(/\s+/g, '-'),
        contact_email: deptEmail || undefined,
      })
    }
  }

  const isSubmitting = zoneMutation.isPending || wardMutation.isPending || deptMutation.isPending

  const getCityName = (cityId: string) => {
    const found = cities.find((c: any) => String(c.id) === String(cityId) || c.name === cityId)
    return found ? found.name : cityId || '—'
  }

  const isLoading =
    activeTab === 'zones' ? loadingZones : activeTab === 'wards' ? loadingWards : loadingDepts

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 muni-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SectionLabel>Administrative Boundaries</SectionLabel>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Master Data Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Live directory of geographic zones, municipal wards, and administrative departments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--primary)] text-primary-foreground px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm shadow-sm hover:opacity-90 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add {activeTab === 'zones' ? 'Zone' : activeTab === 'wards' ? 'Ward' : 'Department'}
        </button>
      </div>

      <div className="flex space-x-2 bg-[var(--surface-elevated)] p-1.5 rounded-xl w-fit border border-[var(--glass-border)]">
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'zones'
              ? 'bg-[var(--primary)] text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
          }`}
        >
          <MapPin className="w-4 h-4" /> Zones ({zones.length})
        </button>
        <button
          onClick={() => setActiveTab('wards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'wards'
              ? 'bg-[var(--primary)] text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
          }`}
        >
          <LandPlot className="w-4 h-4" /> Wards ({wards.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'departments'
              ? 'bg-[var(--primary)] text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
          }`}
        >
          <Building className="w-4 h-4" /> Departments ({departments.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            {activeTab === 'zones' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                  <tr>
                    <th className="px-6 py-3.5">Zone Name</th>
                    <th className="px-6 py-3.5">Zone ID</th>
                    <th className="px-6 py-3.5">City</th>
                    <th className="px-6 py-3.5">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {zones.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No zones registered in master data yet. Click &quot;Add Zone&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    zones.map((zone: any) => (
                      <tr key={zone.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{zone.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{String(zone.id).slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-foreground/80 font-medium">{getCityName(zone.city_id)}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                          {zone.created_at ? new Date(zone.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'wards' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                  <tr>
                    <th className="px-6 py-3.5">Ward Number</th>
                    <th className="px-6 py-3.5">Ward Name</th>
                    <th className="px-6 py-3.5">City</th>
                    <th className="px-6 py-3.5">Zone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {wards.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No wards registered in master data yet. Click &quot;Add Ward&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    wards.map((ward: any) => (
                      <tr key={ward.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-foreground">Ward #{ward.ward_number}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">{ward.name}</td>
                        <td className="px-6 py-4 text-foreground/80 font-medium">{getCityName(ward.city_id)}</td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{ward.zone_id ? String(ward.zone_id).slice(0, 8) : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'departments' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                  <tr>
                    <th className="px-6 py-3.5">Department Name</th>
                    <th className="px-6 py-3.5">Slug</th>
                    <th className="px-6 py-3.5">Contact Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                        No departments registered in master data yet. Click &quot;Add Department&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept: any) => (
                      <tr key={dept.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{dept.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{dept.slug}</td>
                        <td className="px-6 py-4 text-foreground/80 text-xs">{dept.contact_email || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--surface)] border border-[var(--glass-border)] p-6 rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Add New {activeTab === 'zones' ? 'Zone' : activeTab === 'wards' ? 'Ward' : 'Department'}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Creates a real database record in the municipal master table.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'zones' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Zone Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. North Zone"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">City</label>
                    <select
                      value={zoneCityId}
                      onChange={(e) => setZoneCityId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {cities.map((city: any) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'wards' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Ward Number</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={wardNumber}
                      onChange={(e) => setWardNumber(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Ward Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ward A - Colaba"
                      value={wardName}
                      onChange={(e) => setWardName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">City</label>
                    <select
                      value={wardCityId}
                      onChange={(e) => setWardCityId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      {cities.map((city: any) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Zone (Optional)</label>
                    <select
                      value={wardZoneId}
                      onChange={(e) => setWardZoneId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="">None</option>
                      {zones.map((z: any) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'departments' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Department Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Water Supply & Sewage"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Slug (Identifier)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. water-supply"
                      value={deptSlug}
                      onChange={(e) => setDeptSlug(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Contact Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. water@dept.gov.in"
                      value={deptEmail}
                      onChange={(e) => setDeptEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-[var(--glass-border)] rounded-xl hover:bg-[var(--surface-elevated)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold bg-[var(--primary)] text-primary-foreground rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
