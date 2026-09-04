import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
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
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Municipal Intelligence" }] }),
  component: AnalyticsPage,
});

const DEPT_COLORS = [
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#e74c3c",
  "#f39c12",
  "#e67e22",
  "#2ecc71",
  "#fd79a8",
];

const complaintConfig: ChartConfig = {
  total: { label: "Total Reports", color: "#1abc9c" },
  critical: { label: "Critical", color: "#e74c3c" },
};

const severityConfig: ChartConfig = {
  low: { label: "Low", color: "#27ae60" },
  moderate: { label: "Moderate", color: "#f39c12" },
  high: { label: "High", color: "#e67e22" },
  critical: { label: "Critical", color: "#e74c3c" },
};

const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface-elevated)",
  border: "1px solid var(--glass-border)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

function AnalyticsPage() {
    const { t } = useI18n();
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "pune";
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalyticsData>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData(city)
      .then(setData)
      .finally(() => setLoading(false));
  }, [city]);

  if (loading || !data) return <LoadingState message="Loading analytics..." />;

  const totalDeptReports = data.departmentDistribution.reduce((s: number, d: any) => s + d.value, 0);

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>{t('ui.city_analytics')}</SectionLabel>
        <h1 className="jm-glitch-text mt-2 text-2xl font-semibold">{t('ui.trends_and_distribution_insigh')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('ui.prototype_intelligence_data')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* 1 — Complaint Volume Trend */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.complaint_volume_trend')}</SectionLabel>
          <ChartContainer config={complaintConfig} className="mt-4 h-[260px] w-full">
            <AreaChart data={data.complaintTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsTotalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1abc9c" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1abc9c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#1abc9c"
                fill="url(#analyticsTotalFill)"
                strokeWidth={2.5}
                animationDuration={1400}
                dot={{ r: 3, fill: "#1abc9c", stroke: "#fff", strokeWidth: 1.5 }}
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="#e74c3c"
                strokeWidth={2}
                dot={{ r: 3, fill: "#e74c3c" }}
                animationDuration={1400}
              />
            </AreaChart>
          </ChartContainer>
        </GlassCard>

        {/* 2 — Severity Distribution */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.severity_distribution')}</SectionLabel>
          <ChartContainer config={severityConfig} className="mt-4 h-[260px] w-full">
            <BarChart data={data.severityTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="low" stackId="a" fill="#27ae60" radius={[0, 0, 0, 0]} animationDuration={1200} />
              <Bar dataKey="moderate" stackId="a" fill="#f39c12" animationDuration={1200} />
              <Bar dataKey="high" stackId="a" fill="#e67e22" animationDuration={1200} />
              <Bar dataKey="critical" stackId="a" fill="#e74c3c" radius={[4, 4, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        {/* 3 — Department Workload Pie */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.department_workload')}</SectionLabel>
          <ChartContainer config={{ value: { label: "Complaints" } }} className="mt-4 h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Pie
                data={data.departmentDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={2}
                animationDuration={1500}
              >
                <Label
                  value={totalDeptReports}
                  position="center"
                  style={{ fontSize: 22, fontWeight: 700, fill: "var(--foreground)" }}
                />
                {data.departmentDistribution.map((_: any, i: number) => (
                  <Cell
                    key={i}
                    fill={DEPT_COLORS[i % DEPT_COLORS.length]}
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </GlassCard>

        {/* 4 — Category Distribution horizontal bar */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.category_distribution')}</SectionLabel>
          <ChartContainer
            config={{ value: { label: "Reports", color: "#3498db" } }}
            className="mt-4 h-[260px] w-full"
          >
            <BarChart
              data={data.categoryDistribution}
              layout="vertical"
              margin={{ top: 8, right: 48, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1200}>
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                {data.categoryDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </GlassCard>

        {/* 5 — Emerging Issues Trend */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.emerging_issues_trend')}</SectionLabel>
          <ChartContainer
            config={{ count: { label: "Issues", color: "#9b59b6" } }}
            className="mt-4 h-[220px] w-full"
          >
            <AreaChart data={data.emergingTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="emergingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b59b6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#9b59b6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#9b59b6"
                strokeWidth={2.5}
                fill="url(#emergingFill)"
                dot={{ r: 4, fill: "#9b59b6", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#9b59b6", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1400}
              />
            </AreaChart>
          </ChartContainer>
        </GlassCard>

        {/* 6 — Average Response Time */}
        <GlassCard elevation="raised" className="jm-chart-card p-5">
          <SectionLabel>{t('ui.average_response_time_days')}</SectionLabel>
          <ChartContainer
            config={{ days: { label: "Days", color: "#f39c12" } }}
            className="mt-4 h-[220px] w-full"
          >
            <LineChart data={data.responseTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={30} domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} contentStyle={TOOLTIP_STYLE} />
              <ReferenceLine
                y={7}
                stroke="#e74c3c"
                strokeDasharray="4 4"
                label={{ value: "SLA Target", fill: "#e74c3c", fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="days"
                stroke="#f39c12"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#f39c12", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#f39c12", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1400}
              />
            </LineChart>
          </ChartContainer>
        </GlassCard>

      </div>
    </div>
  );
}
