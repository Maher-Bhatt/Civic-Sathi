import { cn } from "@/lib/utils";
import type { ComplaintStatus, Severity } from "@/services/types";

const statusStyles: Record<ComplaintStatus, string> = {
  Received: "text-muted-foreground border-border bg-[var(--glass)]",
  "Under Review": "text-muted-foreground border-border bg-[var(--glass)]",
  Assigned:
    "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  "In Progress":
    "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  Resolved:
    "text-success border-[color-mix(in_oklab,var(--success)_40%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  Closed: "text-subtle border-border bg-[var(--glass)]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.08em] uppercase",
        statusStyles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

const severityStyles: Record<Severity, string> = {
  Low: "text-subtle border-border bg-[var(--glass)]",
  Moderate:
    "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  High: "text-critical border-[color-mix(in_oklab,var(--critical)_38%,transparent)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
  Critical:
    "text-critical border-[color-mix(in_oklab,var(--critical)_55%,transparent)] bg-[color-mix(in_oklab,var(--critical)_18%,transparent)]",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const bars = { Low: 1, Moderate: 2, High: 3, Critical: 4 }[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.08em] uppercase",
        severityStyles[severity],
        className,
      )}
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-current transition-opacity duration-300"
            style={{ height: 4 + i * 2, opacity: i < bars ? 0.95 : 0.22 }}
          />
        ))}
      </span>
      {severity}
    </span>
  );
}
