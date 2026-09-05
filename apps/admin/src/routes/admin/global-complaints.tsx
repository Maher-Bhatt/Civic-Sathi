import { createFileRoute } from '@tanstack/react-router'
import { GlassCard } from '@/components/ui/glass-card'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/admin/global-complaints')({
  component: GlobalComplaintsPage,
})

const MOCK_COMPLAINTS = [
  { id: 'C-2026-8901', city: 'Mumbai', category: 'Roads', priority: 'Critical', status: 'Open', date: '2026-09-05', ward: 'Ward A' },
  { id: 'C-2026-8902', city: 'Delhi', category: 'Water', priority: 'High', status: 'In Progress', date: '2026-09-04', ward: 'Ward 2' },
  { id: 'C-2026-8903', city: 'Bengaluru', category: 'Waste', priority: 'Medium', status: 'Open', date: '2026-09-04', ward: 'Ward X' },
  { id: 'C-2026-8904', city: 'Vadodara', category: 'Health', priority: 'Low', status: 'Resolved', date: '2026-09-03', ward: 'Ward 5' },
  { id: 'C-2026-8905', city: 'Mumbai', category: 'Electricity', priority: 'High', status: 'Closed', date: '2026-09-02', ward: 'Ward B' },
  { id: 'C-2026-8906', city: 'Delhi', category: 'Traffic', priority: 'Medium', status: 'Open', date: '2026-09-01', ward: 'Ward 1' },
  { id: 'C-2026-8907', city: 'Bengaluru', category: 'Roads', priority: 'Critical', status: 'In Progress', date: '2026-09-01', ward: 'Ward Y' },
  { id: 'C-2026-8908', city: 'Vadodara', category: 'Water', priority: 'Medium', status: 'Resolved', date: '2026-08-31', ward: 'Ward 6' },
  { id: 'C-2026-8909', city: 'Mumbai', category: 'Waste', priority: 'Low', status: 'Closed', date: '2026-08-30', ward: 'Ward C' },
  { id: 'C-2026-8910', city: 'Delhi', category: 'Health', priority: 'High', status: 'Open', date: '2026-08-30', ward: 'Ward 3' },
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'Critical': return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30'
    case 'High': return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30'
    case 'Medium': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
    case 'Low': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
    default: return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
  }
}

function GlobalComplaintsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 muni-page-enter">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Global Complaints Search</h1>
        <p className="text-muted-foreground mt-1 text-sm">Cross-city master directory of all reported civic issues</p>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by ID, keyword, or user..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium">
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Vadodara">Vadodara</option>
          </select>
          <select className="bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-primary-foreground px-4 py-2 rounded-xl transition-colors font-semibold text-sm shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
              <tr>
                <th className="px-6 py-3.5">Case ID</th>
                <th className="px-6 py-3.5">City</th>
                <th className="px-6 py-3.5">Ward</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Filed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {MOCK_COMPLAINTS.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono font-semibold text-xs text-blue-600 dark:text-blue-400">{complaint.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{complaint.city}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{complaint.ward}</td>
                  <td className="px-6 py-4 text-foreground/80">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-foreground">
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{complaint.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div>Showing 1 to 10 of 2,453 entries</div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg transition-colors disabled:opacity-50 text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-lg transition-colors text-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
