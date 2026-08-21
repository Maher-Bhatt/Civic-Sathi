import { Link } from "@tanstack/react-router";
import { safeFormat } from "@/lib/safe-format";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MuniComplaint } from "@/services/types";
import { SeverityBadge, StatusBadge } from "./status-badge";
import { useI18n } from "@/lib/i18n";

type SortKey = keyof Pick<
  MuniComplaint,
  "id" | "category" | "area" | "ward" | "severity" | "department" | "status" | "createdAt"
>;

export function ComplaintTable({
  complaints,
  selected,
  onSelect,
  sortKey,
  sortDir,
  onSort,
}: {
  complaints: MuniComplaint[];
  selected: Set<string>;
  onSelect: (ids: Set<string>) => void;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
    const { t } = useI18n();
  function toggleAll() {
    if (selected.size === complaints.length) onSelect(new Set());
    else onSelect(new Set(complaints.map((c) => c.id)));
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelect(next);
  }

  const SortHead = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(k)}
        className="flex items-center gap-1 text-left hover:text-foreground"
      >
        {children}
        {sortKey === k && <span className="text-[0.6rem]">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </TableHead>
  );

  if (complaints.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] p-12 text-center">
        <p className="text-sm text-muted-foreground">{t('ui.no_complaints_match_the_select')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={selected.size === complaints.length && complaints.length > 0}
                onChange={toggleAll}
                aria-label={t('ui.select_all')}
              />
            </TableHead>
            <SortHead k="id">{t('ui.complaint_id')}</SortHead>
            <SortHead k="category">{t('ui.category')}</SortHead>
            <SortHead k="area">{t('ui.area')}</SortHead>
            <SortHead k="ward">{t('ui.ward')}</SortHead>
            <SortHead k="severity">{t('ui.severity')}</SortHead>
            <SortHead k="department">{t('ui.department')}</SortHead>
            <SortHead k="status">{t('ui.status')}</SortHead>
            <SortHead k="createdAt">{t('ui.created')}</SortHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((c) => (
            <TableRow
              key={c.id}
              className={cn(
                "transition-colors duration-150 hover:bg-[var(--glass)]",
                selected.has(c.id) && "bg-[var(--glass)]",
              )}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggleOne(c.id)}
                  aria-label={`Select ${c.id}`}
                />
              </TableCell>
              <TableCell>
                <Link
                  to={"/complaints/$id" as any}
                  params={{ id: c.id } as any}
                  className="font-medium text-primary hover:underline"
                >
                  {c.id}
                </Link>
              </TableCell>
              <TableCell className="min-w-[18rem]">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description || "No description supplied"}</div>
                <div className="mt-1 text-[0.65rem] uppercase tracking-wide text-primary">{c.category}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.area}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.ward}</TableCell>
              <TableCell>
                <SeverityBadge severity={c.severity} />
              </TableCell>
              <TableCell className="text-sm">{c.department}</TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {safeFormat(c.createdAt, "dd MMM yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
