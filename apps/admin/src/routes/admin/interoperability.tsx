import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Server, Activity, Shield, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getSetuSystems } from '@/services/shared-store'

export const Route = createFileRoute('/admin/interoperability')({
  component: InteroperabilityPage,
})

function getStatusBadge(status: string) {
  const s = String(status || '').toUpperCase()
  if (s === 'ACTIVE' || s === 'ONLINE' || s === 'VERIFIED_DEMO') {
    return {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    }
  }
  if (s === 'SANDBOX' || s === 'DEGRADED' || s === 'PENDING') {
    return {
      dot: 'bg-amber-500',
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    }
  }
  return {
    dot: 'bg-slate-500',
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  }
}

function InteroperabilityPage() {
  const { data: systems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['setu-systems'],
    queryFn: getSetuSystems,
    retry: 1,
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      <div>
        <SectionLabel>PS26129 Interoperability</SectionLabel>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">
          Sathi Setu Interoperability Hub
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Live telemetry and schema status of federated public grievance connectors via Sathi Setu.
        </p>
      </div>

      {/* Gateway Connection Banner */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${error ? 'bg-amber-500/15 text-amber-600' : 'bg-emerald-500/15 text-emerald-600'}`}>
            {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {error ? 'Sathi Setu Service Standby' : 'Sathi Setu Gateway Connected'}
            </div>
            <div className="text-xs text-muted-foreground">
              {error
                ? 'External connector endpoint unreachable at VITE_SETU_API_BASE_URL. Start sathi-setu service to stream live telemetry.'
                : 'Directly querying the external_systems registry and canonical connectors.'}
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground transition-colors self-start sm:self-auto"
        >
          Check Connectivity
        </button>
      </GlassCard>

      {/* Connected Systems Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Connected Systems Registry ({systems.length})</SectionLabel>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : systems.length === 0 ? (
          <GlassCard className="p-8 text-center text-muted-foreground">
            <Server className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-foreground">No external systems returned</p>
            <p className="text-xs mt-1">
              Ensure Sathi Setu migrations are applied to populate the federated external systems registry.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system) => {
              const badgeStyle = getStatusBadge(system.status)
              return (
                <GlassCard key={system.key} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/15 rounded-xl text-blue-600 dark:text-blue-400">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">{system.name}</h3>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {system.key}
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badgeStyle.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
                        <span>{system.status}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {system.description || 'Federated grievance ingest and status sync connector.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[var(--glass-border)]">
                    <div>
                      <div className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1 font-medium">
                        <Shield className="w-3 h-3" /> Tier
                      </div>
                      <div className="font-semibold text-foreground text-xs uppercase">
                        {system.classification || 'STANDARD'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground mb-0.5 flex items-center gap-1 font-medium">
                        <Activity className="w-3 h-3" /> Last Sync
                      </div>
                      <div className="font-medium text-muted-foreground text-xs">
                        {system.last_sync || 'Not recorded'}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
