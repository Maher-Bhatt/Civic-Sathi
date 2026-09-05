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
  if (conf >= 90) return 'text-emerald-400'
  if (conf >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

function AiOversightPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Oversight</h1>
        <p className="text-gray-400 mt-1">Monitor AI model performance, accuracy, and systemic insights</p>
      </div>

      <section>
        <SectionLabel>Performance KPIs</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-gray-400">Total AI Decisions</h3>
            </div>
            <div className="text-3xl font-bold text-white">124,592</div>
            <div className="text-xs text-emerald-400 mt-2">↑ 12% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-medium text-gray-400">Accuracy Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white">94.2%</div>
            <div className="text-xs text-emerald-400 mt-2">↑ 0.5% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-gray-400">Override Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white">5.8%</div>
            <div className="text-xs text-emerald-400 mt-2">↓ 1.2% this month</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-gray-400">Avg Confidence</h3>
            </div>
            <div className="text-3xl font-bold text-white">88.5%</div>
            <div className="text-xs text-emerald-400 mt-2">↑ 2.1% this month</div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Recent AI Triage Decisions</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 uppercase text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Case ID</th>
                  <th className="px-6 py-4 font-medium">User Input Summary</th>
                  <th className="px-6 py-4 font-medium">AI Category</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium">Final Category</th>
                  <th className="px-6 py-4 font-medium">Override?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_DECISIONS.map((decision) => (
                  <tr key={decision.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-400">{decision.id}</td>
                    <td className="px-6 py-4 text-white truncate max-w-xs" title={decision.input}>{decision.input}</td>
                    <td className="px-6 py-4 text-gray-300">{decision.aiCat}</td>
                    <td className="px-6 py-4 font-bold">
                      <span className={getConfidenceColor(decision.conf)}>{decision.conf}%</span>
                    </td>
                    <td className="px-6 py-4 text-white">{decision.final}</td>
                    <td className="px-6 py-4">
                      {decision.override ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
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
          <GlassCard className="p-5 border-l-4 border-l-orange-500">
            <h3 className="text-lg font-bold text-white">Recurring Potholes</h3>
            <p className="text-sm text-gray-400 mt-2">AI detected 47 similar reports in Zone 6 over the last 14 days, indicating a major systemic road failure.</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-lg transition-colors text-sm font-medium">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border-l-4 border-l-blue-500">
            <h3 className="text-lg font-bold text-white">Water Contamination Spike</h3>
            <p className="text-sm text-gray-400 mt-2">Sudden 300% increase in water quality complaints in Ward B. Possible pipeline cross-contamination.</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-lg transition-colors text-sm font-medium">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-5 border-l-4 border-l-yellow-500">
            <h3 className="text-lg font-bold text-white">Dengue Hotspot Warning</h3>
            <p className="text-sm text-gray-400 mt-2">Correlation detected between stagnant water reports and health complaints in North Zone.</p>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                <Check className="w-4 h-4" /> Escalate
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-lg transition-colors text-sm font-medium">
                <X className="w-4 h-4" /> Dismiss
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
