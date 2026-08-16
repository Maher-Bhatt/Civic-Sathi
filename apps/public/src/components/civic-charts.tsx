import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  reports: { label: "Reports", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

const issueConfig = {
  count: { label: "Reports", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

/** Animated number counter — counts up on mount. */
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
          <linearGradient id="jmTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={4} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="reports"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#jmTrendFill)"
          animationDuration={1400}
          animationEasing="ease-out"
          dot={{ r: 3, fill: "var(--color-chart-1)", strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--background)" }}
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
    <ChartContainer config={issueConfig} className={cn("h-[200px] w-full", className)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
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
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} animationDuration={1200} animationEasing="ease-out">
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
    <ChartContainer config={pieConfig} className={cn("mx-auto h-[200px] w-full max-w-[220px]", className)}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((d) => (
            <Cell key={d.health} fill={d.fill} stroke="transparent" />
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
