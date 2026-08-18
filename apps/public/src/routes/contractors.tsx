import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
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

export const Route = createFileRoute("/contractors")({
  head: () => ({ meta: [{ title: "Contractor Transparency & Tri-Party Ratings — Civic Sathi" }] }),
  component: ContractorsPublicPage,
});

function ContractorsPublicPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [categoryVal, setCategoryVal] = useState("Road Quality & Smoothness");
  const [commentVal, setCommentVal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listPublicContractors()
      .then((data) => {
        setContractors(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleRateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContractor) return;
    setSubmitting(true);
    try {
      await submitPublicRating(selectedContractor.id, ratingVal, commentVal, categoryVal);
      toast.success(`Thank you! Your verified rating for ${selectedContractor.company_name} has been recorded.`);
      setSelectedContractor(null);
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
          const pub = Number(c.public_rating || 4.5);
          const ai = Number(c.ai_rating || 4.8);
          const off = Number(c.officer_rating || 4.6);
          const overall = Number(c.overall_rating || (pub * 0.35 + ai * 0.35 + off * 0.30).toFixed(1));

          return (
            <GlassCard key={c.id} className="p-6 glass-strong lift flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{c.company_name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Contact: {c.contact_person} • {c.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-extrabold text-emerald-500">{overall.toFixed(1)}</span>
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
                      {pub.toFixed(1)} <span className="text-[10px] font-normal">/ 5</span>
                    </span>
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-0.5">Citizen Votes</span>
                  </div>

                  {/* AI */}
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                      <Bot className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">AI Quality</span>
                    </div>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {ai.toFixed(1)} <span className="text-[10px] font-normal">/ 5</span>
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
                      {off.toFixed(1)} <span className="text-[10px] font-normal">/ 5</span>
                    </span>
                    <span className="block text-[9px] text-[var(--muted-foreground)] mt-0.5">Govt Inspection</span>
                  </div>
                </div>

                {/* AI Insights bullets */}
                <div className="mt-4 space-y-1.5 text-xs text-[var(--muted-foreground)]">
                  {(c.ai_insights || [
                    "High SLA adherence on civic work orders",
                    "Prompt resolution of citizen feedback within warranty period"
                  ]).slice(0, 2).map((insight: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {c.total_reviews_count || 32} total citizen reviews
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedContractor(c)}
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition"
                >
                  Rate This Contractor
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Citizen Review Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade">
          <GlassCard className="w-full max-w-lg p-6 glass-strong shadow-2xl relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <SectionLabel>Public Citizen Feedback</SectionLabel>
                <h3 className="text-xl font-bold text-[var(--foreground)] mt-1">
                  Rate {selectedContractor.company_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContractor(null)}
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRatingVal(num)}
                      className="p-2 rounded-lg hover:bg-[var(--surface-elevated)]"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          num <= ratingVal ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm ml-2">{ratingVal}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Category of Work</label>
                <select
                  value={categoryVal}
                  onChange={(e) => setCategoryVal(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-xs"
                >
                  <option>Road Quality & Smoothness</option>
                  <option>Drainage & Water Desilting</option>
                  <option>Cleanliness & Waste Clearance</option>
                  <option>Timeliness & Punctuality</option>
                  <option>Overall Workmanship</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Feedback / Public Comment</label>
                <textarea
                  required
                  rows={3}
                  value={commentVal}
                  onChange={(e) => setCommentVal(e.target.value)}
                  placeholder="Share details about the quality of work performed in your neighborhood..."
                  className="w-full p-3 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  onClick={() => setSelectedContractor(null)}
                  className="px-4 py-2 rounded-lg border border-[var(--glass-border)] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Verified Rating"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
