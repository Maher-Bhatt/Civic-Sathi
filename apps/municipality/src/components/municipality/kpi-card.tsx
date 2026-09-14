import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";
import { AlertTriangle } from "lucide-react";

export function KpiCard({
  label,
  value,
  accent,
  delay = 0,
  className,
  trend,
  trendDirection,
  trendGood,
  progress,
}: {
  label: string;
  value: number;
  accent?: "default" | "critical" | "warning" | "success";
  delay?: number;
  className?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "none";
  trendGood?: boolean;
  progress?: number;
}) {
  const isCritical = accent === "critical";

  return (
    <div
      className={cn(
        "animate-rise flex flex-col justify-between p-5 rounded-xl border shadow-sm bg-white dark:bg-slate-900 transition-all",
        isCritical ? "border-l-4 border-l-red-600 bg-red-50/30 dark:bg-red-950/20 border-slate-200 dark:border-slate-800" : "border-slate-200 dark:border-slate-800",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        {isCritical && <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
        <span className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          isCritical ? "text-red-700 dark:text-red-400" : "text-slate-500 dark:text-slate-400"
        )}>
          {label}
        </span>
      </div>
      
      <div className="flex items-end justify-between mt-1">
        <p className={cn(
          "text-3xl font-bold tabular-nums tracking-tight",
          isCritical ? "text-red-600 dark:text-red-500" : "text-slate-900 dark:text-white"
        )}>
          <CountUp value={value} />
        </p>
        
        {trend && (
          <span className={cn(
            "text-[13px] font-medium mb-1",
            trendGood === true ? "text-green-600 dark:text-green-400" : trendGood === false ? "text-red-600 dark:text-red-400" : "text-slate-500"
          )}>
            {trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : ""} {trend}
          </span>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className={cn("h-full rounded-full", isCritical ? "bg-red-600" : "bg-primary")} 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
            />
          </div>
          <span className="text-[10px] text-slate-400">vs prev 30d</span>
        </div>
      )}
    </div>
  );
}
