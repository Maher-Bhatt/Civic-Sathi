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
  type PointCluster,
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
  const [selectedPoint, setSelectedPoint] = useState<PointCluster | null>(null);

  const activityById = useMemo(() => new Map(activities.map((a) => [a.area.id, a])), [activities]);
  const activityRef = useRef(activityById);
  activityRef.current = activityById;

  const onSelectRef = useRef(onSelectArea);
  onSelectRef.current = onSelectArea;

  const styleFor = useCallback((areaId: string): Leaflet.PathOptions => {
    const activity = activityRef.current.get(areaId);
    const health = activity?.health ?? "low";
    const color = AREA_HEALTH_HEX[health];
    const selected = selectedAreaId === areaId;
    return {
      color,
      weight: selected ? 2.4 : 1,
      opacity: selected ? 0.95 : 0.58,
      fillColor: color,
      fillOpacity: mode === "health" ? (selected ? 0.5 : health === "low" ? 0.12 : 0.28) : 0.035,
    };
  }, [mode, selectedAreaId]);

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
    labelRef.current = L.tileLayer(tiles.labels, { maxZoom: 19, opacity: 0.85 }).addTo(map);
  }, [resolved, ready]);

  /* ---------------------------------------------------------- severity zones */
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !ready) return;
    areaLayer.current?.remove();
    const layer = L.geoJSON(areaFeatureCollection(cityId), {
      style: (feature) => styleFor(String(feature?.properties?.["areaId"])),
      onEachFeature: (feature, leafletLayer) => {
        const areaId = String(feature.properties?.["areaId"]);
        leafletLayer.on("click", (event) => {
          L.DomEvent.stopPropagation(event as unknown as Event);
          onSelectRef.current(areaId);
        });
        leafletLayer.on("mouseover", () => {
          const activity = activityRef.current.get(areaId);
          if (!activity) return;
          const tip = `<span class="jm-ward-tip"><strong>${escapeHtml(activity.area.name)}</strong><br/>${AREA_HEALTH_LABEL[activity.health]} severity · ${activity.total} mapped reports · ${activity.resolved} resolved<br/><span class="jm-tip-sub">Top: ${ISSUE_LABEL[activity.topIssue]} · Risk ${activity.risk}/100</span></span>`;
          leafletLayer.bindTooltip(tip, { sticky: true, direction: "top", opacity: 1, className: "jm-ward-tooltip" });
          leafletLayer.openTooltip();
        });
        leafletLayer.on("mouseout", () => leafletLayer.closeTooltip());
      },
    }).addTo(map);
    areaLayer.current = layer;
    return () => layer.remove();
  }, [cityId, ready, styleFor]);

  useEffect(() => {
    const layer = areaLayer.current;
    if (!layer) return;
    layer.eachLayer((leafletLayer) => {
      const feature = (leafletLayer as unknown as { feature?: GeoJSON.Feature }).feature;
      (leafletLayer as Leaflet.Path).setStyle(styleFor(String(feature?.properties?.["areaId"] ?? "")));
    });
  }, [activities, mode, selectedAreaId, styleFor]);

  /* ------------------------------------------------------- complaint markers */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const city = getCity(cityId);
    map.setView(city.center, city.zoom);
  }, [cityId, compact, ready]);

  /* --------------------------------------------- complaint activity mode */
  useEffect(() => {
    const L = LRef.current;
    const layer = pointLayer.current;
    if (!L || !layer || !ready) return;
    layer.clearLayers();
    setSelectedPoint(null);
    if (mode === "hotspots" || zoom < 12) return;

    for (const c of clusterPoints(points, zoom)) {
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
      L.circle(a.area.center, {
        radius: a.area.radiusMeters * 0.7,
        color: hex,
        weight: 1,
        opacity: 0.55,
        fillColor: hex,
        fillOpacity: 0.14,
        interactive: false,
      }).addTo(layer);
      const trend = a.trendPct >= 0 ? `+${a.trendPct}%` : `${a.trendPct}%`;
      const icon = L.divIcon({
        className: "jm-cluster-icon",
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        html: `<span class="jm-cluster jm-hotspot-pulse" style="--jm-c:${hex};width:46px;height:46px"><span class="jm-cluster-count">${a.total}</span></span>`,
      });
      const m = L.marker(a.area.center, {
        icon,
        title: `${a.area.name} hotspot`,
        alt: `${a.area.name} hotspot`,
      }).addTo(layer);
      m.bindTooltip(
        `<span class="jm-ward-tip"><strong>${escapeHtml(a.area.name)} Hotspot</strong><br/>
          ${ISSUE_LABEL[a.topIssue]} · ${a.total} mapped reports · ${a.resolved} resolved<br/>
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

  const selectedPointArea = selectedPoint ? activityRef.current.get(selectedPoint.areaId)?.area.name : null;
  const selectedPointIssues = selectedPoint
    ? Object.entries(selectedPoint.issueCounts)
        .filter(([, count]) => Number(count || 0) > 0)
        .sort(([, left], [, right]) => Number(right || 0) - Number(left || 0))
        .map(([issue, count]) => `${ISSUE_LABEL[issue as keyof typeof ISSUE_LABEL]} (${count})`)
        .join(" · ")
    : "";

  const resetView = () => {
    const map = mapRef.current;
    if (map) {
      const layer = areaLayer.current;
      if (layer) {
        try {
          map.fitBounds(layer.getBounds(), { padding: [24, 24] });
        } catch {
          map.setView(getCity(cityId).center, getCity(cityId).zoom);
        }
      } else {
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

      {mode === "health" && (
        <div
          className="absolute bottom-3 left-3 z-[500] rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          aria-label="Live severity legend"
        >
          <p className="mb-1 text-[0.6rem] font-bold tracking-[0.1em] text-subtle uppercase">Live severity zones</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] text-foreground">
            {(["low", "moderate", "high", "critical"] as const).map((health) => (
              <span key={health} className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: AREA_HEALTH_HEX[health] }} aria-hidden />
                {AREA_HEALTH_LABEL[health]}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedPoint && (
        <div className="animate-rise absolute inset-x-2 bottom-2 z-[600] sm:inset-x-auto sm:right-3 sm:bottom-3 sm:w-[21rem]" aria-live="polite">
          <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="label-xs" style={{ color: AREA_HEALTH_HEX[selectedPoint.health] }}>
                  {selectedPoint.count === 1 ? "Mapped civic report" : `${selectedPoint.count} reports in this map cell`}
                </span>
                <h3 className="mt-1 text-base font-semibold">
                  {selectedPointIssues || "Civic issue activity"}
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
              <div>
                <dt className="label-xs">Mapped area</dt>
                <dd className="mt-0.5 truncate text-foreground">{selectedPointArea || "City map"}</dd>
              </div>
              <div>
                <dt className="label-xs">Severity</dt>
                <dd className="mt-0.5 capitalize text-foreground">{selectedPoint.health}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label-xs">Map coordinates</dt>
                <dd className="mt-0.5 font-mono tabular-nums text-foreground">{selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}</dd>
              </div>
              <div>
                <dt className="label-xs">Resolved</dt>
                <dd className="mt-0.5 text-foreground">{selectedPoint.resolved} of {selectedPoint.count}</dd>
              </div>
              <div>
                <dt className="label-xs">Reports</dt>
                <dd className="mt-0.5 text-foreground">{selectedPoint.count}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[0.68rem] leading-relaxed text-subtle">
              Click a marker again after zooming in to inspect a more precise mapped location. Citizen identities are never shown.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
