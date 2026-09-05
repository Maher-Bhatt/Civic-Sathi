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
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      <div>
        <SectionLabel>Ecosystem Integrations</SectionLabel>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Interoperability Health Monitor</h1>
        <p className="text-muted-foreground mt-1 text-sm">Status of third-party civic APIs, state gateways, and data pipelines</p>
      </div>

      <section>
        <SectionLabel>Integration Endpoints</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {MOCK_INTEGRATIONS.map((integ, idx) => (
            <GlassCard key={idx} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/15 rounded-xl text-blue-600 dark:text-blue-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{integ.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(integ.status)} animate-pulse`} />
                    <span className="text-xs font-semibold text-foreground">{integ.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[var(--glass-border)]">
                <div>
                  <div className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1 font-medium"><Activity className="w-3 h-3"/> Latency</div>
                  <div className={`font-bold text-sm ${integ.status === 'Offline' ? 'text-muted-foreground' : integ.latency > 500 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {integ.latency > 0 ? `${integ.latency}ms` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1 font-medium"><Clock className="w-3 h-3"/> Sync</div>
                  <div className="font-semibold text-foreground text-sm">{integ.sync}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1 font-medium"><Shield className="w-3 h-3"/> Uptime</div>
                  <div className="font-semibold text-foreground text-sm">{integ.uptime}%</div>
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
            <div className="p-4 bg-blue-500/15 rounded-2xl text-blue-600 dark:text-blue-400">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">1.2M</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Calls Today</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-500/15 rounded-2xl text-purple-600 dark:text-purple-400">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">8.5M</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Calls This Week</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-emerald-500/15 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Wifi className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">34.2M</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Calls This Month</div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Recent Sync Errors</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Integration API</th>
                  <th className="px-6 py-3.5">Error Message</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {MOCK_ERRORS.map((err, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{err.time}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{err.api}</td>
                    <td className="px-6 py-4 text-foreground/80 font-mono text-xs">{err.error}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${err.severity === 'Critical' ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30' : err.severity === 'Warning' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' : 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30'}`}>
                        {err.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground border border-[var(--glass-border)] rounded-lg transition-colors text-xs font-semibold">
                        View Logs
                      </button>
                      <button className="px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1">
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
