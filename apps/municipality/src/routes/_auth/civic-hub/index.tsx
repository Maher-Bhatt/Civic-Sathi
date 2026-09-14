import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Network, ArrowRightLeft, ShieldCheck, Settings2, Key, Globe2, Activity } from "lucide-react";

export const Route = createFileRoute("/_auth/civic-hub/")({
  component: CivicHubControlPage,
});

function CivicHubControlPage() {
  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Integration & Interoperability</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Civic Hub Control</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Manage local city API integrations and Sathi Setu endpoints.</p>
        </div>
        <button className="action-btn primary flex items-center gap-2">
          <Key className="w-4 h-4" /> Generate API Key
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 col-span-1 md:col-span-2">
           <div className="flex items-center gap-2 mb-6">
             <Network className="w-5 h-5 text-[var(--primary)]" />
             <h2 className="text-lg font-bold">Active Local Integrations</h2>
           </div>
           
           <div className="space-y-4">
             {/* Sathi Setu */}
             <div className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <ArrowRightLeft className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-[var(--foreground)]">Sathi Setu Interoperability</h3>
                   <p className="text-xs text-[var(--muted-foreground)]">Connecting local PWD and Water Board systems.</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-right">
                   <span className="block text-xs font-bold text-emerald-500">Connected</span>
                   <span className="block text-[10px] text-[var(--muted-foreground)]">Last sync: 2 mins ago</span>
                 </div>
                 <button className="p-2 rounded-lg hover:bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                   <Settings2 className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {/* Smart City Cameras */}
             <div className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                   <Globe2 className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-[var(--foreground)]">Smart City Surveillance Feed</h3>
                   <p className="text-xs text-[var(--muted-foreground)]">AI Triage CCTV analysis endpoint.</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-right">
                   <span className="block text-xs font-bold text-emerald-500">Connected</span>
                   <span className="block text-[10px] text-[var(--muted-foreground)]">Last sync: 10 secs ago</span>
                 </div>
                 <button className="p-2 rounded-lg hover:bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
                   <Settings2 className="w-5 h-5" />
                 </button>
               </div>
             </div>
           </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-sm font-bold uppercase text-[var(--muted-foreground)] tracking-wider mb-4">Traffic & Sync</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted-foreground)]">Incoming Webhooks</span>
                  <span className="font-bold">1,204 / hr</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted-foreground)]">Outgoing API Calls</span>
                  <span className="font-bold">8,432 / hr</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                  <div className="h-full bg-[var(--primary)] w-[85%]"></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold">Data Compliance</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              All local endpoints are currently compliant with DEPA guidelines. No unauthorized data sharing detected.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
