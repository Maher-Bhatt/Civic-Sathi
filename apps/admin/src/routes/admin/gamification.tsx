import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Trophy, Star, ShieldCheck, Target, Zap, Medal, Info } from 'lucide-react'

export const Route = createFileRoute('/admin/gamification')({
  component: GamificationPage,
})

const MOCK_BADGES = [
  { id: 1, name: 'First Report', xp: 50, icon: Star, color: 'text-yellow-400' },
  { id: 2, name: 'Civic Hero', xp: 500, icon: Trophy, color: 'text-amber-500' },
  { id: 3, name: 'Trusted Verifier', xp: 200, icon: ShieldCheck, color: 'text-blue-400' },
  { id: 4, name: 'Pothole Hunter', xp: 150, icon: Target, color: 'text-rose-400' },
  { id: 5, name: 'Quick Responder', xp: 100, icon: Zap, color: 'text-purple-400' },
  { id: 6, name: 'Top 1% Contributor', xp: 1000, icon: Medal, color: 'text-emerald-400' },
]

const MOCK_MISSIONS = [
  { id: 1, name: 'Monsoon Prep 2026', reward: 500, deadline: '2026-09-30', participants: 1245, status: 'Active' },
  { id: 2, name: 'Clean India Drive', reward: 300, deadline: '2026-10-02', participants: 3420, status: 'Active' },
  { id: 3, name: 'Report 5 Potholes', reward: 150, deadline: '2026-09-15', participants: 890, status: 'Active' },
  { id: 4, name: 'Verify 10 Resolves', reward: 200, deadline: '2026-09-20', participants: 450, status: 'Active' },
  { id: 5, name: 'Summer Water Saving', reward: 400, deadline: '2026-08-31', participants: 5600, status: 'Completed' },
]

function GamificationPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      <GlassCard className="p-4 border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-foreground">
            Prototype Concept — Not Connected to Live Data
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Civic engagement XP, achievement badges, and seasonal missions are an architectural concept. Citizen profile points and rewards backend is scheduled for future release.
          </div>
        </div>
      </GlassCard>

      <div>
        <SectionLabel>Engagement & Rewards</SectionLabel>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Gamification Engine</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage civic engagement rewards, badges, and missions</p>
      </div>

      <section>
        <SectionLabel>Achievement Badges</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {MOCK_BADGES.map((badge) => (
            <GlassCard key={badge.id} className="flex items-center gap-4 p-4 hover:bg-[var(--surface-elevated)]/50 transition-colors cursor-pointer border border-[var(--glass-border)]">
              <div className={`p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] ${badge.color}`}>
                <badge.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{badge.name}</h3>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">+{badge.xp} XP Value</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Active Missions</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">Mission Name</th>
                  <th className="px-6 py-3.5">XP Reward</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5">Participants</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {MOCK_MISSIONS.map((mission) => (
                  <tr key={mission.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{mission.name}</td>
                    <td className="px-6 py-4 text-emerald-700 dark:text-emerald-400 font-bold">+{mission.reward} XP</td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{mission.deadline}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{mission.participants.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${mission.status === 'Active' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'}`}>
                        {mission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      <section>
        <SectionLabel>XP Configuration</SectionLabel>
        <GlassCard className="mt-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground mb-4">Action Multipliers</h3>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Report Filed</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">10 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Upvote/Downvote</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">2 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Verified Report (by Official)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">25 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Community Verification</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">15 XP</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground mb-4">Level Thresholds</h3>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Level 2 (Active Citizen)</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold text-sm">100 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Level 5 (Community Lead)</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold text-sm">1,000 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-2.5">
                <span className="text-foreground/90 font-medium text-sm">Level 10 (Civic Champion)</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold text-sm">5,000 XP</span>
              </div>
              <div className="mt-5">
                <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-primary-foreground px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm shadow-sm">
                  Edit Configurations
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
