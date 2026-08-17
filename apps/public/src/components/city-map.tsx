import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Layers, MapPin, Minus, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import {
  ATTRIBUTION,
  SEVERITY_HEX,
  TILES,
  getCity,
  type CityId,
  type MapCluster,
} from "@/services/cities";
import { useI18n } from "@/lib/i18n";

export interface CityMapProps {
  cityId: CityId;
  clusters?: MapCluster[] | undefined;
  /** Citizen-adjustable report marker. */
  marker?: { lat: number; lng: number } | null | undefined;
  onMarkerChange?: ((pos: { lat: number; lng: number }) => void) | undefined;
  /** Recentres the map without changing city. */
  focus?: { lat: number; lng: number; zoom?: number | undefined } | null | undefined;
  className?: string | undefined;
  ariaLabel?: string | undefined;
  showLegend?: boolean | undefined;
  /** Link target used by the cluster panel's primary action. */
  issueLinkId?: string | undefined;
}

const LEGEND: Array<[string, string]> = [
  ["Normal", SEVERITY_HEX.Normal],
  ["Moderate", SEVERITY_HEX.Moderate],
  ["High", SEVERITY_HEX.High],
  ["Critical", SEVERITY_HEX.Critical],
];

export function CityMap({
  cityId,
  clusters = [],
  marker = null,
  onMarkerChange,
  focus = null,
  className,
  ariaLabel = "Interactive city map of aggregated civic reports",
  showLegend = true,
  issueLinkId,
}: CityMapProps) {
    const { t } = useI18n();
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const baseRef = useRef<Leaflet.TileLayer | null>(null);
  const labelRef = useRef<Leaflet.TileLayer | null>(null);
  const clusterLayer = useRef<Leaflet.LayerGroup | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const onMarkerChangeRef = useRef(onMarkerChange);
  onMarkerChangeRef.current = onMarkerChange;

  const { resolved } = useTheme();
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<MapCluster | null>(null);

  /* ---------------------------------------------------------- create map */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = (await import("leaflet")) as unknown as typeof Leaflet;
      if (cancelled || !holder.current || mapRef.current) return;
      LRef.current = L;
      const city = getCity(cityId);
      const map = L.map(holder.current, {
        center: city.center,
        zoom: city.zoom,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        preferCanvas: false,
      });
      map.on("click", (e: Leaflet.LeafletMouseEvent) => {
        onMarkerChangeRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      mapRef.current = map;
      clusterLayer.current = L.layerGroup().addTo(map);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterLayer.current = null;
      markerRef.current = null;
      baseRef.current = null;
      labelRef.current = null;
      setReady(false);
    };
    // city changes are handled by a dedicated effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------- basemap */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;
    const tiles = resolved === "dark" ? TILES.dark : TILES.light;
    baseRef.current?.remove();
    labelRef.current?.remove();
    baseRef.current = L.tileLayer(tiles.url, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
    labelRef.current = L.tileLayer(tiles.labels, { maxZoom: 19, opacity: 0.9 }).addTo(map);
  }, [resolved, ready]);

  /* ---------------------------------------------------------------- city */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const city = getCity(cityId);
    setSelected(null);
    map.flyTo(city.center, city.zoom, { duration: 0.9 });
  }, [cityId, ready]);

  /* --------------------------------------------------------------- focus */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !focus) return;
    map.flyTo([focus.lat, focus.lng], focus.zoom ?? 15, { duration: 0.8 });
  }, [focus?.lat, focus?.lng, focus?.zoom, ready]);

  /* ------------------------------------------------------------ clusters */
  useEffect(() => {
    const L = LRef.current;
    const layer = clusterLayer.current;
    if (!L || !layer || !ready) return;
    layer.clearLayers();

    for (const c of clusters) {
      const color = SEVERITY_HEX[c.severity];

      if (c.hotspot) {
        L.circle([c.lat, c.lng], {
          radius: c.radiusMeters,
          color,
          weight: 1,
          opacity: 0.5,
          fillColor: color,
          fillOpacity: 0.1,
          interactive: false,
        }).addTo(layer);
      } else {
        L.circle([c.lat, c.lng], {
          radius: c.radiusMeters,
          color,
          weight: 1,
          opacity: 0.28,
          fillColor: color,
          fillOpacity: 0.06,
          interactive: false,
        }).addTo(layer);
      }

      const size = Math.max(30, Math.min(54, 26 + c.count));
      const icon = L.divIcon({
        className: "jm-cluster-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        html: `<span class="jm-cluster" style="--jm-c:${color};width:${size}px;height:${size}px">
            <span class="jm-cluster-count">${c.count}</span>
          </span>`,
      });
      const m = L.marker([c.lat, c.lng], {
        icon,
        keyboard: true,
        title: `${c.category} — ${c.count} reports, ${c.ward}`,
        alt: `${c.category} cluster in ${c.ward}`,
        riseOnHover: true,
      }).addTo(layer);
      m.on("click", () => setSelected(c));
      m.on("keypress", () => setSelected(c));
    }
  }, [clusters, ready]);

  /* -------------------------------------------------------------- marker */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;
    if (!marker) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      const icon = L.divIcon({
        className: "jm-pin-icon",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<span class="jm-pin"><span class="jm-pin-dot"></span></span>`,
      });
      markerRef.current = L.marker([marker.lat, marker.lng], {
        icon,
        draggable: !!onMarkerChange,
        keyboard: true,
        title: "Your report location — drag to correct",
        alt: "Your report location",
      }).addTo(map);
      markerRef.current.on("dragend", () => {
        const ll = markerRef.current?.getLatLng();
        if (ll) onMarkerChangeRef.current?.({ lat: ll.lat, lng: ll.lng });
      });
    } else {
      markerRef.current.setLatLng([marker.lat, marker.lng]);
    }
  }, [marker?.lat, marker?.lng, ready, onMarkerChange]);

  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl",
        onMarkerChange && "cursor-crosshair",
        className,
      )}
    >
      <div
        ref={holder}
        role="application"
        aria-label={ariaLabel}
        className="jm-map h-full w-full bg-[var(--background-secondary)]"
      />

      {/* zoom controls */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={t('ui.zoom_in')}
          onClick={() => mapRef.current?.zoomIn()}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('ui.zoom_out')}
          onClick={() => mapRef.current?.zoomOut()}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {showLegend && (
        <div className="pointer-events-none absolute top-3 left-3 z-[500] hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 backdrop-blur-xl sm:block">
          <span className="label-xs flex items-center gap-1.5">
            <Layers className="h-3 w-3" aria-hidden /> {t('ui.severity')}</span>
          <ul className="mt-1.5 space-y-1">
            {LEGEND.map(([label, hex]) => (
              <li key={label} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: hex }} aria-hidden />
                <span className="text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* cluster detail — bottom sheet on mobile, floating panel on desktop */}
      {selected && (
        <div className="animate-rise absolute inset-x-2 bottom-2 z-[600] sm:inset-x-auto sm:right-3 sm:bottom-3 sm:w-[19rem]">
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <span className="label-xs" style={{ color: SEVERITY_HEX[selected.severity] }}>
                {selected.hotspot ? "High concentration" : "Multiple reports detected"}
              </span>
              <button
                type="button"
                aria-label={t('ui.close_report_details')}
                onClick={() => setSelected(null)}
                className="press -mt-1 -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-subtle hover:bg-[var(--glass)] hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <h3 className="mt-2 text-base font-semibold">{selected.category}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.count} {t('ui.similar_reports_within_approxi')}{selected.radiusMeters}{t('ui.m')}</p>
            {selected.hotspot && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <div>
                  <p className="label-xs">{t('ui.related_reports')}</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums">
                    {selected.relatedCount}
                  </p>
                </div>
                <div>
                  <p className="label-xs">{t('ui.risk')}</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums">{selected.risk}</p>
                </div>
              </div>
            )}
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-subtle">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {selected.ward} · {selected.area}
            </p>
            <p className="mt-2 text-[0.7rem] leading-relaxed text-subtle">
              {t('ui.aggregate_view_only_no_citizen')}</p>
            <div className="mt-3">
              {issueLinkId ? (
                <Link
                  to="/complaint/$id"
                  params={{ id: issueLinkId }}
                  className="press inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-[0.7rem] font-medium tracking-[0.06em] text-primary-foreground uppercase hover:brightness-110"
                >
                  {t('ui.view_issue')}</Link>
              ) : (
                <Link
                  to="/report"
                  className="press inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-[0.7rem] font-medium tracking-[0.06em] text-primary-foreground uppercase hover:brightness-110"
                >
                  {t('ui.report_this_too')}</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
