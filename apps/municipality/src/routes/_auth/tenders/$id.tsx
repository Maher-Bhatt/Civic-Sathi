import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { getTender, listBids, awardBid } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/tenders/$id")({ 
  head: ({ params }: any) => ({ meta: [{ title: `${params.id} — Tender Details` }] }), 
  component: TenderDetailPage 
});

function TenderDetailPage() {
    const { t } = useI18n();
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
        <ArrowLeft className="h-4 w-4" /> {t('ui.all_tenders')}</Link>

      <header className="flex flex-wrap items-center gap-3">
        <SectionLabel className="tabular-nums">{tender.id}</SectionLabel>
        <span className="rounded-full bg-[var(--surface-elevated)] text-[var(--primary)] px-3 py-1 text-xs font-medium">{tender.status}</span>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Tender Details */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.tender_details')}</SectionLabel>
            <h1 className="mt-3 text-xl font-semibold">{tender.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{tender.description}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><dt className="label-xs">{t('ui.department')}</dt><dd className="mt-1 text-sm font-medium">{tender.department_id || "N/A"}</dd></div>
              <div><dt className="label-xs">{t('ui.estimated_cost')}</dt><dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">₹{(tender.estimated_budget ?? 0).toLocaleString("en-IN")}</dd></div>
              <div><dt className="label-xs">{t('ui.civic_issue_id')}</dt><dd className="mt-1 text-sm">{tender.civic_issue_id || "N/A"}</dd></div>
            </dl>
            {tender.scope_of_work && (
              <>
                <dt className="label-xs mt-5">{t('ui.scope_of_work')}</dt>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]">{tender.scope_of_work}</pre>
              </>
            )}
          </GlassCard>

          {/* Sealed Bids */}
          <GlassCard elevation="raised" className="p-6">
            <SectionLabel>{t('ui.submitted_bids')} ({bids.length})</SectionLabel>
            {loadingBids ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">{t('ui.loading_bids')}</p>
            ) : bids.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">{t('ui.no_bids_submitted_yet')}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {bids.map((bid: any) => (
                  <div key={bid.id} className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 transition-all duration-200">
                      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg text-[var(--foreground)]">{bid.contractor?.company_name || 'Unknown Contractor'}</p>
                            {bid.contractor?.composite_score >= 4.0 && <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-emerald-500/20">Highly Rated</span>}
                          </div>
                          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">ID: {bid.contractor_id}</p>
                          
                          {/* Tri-Party Ratings */}
                          {bid.contractor && (
                             <div className="flex gap-3 mt-3">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Public</span>
                                  <span className="text-sm font-bold text-orange-500">{bid.contractor.public_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">AI Audit</span>
                                  <span className="text-sm font-bold text-blue-500">{bid.contractor.ai_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Officer</span>
                                  <span className="text-sm font-bold text-emerald-500">{bid.contractor.officer_rating || 'N/A'}</span>
                               </div>
                               <div className="flex flex-col pl-3 border-l border-[var(--glass-border)]">
                                  <span className="text-[10px] font-bold uppercase text-[var(--primary)]">Composite</span>
                                  <span className="text-sm font-extrabold text-[var(--primary)]">{bid.contractor.composite_score ? bid.contractor.composite_score.toFixed(1) : 'N/A'} / 5</span>
                               </div>
                             </div>
                          )}
                        </div>
                        <div className="text-right bg-[var(--surface-elevated)] p-3 rounded-xl border border-[var(--glass-border)]">
                          <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase">Quoted Bid</p>
                          <p className="text-xl font-extrabold tabular-nums text-[var(--foreground)] mt-1">
                            ₹{(bid.quoted_amount ?? 0).toLocaleString("en-IN")}
                          </p>
                          <div className="mt-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--glass-border)] bg-[var(--background)] text-[var(--foreground)]">{bid.status}</span>
                          </div>
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
            <SectionLabel>{t('ui.tender_info')}</SectionLabel>
            <dl className="mt-4 space-y-3">
              <div><dt className="label-xs">{t('ui.city')}</dt><dd className="mt-1 text-sm capitalize">{tender.city_id}</dd></div>
              <div><dt className="label-xs">{t('ui.status')}</dt><dd className="mt-1 text-sm font-semibold">{tender.status}</dd></div>
            </dl>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
