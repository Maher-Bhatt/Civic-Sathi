import { cn } from "@/lib/utils";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { CountUp } from "./count-up";

export function KpiCard({
  label,
  value,
  accent,
  delay = 0,
  className,
}: {
  label: string;
  value: number;
  accent?: "default" | "critical" | "warning" | "success";
  delay?: number;
  className?: string;
}) {
  const accentClass =
    accent === "critical"
      ? "text-critical"
      : accent === "warning"
        ? "text-warning"
        : accent === "success"
          ? "text-primary"
          : "text-foreground";

  return (
    <GlassCard
      elevation="raised"
      className={cn("animate-rise p-5", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <SectionLabel>{label}</SectionLabel>
      <p className={cn("mt-2 text-3xl font-semibold tracking-tight", accentClass)}>
        <CountUp value={value} />
      </p>
    </GlassCard>
  );
}
