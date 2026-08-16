import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getAnalyticsData } from "@/services/api";
import { AREA_HEALTH_HEX } from "@/services/geography";

export const Route = createFileRoute("/_auth/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Municipal Intelligence" }] }),
  component: AnalyticsPage,
});

const complaintConfig: ChartConfig = {
  total: { label: "Total", color: "var(--color-chart-1)" },
  critical: { label: "Critical", color: "var(--color-chart-4)" },
};

const severityConfig: ChartConfig = {
  low: { label: "Low", color: AREA_HEALTH_HEX.low },
  moderate: { label: "Moderate", color: AREA_HEALTH_HEX.moderate },
  high: { label: "High", color: AREA_HEALTH_HEX.high },
  critical: { label: "Critical", color: AREA_HEALTH_HEX.critical },
};

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  AREA_HEALTH_HEX.moderate,
];

function AnalyticsPage() {
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalyticsData>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData(city)
      .then(setData)
      .finally(() => setLoading(false));
  }, [city]);

  if (loading || !data) return <LoadingState message="Loading analytics..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>City Analytics</SectionLabel>
        <h1 className="jm-glitch-text mt-2 text-2xl font-semibold">Trends and distribution insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">Prototype Intelligence Data</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Complaint Volume Trend</SectionLabel>
          <ChartContainer config={complaintConfig} className="mt-4 h-[260px] w-full">
            <AreaChart data={data.complaintTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="muniVolFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-chart-1)"
                fill="url(#muniVolFill)"
                strokeWidth={2}
                animationDuration={1400}
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="var(--color-chart-4)"
                strokeWidth={2}
                dot={false}
                animationDuration={1400}
              />
            </AreaChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Severity Distribution</SectionLabel>
          <ChartContainer config={severityConfig} className="mt-4 h-[260px] w-full">
            <BarChart data={data.severityTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="low" stackId="a" fill={AREA_HEALTH_HEX.low} radius={[0, 0, 0, 0]} animationDuration={1200} />
              <Bar dataKey="moderate" stackId="a" fill={AREA_HEALTH_HEX.moderate} animationDuration={1200} />
              <Bar dataKey="high" stackId="a" fill={AREA_HEALTH_HEX.high} animationDuration={1200} />
              <Bar dataKey="critical" stackId="a" fill={AREA_HEALTH_HEX.critical} radius={[4, 4, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Department Workload</SectionLabel>
          <ChartContainer config={{ value: { label: "Complaints" } }} className="mt-4 h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data.departmentDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                animationDuration={1500}
              >
                {data.departmentDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Category Distribution</SectionLabel>
          <ChartContainer config={{ value: { label: "Reports", color: "var(--color-chart-1)" } }} className="mt-4 h-[260px] w-full">
            <BarChart
              data={data.categoryDistribution}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} animationDuration={1200} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Emerging Issues Trend</SectionLabel>
          <ChartContainer config={{ count: { label: "Issues", color: "var(--color-chart-1)" } }} className="mt-4 h-[220px] w-full">
            <LineChart data={data.emergingTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={{ r: 3 }}
                animationDuration={1400}
              />
            </LineChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>Average Response Time (days)</SectionLabel>
          <ChartContainer config={{ days: { label: "Days", color: "var(--color-chart-3)" } }} className="mt-4 h-[220px] w-full">
            <LineChart data={data.responseTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="days"
                stroke="var(--color-days)"
                strokeWidth={2}
                dot={{ r: 3 }}
                animationDuration={1400}
              />
            </LineChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </div>
  );
}
