import { useRef, useState } from "react";
import { Camera, ImageIcon, RefreshCw, Sparkles, Trash2, Upload } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { analyzeComplaintPhoto, uploadComplaintPhoto } from "@/services/api";
import type { ImageAnalysis, IssueCategory } from "@/services/types";
import { ISSUE_TYPES } from "@/services/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function PhotoUploader({
  photo,
  onPhoto,
  onCategorySuggestion,
}: {
  photo: string | null;
  onPhoto: (dataUrl: string | null) => void;
  onCategorySuggestion: (category: IssueCategory) => void;
}) {
    const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setAnalysis(null);
    setUploading(true);
    setProgress(8);
    const tick = setInterval(() => setProgress((p) => Math.min(92, p + 11)), 90);
    try {
      const dataUrl = await uploadComplaintPhoto(file);
      onPhoto(dataUrl);
      setProgress(100);
      setAnalyzing(true);
      const result = await analyzeComplaintPhoto(file.name);
      setAnalysis(result);
    } catch {
      setError("We couldn't process that image. Try another photo.");
    } finally {
      clearInterval(tick);
      setUploading(false);
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!photo ? (
        <GlassCard
          interactive
          className="flex flex-col items-center gap-4 px-6 py-12 text-center"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[var(--glass-strong)] text-muted-foreground">
            <Upload className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium">{t('ui.add_a_photo_of_the_problem')}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('ui.optional_a_photo_helps_the_dep')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <GlassButton
              size="sm"
              variant="glass"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraRef.current?.click();
              }}
            >
              <Camera className="h-3.5 w-3.5" aria-hidden />
              {t('ui.camera')}</GlassButton>
            <GlassButton
              size="sm"
              variant="glass"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <ImageIcon className="h-3.5 w-3.5" aria-hidden />
              {t('ui.gallery')}</GlassButton>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden p-2.5">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={photo}
              alt="Photo attached to your civic report"
              loading="lazy"
              className="h-56 w-full object-cover sm:h-72"
            />
            {(uploading || analyzing) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color-mix(in_oklab,var(--background)_72%,transparent)] backdrop-blur-sm">
                <Sparkles className="h-5 w-5 animate-pulse text-primary" aria-hidden />
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  {uploading ? "Uploading image" : "Analyzing image"}
                </p>
              </div>
            )}
          </div>
          {uploading && (
            <div
              className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--glass-strong)]"
              role="progressbar"
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 px-1 pt-3 pb-1">
            <GlassButton
              size="sm"
              variant="glass"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              {t('ui.replace')}</GlassButton>
            <GlassButton
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                onPhoto(null);
                setAnalysis(null);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              {t('ui.remove')}</GlassButton>
          </div>
        </GlassCard>
      )}

      {error && (
        <p className="text-sm text-critical" role="alert">
          {error}
        </p>
      )}

      {analysis && !analyzing && (
        <GlassCard elevation="raised" className="animate-rise space-y-4 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <SectionLabel>{t('ui.ai_assisted_image_reading')}</SectionLabel>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="label-xs">{t('ui.detected')}</dt>
              <dd className="mt-1 text-sm font-medium">{analysis.detected}</dd>
            </div>
            <div>
              <dt className="label-xs">{t('ui.suggested_category')}</dt>
              <dd className="mt-1 text-sm font-medium">{analysis.category}</dd>
            </div>
            <div>
              <dt className="label-xs">{t('ui.confidence')}</dt>
              <dd className="mt-1 text-sm font-medium">{analysis.confidence}</dd>
            </div>
          </dl>
          <p className="text-xs text-subtle">
            {t('ui.this_is_an_ai_assisted_suggest')}</p>
          <div className="flex flex-wrap gap-2">
            <GlassButton
              size="sm"
              type="button"
              onClick={() => {
                onCategorySuggestion(analysis.category);
                setChanging(false);
              }}
            >
              {t('ui.confirm')}</GlassButton>
            <GlassButton
              size="sm"
              variant="glass"
              type="button"
              onClick={() => setChanging((v) => !v)}
            >
              {t('ui.change_category')}</GlassButton>
          </div>
          {changing && (
            <div className="flex flex-wrap gap-2 pt-1">
              {ISSUE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onCategorySuggestion(t);
                    setChanging(false);
                  }}
                  className={cn(
                    "press rounded-full border border-border bg-[var(--glass)] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
