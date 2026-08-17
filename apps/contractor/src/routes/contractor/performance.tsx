import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractor } from "@/services/api";
import { Contractor } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";

export const Route = createFileRoute("/contractor/performance")({
  head: () => ({ meta: [{ title: "Performance - Contractor Portal" }] }),
  component: ContractorPerformance,
});

const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface-elevated)",
  border: "1px solid var(--glass-border)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

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

  const slaValue = Math.min(100, score + 12);
  const ftipValue = Math.min(100, score + 5);
  const otcValue = Math.min(100, score + 8);

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
              {slaValue}%
            </div>
            <div className="text-xs text-[var(--success)] mt-1">Target: &gt; 90%</div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${slaValue}%`,
                  background: "linear-gradient(90deg, #1abc9c, #27ae60)",
                }}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5 glass-strong flex flex-col justify-between">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">First-Time Inspection Pass</div>
            <div className="text-3xl font-light text-[var(--foreground)]">
              {ftipValue}%
            </div>
            <div className="text-xs text-[var(--warning)] mt-1">Target: &gt; 85%</div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${ftipValue}%`,
                  background: "linear-gradient(90deg, #f39c12, #e67e22)",
                }}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5 glass-strong flex flex-col justify-between">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">On-Time Completion</div>
            <div className="text-3xl font-light text-[var(--foreground)]">
              {otcValue}%
            </div>
            <div className="text-xs text-[var(--success)] mt-1">Target: &gt; 95%</div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${otcValue}%`,
                  background: "linear-gradient(90deg, #1abc9c, #27ae60)",
                }}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5 glass-strong flex flex-col justify-between bg-[var(--surface-elevated)]/50">
            <div className="text-[var(--muted-foreground)] text-sm mb-2">Total Historical Work Orders</div>
            <div className="text-3xl font-semibold text-[var(--primary)]">
              {Math.floor(Math.random() * 50) + 120}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">Lifetime completed</div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: "78%",
                  background: "linear-gradient(90deg, #3498db, #1abc9c)",
                }}
              />
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 glass-strong h-80 flex flex-col">
          <SectionLabel className="mb-4">Score Trend (Last 4 Quarters)</SectionLabel>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1abc9c" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1abc9c" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend />
                <ReferenceLine
                  y={80}
                  stroke="#27ae60"
                  strokeDasharray="4 4"
                  label={{ value: "Target: 80", fill: "#27ae60", fontSize: 10, position: "insideTopRight" }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                  {mockHistoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score >= 80
                          ? "#27ae60"
                          : entry.score >= 60
                          ? "#f39c12"
                          : "#e74c3c"
                      }
                      fillOpacity={0.85}
                    />
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
