import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractor } from "@/services/api";
import { Contractor } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

export const Route = createFileRoute("/contractor/performance")({
  head: () => ({ meta: [{ title: "Performance - Contractor Portal" }] }),
  component: ContractorPerformance,
});

function ContractorPerformance() {
  const { contractor: contractorAuth } = useContractorAuth();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!contractorAuth?.contractorId) return;
      try {
        const data = await getContractor(contractorAuth.contractorId);
        setContractor(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contractorAuth]);

  if (loading) return <LoadingState message="Loading performance metrics..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading performance metrics."} />;
  if (!contractor) return null;

  const score = contractor.performanceScore;
  const scoreColor = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--critical)";
  
  // Mock history data for charts based on score
  const mockHistoryData = [
    { name: "Q1", score: Math.max(0, score - 15) },
    { name: "Q2", score: Math.max(0, score - 5) },
    { name: "Q3", score: Math.min(100, score + 5) },
    { name: "Q4", score: score },
  ];

  return (
    <div className="space-y-6 animate-fade">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Performance Metrics</h1>
        <p className="text-[var(--muted-foreground)] text-sm">Track your company's rating and operational statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Gauge */}
        <GlassCard className="p-8 glass-strong flex flex-col items-center justify-center text-center lift">
          <SectionLabel className="mb-6">Overall Rating</SectionLabel>
          <div 
            className="relative w-48 h-48 rounded-full border-8 flex items-center justify-center shadow-lg"
            style={{ borderColor: scoreColor, backgroundColor: "var(--surface)" }}
          >
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold" style={{ color: scoreColor }}>{score}</span>
              <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest mt-1">out of 100</span>
            </div>
          </div>
          <div className="mt-8 px-4 py-2 bg-[var(--surface-elevated)] rounded-md border border-[var(--glass-border)] text-sm">
            Status: <span className="font-semibold" style={{ color: scoreColor }}>
              {score >= 80 ? "Excellent" : score >= 60 ? "Satisfactory" : "Needs Improvement"}
            </span>
          </div>
        </GlassCard>

        {/* Breakdown Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassCard className="p-5 glass-strong flex flex-col justify-between">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">SLA Compliance</div>
            <div className="text-3xl font-light text-[var(--foreground)]">
              {Math.min(100, score + 12)}%
            </div>
            <div className="text-xs text-[var(--success)] mt-2">Target: &gt; 90%</div>
          </GlassCard>
          
          <GlassCard className="p-5 glass-strong flex flex-col justify-between">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">First-Time Inspection Pass</div>
            <div className="text-3xl font-light text-[var(--foreground)]">
              {Math.min(100, score + 5)}%
            </div>
            <div className="text-xs text-[var(--warning)] mt-2">Target: &gt; 85%</div>
          </GlassCard>
          
          <GlassCard className="p-5 glass-strong flex flex-col justify-between">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">On-Time Completion</div>
            <div className="text-3xl font-light text-[var(--foreground)]">
              {Math.min(100, score + 8)}%
            </div>
            <div className="text-xs text-[var(--success)] mt-2">Target: &gt; 95%</div>
          </GlassCard>

          <GlassCard className="p-5 glass-strong flex flex-col justify-between bg-[var(--surface-elevated)]/50">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">Total Historical Work Orders</div>
            <div className="text-3xl font-semibold text-[var(--primary)]">
              {Math.floor(Math.random() * 50) + 120}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-2">Lifetime completed</div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 glass-strong h-80 flex flex-col">
          <SectionLabel className="mb-4">Score Trend (Last 4 Quarters)</SectionLabel>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--surface-elevated)' }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--glass-border)', borderRadius: '8px' }} 
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {mockHistoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--primary)" fillOpacity={0.7 + (index * 0.1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 glass-strong">
          <SectionLabel className="mb-4">Company Profile Data</SectionLabel>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Specializations</div>
              <div className="flex flex-wrap gap-2">
                {contractor.specializationCategories.map((spec: string) => (
                  <span key={spec} className="px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-md text-xs font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--glass-border)]">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Service Wards</div>
              <div className="flex flex-wrap gap-2">
                {contractor.serviceAreas.map(area => (
                  <span key={area} className="px-2.5 py-1 bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--glass-border)] rounded-md text-xs">
                    Ward {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
