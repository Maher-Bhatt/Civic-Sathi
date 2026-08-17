import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { CITIES, type CityId } from "@/services/cities";
import type { MuniSettings } from "@/services/types";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/settings")({
  head: () => ({ meta: [{ title: "Settings — Municipal Intelligence" }] }),
  component: SettingsPage,
});

function SettingsPage() {
    const { t } = useI18n();
  const { settings, updateSettings, ready } = useMuniAuth();
  const [draft, setDraft] = useState<MuniSettings | null>(null);
  const [saving, setSaving] = useState(false);

  if (!ready) return <LoadingState message="Loading settings..." />;
  const current = draft ?? settings;
  if (!current) return <LoadingState message="Loading settings..." />;

  function patch(p: Partial<MuniSettings>) {
    setDraft((d) => ({ ...current, ...(d ?? {}), ...p } as MuniSettings));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSettings(draft ?? {});
      setDraft(null);
      toast.success("Settings saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="muni-page-enter mx-auto max-w-2xl space-y-6">
      <header>
        <SectionLabel>{t('ui.portal_settings')}</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">{t('ui.preferences')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('ui.settings_are_stored_locally_in')}</p>
      </header>

      <GlassCard elevation="raised" className="space-y-6 p-6">
        <div>
          <label className="label-xs mb-1.5 block">{t('ui.theme')}</label>
          <select
            value={current.theme}
            onChange={(e) => patch({ theme: e.target.value as MuniSettings["theme"] })}
            className="filter-input"
          >
            <option value="system">{t('ui.system')}</option>
            <option value="dark">{t('ui.dark')}</option>
            <option value="light">{t('ui.light')}</option>
          </select>
        </div>

        <div>
          <label className="label-xs mb-1.5 block">{t('ui.default_city')}</label>
          <select
            value={current.defaultCity}
            onChange={(e) => patch({ defaultCity: e.target.value as CityId })}
            className="filter-input"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-xs mb-1.5 block">{t('ui.default_map_mode')}</label>
          <select
            value={current.defaultMapMode}
            onChange={(e) =>
              patch({ defaultMapMode: e.target.value as MuniSettings["defaultMapMode"] })
            }
            className="filter-input"
          >
            <option value="health">{t('ui.area_health')}</option>
            <option value="activity">{t('ui.complaint_activity')}</option>
            <option value="hotspots">{t('ui.hotspots')}</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={current.compactMode}
            onChange={(e) => patch({ compactMode: e.target.checked })}
            className="rounded border-[var(--glass-border)]"
          />
          {t('ui.compact_mode')}</label>
      </GlassCard>

      <GlassCard elevation="raised" className="space-y-4 p-6">
        <SectionLabel>{t('ui.notifications')}</SectionLabel>
        {(
          [
            ["critical", "Critical alerts"],
            ["assignments", "Assignment updates"],
            ["riskChanges", "Risk score changes"],
            ["dailyDigest", "Daily digest email"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between text-sm">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={current.notifications[key]}
              onChange={(e) =>
                patch({
                  notifications: { ...current.notifications, [key]: e.target.checked },
                })
              }
              className="rounded border-[var(--glass-border)]"
            />
          </label>
        ))}
      </GlassCard>

      <GlassButton onClick={() => void handleSave()} disabled={saving || !draft}>
        {saving ? "Saving..." : "Save changes"}
      </GlassButton>
    </div>
  );
}
