import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
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
        <p className="text-sm text-muted-foreground">No complaints match the selected filters.</p>
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
                aria-label="Select all"
              />
            </TableHead>
            <SortHead k="id">Complaint ID</SortHead>
            <SortHead k="category">Category</SortHead>
            <SortHead k="area">Area</SortHead>
            <SortHead k="ward">Ward</SortHead>
            <SortHead k="severity">Severity</SortHead>
            <SortHead k="department">Department</SortHead>
            <SortHead k="status">Status</SortHead>
            <SortHead k="createdAt">Created</SortHead>
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
              <TableCell className="text-sm">{c.category}</TableCell>
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
                {format(new Date(c.createdAt), "dd MMM yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
