import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { getTender, listBids, awardBid } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/tenders/$id")({ 
  head: ({ params }: any) => ({ meta: [{ title: `${params.id} — Tender Details` }] }), 
  component: TenderDetailPage 
});

function TenderDetailPage() {
  const { id } = Route.useParams() as any;
  const queryClient = useQueryClient();

  const { data: tender, isLoading: loadingTender, error: tenderError } = useQuery({
    queryKey: ["tender", id],
    queryFn: () => getTender(id),
  });

  const { data: bids = [], isLoading: loadingBids } = useQuery({
    queryKey: ["tender-bids", id],
    queryFn: () => listBids(id),
    enabled: !!tender,
  });

  const awardMutation = useMutation({
    mutationFn: (bidId: string) => awardBid(id, bidId),
    onSuccess: () => {
      toast.success("Tender awarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["tender", id] });
      queryClient.invalidateQueries({ queryKey: ["tender-bids", id] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to award tender"),
  });

  if (loadingTender) return <LoadingState message="Loading tender details..." />;
  if (tenderError || !tender) return <ErrorState description="Tender not found." onRetry={() => window.location.reload()} />;

  const isAwarded = tender.status === "AWARDED" || tender.status === "CLOSED";

  return (
    <div className="muni-page-enter space-y-6">
      <Link to={"/tenders" as any} className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
        <ArrowLeft className="h-4 w-4" /> All tenders
      </Link>

      <header className="flex flex-wrap items-center gap-3">
        <SectionLabel className="tabular-nums">{tender.id}</SectionLabel>
        <span className="rounded-full bg-[var(--surface-elevated)] text-[var(--primary)] px-3 py-1 text-xs font-medium">{tender.status}</span>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Tender Details */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>Tender Details</SectionLabel>
            <h1 className="mt-3 text-xl font-semibold">{tender.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{tender.description}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><dt className="label-xs">Department</dt><dd className="mt-1 text-sm font-medium">{tender.department_id || "N/A"}</dd></div>
              <div><dt className="label-xs">Estimated Cost</dt><dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">₹{tender.estimated_budget?.toLocaleString("en-IN")}</dd></div>
              <div><dt className="label-xs">Civic Issue ID</dt><dd className="mt-1 text-sm">{tender.civic_issue_id || "N/A"}</dd></div>
            </dl>
            {tender.scope_of_work && (
              <>
                <dt className="label-xs mt-5">Scope of Work</dt>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]">{tender.scope_of_work}</pre>
              </>
            )}
          </GlassCard>

          {/* Sealed Bids */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>Submitted Bids ({bids.length})</SectionLabel>
            {loadingBids ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading bids...</p>
            ) : bids.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">No bids submitted yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {bids.map((bid: any) => (
                  <div key={bid.id} className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">Contractor ID: {bid.contractor_id}</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">Bid ID: {bid.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold tabular-nums text-[var(--primary)]">
                          ₹{bid.quoted_amount.toLocaleString("en-IN")}
                        </p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded border border-[var(--glass-border)]">{bid.status}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--glass-border)] text-sm">
                      <p className="text-[var(--muted-foreground)] whitespace-pre-wrap">{bid.technical_proposal}</p>
                    </div>
                    
                    {!isAwarded && bid.status === "SUBMITTED" && (
                      <button
                        onClick={() => awardMutation.mutate(bid.id)}
                        disabled={awardMutation.isPending}
                        className="mt-4 action-btn primary w-full flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {awardMutation.isPending ? "Awarding..." : "Award Tender to this Bid"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <GlassCard elevation="raised" className="p-5">
            <SectionLabel>Tender Info</SectionLabel>
            <dl className="mt-4 space-y-3">
              <div><dt className="label-xs">City</dt><dd className="mt-1 text-sm capitalize">{tender.city_id}</dd></div>
              <div><dt className="label-xs">Status</dt><dd className="mt-1 text-sm font-semibold">{tender.status}</dd></div>
            </dl>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
