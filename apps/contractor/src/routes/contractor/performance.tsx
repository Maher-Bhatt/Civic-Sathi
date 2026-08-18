import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractorPerformance } from "@/services/api";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import {
  Star,
  Bot,
  Building2,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
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
} from "recharts";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contractor/performance")({
  head: () => ({ meta: [{ title: "Performance & Tri-Party Ratings — Contractor Portal" }] }),
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
  const { t } = useI18n();
  const { contractor: contractorAuth } = useContractorAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const perf = await getContractorPerformance();
        setData(perf);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contractorAuth]);

  if (loading) return <LoadingState message="Loading Tri-Party Performance Scorecard..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading performance scorecard."} />;
  if (!data) return null;

  const pubRating = Number(data.public_rating || 4.7);
  const aiRating = Number(data.ai_rating || 4.9);
  const offRating = Number(data.officer_rating || 4.8);
  const overall = Number(data.overall_rating || (pubRating * 0.35 + aiRating * 0.35 + offRating * 0.30).toFixed(1));

  const historyData = [
    { name: "Q1", score: +(overall - 0.4).toFixed(1) },
    { name: "Q2", score: +(overall - 0.2).toFixed(1) },
    { name: "Q3", score: +(overall - 0.1).toFixed(1) },
    { name: "Q4 (Current)", score: overall },
  ];

  const reviews = Array.isArray(data.reviews) ? data.reviews : [];

  return (
    <div className="space-y-6 animate-fade pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>Tri-Party Governance & Trust Scorecard</SectionLabel>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mt-1">
            {data.company_name || "Bharat Infra Operations"}
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            Transparent performance ratings audited by Citizens, Antigravity AI, and Municipal Officers.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold block">Class-A Verified Contractor</span>
            <span>Active across Vadodara & Bengaluru</span>
          </div>
        </div>
      </div>

      {/* 3-Way Rating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Public Rating */}
        <GlassCard className="p-6 glass-strong lift flex flex-col justify-between border-t-4 border-t-amber-500">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Users className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">1. Public Rating</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                Citizens
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">{pubRating.toFixed(1)}</span>
              <span className="text-sm text-[var(--muted-foreground)]">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(pubRating) ? "fill-amber-500" : "text-gray-300 dark:text-gray-700"}`}
                />
              ))}
              <span className="text-xs text-[var(--muted-foreground)] ml-2">
                ({data.total_reviews_count || 32} verified reviews)
              </span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mt-4 leading-relaxed">
              Direct civic ratings submitted by citizens on completed road repairs, cleanliness, and public satisfaction.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Citizen Satisfaction:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">96.4% Positive</span>
          </div>
        </GlassCard>

        {/* 2. AI Quality Score */}
        <GlassCard className="p-6 glass-strong lift flex flex-col justify-between border-t-4 border-t-blue-500">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Bot className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">2. AI Quality Rating</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                AI Audit
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">{aiRating.toFixed(1)}</span>
              <span className="text-sm text-[var(--muted-foreground)]">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-blue-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(aiRating) ? "fill-blue-500" : "text-gray-300 dark:text-gray-700"}`}
                />
              ))}
              <span className="text-xs text-[var(--muted-foreground)] ml-2">Algorithmic SLA</span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mt-4 leading-relaxed">
              Automated audit calculating milestone turnaround times, repeat defect reports within 90 days, and photo evidence validity.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Defect Recurrence Rate:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">0.8% (Benchmark &lt; 5%)</span>
          </div>
        </GlassCard>

        {/* 3. Municipal Officer Rating */}
        <GlassCard className="p-6 glass-strong lift flex flex-col justify-between border-t-4 border-t-emerald-500">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Building2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">3. Officer Rating</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                Govt Engineers
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">{offRating.toFixed(1)}</span>
              <span className="text-sm text-[var(--muted-foreground)]">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-emerald-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(offRating) ? "fill-emerald-500" : "text-gray-300 dark:text-gray-700"}`}
                />
              ))}
              <span className="text-xs text-[var(--muted-foreground)] ml-2">Official Sign-Offs</span>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] mt-4 leading-relaxed">
              Ratings by Executive Engineers & Ward Inspectors based on physical core samples, Measurement Books, and safety adherence.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">First-Time Pass Rate:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">97.5%</span>
          </div>
        </GlassCard>
      </div>

      {/* Composite Score & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composite Score */}
        <GlassCard className="p-8 glass-strong flex flex-col items-center justify-center text-center lift">
          <SectionLabel className="mb-4">Composite JANMIND Trust Index</SectionLabel>
          <div className="relative w-44 h-44 rounded-full border-8 border-emerald-500 flex items-center justify-center bg-[var(--surface)] shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-emerald-500">{overall.toFixed(1)}</span>
              <span className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-widest mt-1">Out of 5.0</span>
            </div>
          </div>
          <div className="mt-6 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20">
            Top 2% Contractor Tier in Gujarat
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-3">
            Formula: 35% Public + 35% AI SLA + 30% Municipal Officer
          </p>
        </GlassCard>

        {/* AI Performance Insights */}
        <GlassCard className="lg:col-span-2 p-6 glass-strong flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <SectionLabel>AI Quality Audit & Recommendations</SectionLabel>
            </div>

            <div className="space-y-3">
              {(data.ai_insights || [
                "99.2% on-time milestone delivery across current work orders",
                "0 defect claims during 1-year guarantee period",
                "Excellent citizen feedback on dust and noise suppression"
              ]).map((insight: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--foreground)]">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-center gap-3">
            <Bot className="h-6 w-6 text-purple-500 shrink-0" />
            <div>
              <span className="font-semibold text-[var(--foreground)] block">AI Bidding Advantage Active</span>
              <span className="text-[var(--muted-foreground)]">
                Because your AI score is above 4.8, your bids receive a 5% technical weight bonus in open municipal tenders.
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Verified Reviews Feed */}
      <GlassCard className="p-6 glass-strong">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
            <SectionLabel>Recent Tri-Party Verified Reviews</SectionLabel>
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">Publicly visible</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r: any) => {
            const isPublic = r.author_type === "PUBLIC";
            const isAI = r.author_type === "AI";
            const badgeColor = isPublic
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : isAI
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

            return (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`}>
                      {r.author_type} Review
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{Number(r.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="font-semibold text-[var(--foreground)] mt-1">{r.author_name}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{r.category}</p>
                  <p className="mt-3 text-[var(--foreground)] leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--glass-border)] text-[10px] text-[var(--muted-foreground)]">
                  Verified Audit Timestamp
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
