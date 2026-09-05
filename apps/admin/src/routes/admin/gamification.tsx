import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { Trophy, Star, ShieldCheck, Target, Zap, Medal } from 'lucide-react'

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Gamification Engine</h1>
        <p className="text-gray-400 mt-1">Manage civic engagement rewards, badges, and missions</p>
      </div>

      <section>
        <SectionLabel>Achievement Badges</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {MOCK_BADGES.map((badge) => (
            <GlassCard key={badge.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className={`p-3 rounded-xl bg-white/5 ${badge.color}`}>
                <badge.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{badge.name}</h3>
                <p className="text-sm text-gray-400">+{badge.xp} XP Value</p>
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
              <thead className="bg-white/5 uppercase text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Mission Name</th>
                  <th className="px-6 py-4 font-medium">XP Reward</th>
                  <th className="px-6 py-4 font-medium">Deadline</th>
                  <th className="px-6 py-4 font-medium">Participants</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_MISSIONS.map((mission) => (
                  <tr key={mission.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{mission.name}</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">+{mission.reward} XP</td>
                    <td className="px-6 py-4 text-gray-400">{mission.deadline}</td>
                    <td className="px-6 py-4 text-gray-300">{mission.participants.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${mission.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
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
              <h3 className="text-lg font-medium text-white mb-4">Action Multipliers</h3>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Report Filed</span>
                <span className="text-emerald-400 font-medium">10 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Upvote/Downvote</span>
                <span className="text-emerald-400 font-medium">2 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Verified Report (by Official)</span>
                <span className="text-emerald-400 font-medium">25 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Community Verification</span>
                <span className="text-emerald-400 font-medium">15 XP</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Level Thresholds</h3>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Level 2 (Active Citizen)</span>
                <span className="text-blue-400 font-medium">100 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Level 5 (Community Lead)</span>
                <span className="text-blue-400 font-medium">1,000 XP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-300">Level 10 (Civic Champion)</span>
                <span className="text-blue-400 font-medium">5,000 XP</span>
              </div>
              <div className="mt-4">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-medium">
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
