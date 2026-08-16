import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Search, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { officerSearch } from "@/services/api";

export function MuniSearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Awaited<ReturnType<typeof officerSearch>> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      officerSearch(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-lg border-[var(--glass-border)] p-0">
        <DialogHeader className="border-b border-[var(--glass-border)] p-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-medium">
            <Search className="h-4 w-4" />
            Officer Search
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Complaint ID, area, ward, issue, department..."
            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          <div className="mt-4 max-h-72 overflow-y-auto">
            {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
            {!loading && query && results && (
              <div className="space-y-4">
                {results.complaints.length > 0 && (
                  <div>
                    <p className="label-xs mb-2">Complaints</p>
                    <ul className="space-y-1">
                      {results.complaints.map((c) => (
                        <li key={c.id}>
                          <Link
                            to={"/complaints/$id" as any}
                            params={{ id: c.id } as any}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--glass)]"
                          >
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{c.id}</span>
                            <span className="text-muted-foreground">— {c.category}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.issues.length > 0 && (
                  <div>
                    <p className="label-xs mb-2">Emerging Issues</p>
                    <ul className="space-y-1">
                      {results.issues.map((i) => (
                        <li key={i.id}>
                          <Link
                            to={"/issues/$id" as any}
                            params={{ id: i.id } as any}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--glass)]"
                          >
                            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{i.category}</span>
                            <span className="text-muted-foreground">— {i.areaName}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.complaints.length === 0 && results.issues.length === 0 && (
                  <p className="text-sm text-muted-foreground">No results found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
