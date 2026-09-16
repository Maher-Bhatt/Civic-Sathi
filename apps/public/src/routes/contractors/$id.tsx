import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { getPublicContractor, submitPublicRating } from "@/services/api";
import { Star, Building2, MapPin, ChevronLeft, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/states";

export const Route = createFileRoute("/contractors/$id")({
  component: ContractorProfileRoute,
});

function ContractorProfileRoute() {
  const { id } = Route.useParams();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [ratingVal, setRatingVal] = useState<number | null>(null);
  const [commentVal, setCommentVal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPublicContractor(id)
      .then(setContractor)
      .catch((err) => toast.error("Failed to load contractor details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageShell className="max-w-5xl">
        <LoadingState />
      </PageShell>
    );
  }
  if (!contractor) {
    return (
      <PageShell className="max-w-5xl">
        <div className="p-8 text-center text-red-500">Contractor not found.</div>
      </PageShell>
    );
  }

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingVal === null) {
      toast.error("Please select a rating from 1 to 5 stars.");
      return;
    }
    setSubmitting(true);
    try {
      await submitPublicRating(contractor.id, "generic", ratingVal, commentVal, "Citizen Feedback");
      toast.success("Thank you for your verified rating!");
      setRatingVal(null);
      setCommentVal("");
    } catch (err) {
      toast.error("Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell className="max-w-5xl">
      <div className="space-y-6">
        <Link
          to="/contractors"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft size={16} /> Back to Contractors
        </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 glass-strong">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <Building2 size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)]">{contractor.company_name}</h1>
                <p className="text-[var(--muted-foreground)] flex items-center gap-2 mt-2">
                  <MapPin size={16} /> {contractor.contact_person}
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center gap-1 border border-emerald-500/20">
                    <CheckCircle2 size={14} /> Registered Government Contractor
                  </span>
                  <span className="text-[var(--muted-foreground)]">{contractor.total_reviews_count || 0} Verified Reviews</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--glass-border)] pt-8">
               <div className="text-center">
                  <span className="block text-3xl font-bold text-orange-500">{contractor.public_rating || 'N/A'}</span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Citizen Votes</span>
               </div>
               <div className="text-center border-l border-r border-[var(--glass-border)]">
                  <span className="block text-3xl font-bold text-red-500">{contractor.ai_rating || 'N/A'}</span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">AI Quality Audit</span>
               </div>
               <div className="text-center">
                  <span className="block text-3xl font-bold text-emerald-500">{contractor.officer_rating || 'N/A'}</span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Govt Inspection</span>
               </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
             <SectionLabel>Public Track Record</SectionLabel>
             <h3 className="text-lg font-bold mb-4">Recent Projects & Work Orders</h3>
             <div className="space-y-4">
               {/* Mock Work Orders for Demo since endpoint might not return them directly */}
               {[1, 2].map((i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">Road Resurfacing - Ward 14</h4>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">Completed ahead of schedule. Inspected by AI surface analysis.</p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-medium text-[var(--muted-foreground)]">
                         <span className="flex items-center gap-1"><Calendar size={14}/> Aug 2026</span>
                         <span className="px-2 py-0.5 rounded text-emerald-600 bg-emerald-500/10">SLA Met</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
             <SectionLabel>Have your say</SectionLabel>
             <h3 className="text-lg font-bold mb-4">Rate This Contractor</h3>
             
             <form onSubmit={handleRateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingVal(num)}
                        className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition"
                      >
                        <Star
                          className={`h-8 w-8 ${ratingVal && ratingVal >= num ? "fill-orange-400 text-orange-400" : "text-[var(--muted-foreground)]"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Additional Comments</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your experience with this contractor's work..."
                    value={commentVal}
                    onChange={(e) => setCommentVal(e.target.value)}
                    className="w-full rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  ></textarea>
                </div>
  
                <button
                  type="submit"
                  disabled={submitting || ratingVal === null}
                  className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Verified Rating"}
                </button>
             </form>
          </GlassCard>

          {contractor.ai_insights && contractor.ai_insights.length > 0 && (
             <GlassCard className="p-6 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                  <Sparkles size={18} />
                  <h3 className="font-bold">AI Quality Findings</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  {contractor.ai_insights.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                       <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                       <span className="text-[var(--foreground)]">{insight}</span>
                    </li>
                  ))}
                </ul>
             </GlassCard>
          )}
        </div>
      </div>
      </div>
    </PageShell>
  );
}
