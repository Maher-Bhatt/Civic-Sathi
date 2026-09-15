import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { listPublicContractors, submitPublicRating } from "@/services/api";
import {
  Star,
  Bot,
  Building2,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  MessageSquarePlus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contractors/")({
  head: () => ({ meta: [{ title: "Contractor Transparency & Tri-Party Ratings â€” Civic Sathi" }] }),
  component: ContractorsPublicPage,
});

function ContractorsPublicPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);
  const [ratingVal, setRatingVal] = useState<number | null>(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState("");
  const [categoryVal, setCategoryVal] = useState("Road Quality & Smoothness");
  const [commentVal, setCommentVal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listPublicContractors()
      .then((data) => {
        setContractors(Array.isArray(data) ? data : []);
      })
      .catch((error: any) => {
        setLoadError(error instanceof Error ? error : new Error("Contractor data could not be loaded."));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleRateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContractor) return;
    if (ratingVal === null || !selectedWorkOrderId || !commentVal.trim()) {
      toast.error("Choose a star rating, an inspected work order, and add a comment before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await submitPublicRating(selectedContractor.id, selectedWorkOrderId, ratingVal, commentVal.trim(), categoryVal);
      toast.success(`Thank you! Your verified rating for ${selectedContractor.company_name} has been recorded.`);
      setSelectedContractor(null);
      setRatingVal(null);
      setSelectedWorkOrderId("");
      setCommentVal("");
      // Refresh
      const updated = await listPublicContractors();
      setContractors(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message="Loading verified civic contractors..." />;
  if (loadError) return <ErrorState description={loadError.message} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-fade">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" />
          100% Public Accountability & Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          Civic Contractor Ratings & Trust Index
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Every contractor executing public infrastructure is rated independently by{" "}
          <strong className="text-[var(--foreground)]">Citizens (Public)</strong>,{" "}
          <strong className="text-[var(--foreground)]">Antigravity AI (SLA & Quality Audit)</strong>, and{" "}
          <strong className="text-[var(--foreground)]">Municipal Engineers (Physical Sign-off)</strong>.
        </p>
      </div>

      {/* Contractor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map((c) => {
          const toRating = (value: unknown) => {
            if (value === null || value === undefined || value === "") return null;
            const parsed = Number(value);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
          };
          const pub = toRating(c.public_rating);
          const ai = toRating(c.ai_rating);
          const off = toRating(c.officer_rating);
          const overall = toRating(c.overall_rating)
            ?? (pub !== null && ai !== null && off !== null
              ? Number((pub * 0.35 + ai * 0.35 + off * 0.30).toFixed(1))
              : null);

          return (
            <GlassCard key={c.id} className="p-6 glass-strong lift flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{c.company_name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Contact: {c.contact_person} â€¢ {c.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{overall === null ? "Not yet rated" : overall.toFixed(1)}</span>
                    <span className="text-xs text-[var(--muted-foreground)] block">Composite Index</span>
                  </div>
                </div>

                {/* 3 Distinct Rating Chips */}
                <div className="grid grid-cols-3 gap-2.5 mt-5">
                  {/* Public */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">Public</span>
                    </div>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {pub === null ? "â€”" : pub.toFixed(1)} {pub !== null && <span className="text-[10px] font-normal">/ 5</span>}
                    </span>
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-0.5">Citizen Votes</span>
                  </div>

                  {/* AI */}
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-700 dark:text-orange-300 mb-1">
                      <Bot className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">AI Quality</span>
                    </div>
                    <span className="text-lg font-black text-orange-700 dark:text-orange-300">
                      {ai === null ? "â€”" : ai.toFixed(1)} {ai !== null && <span className="text-[10px] font-normal">/ 5</span>}
                    </span>
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-0.5">SLA & Evidence</span>
                  </div>

                  {/* Officer */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">Officer</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {off === null ? "â€”" : off.toFixed(1)} {off !== null && <span className="text-[10px] font-normal">/ 5</span>}
                    </span>
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-0.5">Govt Inspection</span>
                  </div>
                </div>

                {/* AI Insights bullets */}
                <div className="mt-4 space-y-1.5 text-xs text-[var(--muted-foreground)]">
                  {Array.isArray(c.ai_insights) && c.ai_insights.length > 0 ? (
                    c.ai_insights.slice(0, 2).map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[var(--muted-foreground)]">No AI quality findings published yet.</div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {Number(c.total_reviews_count ?? 0)} verified reviews
                </span>
                <Link
                  to="/contractors/$id"
                  params={{ id: c.id }}
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition"
                >
                  View & Rate Contractor
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>

      </div>
  );
}
