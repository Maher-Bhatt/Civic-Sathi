import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAuditLogs } from "@/services/shared-store";
import type { AuditLog, SystemRole } from "@/services/types";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { Shield, Search, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs | Admin | Civic Sathi" }] }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
    const { t } = useI18n();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // auto-refresh 30s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (roleFilter !== "ALL" && log.actorRole !== roleFilter) return false;
    if (entityFilter !== "ALL" && log.entityType !== entityFilter) return false;
    if (search && !log.actorName.toLowerCase().includes(search.toLowerCase()) &&
        !log.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (startDate && new Date(log.at) < new Date(startDate)) return false;
    if (endDate && new Date(log.at) > new Date(new Date(endDate).setHours(23, 59, 59, 999))) return false;
    return true;
  });

  const uniqueRoles = Array.from(new Set(logs.map(l => l.actorRole)));
  const uniqueEntities = Array.from(new Set(logs.map(l => l.entityType)));

  if (loading) return <LoadingState message="Loading audit logs..." />;

  return (
    <div className="space-y-6 muni-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('ui.system_audit_logs')}</h1>
          <p className="text-[var(--muted-foreground)]">{t('ui.immutable_record_of_platform_a')}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <span>{t('ui.last_updated')}{lastRefreshed.toLocaleTimeString()}</span>
          <button onClick={loadData} className="p-2 glass rounded-md hover:bg-[var(--surface-elevated)] transition-colors" title={t('ui.refresh')}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              className="ambient-field pl-9 w-full"
              placeholder={t('ui.search_actor_or_action')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="ambient-field min-w-[130px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">{t('ui.all_roles')}</option>
            {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select 
            className="ambient-field min-w-[130px]"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="ALL">{t('ui.all_entities')}</option>
            {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="ambient-field text-sm" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
            />
            <span className="text-muted-foreground">-</span>
            <input 
              type="date" 
              className="ambient-field text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--surface-elevated)]/50">
                <th className="py-3 px-4 font-medium">{t('ui.timestamp')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.actor')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.action')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.target_entity')}</th>
                <th className="py-3 px-4 font-medium">{t('ui.details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--surface-elevated)]/30 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-xs text-[var(--muted-foreground)]">
                    {new Date(log.at).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.actorName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[var(--background)] border border-[var(--glass-border)] text-[var(--muted-foreground)]">
                        {log.actorRole}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-xs font-medium border border-[var(--glass-border)] bg-[var(--surface-elevated)]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span>{log.entityType}</span>
                      <span className="text-xs text-[var(--muted-foreground)] font-mono">{log.entityId.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {log.reason ? (
                      <div className="text-xs font-mono bg-[var(--background)] p-2 rounded border border-[var(--glass-border)] overflow-x-auto max-w-xs">
                        {log.reason}
                      </div>
                    ) : (
                      <span className="text-[var(--muted-foreground)] italic text-xs">{t('ui.no_details')}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--muted-foreground)]">
                    <div className="mx-auto max-w-md space-y-2">
                      <p className="font-semibold">{t('ui.no_audit_logs_match_your_crite')}</p>
                      <p className="text-xs leading-relaxed">{t('ui.audit_logs_explain_empty', 'No persisted platform events match these filters yet. Successful sign-ins and administrative changes will be recorded here automatically.')}</p>
                      <button type="button" onClick={() => window.location.reload()} className="text-xs font-semibold text-primary hover:underline">{t('ui.refresh', 'Refresh')}</button>
                    </div></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}


