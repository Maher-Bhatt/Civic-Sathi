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
    case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'Low': return 'bg-green-500/10 text-green-400 border-green-500/20'
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

function GlobalComplaintsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Global Complaints Search</h1>
        <p className="text-gray-400 mt-1">Cross-city view of all reported civic issues</p>
      </div>

      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, keyword, or user..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Vadodara">Vadodara</option>
          </select>
          <select className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 uppercase text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Case ID</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Ward</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Filed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {MOCK_COMPLAINTS.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-blue-400">{complaint.id}</td>
                  <td className="px-6 py-4 text-white">{complaint.city}</td>
                  <td className="px-6 py-4 text-gray-400">{complaint.ward}</td>
                  <td className="px-6 py-4 text-gray-300">{complaint.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{complaint.status}</td>
                  <td className="px-6 py-4 text-gray-400">{complaint.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400">
          <div>Showing 1 to 10 of 2,453 entries</div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
