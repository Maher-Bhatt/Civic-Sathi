import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getWorkOrders, getEligibleTenders } from "@/services/api";
import { WorkOrder, workOrderStatusLabel, workOrderStatusColor } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { AlertCircle, FileCheck, Banknote, HardHat, Sparkles } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contractor/dashboard")({
  head: () => ({ meta: [{ title: "Contractor Operations Center" }] }),
  component: ContractorDashboard,
});

function ContractorDashboard() {
    const { t } = useI18n();
  const { contractor } = useContractorAuth();
  const cityId = contractor?.city || "vadodara";

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ["contractor-dashboard", contractor?.id, cityId],
    queryFn: async () => {
      const [woData, tenderData] = await Promise.all([
        getWorkOrders(cityId),
        getEligibleTenders(cityId)
      ]);
      return { workOrders: woData, tenders: tenderData };
    },
    enabled: !!contractor?.id,
  });

  const workOrders = data?.workOrders || [];
  const tenders = data?.tenders || [];

  if (loading) return <LoadingState message="Initializing Operations Center..." />;
  if (error) return <ErrorState description={error?.message ?? "Connection Error"} />;
  if (!contractor) return null;

  const activeWorkOrders = workOrders.filter(wo => wo.status !== 'COMPLETED' && wo.status !== 'CLOSED');
  const delayedWorkOrders = activeWorkOrders.filter(wo => (wo as any).risk_level === 'HIGH' || (wo as any).risk_level === 'CRITICAL');
  const pendingInspections = workOrders.filter(wo => wo.status === 'INSPECTION_PENDING');

  return (
    <div className="space-y-6 animate-fade max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
          {t('ui.contractor_operations_center')}</h1>
        <p className="text-[var(--muted-foreground)] text-sm">{contractor.name} | {contractor.email}</p>
      </div>

      {/* AI Contractor Brief */}
      <GlassCard className="p-5 glass-strong border-[var(--primary)] border-l-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-[var(--primary)]" />
          <SectionLabel className="!mb-0 !text-sm">{t('ui.ai_operations_brief')}</SectionLabel>
        </div>
        <div className="space-y-2 text-sm text-[var(--foreground)]">
          <p>{t('ui.you_have')}<strong>{activeWorkOrders.length} {t('ui.active_work_orders')}</strong>.</p>
          {delayedWorkOrders.length > 0 && <p className="text-[var(--destructive)]">⚠️ {delayedWorkOrders.length} {t('ui.projects_are_currently_at_high')}</p>}
          {pendingInspections.length > 0 && <p className="text-[var(--warning)]">⏳ {pendingInspections.length} {t('ui.work_orders_are_awaiting_munic')}</p>}
          <p className="text-[var(--success)]">💡 {tenders.length} {t('ui.eligible_tenders_close_within_')}</p>
        </div>
      </GlassCard>

      {/* Critical Action Items */}
      {delayedWorkOrders.length > 0 && (
        <GlassCard className="p-5 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">{t('ui.needs_your_attention')}</span>
          </div>
          <ul className="text-sm space-y-2">
            {delayedWorkOrders.map(wo => (
              <li key={wo.id} className="flex justify-between items-center">
                <span>{wo.title} {t('ui.behind_schedule')}</span>
                <Link to={"/contractor/work-orders/$id" as any} params={{ id: wo.id } as any} className="text-red-600 hover:underline">{t('ui.provide_evidence')}</Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><HardHat className="h-4 w-4" /> {t('ui.active_work_orders')}</div>
          <span className="text-3xl font-light text-[var(--foreground)]">{activeWorkOrders.length}</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><FileCheck className="h-4 w-4" /> {t('ui.inspection_pending')}</div>
          <span className="text-3xl font-light text-[var(--warning)]">{pendingInspections.length}</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><Banknote className="h-4 w-4" /> {t('ui.payments_pending')}</div>
          <span className="text-3xl font-light text-[var(--success)]">₹0.00</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><AlertCircle className="h-4 w-4" /> {t('ui.risk_alerts')}</div>
          <span className="text-3xl font-light text-[var(--destructive)]">{delayedWorkOrders.length}</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Project Health */}
        <GlassCard className="glass-strong overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center">
            <SectionLabel>{t('ui.active_project_health')}</SectionLabel>
            <Link to={"/contractor/work-orders" as any} className="text-xs text-[var(--primary)] hover:underline">{t('ui.view_all')}</Link>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
             {activeWorkOrders.length === 0 ? (
               <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">{t('ui.no_active_projects')}</div>
             ) : (
               <ul className="divide-y divide-[var(--glass-border)]">
                 {activeWorkOrders.map(wo => (
                   <li key={wo.id} className="p-4 hover:bg-[var(--surface-elevated)] transition-colors">
                     <div className="flex justify-between mb-1">
                       <Link to={"/contractor/work-orders/$id" as any} params={{ id: wo.id } as any} className="font-medium hover:text-[var(--primary)]">{wo.title}</Link>
                       <span className="text-xs px-2 py-0.5 rounded border border-[var(--glass-border)]" style={{ color: workOrderStatusColor(wo.status) }}>{workOrderStatusLabel(wo.status)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                       <span>{t('ui.risk')}{(wo as any).risk_level || 'LOW'}</span>
                       <span>{t('ui.planned')}{(wo as any).planned_progress_pct || 0}{t('ui.verified')}{(wo as any).verified_progress_pct || 0}%</span>
                     </div>
                     <div className="w-full bg-[var(--surface)] h-1.5 mt-2 rounded-full overflow-hidden flex">
                        <div className="bg-[var(--primary)] h-full" style={{ width: `${(wo as any).verified_progress_pct || 0}%`}}></div>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </GlassCard>

        {/* Tender Opportunities */}
        <GlassCard className="glass-strong overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center">
            <SectionLabel>{t('ui.recommended_tender_opportuniti')}</SectionLabel>
            <Link to={"/contractor/tenders" as any} className="text-xs text-[var(--primary)] hover:underline">{t('ui.view_market')}</Link>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
             {tenders.length === 0 ? (
               <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">{t('ui.no_matching_tenders_available_')}</div>
             ) : (
               <ul className="divide-y divide-[var(--glass-border)]">
                 {tenders.map(t => (
                   <li key={t.id} className="p-4 hover:bg-[var(--surface-elevated)] transition-colors">
                     <div className="flex justify-between mb-1">
                       <span className="font-medium">{t.title}</span>
                       <span className="text-xs text-[var(--success)] font-mono">₹{t.estimated_budget?.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-2">
                       <span className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">{t('ui.high_match')}</span>
                       <span>{t('ui.closes')}{new Date(t.closed_at).toLocaleDateString('en-IN')}</span>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </GlassCard>
      </div>

    </div>
  );
}


