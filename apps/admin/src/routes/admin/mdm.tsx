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
          <thead className="bg-white/5 uppercase text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">City</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-400">{item.code}</td>
                <td className="px-6 py-4 text-gray-400">{item.city}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-blue-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-rose-400">
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Master Data Management</h1>
          <p className="text-gray-400 mt-1">Manage global geographic and administrative data</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="flex space-x-2 bg-white/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'zones' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
        >
          <MapPin className="w-4 h-4" /> Zones ({MOCK_ZONES.length})
        </button>
        <button
          onClick={() => setActiveTab('wards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'wards' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
        >
          <LandPlot className="w-4 h-4" /> Wards ({MOCK_WARDS.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'departments' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
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
