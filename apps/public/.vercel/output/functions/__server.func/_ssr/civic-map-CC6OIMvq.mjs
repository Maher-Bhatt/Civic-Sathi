import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as Crosshair, f as RotateCcw, g as Minus, h as Plus } from "../_libs/lucide-react.mjs";
import { i as TILES, o as getCity, t as ATTRIBUTION } from "./cities-CP3Vvkkz.mjs";
import { D as useI18n, E as cn } from "./router-hbYygTvF.mjs";
import { o as useTheme } from "./router-hbYygTvF2.mjs";
import { d as areaFeatureCollection, g as clusterPoints, n as AREA_HEALTH_LABEL, s as ISSUE_LABEL, t as AREA_HEALTH_HEX } from "./civic-map-panel-b0dhlz4x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/civic-map-CC6OIMvq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
/**
* Native-layer civic map. All geometry (polygons, clusters, hotspots) is drawn
* by Leaflet itself — no React components are mounted per feature — so the
* larger Bengaluru dataset stays smooth.
*/
function CivicMap({ cityId, mode, activities, points, selectedAreaId, onSelectArea, focus = null, onResetView, onNearMe, locating = false, className, compact = false }) {
	const { t } = useI18n();
	const holder = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const LRef = (0, import_react.useRef)(null);
	const baseRef = (0, import_react.useRef)(null);
	const labelRef = (0, import_react.useRef)(null);
	const areaLayer = (0, import_react.useRef)(null);
	const pointLayer = (0, import_react.useRef)(null);
	const hotspotLayer = (0, import_react.useRef)(null);
	const { resolved } = useTheme();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [zoom, setZoom] = (0, import_react.useState)(getCity(cityId).zoom);
	const activityById = (0, import_react.useMemo)(() => new Map(activities.map((a) => [a.area.id, a])), [activities]);
	const activityRef = (0, import_react.useRef)(activityById);
	activityRef.current = activityById;
	const modeRef = (0, import_react.useRef)(mode);
	modeRef.current = mode;
	const selectedRef = (0, import_react.useRef)(selectedAreaId);
	selectedRef.current = selectedAreaId;
	const onSelectRef = (0, import_react.useRef)(onSelectArea);
	onSelectRef.current = onSelectArea;
	const styleFor = (0, import_react.useCallback)((areaId) => {
		const health = activityRef.current.get(areaId)?.health ?? "low";
		const hex = AREA_HEALTH_HEX[health];
		const active = selectedRef.current === areaId;
		if (modeRef.current !== "health") return {
			color: hex,
			weight: active ? 2 : .8,
			opacity: active ? .9 : .32,
			fillColor: hex,
			fillOpacity: active ? .16 : .05
		};
		return {
			color: hex,
			weight: active ? 2.4 : 1,
			opacity: active ? .95 : .5,
			fillColor: hex,
			fillOpacity: active ? .5 : health === "low" ? .18 : .32
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled || !holder.current || mapRef.current) return;
			LRef.current = L;
			const city = getCity(cityId);
			const map = L.map(holder.current, {
				center: city.center,
				zoom: city.zoom,
				zoomControl: false,
				attributionControl: true,
				scrollWheelZoom: true
			});
			map.on("click", () => onSelectRef.current(null));
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
	}, []);
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		const L = LRef.current;
		const map = mapRef.current;
		if (!L || !map || !ready) return;
		const tiles = resolved === "dark" ? TILES.dark : TILES.light;
		baseRef.current?.remove();
		labelRef.current?.remove();
		baseRef.current = L.tileLayer(tiles.url, {
			attribution: ATTRIBUTION,
			maxZoom: 19
		}).addTo(map);
		labelRef.current = L.tileLayer(tiles.labels, {
			maxZoom: 19,
			opacity: .85
		}).addTo(map);
		areaLayer.current?.bringToFront();
	}, [resolved, ready]);
	(0, import_react.useEffect)(() => {
		const L = LRef.current;
		const map = mapRef.current;
		if (!L || !map || !ready) return;
		areaLayer.current?.remove();
		const layer = L.geoJSON(areaFeatureCollection(cityId), {
			style: (f) => styleFor(String(f?.properties?.["areaId"])),
			onEachFeature: (feature, lyr) => {
				const areaId = String(feature.properties?.["areaId"]);
				lyr.on("click", (e) => {
					L.DomEvent.stopPropagation(e);
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
						className: "jm-ward-tooltip"
					});
					lyr.openTooltip();
					lyr.setStyle({
						weight: 2.4,
						opacity: .95
					});
				});
				lyr.on("mouseout", () => {
					lyr.closeTooltip();
					lyr.setStyle(styleFor(areaId));
				});
			}
		}).addTo(map);
		areaLayer.current = layer;
		try {
			if (!compact) map.fitBounds(layer.getBounds(), { padding: [24, 24] });
			else {
				const city = getCity(cityId);
				map.setView(city.center, city.zoom);
			}
		} catch {}
		return () => {
			layer.remove();
		};
	}, [
		cityId,
		ready,
		styleFor
	]);
	(0, import_react.useEffect)(() => {
		const layer = areaLayer.current;
		if (!layer) return;
		layer.eachLayer((lyr) => {
			const f = lyr.feature;
			lyr.setStyle(styleFor(String(f?.properties?.["areaId"])));
		});
	}, [
		mode,
		selectedAreaId,
		activities,
		styleFor
	]);
	(0, import_react.useEffect)(() => {
		const L = LRef.current;
		const layer = pointLayer.current;
		if (!L || !layer || !ready) return;
		layer.clearLayers();
		if (mode !== "activity") return;
		for (const c of clusterPoints(points, zoom)) {
			const hex = AREA_HEALTH_HEX[c.health];
			const size = c.count === 1 ? 14 : Math.max(28, Math.min(52, 24 + c.count * .7));
			const icon = L.divIcon({
				className: "jm-cluster-icon",
				iconSize: [size, size],
				iconAnchor: [size / 2, size / 2],
				html: c.count === 1 ? `<span class="jm-dot" style="--jm-c:${hex}"></span>` : `<span class="jm-cluster" style="--jm-c:${hex};width:${size}px;height:${size}px"><span class="jm-cluster-count">${c.count}</span></span>`
			});
			const m = L.marker([c.lat, c.lng], {
				icon,
				keyboard: false,
				title: `${c.count} aggregated reports`,
				alt: `${c.count} aggregated reports`
			});
			m.on("click", (e) => {
				L.DomEvent.stopPropagation(e);
				onSelectRef.current(c.areaId);
			});
			m.addTo(layer);
		}
	}, [
		mode,
		points,
		zoom,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const L = LRef.current;
		const layer = hotspotLayer.current;
		if (!L || !layer || !ready) return;
		layer.clearLayers();
		if (mode !== "hotspots") return;
		for (const a of activities.filter((x) => x.hotspot)) {
			const hex = AREA_HEALTH_HEX[a.health];
			L.circle(a.area.center, {
				radius: a.area.radiusMeters * .7,
				color: hex,
				weight: 1,
				opacity: .55,
				fillColor: hex,
				fillOpacity: .14,
				interactive: false
			}).addTo(layer);
			const trend = a.trendPct >= 0 ? `+${a.trendPct}%` : `${a.trendPct}%`;
			const icon = L.divIcon({
				className: "jm-cluster-icon",
				iconSize: [46, 46],
				iconAnchor: [23, 23],
				html: `<span class="jm-cluster jm-hotspot-pulse" style="--jm-c:${hex};width:46px;height:46px"><span class="jm-cluster-count">${a.total}</span></span>`
			});
			const m = L.marker(a.area.center, {
				icon,
				title: `${a.area.name} hotspot`,
				alt: `${a.area.name} hotspot`
			}).addTo(layer);
			m.bindTooltip(`<span class="jm-ward-tip"><strong>${escapeHtml(a.area.name)}</strong><br/>
          ${ISSUE_LABEL[a.topIssue]} · ${a.total} reports<br/>
          <span class="jm-tip-sub">Trend ${trend} · Risk ${a.risk}/100</span></span>`, {
				direction: "top",
				opacity: 1,
				className: "jm-ward-tooltip"
			});
			m.on("click", (e) => {
				L.DomEvent.stopPropagation(e);
				onSelectRef.current(a.area.id);
			});
		}
	}, [
		mode,
		activities,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map || !ready || !focus) return;
		map.flyTo([focus.lat, focus.lng], focus.zoom ?? 14, { duration: .8 });
	}, [
		focus?.lat,
		focus?.lng,
		focus?.zoom,
		ready
	]);
	const resetView = () => {
		const map = mapRef.current;
		const layer = areaLayer.current;
		if (map && layer) try {
			map.fitBounds(layer.getBounds(), { padding: [24, 24] });
		} catch {
			map.setView(getCity(cityId).center, getCity(cityId).zoom);
		}
		onResetView?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("jm-map-shell glass relative overflow-hidden rounded-2xl", !ready && "jm-map-loading", className),
		children: [
			!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-[400] flex items-center justify-center bg-[var(--background-secondary)]",
				role: "status",
				"aria-label": t("ui.loading_map"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "jm-map-scan absolute inset-0 opacity-50",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative z-10 text-xs tracking-[0.12em] text-subtle uppercase",
					children: t("ui.loading_tiles")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: holder,
				role: "application",
				"aria-label": `Civic activity map of ${getCity(cityId).name} by locality`,
				className: "jm-map h-full w-full bg-[var(--background-secondary)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 right-3 z-[500] flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("ui.zoom_in"),
						onClick: () => mapRef.current?.zoomIn(),
						className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("ui.zoom_out"),
						onClick: () => mapRef.current?.zoomOut(),
						className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("ui.reset_map_view"),
						onClick: resetView,
						className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					}), onNearMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("ui.find_my_area"),
						onClick: onNearMe,
						"aria-busy": locating,
						className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, {
							className: cn("h-4 w-4", locating && "animate-pulse"),
							"aria-hidden": true
						})
					})] })
				]
			})
		]
	});
}
//#endregion
export { CivicMap };
