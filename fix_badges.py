import glob

content = """import { cn } from "@/lib/utils";
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

export function StatusBadge({ status, className }: { status: ComplaintStatus | string, className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1 text-xs font-semibold capitalize",
        STATUS_STYLES[status] || STATUS_STYLES["Received"],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

const SEVERITY_STYLES: Record<string, string> = {
  Low: "text-slate-500 border-slate-200",
  Moderate: "text-amber-700 border-amber-200",
  High: "text-orange-500 border-orange-200",
  Critical: "text-red-600 border-red-200",
};

export function SeverityBadge({ severity, className }: { severity: Severity | string, className?: string }) {
  const bars = { Low: 1, Moderate: 2, High: 3, Critical: 4 }[severity as string] || 1;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border-2 px-2.5 py-1 text-xs font-semibold capitalize",
        SEVERITY_STYLES[severity as string] || SEVERITY_STYLES["Low"],
        className
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
"""

for file in glob.glob('apps/*/src/components/ui/badges.tsx'):
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {file}')
