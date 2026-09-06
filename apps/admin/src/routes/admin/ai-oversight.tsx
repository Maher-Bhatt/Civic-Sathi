import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Brain, TrendingUp, AlertTriangle, Activity, Check, X } from 'lucide-react'
import { adminApiFetch } from '@/services/shared-store'

export const Route = createFileRoute('/admin/ai-oversight')({
  component: AiOversightPage,
})

function getConfidenceColor(conf: number) {
  if (conf >= 90) return 'text-emerald-700 dark:text-emerald-400'
  if (conf >= 70) return 'text-amber-700 dark:text-amber-400'
  return 'text-rose-700 dark:text-rose-400'
}

function AiOversightPage() {
  const { data: stats } = useQuery({
    queryKey: ['model-run-stats'],
    queryFn: () => adminApiFetch<any>('/api/v1/admin/model-runs/stats'),
    refetchInterval: 60_000,
    retry: 1,
  })

  const { data: runs } = useQuery({
    queryKey: ['model-runs'],
    queryFn: () => adminApiFetch<any>('/api/v1/admin/model-runs?limit=20'),
    refetchInterval: 60_000,
    retry: 1,
  })

  const totalRuns = stats?.total_runs ?? 0
  const isLive = totalRuns > 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      {/* Live / Prototype Banner */}
      {!isLive && (
        <GlassCard className="p-4 border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold">No model run history yet</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              AI model runs will appear here once the Groq API key is set and complaints are processed through the AI triage pipeline. Set <code className="font-mono bg-amber-500/10 px-1 rounded">GROQ_API_KEY</code> in your Render environment variables.
            </div>
          </div>
        </GlassCard>
      )}

      {isLive && (
        <GlassCard className="p-3 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Live ML Telemetry — Connected to Groq API</span>
        </GlassCard>
      )}

      <div>
        <SectionLabel>Machine Learning Oversight</SectionLabel>
        <h1 className="text-3xl font-bold tracking-tight mt-1">AI Oversight</h1>
        <p className="text-muted-foreground mt-1 text-sm">Monitor AI model performance, accuracy, and systemic insights</p>
      </div>

      <section>
        <SectionLabel>Performance KPIs</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total AI Decisions</h3>
            </div>
            <div className="text-3xl font-bold">{(stats?.total_runs ?? 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">All time</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Runs Last 30 Days</h3>
            </div>
            <div className="text-3xl font-bold">{(stats?.runs_last_30_days ?? 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">Rolling window</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error Rate</h3>
            </div>
            <div className="text-3xl font-bold">{stats?.error_rate_pct ?? 0}%</div>
            <div className="text-xs text-muted-foreground mt-2">{stats?.error_count ?? 0} errors</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Duration</h3>
            </div>
            <div className="text-3xl font-bold">{stats?.avg_duration_ms ?? 0}ms</div>
            <div className="text-xs text-muted-foreground mt-2">Per model run</div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Recent Model Runs</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">Run Type</th>
                  <th className="px-6 py-3.5">Model</th>
                  <th className="px-6 py-3.5">Inputs</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {!runs?.items?.length ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                      {isLive ? "Loading model runs…" : "No model runs recorded yet. Process complaints through the AI triage pipeline to populate this table."}
                    </td>
                  </tr>
                ) : runs.items.map((run: any) => (
                  <tr key={run.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{run.run_type}</td>
                    <td className="px-6 py-4 text-foreground/80">{run.model_name}</td>
                    <td className="px-6 py-4">{run.input_count}</td>
                    <td className="px-6 py-4">{run.duration_ms ? `${run.duration_ms}ms` : '—'}</td>
                    <td className="px-6 py-4">
                      {run.error_message ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/15 text-red-600 border border-red-500/30">
                          <X className="w-3 h-3 mr-1" /> Error
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" /> OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(run.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      <section>
        <SectionLabel>Systemic Issue Recommendations</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <GlassCard className="p-5 border-l-4 border-l-orange-500 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recurring Potholes</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">AI detected 47 similar reports in Zone 6 over the last 14 days, indicating a major systemic road failure.</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors text-sm font-semibold shadow-sm">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground py-2 rounded-lg transition-colors text-sm font-semibold">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border-l-4 border-l-blue-500 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Water Contamination Spike</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Sudden 300% increase in water quality complaints in Ward B. Possible pipeline cross-contamination.</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-semibold shadow-sm">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground py-2 rounded-lg transition-colors text-sm font-semibold">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border-l-4 border-l-amber-500 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Dengue Hotspot Warning</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Correlation detected between stagnant water reports and health complaints in North Zone.</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors text-sm font-semibold shadow-sm">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80 text-foreground py-2 rounded-lg transition-colors text-sm font-semibold">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
