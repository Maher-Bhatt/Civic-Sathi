import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getTenderDetails, submitBid } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contractor/tenders/$id")({
  component: TenderDetail,
});

function TenderDetail() {
    const { t } = useI18n();
  const { id } = Route.useParams() as any;
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");

  const { data: tender, isLoading: loading } = useQuery({
    queryKey: ["tender", id],
    queryFn: () => getTenderDetails(id),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitBid(id, Number(bidAmount), proposal),
    onSuccess: () => {
      toast.success("Sealed bid submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["contractor-tenders"] });
      router.navigate({ to: "/contractor/tenders" as any });
    },
    onError: (err: any) => toast.error(err.message || "Failed to submit bid"),
  });

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    if (!bidAmount || !proposal) {
      toast.error("Please fill all fields.");
      return;
    }
    submitMutation.mutate();
  }

  if (loading) return <div className="p-8 text-center text-[var(--muted-foreground)]">{t('ui.loading_tender')}</div>;
  if (!tender) return <div className="p-8 text-center text-[var(--critical)]">{t('ui.tender_not_found')}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        to="/contractor/tenders"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('ui.back_to_tenders')}</Link>

      <header className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          <div>
            <h1 className="text-2xl font-bold">{tender.title}</h1>
            <div className="mt-2 text-sm text-[var(--muted-foreground)]">{t('ui.id')}{tender.id}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-[var(--primary)]">{t('ui.est_budget')}</div>
            <div className="text-2xl font-medium tabular-nums">₹{tender.estimated_budget?.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">{t('ui.description')}</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{tender.description}</p>
          </div>
          {tender.scope_of_work && (
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('ui.scope_of_work')}</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed whitespace-pre-wrap">{tender.scope_of_work}</p>
            </div>
          )}
        </div>
      </header>

      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">{t('ui.submit_sealed_bid')}</h2>
        <form onSubmit={handleBid} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">{t('ui.quoted_amount')}</label>
            <input
              type="number"
              required
              min="0"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder={t('ui.e_g_500000')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('ui.technical_proposal_notes')}</label>
            <textarea
              required
              rows={5}
              value={proposal}
              onChange={e => setProposal(e.target.value)}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder={t('ui.detail_your_approach_timeline_')}
            />
          </div>
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-[var(--primary)] text-white font-medium py-3 rounded-md hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
          >
            {submitMutation.isPending ? "Submitting securely..." : "Submit Sealed Bid"}
          </button>
        </form>
      </div>
    </div>
  );
}

