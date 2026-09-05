import { createFileRoute } from '@tanstack/react-router'
import { GlassCard, SectionLabel } from '@/components/ui/glass-card'
import { ShieldAlert, Users, UserX, CheckCircle, Ban } from 'lucide-react'

export const Route = createFileRoute('/admin/trust-safety')({
  component: TrustSafetyPage,
})

const MOCK_FLAGGED = [
  { id: 1, user: '@john_doe', type: 'Comment', reason: 'Hate Speech', severity: 'High', date: '2026-09-05' },
  { id: 2, user: '@spam_bot99', type: 'Report', reason: 'Spam/Fake', severity: 'Critical', date: '2026-09-05' },
  { id: 3, user: '@angry_citizen', type: 'Comment', reason: 'Harassment', severity: 'Medium', date: '2026-09-04' },
  { id: 4, user: '@troll_master', type: 'Profile', reason: 'Inappropriate Image', severity: 'High', date: '2026-09-04' },
  { id: 5, user: '@fake_official', type: 'Account', reason: 'Impersonation', severity: 'Critical', date: '2026-09-03' },
  { id: 6, user: '@user1234', type: 'Report', reason: 'Misinformation', severity: 'Medium', date: '2026-09-03' },
  { id: 7, user: '@local_biz', type: 'Comment', reason: 'Advertising', severity: 'Low', date: '2026-09-02' },
  { id: 8, user: '@anon_user', type: 'Report', reason: 'Spam/Fake', severity: 'High', date: '2026-09-02' },
]

const MOCK_BANNED = [
  { id: 1, user: '@scammer_x', banDate: '2026-08-15', reason: 'Repeated Fraudulent Reports', duration: 'Permanent' },
  { id: 2, user: '@hate_speech_01', banDate: '2026-08-20', reason: 'Severe Harassment', duration: 'Permanent' },
  { id: 3, user: '@bot_net_55', banDate: '2026-09-01', reason: 'Automated Spam', duration: 'Permanent' },
  { id: 4, user: '@temp_ban_user', banDate: '2026-09-04', reason: 'Misinformation', duration: '7 Days' },
]

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'Low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

function TrustSafetyPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Trust & Safety</h1>
        <p className="text-gray-400 mt-1">Platform moderation, flagged content, and user bans</p>
      </div>

      <section>
        <SectionLabel>Moderation Queue</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 rounded-full text-orange-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">142</div>
              <div className="text-sm text-gray-400">Pending Review</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-400">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">56</div>
              <div className="text-sm text-gray-400">Flagged Users</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-full text-red-400">
              <UserX className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1,204</div>
              <div className="text-sm text-gray-400">Total Banned</div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Flagged Content</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 uppercase text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Content Type</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_FLAGGED.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-400">{item.user}</td>
                    <td className="px-6 py-4 text-gray-300">{item.type}</td>
                    <td className="px-6 py-4 text-white">{item.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-colors" title="Approve/Safe">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-colors" title="Ban/Remove">
                        <Ban className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      <section>
        <SectionLabel>Banned Users</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 uppercase text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Ban Date</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_BANNED.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-rose-400">{item.user}</td>
                    <td className="px-6 py-4 text-white">{item.reason}</td>
                    <td className="px-6 py-4 text-gray-400">{item.banDate}</td>
                    <td className="px-6 py-4 text-gray-400">{item.duration}</td>
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
