import { createFileRoute } from '@tanstack/react-router'
import { GlassCard } from '@/components/ui/glass-card'
import { Search, ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listGlobalComplaints, listAdminCities } from '@/services/shared-store'

export const Route = createFileRoute('/admin/global-complaints')({
  component: GlobalComplaintsPage,
})

function getPriorityColor(priority: string) {
  const p = String(priority || '').toLowerCase()
  switch (p) {
    case 'critical':
      return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30'
    case 'high':
      return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30'
    case 'medium':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
    case 'low':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
    default:
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
  }
}

const PAGE_SIZE = 15

function GlobalComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(0)

  const { data: cities = [] } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: () => listAdminCities(),
  })

  const { data: rawComplaints = [], isLoading } = useQuery({
    queryKey: ['global-complaints', selectedCity, selectedStatus, page],
    queryFn: () =>
      listGlobalComplaints({
        city: selectedCity || undefined,
        status: selectedStatus || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }),
  })

  // Normalize complaint list
  const complaints: any[] = Array.isArray(rawComplaints)
    ? rawComplaints
    : Array.isArray((rawComplaints as any)?.items)
    ? (rawComplaints as any).items
    : []

  // Client-side search filter by title or public_id
  const filteredComplaints = complaints.filter((c: any) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const id = String(c.public_id || c.id || '').toLowerCase()
    const title = String(c.title || '').toLowerCase()
    const cat = String(c.category || '').toLowerCase()
    return id.includes(term) || title.includes(term) || cat.includes(term)
  })

  const handleCityChange = (val: string) => {
    setSelectedCity(val)
    setPage(0)
  }

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val)
    setPage(0)
  }

  const getCityLabel = (c: any) => {
    if (c.city && typeof c.city === 'object') return c.city.name || '—'
    if (c.city_name) return c.city_name
    if (c.city) return c.city
    const found = cities.find((city: any) => String(city.id) === String(c.city_id))
    return found ? found.name : '—'
  }

  const getWardLabel = (c: any) => {
    if (c.ward && typeof c.ward === 'object') return c.ward.name || `Ward ${c.ward.ward_number || ''}`
    if (c.ward_number) return `Ward ${c.ward_number}`
    return c.ward || '—'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 muni-page-enter">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Global Complaints Directory</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          National multi-city directory querying live citizen submissions from the central registry
        </p>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by case ID, title, or category..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium"
          >
            <option value="">All Cities</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="vadodara">Vadodara</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="received">Received</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-16">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-foreground">No complaints matched the criteria</p>
              <p className="text-xs mt-1">Try clearing your filters or search term to view all records.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">Public ID</th>
                  <th className="px-6 py-3.5">Title / Category</th>
                  <th className="px-6 py-3.5">City</th>
                  <th className="px-6 py-3.5">Ward</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Filed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                      {complaint.public_id || String(complaint.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground truncate max-w-xs" title={complaint.title}>
                        {complaint.title || 'Untitled grievance'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{complaint.category || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{getCityLabel(complaint)}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{getWardLabel(complaint)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                          complaint.priority,
                        )}`}
                      >
                        {complaint.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground capitalize">
                        {String(complaint.status || 'received').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div>
            Page {page + 1} · Showing {filteredComplaints.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg transition-colors disabled:opacity-40 text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={complaints.length < PAGE_SIZE}
              className="p-2 hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg transition-colors disabled:opacity-40 text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
