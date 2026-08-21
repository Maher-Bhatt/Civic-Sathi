import { useState } from "react";
import { Crosshair, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { CitySelector, ClientCityMap } from "@/components/city-map-panel";
import { clustersForCity, getCity, nearestCity, nearestWardOrArea, type CityId } from "@/services/cities";
import type { LocationInfo } from "@/services/types";
import { useI18n } from "@/lib/i18n";

type Phase = "idle" | "asking" | "detecting" | "ready" | "error";

export interface LocationPickerValue {
  location: LocationInfo | null;
  marker: { lat: number; lng: number } | null;
  city: CityId;
}

export function LocationPicker({
  location,
  marker,
  city,
  onChange,
}: LocationPickerValue & {
  onChange: (value: {
    location: LocationInfo;
    marker: { lat: number; lng: number };
    city: CityId;
  }) => void;
}) {
    const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>(marker ? "ready" : "idle");
  const [mapMode, setMapMode] = useState(!!marker);

  const commit = (pos: { lat: number; lng: number }, cityId: CityId) => {
    const { ward, area } = nearestWardOrArea(cityId, pos.lat, pos.lng);
    onChange({
      location: {
        lat: pos.lat,
        lng: pos.lng,
        ward,
        area,
      },
      marker: pos,
      city: cityId,
    });
  };

  function detect() {
    setPhase("detecting");
    const fallback = () => {
      const c = getCity(city);
      commit({ lat: c.center[0], lng: c.center[1] }, city);
      setPhase("error");
      setMapMode(true);
    };
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      fallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = nearestCity(pos.coords.latitude, pos.coords.longitude);
        commit({ lat: pos.coords.latitude, lng: pos.coords.longitude }, found.id);
        setPhase("ready");
        setMapMode(true);
      },
      fallback,
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="space-y-4">
      {phase === "idle" && (
        <GlassCard className="space-y-3 p-4 sm:p-5">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            <SectionLabel>{t('ui.why_we_ask_for_location')}</SectionLabel>
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t('ui.your_location_helps_us_underst')}</p>
        </GlassCard>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <GlassButton
          type="button"
          onClick={detect}
          disabled={phase === "detecting"}
          className="w-full sm:w-auto"
        >
          {phase === "detecting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Crosshair className="h-4 w-4" aria-hidden />
          )}
          {t('ui.use_my_current_location')}</GlassButton>
        <GlassButton
          type="button"
          variant="glass"
          className="w-full sm:w-auto"
          onClick={() => {
            setMapMode(true);
            if (!marker) {
              const c = getCity(city);
              commit({ lat: c.center[0], lng: c.center[1] }, city);
              setPhase("ready");
            }
          }}
        >
          <MapPin className="h-4 w-4" aria-hidden />
          {t('ui.choose_on_map')}</GlassButton>
      </div>

      {phase === "detecting" && (
        <p className="text-sm text-muted-foreground" role="status">
          {t('ui.waiting_for_your_device_locati')}</p>
      )}

      {phase === "error" && (
        <p className="text-sm text-muted-foreground" role="status">
          {t('ui.we_couldn_t_read_your_device_l')}</p>
      )}

      {phase === "ready" && location && (
        <GlassCard elevation="raised" className="animate-rise flex items-center gap-3 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary">
            <MapPin className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <SectionLabel>{t('ui.location_detected')}</SectionLabel>
            <p className="mt-0.5 truncate text-sm font-medium">{location.area}</p>
            <p className="text-xs text-subtle tabular-nums">
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          </div>
        </GlassCard>
      )}

      {mapMode && (
        <div className="space-y-3">
          <CitySelector
            cityId={city}
            onChange={(id) => {
              const c = getCity(id);
              commit({ lat: c.center[0], lng: c.center[1] }, id);
              setPhase("ready");
            }}
          />
          <div className="relative">
            <ClientCityMap
              cityId={city}
              clusters={clustersForCity(city)}
              className="h-[300px] sm:h-[380px]"
              marker={marker}
              onMarkerChange={(pos) => commit(pos, city)}
              focus={marker}
              showLegend={false}
              ariaLabel="Map for choosing the location of your report"
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex justify-center sm:justify-start">
              <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 text-xs text-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <span className="font-semibold">Place the report pin</span>
                <span className="ml-1.5 text-muted-foreground">Tap the exact spot or drag the pin.</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-[color-mix(in_oklab,var(--primary)_25%,transparent)] bg-[color-mix(in_oklab,var(--primary)_7%,transparent)] px-3 py-2.5 text-xs leading-relaxed text-muted-foreground" role="status" aria-live="polite">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span>
              {marker && location
                ? <>Selected report point: <strong className="font-mono text-foreground">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</strong> · {location.area}</>
                : t('ui.tap_the_map_or_drag_the_marker')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
