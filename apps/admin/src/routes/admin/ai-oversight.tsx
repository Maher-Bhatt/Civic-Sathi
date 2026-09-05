import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Brain, TrendingUp, AlertTriangle, Activity, Check, X } from 'lucide-react'

export const Route = createFileRoute('/admin/ai-oversight')({
  component: AiOversightPage,
})

const MOCK_DECISIONS = [
  { id: 'C-2026-9011', input: 'Huge crater on MG Road causing traffic jam', aiCat: 'Roads/Pothole', conf: 98, override: false, final: 'Roads/Pothole' },
  { id: 'C-2026-9012', input: 'Water smells like sewage in sector 4', aiCat: 'Water Contamination', conf: 92, override: false, final: 'Water Contamination' },
  { id: 'C-2026-9013', input: 'Tree fell down near the park', aiCat: 'Parks & Rec', conf: 65, override: true, final: 'Emergency/Disaster' },
  { id: 'C-2026-9014', input: 'Streetlights not working since 3 days', aiCat: 'Electricity', conf: 95, override: false, final: 'Electricity' },
  { id: 'C-2026-9015', input: 'Garbage pile smelling very bad', aiCat: 'Waste Management', conf: 88, override: false, final: 'Waste Management' },
  { id: 'C-2026-9016', input: 'Stray dogs biting people', aiCat: 'Public Health', conf: 72, override: true, final: 'Animal Control' },
  { id: 'C-2026-9017', input: 'Illegal construction blocking footpath', aiCat: 'Traffic', conf: 55, override: true, final: 'Building Violations' },
  { id: 'C-2026-9018', input: 'Pipe burst spraying water everywhere', aiCat: 'Water Supply', conf: 99, override: false, final: 'Water Supply' },
]

function getConfidenceColor(conf: number) {
  if (conf >= 90) return 'text-emerald-700 dark:text-emerald-400'
  if (conf >= 70) return 'text-amber-700 dark:text-amber-400'
  return 'text-rose-700 dark:text-rose-400'
}

function AiOversightPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      <div>
        <SectionLabel>Machine Learning Oversight</SectionLabel>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">AI Oversight</h1>
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
            <div className="text-3xl font-bold text-foreground">124,592</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">↑ 12% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accuracy Rate</h3>
            </div>
            <div className="text-3xl font-bold text-foreground">94.2%</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">↑ 0.5% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Override Rate</h3>
            </div>
            <div className="text-3xl font-bold text-foreground">5.8%</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">↓ 1.2% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Confidence</h3>
            </div>
            <div className="text-3xl font-bold text-foreground">88.5%</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">↑ 2.1% this month</div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Recent AI Triage Decisions</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">Case ID</th>
                  <th className="px-6 py-3.5">User Input Summary</th>
                  <th className="px-6 py-3.5">AI Category</th>
                  <th className="px-6 py-3.5">Confidence</th>
                  <th className="px-6 py-3.5">Final Category</th>
                  <th className="px-6 py-3.5">Override?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {MOCK_DECISIONS.map((decision) => (
                  <tr key={decision.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-xs text-blue-600 dark:text-blue-400">{decision.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground truncate max-w-xs" title={decision.input}>{decision.input}</td>
                    <td className="px-6 py-4 text-foreground/80">{decision.aiCat}</td>
                    <td className="px-6 py-4 font-bold">
                      <span className={getConfidenceColor(decision.conf)}>{decision.conf}%</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{decision.final}</td>
                    <td className="px-6 py-4">
                      {decision.override ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          No
                        </span>
                      )}
                    </td>
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
