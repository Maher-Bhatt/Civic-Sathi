import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import { toast } from "sonner";
import { ComplaintTable } from "@/components/municipality/complaint-table";
import { FilterDrawer } from "@/components/municipality/filter-drawer";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { bulkUpdateComplaints, getMuniComplaints, getSavedViews } from "@/services/api";
import {
  DEFAULT_COMPLAINT_FILTERS,
  type ComplaintFilters,
  type MuniComplaint,
} from "@/services/types";
import { DEPARTMENTS } from "@/services/types";
import { useI18n } from "@/lib/i18n";

type SortKey = keyof Pick<
  MuniComplaint,
  "id" | "category" | "area" | "ward" | "severity" | "department" | "status" | "createdAt"
>;

export const Route = createFileRoute("/_auth/complaints/")({
  validateSearch: (search: Record<string, unknown>) => ({
    area: typeof search["area"] === "string" ? search["area"] : "",
  }),
  head: () => ({ meta: [{ title: "Complaints — Municipal Intelligence" }] }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const { t } = useI18n();
  const { officer } = useMuniAuth();
  const { area: areaSearch } = Route.useSearch();
  const [complaints, setComplaints] = useState<MuniComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComplaintFilters>({
    ...DEFAULT_COMPLAINT_FILTERS,
    city: officer?.city ?? "all",
    area: areaSearch,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [savedViews, setSavedViews] = useState<Awaited<ReturnType<typeof getSavedViews>>>([]);

  useEffect(() => {
    if (areaSearch) setFilters((f) => ({ ...f, area: areaSearch }));
  }, [areaSearch]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    getMuniComplaints(filters)
      .then((items) => {
        if (active) setComplaints(items);
      })
      .catch((error) => {
        console.error("Failed to load municipal complaints", error);
        if (active)
          setLoadError("We couldn't load the complaints right now. Your filters were preserved.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    getSavedViews().then((views) => {
      if (active) setSavedViews(views);
    });
    return () => {
      active = false;
    };
  }, [filters]);

  const sorted = useMemo(() => {
    const list = [...complaints];
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [complaints, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function bulkAssign(dept: (typeof DEPARTMENTS)[number]) {
    if (selected.size === 0) return;
    await bulkUpdateComplaints([...selected], { department: dept, status: "Assigned" });
    toast.success(`Assigned ${selected.size} complaints to ${dept}`);
    setSelected(new Set());
    const refreshed = await getMuniComplaints(filters);
    setComplaints(refreshed);
  }

  if (loading) return <LoadingState message="Loading complaints..." />;
  if (loadError) {
    return (
      <div className="muni-page-enter space-y-6">
        <header>
          <SectionLabel>{t("ui.complaint_management")}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">{t("ui.all_civic_reports")}</h1>
        </header>
        <ErrorState
          description={loadError}
          onRetry={() => setFilters((current) => ({ ...current }))}
        />
      </div>
    );
  }

  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>{t("ui.complaint_management")}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold">{t("ui.all_civic_reports")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sorted.length} {t("ui.complaints_prototype_intellige")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlassButton variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <Filter className="h-3.5 w-3.5" />
            {t("ui.filters")}
          </GlassButton>
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => toast.info("Export is not available in the prototype.")}
          >
            <Download className="h-3.5 w-3.5" />
            {t("ui.export")}
          </GlassButton>
        </div>
      </header>

      {savedViews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {savedViews.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  ...(v.filters["category"]
                    ? { category: v.filters["category"] as ComplaintFilters["category"] }
                    : {}),
                  ...(v.filters["severity"]
                    ? { severity: v.filters["severity"] as ComplaintFilters["severity"] }
                    : {}),
                  ...(v.filters["ward"] ? { ward: v.filters["ward"] as string } : {}),
                }))
              }
              className="press rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <GlassCard elevation="flat" className="flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm text-muted-foreground">
            {selected.size} {t("ui.selected")}
          </span>
          <button
            type="button"
            onClick={() => void bulkAssign("Water Supply" as any)}
            className="action-btn bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
          >
            {t("ui.bulk_verify")}
          </button>
          <button
            type="button"
            onClick={() => toast.success("Opening bulk classification...")}
            className="action-btn"
          >
            {t("ui.bulk_classify")}
          </button>
        </GlassCard>
      )}

      <ComplaintTable
        complaints={sorted}
        selected={selected}
        onSelect={setSelected}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
      />

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
        onApply={() => setFilterOpen(false)}
        onClear={() => setFilters({ ...DEFAULT_COMPLAINT_FILTERS, city: officer?.city ?? "all" })}
      />
    </div>
  );
}
