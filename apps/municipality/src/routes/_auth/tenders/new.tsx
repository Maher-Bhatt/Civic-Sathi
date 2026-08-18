import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { useMuniAuth } from "@/lib/muni-auth";
import { createTender } from "@/services/api";
import { DEPARTMENTS, ISSUE_TYPES } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/tenders/new")({ 
  head: () => ({ meta: [{ title: "Publish Tender — Civic Sathi" }] }), 
  component: NewTenderPage 
});

function NewTenderPage() {
    const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { officer } = useMuniAuth();
  const [form, setForm] = useState({
    title: "", description: "", category: "Road Damage", department: "Public Works",
    ward: "", area: "", estimatedCost: "", scope: "", civicIssueIds: "", priority: "Moderate"
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!officer?.city) throw new Error("Officer city is missing");
      const ids = form.civicIssueIds.split(",").map(s => s.trim()).filter(Boolean);
      return createTender({
        title: form.title,
        description: form.description,
        city_id: officer.city,
        department_id: form.department,
        civic_issue_id: ids.length > 0 ? ids[0] : null,
        scope_of_work: form.scope,
        estimated_budget: Number(form.estimatedCost) || 0,
      });
    },
    onSuccess: (tender) => {
      toast.success(`Tender published successfully!`);
      queryClient.invalidateQueries({ queryKey: ["muni-tenders"] });
      void navigate({ to: "/tenders/$id" as any, params: { id: tender.id } as any });
    },
    onError: () => toast.error("Failed to publish tender"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitMutation.mutate();
  }

  return (
    <div className="muni-page-enter mx-auto max-w-2xl space-y-6">
      <header>
        <SectionLabel>{t('ui.publish_tender')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{t('ui.define_public_procurement_requ')}</h1>
      </header>
      <GlassCard elevation="raised" className="p-6">
        <form onSubmit={e => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="label-xs" htmlFor="wp-title">{t('ui.title')}</label>
            <input id="wp-title" value={form.title} onChange={set("title")} required className="filter-input" placeholder={t('ui.road_repair_ward_14_sarvodaya_')} />
          </div>
          <div className="space-y-1.5">
            <label className="label-xs" htmlFor="wp-desc">{t('ui.description')}</label>
            <textarea id="wp-desc" value={form.description} onChange={set("description")} rows={3} className="filter-input" placeholder={t('ui.describe_the_civic_issue_and_w')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-cat">{t('ui.category')}</label>
              <select id="wp-cat" value={form.category} onChange={set("category")} className="filter-input">
                {ISSUE_TYPES.map(issueType => <option key={issueType}>{issueType}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-dept">{t('ui.department')}</label>
              <select id="wp-dept" value={form.department} onChange={set("department")} className="filter-input">
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-ward">{t('ui.ward')}</label>
              <input id="wp-ward" value={form.ward} onChange={set("ward")} className="filter-input" placeholder={t('ui.ward_14')} />
            </div>
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-area">{t('ui.area')}</label>
              <input id="wp-area" value={form.area} onChange={set("area")} className="filter-input" placeholder={t('ui.sarvodaya_nagar')} />
            </div>
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-cost">{t('ui.estimated_cost')}</label>
              <input id="wp-cost" type="number" value={form.estimatedCost} onChange={set("estimatedCost")} className="filter-input" placeholder="850000" />
            </div>
            <div className="space-y-1.5">
              <label className="label-xs" htmlFor="wp-priority">{t('ui.priority')}</label>
              <select id="wp-priority" value={form.priority} onChange={set("priority")} className="filter-input">
                {["Low", "Moderate", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="label-xs" htmlFor="wp-scope">{t('ui.scope_of_work')}</label>
            <textarea id="wp-scope" value={form.scope} onChange={set("scope")} rows={5} className="filter-input" placeholder={t('ui.1_pothole_patching_10_2_road_m')} />
          </div>
          <div className="space-y-1.5">
            <label className="label-xs" htmlFor="wp-civic-issues">{t('ui.civic_issue_ids_comma_separate')}</label>
            <input id="wp-civic-issues" value={form.civicIssueIds} onChange={set("civicIssueIds")} className="filter-input" placeholder={t('ui.ci_171850389_ci_2819030')} />
          </div>
          <button type="submit" disabled={submitMutation.isPending} className="action-btn primary w-full">
            {submitMutation.isPending ? "Publishing..." : "Publish Tender"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
