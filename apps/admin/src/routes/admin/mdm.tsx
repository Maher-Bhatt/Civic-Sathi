import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { useState } from 'react'
import { Edit2, Plus, Trash2, MapPin, Building, LandPlot } from 'lucide-react'

export const Route = createFileRoute('/admin/mdm')({
  component: MasterDataManagementPage,
})

const MOCK_ZONES = [
  { id: 1, name: 'North Zone', code: 'Z-N01', city: 'Mumbai', status: 'Active' },
  { id: 2, name: 'South Zone', code: 'Z-S02', city: 'Mumbai', status: 'Active' },
  { id: 3, name: 'East Zone', code: 'Z-E03', city: 'Delhi', status: 'Active' },
  { id: 4, name: 'West Zone', code: 'Z-W04', city: 'Delhi', status: 'Active' },
  { id: 5, name: 'Central Zone', code: 'Z-C05', city: 'Bengaluru', status: 'Active' },
  { id: 6, name: 'North-West Zone', code: 'Z-NW06', city: 'Vadodara', status: 'Inactive' },
]

const MOCK_WARDS = [
  { id: 1, name: 'Ward A', code: 'W-A01', city: 'Mumbai', status: 'Active' },
  { id: 2, name: 'Ward B', code: 'W-B02', city: 'Mumbai', status: 'Active' },
  { id: 3, name: 'Ward 1', code: 'W-001', city: 'Delhi', status: 'Active' },
  { id: 4, name: 'Ward 2', code: 'W-002', city: 'Delhi', status: 'Active' },
  { id: 5, name: 'Ward X', code: 'W-X01', city: 'Bengaluru', status: 'Inactive' },
]

const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Water Supply', code: 'D-WS', city: 'All', status: 'Active' },
  { id: 2, name: 'Roads & Traffic', code: 'D-RT', city: 'All', status: 'Active' },
  { id: 3, name: 'Waste Management', code: 'D-WM', city: 'All', status: 'Active' },
  { id: 4, name: 'Public Health', code: 'D-PH', city: 'All', status: 'Active' },
  { id: 5, name: 'Parks & Recreation', code: 'D-PR', city: 'All', status: 'Active' },
]

function MasterDataManagementPage() {
  const [activeTab, setActiveTab] = useState<'zones' | 'wards' | 'departments'>('zones')

  const renderTable = (data: any[], type: string) => (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
            <tr>
              <th className="px-6 py-3.5">Name</th>
              <th className="px-6 py-3.5">Code</th>
              <th className="px-6 py-3.5">City</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{item.code}</td>
                <td className="px-6 py-4 text-foreground/80 font-medium">{item.city}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.status === 'Active' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button className="p-2 hover:bg-[var(--surface-elevated)] rounded-lg transition-colors text-blue-600 dark:text-blue-400 border border-[var(--glass-border)]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-[var(--surface-elevated)] rounded-lg transition-colors text-rose-600 dark:text-rose-400 border border-[var(--glass-border)]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 muni-page-enter">
      <div className="flex items-center justify-between">
        <div>
          <SectionLabel>Administrative Boundaries</SectionLabel>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Master Data Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage global geographic entities, municipal wards, and administrative departments</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary)] text-primary-foreground px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm shadow-sm">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="flex space-x-2 bg-[var(--surface-elevated)] p-1.5 rounded-xl w-fit border border-[var(--glass-border)]">
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'zones' ? 'bg-[var(--primary)] text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-black/5'}`}
        >
          <MapPin className="w-4 h-4" /> Zones ({MOCK_ZONES.length})
        </button>
        <button
          onClick={() => setActiveTab('wards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'wards' ? 'bg-[var(--primary)] text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-black/5'}`}
        >
          <LandPlot className="w-4 h-4" /> Wards ({MOCK_WARDS.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'departments' ? 'bg-[var(--primary)] text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-black/5'}`}
        >
          <Building className="w-4 h-4" /> Departments ({MOCK_DEPARTMENTS.length})
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'zones' && renderTable(MOCK_ZONES, 'Zone')}
        {activeTab === 'wards' && renderTable(MOCK_WARDS, 'Ward')}
        {activeTab === 'departments' && renderTable(MOCK_DEPARTMENTS, 'Department')}
      </div>
    </div>
  )
}
