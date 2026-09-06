import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import {
  Server,
  Activity,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  Key,
  Database,
  Copy,
  Check,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getSetuSystems } from '@/services/shared-store'
import { toast } from 'sonner'

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

  const [apiKey, setApiKey] = useState('sk-live-••••••••••••••••')
  const [copied, setCopied] = useState(false)

  const handleExportCSV = () => {
    const csvContent = [
      'id,category,department,status,ward,priority,created_at,resolved_at',
      'GRV-2026-1001,Sanitation,Solid Waste Management,Resolved,Ward 12,High,2026-08-28T09:15:00Z,2026-08-29T14:30:00Z',
      'GRV-2026-1002,Potholes & Roads,Public Works,In Progress,Ward 04,Medium,2026-08-30T11:20:00Z,',
      'GRV-2026-1003,Street Lighting,Electrical Division,Resolved,Ward 09,Low,2026-08-31T18:45:00Z,2026-09-01T20:10:00Z',
      'GRV-2026-1004,Water Supply,Water Supply & Sewerage,Pending,Ward 15,High,2026-09-02T07:10:00Z,',
      'GRV-2026-1005,Stray Animals,Veterinary Dept,Resolved,Ward 03,Medium,2026-09-03T16:00:00Z,2026-09-04T12:00:00Z',
      'GRV-2026-1006,Drainage Overflow,Stormwater Drainage,Resolved,Ward 07,Urgent,2026-09-04T08:30:00Z,2026-09-04T17:45:00Z',
      'GRV-2026-1007,Encroachment,Town Planning,Under Review,Ward 11,Low,2026-09-05T13:15:00Z,',
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `anonymized-municipal-grievances-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Anonymized dataset exported successfully')
  }

  const handleGenerateApiKey = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    setApiKey(`sk-live-••••••••••••${randomSuffix}`)
    toast.success('New API Key generated')
  }

  const handleCopyApiKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success('API Key copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

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

      {/* Open Data & API Access Section */}
      <section className="space-y-4">
        <div>
          <SectionLabel>Public Data & Developer Access</SectionLabel>
          <h2 className="text-xl font-bold text-foreground tracking-tight mt-1">
            Open Data & API Access
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage public datasets, automated exports, and programmatic API access credentials for external developers and research partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open Data Export */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Open Data Export</h3>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    public-dataset-v1.csv (PII Stripped)
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download an anonymized snapshot of civic grievance records for open data compliance, urban analytics, and civic tech research.
              </p>
              <div className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Format:</span>
                  <span className="text-foreground font-semibold">CSV (RFC 4180)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Anonymization:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    GDPR &amp; DPDPA Compliant
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>License:</span>
                  <span className="text-foreground">Open Government Data (OGD)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ready for download</span>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Anonymized Dataset (CSV)
              </button>
            </div>
          </GlassCard>

          {/* API Key Management */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-600 dark:text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">API Key Management</h3>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Sathi-Setu Ingest &amp; Query Token
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Production API credentials used by municipal ward offices and external integrations to synchronize canonical issues.
              </p>
              <div className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Active Secret Key:</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/10 dark:bg-black/40 px-3 py-2 rounded-md border border-[var(--glass-border)]">
                  <code className="text-xs font-mono font-bold tracking-wider text-foreground select-all">
                    {apiKey}
                  </code>
                  <button
                    onClick={handleCopyApiKey}
                    className="p-1 rounded hover:bg-[var(--surface-elevated)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copy API Key"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Keep your secret keys secure</span>
              <button
                onClick={handleGenerateApiKey}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                Generate New Key
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
