import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Server, Activity, Clock, Shield, Power, Wifi, Database } from 'lucide-react'

export const Route = createFileRoute('/admin/interoperability')({
  component: InteroperabilityPage,
})

const MOCK_INTEGRATIONS = [
  { name: 'e-FIR Police Bridge', status: 'Online', latency: 45, sync: '2 mins ago', uptime: 99.9 },
  { name: 'State Transport API', status: 'Online', latency: 120, sync: '1 min ago', uptime: 99.5 },
  { name: 'Hospital Beds API', status: 'Degraded', latency: 850, sync: '15 mins ago', uptime: 95.2 },
  { name: 'Water Supply SCADA', status: 'Online', latency: 35, sync: 'Just now', uptime: 99.99 },
  { name: 'Electricity Grid API', status: 'Offline', latency: 0, sync: '2 hours ago', uptime: 88.4 },
  { name: 'Revenue Records', status: 'Online', latency: 210, sync: '5 mins ago', uptime: 99.1 },
]

const MOCK_ERRORS = [
  { time: '2026-09-05 08:05:12', api: 'Electricity Grid API', error: 'Connection Timeout (HTTP 504)', severity: 'Critical' },
  { time: '2026-09-05 07:45:00', api: 'Hospital Beds API', error: 'Rate Limit Exceeded (HTTP 429)', severity: 'Warning' },
  { time: '2026-09-05 06:30:22', api: 'State Transport API', error: 'Invalid Payload Schema format', severity: 'Error' },
  { time: '2026-09-04 23:15:00', api: 'Electricity Grid API', error: 'Authentication Failure (HTTP 401)', severity: 'Critical' },
]

function getStatusColor(status: string) {
  switch(status) {
    case 'Online': return 'bg-emerald-500'
    case 'Degraded': return 'bg-yellow-500'
    case 'Offline': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

function InteroperabilityPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Interoperability Health Monitor</h1>
        <p className="text-gray-400 mt-1">Status of third-party civic APIs and data pipelines</p>
      </div>

      <section>
        <SectionLabel>Integration Endpoints</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {MOCK_INTEGRATIONS.map((integ, idx) => (
            <GlassCard key={idx} className="p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Server className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">{integ.name}</h3>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(integ.status)} animate-pulse`} />
                  <span className="text-xs font-medium text-gray-300">{integ.status}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-auto pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Latency</div>
                  <div className={`font-medium ${integ.status === 'Offline' ? 'text-gray-500' : integ.latency > 500 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {integ.latency > 0 ? `${integ.latency}ms` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Sync</div>
                  <div className="font-medium text-white text-sm">{integ.sync}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Shield className="w-3 h-3"/> Uptime</div>
                  <div className="font-medium text-white text-sm">{integ.uptime}%</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>API Call Volume Summary</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1.2M</div>
              <div className="text-sm text-gray-400">Calls Today</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-full text-purple-400">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">8.5M</div>
              <div className="text-sm text-gray-400">Calls This Week</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400">
              <Wifi className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">34.2M</div>
              <div className="text-sm text-gray-400">Calls This Month</div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Recent Sync Errors</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 uppercase text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Integration API</th>
                  <th className="px-6 py-4 font-medium">Error Message</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_ERRORS.map((err, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{err.time}</td>
                    <td className="px-6 py-4 font-medium text-white">{err.api}</td>
                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">{err.error}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${err.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : err.severity === 'Warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                        {err.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs font-medium">
                        View Logs
                      </button>
                      <button className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors text-xs font-medium flex items-center gap-1">
                        <Power className="w-3 h-3"/> Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
