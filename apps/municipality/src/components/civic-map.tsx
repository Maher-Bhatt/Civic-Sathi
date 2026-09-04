import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Crosshair, Minus, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { ATTRIBUTION, TILES, getCity, type CityId } from "@/services/cities";
import {
  AREA_HEALTH_HEX,
  AREA_HEALTH_LABEL,
  ISSUE_LABEL,
  areaFeatureCollection,
  clusterPoints,
  type AreaActivity,
  type ComplaintPoint,
} from "@/services/geography";
import { useI18n } from "@/lib/i18n";

export type MapMode = "health" | "activity" | "hotspots";

export interface CivicMapProps {
  cityId: CityId;
  mode: MapMode;
  activities: AreaActivity[];
  points: ComplaintPoint[];
  selectedAreaId: string | null;
  onSelectArea: (areaId: string | null) => void;
  /** Recentre request, e.g. from search or Near me. */
  focus?: { lat: number; lng: number; zoom?: number } | null;
  onResetView?: (() => void) | undefined;
  onNearMe?: (() => void) | undefined;
  locating?: boolean | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Native-layer civic map. All geometry (polygons, clusters, hotspots) is drawn
 * by Leaflet itself — no React components are mounted per feature — so the
 * larger Bengaluru dataset stays smooth.
 */
export function CivicMap({
  cityId,
  mode,
  activities,
  points,
  selectedAreaId,
  onSelectArea,
  focus = null,
  onResetView,
  onNearMe,
  locating = false,
  className,
  compact = false,
}: CivicMapProps) {
    const { t } = useI18n();
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const baseRef = useRef<Leaflet.TileLayer | null>(null);
  const labelRef = useRef<Leaflet.TileLayer | null>(null);
  const areaLayer = useRef<Leaflet.GeoJSON | null>(null);
  const pointLayer = useRef<Leaflet.LayerGroup | null>(null);
  const hotspotLayer = useRef<Leaflet.LayerGroup | null>(null);

  const { resolved } = useTheme();
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(getCity(cityId).zoom);
  const [selectedPoint, setSelectedPoint] = useState<import("@/services/geography").PointCluster | null>(null);

  const activityById = useMemo(() => new Map(activities.map((a) => [a.area.id, a])), [activities]);
  const activityRef = useRef(activityById);
  activityRef.current = activityById;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const selectedRef = useRef(selectedAreaId);
  selectedRef.current = selectedAreaId;
  const onSelectRef = useRef(onSelectArea);
  onSelectRef.current = onSelectArea;

  const styleFor = useCallback((areaId: string): Leaflet.PathOptions => {
    const a = activityRef.current.get(areaId);
    const health = a?.health ?? "low";
    const hex = AREA_HEALTH_HEX[health];
    const active = selectedRef.current === areaId;
    if (modeRef.current !== "health") {
      return {
        color: hex,
        weight: active ? 2 : 0.8,
        opacity: active ? 0.9 : 0.32,
        fillColor: hex,
        fillOpacity: active ? 0.16 : 0.05,
      };
    }
    return {
      color: hex,
      weight: active ? 2.4 : 1,
      opacity: active ? 0.95 : 0.5,
      fillColor: hex,
      fillOpacity: active ? 0.5 : health === "low" ? 0.18 : 0.32,
    };
  }, []);

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
        scrollWheelZoom: true,
      });
      map.on("click", () => {
        onSelectRef.current(null);
        setSelectedPoint(null);
      });
      map.on("zoomend", () => setZoom(map.getZoom()));
      mapRef.current = map;
      pointLayer.current = L.layerGroup().addTo(map);
      hotspotLayer.current = L.layerGroup().addTo(map);
      requestAnimationFrame(() => {
        map.invalidateSize();
        setReady(true);
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      areaLayer.current = null;
      pointLayer.current = null;
      hotspotLayer.current = null;
      baseRef.current = null;
      labelRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------- keep map sized correctly */
  useEffect(() => {
    const el = holder.current;
    const map = mapRef.current;
    if (!el || !map || !ready) return;
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(el);
    map.invalidateSize();
    return () => ro.disconnect();
  }, [ready]);

  /* ------------------------------------------------------------- basemap */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;
    const tiles = resolved === "dark" ? TILES.dark : TILES.light;
    baseRef.current?.remove();
    labelRef.current?.remove();
    baseRef.current = L.tileLayer(tiles.url, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
    if (tiles.labels) {
      labelRef.current = L.tileLayer(tiles.labels, { maxZoom: 19, opacity: 0.85 }).addTo(map);
    }
    areaLayer.current?.bringToFront();
  }, [resolved, ready]);

  /* ------------------------------------------------------- area polygons */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;
    areaLayer.current?.remove();
    const layer = L.geoJSON(areaFeatureCollection(cityId), {
      style: (f) => styleFor(String(f?.properties?.["areaId"])),
      onEachFeature: (feature, lyr) => {
        const areaId = String(feature.properties?.["areaId"]);
        lyr.on("click", (e) => {
          L.DomEvent.stopPropagation(e as unknown as Event);
          onSelectRef.current(areaId);
        });
        lyr.on("mouseover", () => {
          const a = activityRef.current.get(areaId);
          if (!a) return;
          const tip = `<span class="jm-ward-tip"><strong>${escapeHtml(a.area.name)}</strong><br/>
            ${AREA_HEALTH_LABEL[a.health]} civic activity · ${a.total} reports<br/>
            <span class="jm-tip-sub">Top issue: ${ISSUE_LABEL[a.topIssue]}</span></span>`;
          lyr.bindTooltip(tip, {
            sticky: true,
            direction: "top",
            opacity: 1,
            className: "jm-ward-tooltip",
          });
          lyr.openTooltip();
          (lyr as Leaflet.Path).setStyle({ weight: 2.4, opacity: 0.95 });
        });
        lyr.on("mouseout", () => {
          lyr.closeTooltip();
          (lyr as Leaflet.Path).setStyle(styleFor(areaId));
        });
      },
    }).addTo(map);
    areaLayer.current = layer;
    try {
      if (!compact) {
        map.fitBounds(layer.getBounds(), { padding: [24, 24] });
      } else {
        const city = getCity(cityId);
        map.setView(city.center, city.zoom);
      }
    } catch {
      /* empty geometry */
    }
    return () => {
      layer.remove();
    };
  }, [cityId, ready, styleFor]);

  /* ------------------------------------------------------------ restyle */
  useEffect(() => {
    const layer = areaLayer.current;
    if (!layer) return;
    layer.eachLayer((lyr) => {
      const f = (lyr as unknown as { feature?: GeoJSON.Feature }).feature;
      (lyr as Leaflet.Path).setStyle(styleFor(String(f?.properties?.["areaId"])));
    });
  }, [mode, selectedAreaId, activities, styleFor]);

  /* --------------------------------------------- complaint activity mode */
  useEffect(() => {
    const L = LRef.current;
    const layer = pointLayer.current;
    if (!L || !layer || !ready) return;
    layer.clearLayers();
    setSelectedPoint(null);
    if (mode !== "activity" || zoom < 15) return;

    const validPoints = points.filter(p => p.lat !== 0 && p.lng !== 0);
    for (const c of clusterPoints(validPoints, zoom)) {
      const hex = AREA_HEALTH_HEX[c.health];
      const size = c.count === 1 ? 14 : Math.max(28, Math.min(52, 24 + c.count * 0.7));
      const icon = L.divIcon({
        className: "jm-cluster-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        html:
          c.count === 1
            ? `<span class="jm-dot" style="--jm-c:${hex}"></span>`
            : `<span class="jm-cluster" style="--jm-c:${hex};width:${size}px;height:${size}px"><span class="jm-cluster-count">${c.count}</span></span>`,
      });
      const m = L.marker([c.lat, c.lng], {
        icon,
        keyboard: false,
        title: `${c.count} ${c.count === 1 ? "mapped civic report" : "mapped civic reports"} — click for details`,
        alt: `${c.count} ${c.count === 1 ? "mapped civic report" : "mapped civic reports"}`,
      });
      m.on("click", (e) => {
        L.DomEvent.stopPropagation(e as unknown as Event);
        onSelectRef.current(c.areaId);
        setSelectedPoint(c);
      });
      m.addTo(layer);
    }
  }, [mode, points, zoom, ready]);

  /* ---------------------------------------------------------- hotspots */
  useEffect(() => {
    const L = LRef.current;
    const layer = hotspotLayer.current;
    if (!L || !layer || !ready) return;
    layer.clearLayers();
    if (mode !== "hotspots") return;

    for (const a of activities.filter((x) => x.hotspot)) {
      const hex = AREA_HEALTH_HEX[a.health];
      // Keep hotspot markers precise and lightweight. The former activity
      // halo circles were visually noisy on the city-health map and could be
      // mistaken for official boundaries, so hotspot state is represented by
      // the labelled marker only.
      const trend = a.trendPct >= 0 ? `+${a.trendPct}%` : `${a.trendPct}%`;
      const icon = L.divIcon({
        className: "jm-cluster-icon",
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        html: `<span class="jm-cluster jm-hotspot-pulse" style="--jm-c:${hex};width:46px;height:46px"><span class="jm-cluster-count">${a.total}</span></span>`,
      });
      const m = L.marker(a.area.center, {
        icon,
        title: `${a.area.name} activity halo — ${a.total} reports`,
        alt: `${a.area.name} activity halo — ${a.total} reports`,
      }).addTo(layer);
      m.bindTooltip(
        `<span class="jm-ward-tip"><strong>${escapeHtml(a.area.name)}</strong><br/>
          ${ISSUE_LABEL[a.topIssue]} · ${a.total} reports<br/>
          <span class="jm-tip-sub">Trend ${trend} · Risk ${a.risk}/100</span></span>`,
        { direction: "top", opacity: 1, className: "jm-ward-tooltip" },
      );
      m.on("click", (e) => {
        L.DomEvent.stopPropagation(e as unknown as Event);
        onSelectRef.current(a.area.id);
      });
    }
  }, [mode, activities, ready]);

  /* ------------------------------------------------------------- focus */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !focus) return;
    map.flyTo([focus.lat, focus.lng], focus.zoom ?? 14, { duration: 0.8 });
  }, [focus?.lat, focus?.lng, focus?.zoom, ready]);

  const resetView = () => {
    const map = mapRef.current;
    const layer = areaLayer.current;
    if (map && layer) {
      try {
        map.fitBounds(layer.getBounds(), { padding: [24, 24] });
      } catch {
        map.setView(getCity(cityId).center, getCity(cityId).zoom);
      }
    }
    onResetView?.();
  };

  return (
    <div
      className={cn(
        "jm-map-shell glass relative overflow-hidden rounded-2xl",
        !ready && "jm-map-loading",
        className,
      )}
    >
      {!ready && (
        <div
          className="absolute inset-0 z-[400] flex items-center justify-center bg-[var(--background-secondary)]"
          role="status"
          aria-label={t('ui.loading_map')}
        >
          <div className="jm-map-scan absolute inset-0 opacity-50" aria-hidden />
          <span className="relative z-10 text-xs tracking-[0.12em] text-subtle uppercase">
            {t('ui.loading_tiles')}</span>
        </div>
      )}
      <div
        ref={holder}
        role="application"
        aria-label={`Civic activity map of ${getCity(cityId).name} by locality`}
        className="jm-map h-full w-full bg-[var(--background-secondary)]"
      />

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
        {!compact && (
          <>
            <button
              type="button"
              aria-label={t('ui.reset_map_view')}
              onClick={resetView}
              className="press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
            </button>
            {onNearMe && (
              <button
                type="button"
                aria-label={t('ui.find_my_area')}
                onClick={onNearMe}
                aria-busy={locating}
                className="press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]"
              >
                <Crosshair className={cn("h-4 w-4", locating && "animate-pulse")} aria-hidden />
              </button>
            )}
          </>
        )}
      </div>

      {selectedPoint && (
        <div className="animate-rise absolute inset-x-2 bottom-2 z-[600] sm:inset-x-auto sm:right-3 sm:bottom-3 sm:w-[21rem]" aria-live="polite">
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="label-xs" style={{ color: AREA_HEALTH_HEX[selectedPoint.health] }}>
                  {selectedPoint.count === 1 ? "Mapped civic report" : `${selectedPoint.count} reports in this map cell`}
                </span>
                <h3 className="mt-1 text-base font-semibold">
                  {Object.entries(selectedPoint.issueCounts)
                    .filter(([, count]) => Number(count || 0) > 0)
                    .sort(([, left], [, right]) => Number(right || 0) - Number(left || 0))
                    .map(([issue, count]) => `${ISSUE_LABEL[issue as keyof typeof ISSUE_LABEL]} (${count})`)
                    .join(" · ") || "Civic issue activity"}
                </h3>
              </div>
              <button
                type="button"
                aria-label={t("ui.close_report_details")}
                onClick={() => setSelectedPoint(null)}
                className="press -mt-1 -mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-subtle hover:bg-[var(--glass)] hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 text-xs">
              <div><dt className="label-xs">Mapped area</dt><dd className="mt-0.5 truncate text-foreground">{activityRef.current.get(selectedPoint.areaId)?.area.name || "City map"}</dd></div>
              <div><dt className="label-xs">Severity</dt><dd className="mt-0.5 capitalize text-foreground">{selectedPoint.health}</dd></div>
              <div className="col-span-2"><dt className="label-xs">Map coordinates</dt><dd className="mt-0.5 font-mono tabular-nums text-foreground">{selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}</dd></div>
              <div><dt className="label-xs">Resolved</dt><dd className="mt-0.5 text-foreground">{selectedPoint.resolved} of {selectedPoint.count}</dd></div>
              <div><dt className="label-xs">Reports</dt><dd className="mt-0.5 text-foreground">{selectedPoint.count}</dd></div>
            </dl>
            <p className="mt-3 text-[0.68rem] leading-relaxed text-subtle">Zoom further in to separate nearby markers. Citizen identities are never shown.</p>
          </div>
        </div>
      )}
    </div>
  );
}
