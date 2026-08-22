import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Download, Filter, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { ComplaintTable } from "@/components/municipality/complaint-table";
import { FilterDrawer } from "@/components/municipality/filter-drawer";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import {
  bulkUpdateComplaints,
  confirmAiMergeGroup,
  getMuniComplaints,
  getSavedViews,
  proposeAiMergeGroups,
} from "@/services/api";
import {
  DEFAULT_COMPLAINT_FILTERS,
  type ComplaintFilters,
  type MergeProposal,
  type MergeProposalResponse,
  type MuniComplaint,
} from "@/services/types";
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
  const navigate = useNavigate();
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
  const [mergeProposal, setMergeProposal] = useState<MergeProposalResponse | null>(null);
  const [mergeBusy, setMergeBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

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

  async function proposeAiGroups() {
    if (selected.size < 2) {
      toast.info("Select at least two complaints for AI grouping.");
      return;
    }
    const backendIds = complaints
      .filter((complaint) => selected.has(complaint.id))
      .map((complaint) => complaint.backendId || complaint.id)
      .filter(Boolean);
    if (backendIds.length < 2) {
      toast.error("The selected complaints are missing backend IDs. Refresh the queue and try again.");
      return;
    }
    setMergeBusy(true);
    try {
      const response = await proposeAiMergeGroups(backendIds);
      setMergeProposal(response);
      if (response.proposals.length === 0) {
        toast.info("No same-area, same-issue group was found in the selected complaints.");
      } else {
        toast.success(`${response.proposals.length} reviewable AI group${response.proposals.length === 1 ? "" : "s"} found.`);
      }
    } catch (error: any) {
      toast.error(error?.message ?? "AI grouping could not be completed.");
    } finally {
      setMergeBusy(false);
    }
  }

  function removeProposalMember(proposalKey: string, complaintId: string) {
    setMergeProposal((current) => {
      if (!current) return current;
      return {
        ...current,
        proposals: current.proposals
          .map((proposal) => {
            if (proposal.proposal_key !== proposalKey) return proposal;
            const complaintIds = proposal.complaint_ids.filter((id) => id !== complaintId);
            return {
              ...proposal,
              complaint_ids: complaintIds,
              complaint_count: complaintIds.length,
              members: proposal.members.filter((member) => member.id !== complaintId),
            };
          })
          .filter((proposal) => proposal.complaint_count >= 2),
      };
    });
  }

  async function confirmProposal(proposal: MergeProposal) {
    if (proposal.complaint_ids.length < 2) return;
    setMergeBusy(true);
    try {
      const confirmed = await confirmAiMergeGroup(proposal.proposal_key, proposal.complaint_ids);
      toast.success(`Confirmed ${proposal.complaint_count} complaints into one Civic Issue.`);
      const mergedIds = new Set(proposal.complaint_ids);
      setSelected((current) => {
        const next = new Set(current);
        complaints.forEach((complaint) => {
          if (mergedIds.has(complaint.backendId || complaint.id)) next.delete(complaint.id);
        });
        return next;
      });
      setMergeProposal((current) => current ? { ...current, proposals: current.proposals.filter((item) => item.proposal_key !== proposal.proposal_key) } : current);
      setComplaints(await getMuniComplaints(filters));
      const issueId = String((confirmed.issue as any)?.id ?? "");
      if (issueId) {
        await navigate({ to: "/civic-issues/$id" as any, params: { id: issueId } as any });
      }
    } catch (error: any) {
      toast.error(error?.message ?? "The AI group became stale. Run grouping again before confirming.");
    } finally {
      setMergeBusy(false);
    }
  }

  async function bulkVerify() {
    if (selected.size === 0 || bulkBusy) return;
    const ids = complaints
      .filter((complaint) => selected.has(complaint.id) && complaint.status === "Received")
      .map((complaint) => complaint.id);
    if (ids.length === 0) {
      toast.info("Only complaints with Received status can be bulk verified.");
      return;
    }
    setBulkBusy(true);
    try {
      await bulkUpdateComplaints(ids, { status: "Under Review" });
      toast.success(`Verified and accepted ${ids.length} complaint${ids.length === 1 ? "" : "s"}.`);
      setSelected(new Set());
      setComplaints(await getMuniComplaints(filters));
    } catch (error: any) {
      toast.error(error?.message ?? "Bulk verification failed. No further complaints were changed.");
    } finally {
      setBulkBusy(false);
    }
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
            onClick={() => void bulkVerify()}
            disabled={bulkBusy || mergeBusy}
            className="action-btn bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bulkBusy ? "Verifying..." : t("ui.bulk_verify")}
          </button>
          <button
            type="button"
            onClick={() => void proposeAiGroups()}
            disabled={mergeBusy}
            className="action-btn border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-60"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {mergeBusy ? "Analyzing groups..." : "AI Group Similar Complaints"}
          </button>
        </GlassCard>
      )}

      {mergeProposal && (
        <GlassCard elevation="raised" className="space-y-4 border-primary/25 bg-primary/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <SectionLabel className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /> AI grouping review</SectionLabel>
              <p className="mt-1 text-sm text-muted-foreground">
                Review the evidence before confirmation. Nothing changes in the database until you confirm a group.
              </p>
            </div>
            <button type="button" className="press rounded-lg p-1 text-muted-foreground hover:bg-[var(--glass)]" onClick={() => setMergeProposal(null)} aria-label="Close AI grouping review">
              <X className="h-4 w-4" />
            </button>
          </div>
          {mergeProposal.proposals.length === 0 ? (
            <p className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-sm text-muted-foreground">
              No selected complaints meet the same-city, same-category, same-area, and text-similarity rules.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {mergeProposal.proposals.map((proposal) => (
                <div key={proposal.proposal_key} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold capitalize">{proposal.category.replaceAll("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">{proposal.area_label ?? "Mapped area"} · {proposal.complaint_count} complaints · {Math.round(proposal.confidence_score * 100)}% confidence</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[0.65rem] font-semibold text-primary">REVIEW</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{proposal.explanation}</p>
                  <div className="mt-3 space-y-2">
                    {proposal.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{member.public_id}</p>
                          <p className="truncate text-muted-foreground">{member.title} · {member.ward_number ? `Ward ${member.ward_number}` : member.address_text ?? "Mapped location"}</p>
                        </div>
                        <button type="button" onClick={() => removeProposalMember(proposal.proposal_key, member.id)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-critical/10 hover:text-critical" aria-label={`Remove ${member.public_id} from proposal`}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" disabled={mergeBusy || proposal.complaint_count < 2} onClick={() => void confirmProposal(proposal)} className="action-btn mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    <Check className="h-3.5 w-3.5" /> Confirm Merge into Civic Issue
                  </button>
                </div>
              ))}
            </div>
          )}
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
