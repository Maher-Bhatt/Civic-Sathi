import { cn } from "@/lib/utils";
import type { ComplaintStatus, Severity } from "@/services/types";

const STATUS_STYLES: Record<string, string> = {
  Received: "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
  "Under Review": "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
  Assigned: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300",
  "In Progress": "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300",
  Resolved: "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300",
  Closed: "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400",
  Rejected: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
};

const SEVERITY_STYLES: Record<string, string> = {
  Low: "text-slate-500",
  Moderate: "text-amber-600",
  High: "text-orange-500",
  Critical: "text-red-600",
};

export function StatusBadge({ status }: { status: ComplaintStatus | string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-2 px-2.5 py-0.5 text-xs font-semibold capitalize",
        STATUS_STYLES[status] || STATUS_STYLES["Received"]
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity | string }) {
  return (
    <span className={cn("text-xs font-medium", SEVERITY_STYLES[severity] || SEVERITY_STYLES["Low"])}>{severity}</span>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: "Critical" | "High" | "Moderate" | "Informational" | string;
}) {
  const styles: Record<string, string> = {
    Critical: "bg-red-600 border-red-600 text-white shadow-sm",
    High: "bg-orange-500 border-orange-500 text-white shadow-sm",
    Moderate: "bg-transparent border-amber-500 text-amber-700 dark:text-amber-400",
    Informational: "bg-transparent border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400",
  };
  
  // Map "Medium" and "Low" gracefully
  let key = priority;
  if (priority === "Medium") key = "Moderate";
  if (priority === "Low") key = "Informational";

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        styles[key] || styles["Informational"]
      )}
    >
      {priority}
    </span>
  );
}
