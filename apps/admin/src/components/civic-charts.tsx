import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { AreaActivity, DailyTrendPoint, IssueChartPoint, IssueKey } from "@/services/geography";
import { AREA_HEALTH_HEX, ISSUE_LABEL } from "@/services/geography";

const trendConfig = {
  reports: { label: "Reports", color: "#1abc9c" },
} satisfies ChartConfig;

const issueConfig = {
  count: { label: "Reports", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function AnimatedStat({
  value,
  className,
  duration = 900,
}: {
  value: number;
  className?: string | undefined;
  duration?: number | undefined;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span className={cn("jm-stat-pop tabular-nums", className)}>{display}</span>;
}

export function ActivityTrendChart({
  data,
  className,
}: {
  data: DailyTrendPoint[];
  className?: string | undefined;
}) {
  return (
    <ChartContainer config={trendConfig} className={cn("h-[180px] w-full", className)}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="adminTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1abc9c" stopOpacity={0.45} />
            <stop offset="50%" stopColor="#1abc9c" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#1abc9c" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={4} width={28} />
        <ChartTooltip
          content={<ChartTooltipContent />}
          contentStyle={{
            backgroundColor: "var(--surface-elevated)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="reports"
          stroke="#1abc9c"
          strokeWidth={3}
          fill="url(#adminTrendFill)"
          animationDuration={1400}
          animationEasing="ease-out"
          dot={{ r: 4, fill: "#1abc9c", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 8, fill: "#1abc9c", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function IssueBreakdownChart({
  data,
  className,
}: {
  data: IssueChartPoint[];
  className?: string | undefined;
}) {
  return (
    <ChartContainer config={issueConfig} className={cn("h-[220px] w-full", className)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={88}
          tick={{ fontSize: 10 }}
        />
        <ChartTooltip
          content={<ChartTooltipContent hideLabel />}
          contentStyle={{
            backgroundColor: "var(--surface-elevated)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        />
        <Bar
          dataKey="count"
          radius={[0, 6, 6, 0]}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          {data.map((d) => (
            <Cell key={d.issue} fill={d.fill} className="jm-bar-cell" />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function HealthPieChart({
  data,
  className,
}: {
  data: Array<{ health: string; label: string; count: number; fill: string }>;
  className?: string | undefined;
}) {
  const pieConfig = Object.fromEntries(
    data.map((d) => [d.health, { label: d.label, color: d.fill }]),
  ) satisfies ChartConfig;

  return (
    <ChartContainer config={pieConfig} className={cn("mx-auto h-[200px] w-full max-w-[280px]", className)}>
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel />}
          contentStyle={{
            backgroundColor: "var(--surface-elevated)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        />
        <Legend
          formatter={(value) => {
            const entry = data.find((d) => d.health === value);
            return entry ? `${entry.label} (${entry.count})` : value;
          }}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 10 }}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="health"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((d) => (
            <Cell
              key={d.health}
              fill={d.fill}
              stroke="var(--background)"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export function AreaMiniCharts({ activity }: { activity: AreaActivity }) {
  const issueData: IssueChartPoint[] = (Object.entries(activity.counts) as [IssueKey, number][])
    .filter(([, n]) => n > 0)
    .map(([issue, count]) => ({
      issue,
      label: ISSUE_LABEL[issue],
      count,
      fill: AREA_HEALTH_HEX[activity.health],
    }));

  if (issueData.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="label-xs">Issue mix in this locality</p>
      <IssueBreakdownChart data={issueData} className="h-[140px]" />
    </div>
  );
}
