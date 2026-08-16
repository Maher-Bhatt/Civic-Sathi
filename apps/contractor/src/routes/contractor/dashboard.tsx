import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getWorkOrders, getEligibleTenders } from "@/services/api";
import { WorkOrder, workOrderStatusLabel, workOrderStatusColor } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { AlertCircle, FileCheck, Banknote, HardHat, Sparkles } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/contractor/dashboard")({
  head: () => ({ meta: [{ title: "Contractor Operations Center" }] }),
  component: ContractorDashboard,
});

function ContractorDashboard() {
  const { contractor } = useContractorAuth();
  const cityId = contractor?.city || "11111111-1111-1111-1111-111111111111";

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
          Contractor Operations Center
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm">{contractor.name} | {contractor.email}</p>
      </div>

      {/* AI Contractor Brief */}
      <GlassCard className="p-5 glass-strong border-[var(--primary)] border-l-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-[var(--primary)]" />
          <SectionLabel className="!mb-0 !text-sm">AI Operations Brief</SectionLabel>
        </div>
        <div className="space-y-2 text-sm text-[var(--foreground)]">
          <p>You have <strong>{activeWorkOrders.length} active work orders</strong>.</p>
          {delayedWorkOrders.length > 0 && <p className="text-[var(--destructive)]">⚠️ {delayedWorkOrders.length} projects are currently at high schedule risk.</p>}
          {pendingInspections.length > 0 && <p className="text-[var(--warning)]">⏳ {pendingInspections.length} work orders are awaiting municipal inspection.</p>}
          <p className="text-[var(--success)]">💡 {tenders.length} eligible tenders close within the next 72 hours.</p>
        </div>
      </GlassCard>

      {/* Critical Action Items */}
      {delayedWorkOrders.length > 0 && (
        <GlassCard className="p-5 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">NEEDS YOUR ATTENTION</span>
          </div>
          <ul className="text-sm space-y-2">
            {delayedWorkOrders.map(wo => (
              <li key={wo.id} className="flex justify-between items-center">
                <span>{wo.title} - Behind Schedule</span>
                <Link to={"/contractor/work-orders/$id" as any} params={{ id: wo.id } as any} className="text-red-600 hover:underline">Provide Evidence →</Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><HardHat className="h-4 w-4" /> Active Work Orders</div>
          <span className="text-3xl font-light text-[var(--foreground)]">{activeWorkOrders.length}</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><FileCheck className="h-4 w-4" /> Inspection Pending</div>
          <span className="text-3xl font-light text-[var(--warning)]">{pendingInspections.length}</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><Banknote className="h-4 w-4" /> Payments Pending</div>
          <span className="text-3xl font-light text-[var(--success)]">₹0.00</span>
        </GlassCard>
        <GlassCard className="p-5 glass-strong flex flex-col gap-1 lift">
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2"><AlertCircle className="h-4 w-4" /> Risk Alerts</div>
          <span className="text-3xl font-light text-[var(--destructive)]">{delayedWorkOrders.length}</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Project Health */}
        <GlassCard className="glass-strong overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--glass-border)] flex justify-between items-center">
            <SectionLabel>Active Project Health</SectionLabel>
            <Link to={"/contractor/work-orders" as any} className="text-xs text-[var(--primary)] hover:underline">View All</Link>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
             {activeWorkOrders.length === 0 ? (
               <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">No active projects.</div>
             ) : (
               <ul className="divide-y divide-[var(--glass-border)]">
                 {activeWorkOrders.map(wo => (
                   <li key={wo.id} className="p-4 hover:bg-[var(--surface-elevated)] transition-colors">
                     <div className="flex justify-between mb-1">
                       <Link to={"/contractor/work-orders/$id" as any} params={{ id: wo.id } as any} className="font-medium hover:text-[var(--primary)]">{wo.title}</Link>
                       <span className="text-xs px-2 py-0.5 rounded border border-[var(--glass-border)]" style={{ color: workOrderStatusColor(wo.status) }}>{workOrderStatusLabel(wo.status)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                       <span>Risk: {(wo as any).risk_level || 'LOW'}</span>
                       <span>Planned: {(wo as any).planned_progress_pct || 0}% | Verified: {(wo as any).verified_progress_pct || 0}%</span>
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
            <SectionLabel>Recommended Tender Opportunities</SectionLabel>
            <Link to={"/contractor/tenders" as any} className="text-xs text-[var(--primary)] hover:underline">View Market</Link>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
             {tenders.length === 0 ? (
               <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">No matching tenders available in your registered cities.</div>
             ) : (
               <ul className="divide-y divide-[var(--glass-border)]">
                 {tenders.map(t => (
                   <li key={t.id} className="p-4 hover:bg-[var(--surface-elevated)] transition-colors">
                     <div className="flex justify-between mb-1">
                       <span className="font-medium">{t.title}</span>
                       <span className="text-xs text-[var(--success)] font-mono">₹{t.estimated_budget?.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-2">
                       <span className="bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">HIGH MATCH</span>
                       <span>Closes: {new Date(t.closed_at).toLocaleDateString()}</span>
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

