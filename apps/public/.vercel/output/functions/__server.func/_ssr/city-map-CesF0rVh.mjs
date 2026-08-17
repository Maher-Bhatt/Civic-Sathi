import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as MapPin, g as Minus, h as Plus, t as X, w as Layers } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TILES, o as getCity, r as SEVERITY_HEX, t as ATTRIBUTION } from "./cities-DkNmkOQx.mjs";
import { D as cn, O as useI18n } from "./router-DtTrPgUG.mjs";
import { o as useTheme } from "./router-DtTrPgUG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/city-map-CesF0rVh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LEGEND = [
	["Normal", SEVERITY_HEX.Normal],
	["Moderate", SEVERITY_HEX.Moderate],
	["High", SEVERITY_HEX.High],
	["Critical", SEVERITY_HEX.Critical]
];
function CityMap({ cityId, clusters = [], marker = null, onMarkerChange, focus = null, className, ariaLabel = "Interactive city map of aggregated civic reports", showLegend = true, issueLinkId }) {
	const { t } = useI18n();
	const holder = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const LRef = (0, import_react.useRef)(null);
	const baseRef = (0, import_react.useRef)(null);
	const labelRef = (0, import_react.useRef)(null);
	const clusterLayer = (0, import_react.useRef)(null);
	const markerRef = (0, import_react.useRef)(null);
	const onMarkerChangeRef = (0, import_react.useRef)(onMarkerChange);
	onMarkerChangeRef.current = onMarkerChange;
	const { resolved } = useTheme();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
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
				scrollWheelZoom: false,
				preferCanvas: false
			});
			map.on("click", (e) => {
				onMarkerChangeRef.current?.({
					lat: e.latlng.lat,
					lng: e.latlng.lng
				});
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
	}, []);
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
			opacity: .9
		}).addTo(map);
	}, [resolved, ready]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map || !ready) return;
		const city = getCity(cityId);
		setSelected(null);
		map.flyTo(city.center, city.zoom, { duration: .9 });
	}, [cityId, ready]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map || !ready || !focus) return;
		map.flyTo([focus.lat, focus.lng], focus.zoom ?? 15, { duration: .8 });
	}, [
		focus?.lat,
		focus?.lng,
		focus?.zoom,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const L = LRef.current;
		const layer = clusterLayer.current;
		if (!L || !layer || !ready) return;
		layer.clearLayers();
		for (const c of clusters) {
			const color = SEVERITY_HEX[c.severity];
			if (c.hotspot) L.circle([c.lat, c.lng], {
				radius: c.radiusMeters,
				color,
				weight: 1,
				opacity: .5,
				fillColor: color,
				fillOpacity: .1,
				interactive: false
			}).addTo(layer);
			else L.circle([c.lat, c.lng], {
				radius: c.radiusMeters,
				color,
				weight: 1,
				opacity: .28,
				fillColor: color,
				fillOpacity: .06,
				interactive: false
			}).addTo(layer);
			const size = Math.max(30, Math.min(54, 26 + c.count));
			const icon = L.divIcon({
				className: "jm-cluster-icon",
				iconSize: [size, size],
				iconAnchor: [size / 2, size / 2],
				html: `<span class="jm-cluster" style="--jm-c:${color};width:${size}px;height:${size}px">
            <span class="jm-cluster-count">${c.count}</span>
          </span>`
			});
			const m = L.marker([c.lat, c.lng], {
				icon,
				keyboard: true,
				title: `${c.category} — ${c.count} reports, ${c.ward}`,
				alt: `${c.category} cluster in ${c.ward}`,
				riseOnHover: true
			}).addTo(layer);
			m.on("click", () => setSelected(c));
			m.on("keypress", () => setSelected(c));
		}
	}, [clusters, ready]);
	(0, import_react.useEffect)(() => {
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
				html: `<span class="jm-pin"><span class="jm-pin-dot"></span></span>`
			});
			markerRef.current = L.marker([marker.lat, marker.lng], {
				icon,
				draggable: !!onMarkerChange,
				keyboard: true,
				title: "Your report location — drag to correct",
				alt: "Your report location"
			}).addTo(map);
			markerRef.current.on("dragend", () => {
				const ll = markerRef.current?.getLatLng();
				if (ll) onMarkerChangeRef.current?.({
					lat: ll.lat,
					lng: ll.lng
				});
			});
		} else markerRef.current.setLatLng([marker.lat, marker.lng]);
	}, [
		marker?.lat,
		marker?.lng,
		ready,
		onMarkerChange
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass relative overflow-hidden rounded-2xl", onMarkerChange && "cursor-crosshair", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: holder,
				role: "application",
				"aria-label": ariaLabel,
				className: "jm-map h-full w-full bg-[var(--background-secondary)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 right-3 z-[500] flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": t("ui.zoom_in"),
					onClick: () => mapRef.current?.zoomIn(),
					className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "h-4 w-4",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": t("ui.zoom_out"),
					onClick: () => mapRef.current?.zoomOut(),
					className: "press flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-foreground backdrop-blur-xl hover:bg-[var(--surface-elevated)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
						className: "h-4 w-4",
						"aria-hidden": true
					})
				})]
			}),
			showLegend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute top-3 left-3 z-[500] hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 backdrop-blur-xl sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "label-xs flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
							className: "h-3 w-3",
							"aria-hidden": true
						}),
						" ",
						t("ui.severity")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1.5 space-y-1",
					children: LEGEND.map(([label, hex]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2 w-2 rounded-full",
							style: { background: hex },
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase",
							children: label
						})]
					}, label))
				})]
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-rise absolute inset-x-2 bottom-2 z-[600] sm:inset-x-auto sm:right-3 sm:bottom-3 sm:w-[19rem]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-xs",
								style: { color: SEVERITY_HEX[selected.severity] },
								children: selected.hotspot ? "High concentration" : "Multiple reports detected"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": t("ui.close_report_details"),
								onClick: () => setSelected(null),
								className: "press -mt-1 -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-subtle hover:bg-[var(--glass)] hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									className: "h-3.5 w-3.5",
									"aria-hidden": true
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 text-base font-semibold",
							children: selected.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								selected.count,
								" ",
								t("ui.similar_reports_within_approxi"),
								selected.radiusMeters,
								t("ui.m")
							]
						}),
						selected.hotspot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.related_reports")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-lg font-semibold tabular-nums",
								children: selected.relatedCount
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.risk")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-lg font-semibold tabular-nums",
								children: selected.risk
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 inline-flex items-center gap-1.5 text-xs text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									className: "h-3.5 w-3.5",
									"aria-hidden": true
								}),
								selected.ward,
								" · ",
								selected.area
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[0.7rem] leading-relaxed text-subtle",
							children: t("ui.aggregate_view_only_no_citizen")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: issueLinkId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/complaint/$id",
								params: { id: issueLinkId },
								className: "press inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-[0.7rem] font-medium tracking-[0.06em] text-primary-foreground uppercase hover:brightness-110",
								children: t("ui.view_issue")
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/report",
								className: "press inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-[0.7rem] font-medium tracking-[0.06em] text-primary-foreground uppercase hover:brightness-110",
								children: t("ui.report_this_too")
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { CityMap };
