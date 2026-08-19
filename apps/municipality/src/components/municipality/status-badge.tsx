import { cn } from "@/lib/utils";
import type { ComplaintStatus, Severity } from "@/services/types";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  Received: "bg-[var(--glass)] text-muted-foreground",
  "Under Review": "bg-warning/15 text-warning",
  Assigned: "bg-primary/15 text-primary",
  "In Progress": "bg-[#a4503f]/15 text-[#a4503f]",
  Resolved: "bg-primary/20 text-primary",
  Closed: "bg-[var(--glass)] text-subtle",
  Rejected: "border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
};

const SEVERITY_STYLES: Record<Severity, string> = {
  Low: "text-subtle",
  Moderate: "text-warning",
  High: "text-[#a4503f]",
  Critical: "text-critical",
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("text-xs font-medium", SEVERITY_STYLES[severity])}>{severity}</span>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: "Critical" | "High" | "Moderate" | "Informational";
}) {
  const styles = {
    Critical: "border-critical/40 bg-critical/10 text-critical",
    High: "border-[#a4503f]/40 bg-[#a4503f]/10 text-[#a4503f]",
    Moderate: "border-warning/40 bg-warning/10 text-warning",
    Informational: "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}
