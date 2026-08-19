import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassTextarea } from "@/components/ui/glass-input";
import { LocationPicker } from "@/components/location-picker";
import { PhotoUploader } from "@/components/photo-uploader";
import { VoiceInput } from "@/components/voice-input";
import { emptyDraft, loadDraft, saveDraft, type ReportDraft } from "@/lib/report-draft";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a civic problem — Civic Sathi" },
      {
        name: "description",
        content:
          "Describe the problem in your own words, add your location and a photo. Civic Sathi suggests the category and severity.",
      },
      { property: "og:title", content: "Report a civic problem — Civic Sathi" },
      {
        property: "og:description",
        content: "Describe a civic issue, pin the location, add evidence and track the response.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/report">
      <ReportPage />
    </AuthGate>
  ),
});

const steps = [
  { n: "01", tKey: "report.step.problem", label: "Problem" },
  { n: "02", tKey: "report.step.location", label: "Location" },
  { n: "03", tKey: "report.step.evidence", label: "Evidence" },
  { n: "04", tKey: "report.step.review", label: "Review" },
];

function ReportPage() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    setDraft((current) => {
      if (current.language === language) return current;
      const next = { ...current, language };
      saveDraft(next);
      return next;
    });
  }, [language]);

  const update = (patch: Partial<ReportDraft>) =>
    setDraft((d) => {
      const next = { ...d, ...patch };
      saveDraft(next);
      return next;
    });

  const canContinue =
    step === 0 ? draft.description.trim().length > 12 : step === 1 ? !!draft.marker : true;

  function submit() {
    saveDraft(draft);
    navigate({ to: "/analyzing" });
  }

  return (
    <PageShell className="max-w-3xl">
      <div className="animate-rise space-y-2">
        <SectionLabel>{t('ui.new_report')}</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('ui.tell_civicsathi_what_happened')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('ui.you_don_t_need_to_pick_a_categ')}</p>
      </div>

      <ol className="mt-7 flex items-center gap-2" aria-label={t('ui.report_progress')}>
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-medium tabular-nums transition-colors duration-300",
                i < step
                  ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary"
                  : i === step
                    ? "border-primary bg-[var(--glass-strong)] text-foreground"
                    : "border-border text-subtle",
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : s.n}
            </span>
            <span
              className={cn(
                "hidden text-xs tracking-[0.1em] uppercase sm:inline",
                i === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t(s.tKey, s.label)}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden />}
          </li>
        ))}
      </ol>

      <GlassCard elevation="raised" className="animate-rise mt-6 p-5 sm:p-7">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t('ui.describe_the_problem')}</h2>
            <GlassTextarea
              rows={7}
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={t('ui.describe_the_problem_in_your_o')}
              hint="Example: There has been no water supply in our area for three days."
              aria-label={t('ui.describe_the_problem')}
            />
            <div className="flex items-center gap-3 pt-2">
              <VoiceInput
                lang={({ en: "en-IN", hi: "hi-IN", gu: "gu-IN", kn: "kn-IN" } as const)[language]}
                onResult={(text) => {
                  const newDesc = draft.description ? `${draft.description} ${text}` : text;
                  update({ description: newDesc });
                }}
              />
              {hydrated && !draft.description && (
                <GlassButton
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    update({
                      description: "There has been no water supply in our area for three days.",
                    })
                  }
                >
                  {t('ui.use_the_example')}</GlassButton>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">{t('ui.where_is_the_problem')}</h2>
            <LocationPicker
              location={draft.location}
              marker={draft.marker}
              city={draft.city}
              onChange={({ location, marker, city }) => update({ location, marker, city })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">{t('ui.add_photo_or_evidence')}</h2>
            <PhotoUploader
              photo={draft.photo}
              onPhoto={(photo) => update({ photo })}
              onCategorySuggestion={(category) => update({ category })}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">{t('ui.your_report')}</h2>
            <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
              <ReviewRow label={t('ui.description')} onEdit={() => setStep(0)}>
                {draft.description || "Not provided"}
              </ReviewRow>
              <ReviewRow label={t('ui.suggested_category')} onEdit={() => setStep(2)}>
                {draft.category ?? t('ui.civicsathi_will_suggest_category', 'Civic Sathi will suggest a category during analysis.')}
              </ReviewRow>
              <ReviewRow label={t('ui.location')} onEdit={() => setStep(1)}>
                {draft.location
                  ? `${draft.location.area} (${draft.location.lat.toFixed(4)}, ${draft.location.lng.toFixed(4)})`
                  : "Not selected"}
              </ReviewRow>
              <ReviewRow label={t('ui.photo')} onEdit={() => setStep(2)}>
                {draft.photo ? (
                  <img
                    src={draft.photo}
                    alt="Photo attached to your report"
                    className="h-20 w-28 rounded-lg border border-border object-cover"
                  />
                ) : (
                  "No photo attached"
                )}
              </ReviewRow>
            </dl>
            <p className="text-xs leading-relaxed text-subtle">
              {t('ui.civicsathi_will_analyse_your_desc')}</p>
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <GlassButton
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {step === 3 ? t("report.btn.back", "Go back") : t("report.btn.back", "Back")}
          </GlassButton>
          {step < steps.length - 1 ? (
            <GlassButton
              type="button"
              className="w-full sm:w-auto"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
            >
              {t("report.btn.continue", "Continue")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </GlassButton>
          ) : (
            <GlassButton type="button" className="w-full sm:w-auto" onClick={submit}>
              {t("report.btn.submit", "Submit report")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </GlassButton>
          )}
        </div>
      </GlassCard>
    </PageShell>
  );
}

function ReviewRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
    const { t } = useI18n();
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 bg-[var(--glass)] px-4 py-3.5">
      <div className="min-w-0">
        <dt className="label-xs">{label}</dt>
        <dd className="mt-1 text-sm break-words text-foreground">{children}</dd>
      </div>
      <GlassButton type="button" size="sm" variant="ghost" onClick={onEdit}>
        {t('ui.edit')}</GlassButton>
    </div>
  );
}
