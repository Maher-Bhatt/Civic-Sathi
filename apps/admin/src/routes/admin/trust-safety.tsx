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
    default: return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
  }
}

function TrustSafetyPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 muni-page-enter">
      <div>
        <SectionLabel>Safety & Moderation</SectionLabel>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Trust & Safety</h1>
        <p className="text-muted-foreground mt-1 text-sm">Platform moderation, flagged content, and user suspension management.</p>
      </div>

      <section>
        <SectionLabel>Moderation Queue</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-orange-500/15 rounded-2xl text-orange-600 dark:text-orange-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">142</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Pending Review</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-amber-500/15 rounded-2xl text-amber-600 dark:text-amber-400">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">56</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Flagged Users</div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 bg-red-500/15 rounded-2xl text-red-600 dark:text-red-400">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">1,204</div>
              <div className="text-xs font-medium text-muted-foreground mt-0.5">Total Banned</div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section>
        <SectionLabel>Flagged Content</SectionLabel>
        <GlassCard className="mt-4 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Content Type</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Severity</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {MOCK_FLAGGED.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{item.user}</td>
                    <td className="px-6 py-4 text-foreground/80">{item.type}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{item.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors border border-emerald-500/20" title="Approve/Safe">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg transition-colors border border-red-500/20" title="Ban/Remove">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
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
              <thead className="bg-[var(--surface-elevated)]/70 uppercase text-[11px] font-semibold text-muted-foreground tracking-wider border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Ban Date</th>
                  <th className="px-6 py-3.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {MOCK_BANNED.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-rose-600 dark:text-rose-400">{item.user}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{item.reason}</td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{item.banDate}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                        {item.duration}
                      </span>
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
