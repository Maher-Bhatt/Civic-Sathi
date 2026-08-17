import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { m as Radar } from "../_libs/lucide-react.mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { O as cn } from "./router-RIoqlSez.mjs";
import { t as Delaunay } from "../_libs/d3-delaunay+[...].mjs";
import { r as polygon, t as featureCollection } from "../_libs/turf__helpers.mjs";
import { t as index_default } from "../_libs/@turf/intersect+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/civic-map-panel-BHyuJmCZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Verified Vadodara locality / area names.
*
* Centres are locality reference points, not official boundary data. The map
* derives an approximate catchment polygon around each centre because the
* Vadodara Municipal Corporation does not publish an open boundary file for
* these localities. Those polygons are labelled "Approximate Civic Activity
* Area" everywhere they appear.
*/
var area$1 = (id, name, center, radiusMeters, division) => ({
	id: `vad-${id}`,
	city: "vadodara",
	name,
	center,
	radiusMeters,
	boundarySource: "derived",
	admin: {
		body: "Vadodara Municipal Corporation",
		bodyVerified: true,
		...division ? {
			division,
			divisionVerified: false
		} : {}
	}
});
var VADODARA = {
	city: "vadodara",
	dataNote: "Locality names are verified place names. Boundaries shown are derived catchment approximations, not official VMC ward boundaries.",
	areas: [
		area$1("sama", "Sama", [22.339, 73.19], 1500, "North zone"),
		area$1("chhani", "Chhani", [22.358, 73.172], 1600, "North zone"),
		area$1("nizampura", "Nizampura", [22.33, 73.172], 1200, "North zone"),
		area$1("subhanpura", "Subhanpura", [22.326, 73.165], 1e3, "North zone"),
		area$1("gorwa", "Gorwa", [22.333, 73.156], 1300, "North zone"),
		area$1("karelibaug", "Karelibaug", [22.326, 73.199], 1400, "East zone"),
		area$1("warasiya", "Warasiya", [22.332, 73.213], 1300, "East zone"),
		area$1("harni", "Harni", [22.341, 73.208], 1500, "East zone"),
		area$1("ajwa-road", "Ajwa Road", [22.31, 73.145], 1500, "East zone"),
		area$1("waghodia-road", "Waghodia Road", [22.307, 73.226], 1600, "East zone"),
		area$1("fatehgunj", "Fatehgunj", [22.323, 73.183], 1e3, "Central"),
		area$1("sayajigunj", "Sayajigunj", [22.314, 73.187], 900, "Central"),
		area$1("raopura", "Raopura", [22.3, 73.201], 1e3, "Central"),
		area$1("mandvi", "Mandvi", [22.298, 73.205], 900, "Central"),
		area$1("alkapuri", "Alkapuri", [22.31, 73.172], 1100, "West zone"),
		area$1("akota", "Akota", [22.293, 73.174], 1200, "West zone"),
		area$1("gotri", "Gotri", [22.322, 73.137], 1600, "West zone"),
		area$1("sevasi", "Sevasi", [22.323, 73.111], 1500, "West zone"),
		area$1("vasna", "Vasna", [22.3, 73.136], 1400, "West zone"),
		area$1("bhayli", "Bhayli", [22.298, 73.117], 1500, "West zone"),
		area$1("atladara", "Atladara", [22.282, 73.156], 1300, "South zone"),
		area$1("manjalpur", "Manjalpur", [22.279, 73.193], 1400, "South zone"),
		area$1("tarsali", "Tarsali", [22.268, 73.213], 1500, "South zone"),
		area$1("makarpura", "Makarpura", [22.26, 73.19], 1600, "South zone")
	]
};
/**
* Verified Bengaluru locality / area names under the current Greater Bengaluru
* structure (Greater Bengaluru Authority, five city corporations). The legacy
* 243-ward BBMP structure is intentionally not used.
*
* Corporation attribution is indicative until the official boundary
* notification file is loaded; polygons are derived catchment approximations.
*/
var area = (id, name, center, radiusMeters, division) => ({
	id: `blr-${id}`,
	city: "bengaluru",
	name,
	center,
	radiusMeters,
	boundarySource: "derived",
	admin: {
		body: "Greater Bengaluru Authority",
		bodyVerified: true,
		division,
		divisionVerified: false
	}
});
var NORTH = "Bengaluru North City Corporation";
var SOUTH = "Bengaluru South City Corporation";
var EAST = "Bengaluru East City Corporation";
var WEST = "Bengaluru West City Corporation";
var CENTRAL = "Bengaluru Central City Corporation";
var BENGALURU = {
	city: "bengaluru",
	dataNote: "Locality names are verified place names under the Greater Bengaluru structure. Boundaries shown are derived catchment approximations, not official corporation boundaries.",
	areas: [
		area("yelahanka", "Yelahanka", [13.1007, 77.5963], 2600, NORTH),
		area("byatarayanapura", "Byatarayanapura", [13.063, 77.59], 2e3, NORTH),
		area("hebbal", "Hebbal", [13.0358, 77.597], 1800, NORTH),
		area("jalahalli", "Jalahalli", [13.0435, 77.5205], 1800, NORTH),
		area("hennur", "Hennur", [13.03, 77.64], 1800, NORTH),
		area("rt-nagar", "R.T. Nagar", [13.0207, 77.5945], 1400, NORTH),
		area("whitefield", "Whitefield", [12.9698, 77.7499], 2800, EAST),
		area("mahadevapura", "Mahadevapura", [12.991, 77.697], 2e3, EAST),
		area("kr-puram", "K.R. Puram", [13.007, 77.696], 2e3, EAST),
		area("marathahalli", "Marathahalli", [12.9569, 77.7011], 1800, EAST),
		area("bellandur", "Bellandur", [12.926, 77.678], 2e3, EAST),
		area("cv-raman-nagar", "C.V. Raman Nagar", [12.985, 77.663], 1500, EAST),
		area("indiranagar", "Indiranagar", [12.9719, 77.6412], 1500, EAST),
		area("banaswadi", "Banaswadi", [13.014, 77.651], 1600, EAST),
		area("koramangala", "Koramangala", [12.9352, 77.6245], 1600, SOUTH),
		area("hsr-layout", "HSR Layout", [12.9121, 77.6446], 1800, SOUTH),
		area("btm-layout", "BTM Layout", [12.9166, 77.6101], 1500, SOUTH),
		area("jayanagar", "Jayanagar", [12.925, 77.5938], 1600, SOUTH),
		area("jp-nagar", "J.P. Nagar", [12.91, 77.585], 1800, SOUTH),
		area("banashankari", "Banashankari", [12.925, 77.546], 2200, SOUTH),
		area("basavanagudi", "Basavanagudi", [12.942, 77.573], 1400, SOUTH),
		area("bommanahalli", "Bommanahalli", [12.9, 77.62], 1800, SOUTH),
		area("electronic-city", "Electronic City", [12.8452, 77.6602], 2600, SOUTH),
		area("rajajinagar", "Rajajinagar", [12.9982, 77.5551], 1600, WEST),
		area("vijayanagar", "Vijayanagar", [12.972, 77.533], 1600, WEST),
		area("rr-nagar", "Rajarajeshwari Nagar", [12.927, 77.518], 2400, WEST),
		area("kengeri", "Kengeri", [12.908, 77.482], 2400, WEST),
		area("dasarahalli", "Dasarahalli", [13.028, 77.513], 2e3, WEST),
		area("peenya", "Peenya", [13.029, 77.527], 1800, WEST),
		area("yeshwanthpur", "Yeshwanthpur", [13.023, 77.554], 1600, WEST),
		area("malleshwaram", "Malleshwaram", [13.003, 77.569], 1400, WEST),
		area("shivajinagar", "Shivajinagar", [12.985, 77.605], 1200, CENTRAL),
		area("chickpet", "Chickpet", [12.968, 77.577], 1100, CENTRAL),
		area("shanthinagar", "Shanthinagar", [12.956, 77.596], 1200, CENTRAL),
		area("gandhinagar", "Gandhinagar", [12.978, 77.579], 1e3, CENTRAL)
	]
};
var AREA_HEALTH_ORDER = [
	"low",
	"moderate",
	"high",
	"critical"
];
/** Muted charcoal to amber to red scale. No blue, purple, gold, neon or rainbow. */
var AREA_HEALTH_HEX = {
	low: "#6f7d76",
	moderate: "#a8823f",
	high: "#a4503f",
	critical: "#75302a"
};
var AREA_HEALTH_LABEL = {
	low: "Low",
	moderate: "Moderate",
	high: "High",
	critical: "Critical"
};
var ISSUE_LABEL = {
	water: "Water supply",
	roads: "Road damage",
	garbage: "Garbage",
	drainage: "Drainage",
	lighting: "Street lighting",
	other: "Other"
};
var ISSUE_KEYS = [
	"water",
	"roads",
	"garbage",
	"drainage",
	"lighting",
	"other"
];
var GEOGRAPHY = {
	vadodara: VADODARA,
	bengaluru: BENGALURU
};
var cityGeography = (city) => GEOGRAPHY[city];
var cityAreas = (city) => GEOGRAPHY[city].areas;
function hash(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function rng(seed) {
	let a = hash(seed);
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var M_PER_DEG_LAT = 111320;
function areaRing(area) {
	const r = rng(`ring:${area.id}`);
	const steps = 32;
	const [lat, lng] = area.center;
	const mPerDegLng = M_PER_DEG_LAT * Math.cos(lat * Math.PI / 180);
	const wobble = Array.from({ length: 4 }, () => .12 + r() * .16);
	const phase = Array.from({ length: 4 }, () => r() * Math.PI * 2);
	const ring = [];
	for (let i = 0; i < steps; i++) {
		const t = i / steps * Math.PI * 2;
		let k = 1;
		for (let h = 0; h < 4; h++) k += wobble[h] * Math.sin((h + 2) * t + phase[h]);
		const radius = area.radiusMeters * (.85 + .25 * k);
		ring.push([lat + radius * Math.sin(t) / M_PER_DEG_LAT, lng + radius * Math.cos(t) / mPerDegLng]);
	}
	ring.push(ring[0]);
	return ring;
}
function areaFeatureCollection(city) {
	const areas = cityAreas(city);
	const points = areas.map((a) => [a.center[1], a.center[0]]);
	let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
	for (const point of points) {
		const lng = point[0];
		const lat = point[1];
		if (lng < minLng) minLng = lng;
		if (lng > maxLng) maxLng = lng;
		if (lat < minLat) minLat = lat;
		if (lat > maxLat) maxLat = lat;
	}
	const padding = .05;
	const bounds = [
		minLng - padding,
		minLat - padding,
		maxLng + padding,
		maxLat + padding
	];
	const voronoi = Delaunay.from(points).voronoi(bounds);
	return {
		type: "FeatureCollection",
		features: areas.map((a, i) => {
			let cell = voronoi.cellPolygon(i);
			if (cell && cell.length > 0) {
				const first = cell[0];
				const last = cell[cell.length - 1];
				if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
					cell = Array.from(cell);
					cell.push([first[0], first[1]]);
				}
			}
			const ringCoords = areaRing(a).map(([lat, lng]) => [lng, lat]);
			const organicPoly = polygon([ringCoords]);
			let finalGeom = organicPoly.geometry;
			try {
				if (cell && cell.length >= 4) {
					const vPoly = polygon([Array.from(cell)]);
					const intersection = index_default(featureCollection([vPoly, organicPoly]));
					if (intersection && intersection.geometry) finalGeom = intersection.geometry;
				}
			} catch (e) {}
			return {
				type: "Feature",
				properties: {
					areaId: a.id,
					name: a.name,
					boundarySource: a.boundarySource
				},
				geometry: finalGeom
			};
		})
	};
}
var TIME_WINDOWS = [
	{
		key: "7d",
		label: "7 days",
		days: 7
	},
	{
		key: "30d",
		label: "30 days",
		days: 30
	},
	{
		key: "all",
		label: "All time",
		days: 365
	}
];
/** Thresholds scale with the active time window so colours stay meaningful. */
function healthFromCount(total, time = "30d") {
	const k = time === "7d" ? .28 : time === "all" ? 3.4 : 1;
	if (total >= 78 * k) return "critical";
	if (total >= 46 * k) return "high";
	if (total >= 20 * k) return "moderate";
	return "low";
}
/** All prototype complaint points for a city — deterministic, de-identified. */
function buildPoints(city) {
	const points = [];
	for (const a of cityAreas(city)) {
		const r = rng(`pts:${a.id}`);
		const base = 6 + Math.floor(r() ** 2.1 * 210);
		for (let i = 0; i < base; i++) {
			const issue = ISSUE_KEYS[Math.floor(r() * ISSUE_KEYS.length)];
			const daysAgo = Math.floor(r() ** 2 * 180);
			const angle = r() * Math.PI * 2;
			const dist = Math.sqrt(r()) * a.radiusMeters * .82;
			const mPerDegLng = M_PER_DEG_LAT * Math.cos(a.center[0] * Math.PI / 180);
			points.push({
				id: `${a.id}-${i}`,
				areaId: a.id,
				issue,
				health: [
					"low",
					"low",
					"moderate",
					"moderate",
					"high",
					"critical"
				][Math.floor(r() * 6)],
				daysAgo,
				lat: Math.round((a.center[0] + dist * Math.sin(angle) / M_PER_DEG_LAT) * 2200) / 2200,
				lng: Math.round((a.center[1] + dist * Math.cos(angle) / mPerDegLng) * 2200) / 2200
			});
		}
	}
	return points;
}
var pointCache = /* @__PURE__ */ new Map();
function complaintPoints(city) {
	let p = pointCache.get(city);
	if (!p) {
		p = buildPoints(city);
		pointCache.set(city, p);
	}
	return p;
}
var DEFAULT_FILTERS = {
	issue: "all",
	health: "all",
	time: "30d"
};
var windowDays = (t) => TIME_WINDOWS.find((w) => w.key === t)?.days ?? 30;
function filterPoints(points, f) {
	const days = windowDays(f.time);
	return points.filter((p) => p.daysAgo <= days && (f.issue === "all" || p.issue === f.issue) && (f.health === "all" || p.health === f.health));
}
var emptyBreakdown = () => ({
	water: 0,
	roads: 0,
	garbage: 0,
	drainage: 0,
	lighting: 0,
	other: 0
});
/** Aggregated, privacy-safe activity per locality for the active filters. */
function areaActivity(city, filters) {
	const points = filterPoints(complaintPoints(city), filters);
	const all = complaintPoints(city);
	const byArea = /* @__PURE__ */ new Map();
	for (const p of points) {
		const list = byArea.get(p.areaId);
		if (list) list.push(p);
		else byArea.set(p.areaId, [p]);
	}
	return cityAreas(city).map((area) => {
		const list = byArea.get(area.id) ?? [];
		const counts = emptyBreakdown();
		for (const p of list) counts[p.issue] += 1;
		const total = list.length;
		const last7 = list.filter((p) => p.daysAgo <= 7).length;
		const prev7 = all.filter((p) => p.areaId === area.id && p.daysAgo > 7 && p.daysAgo <= 14).length;
		const trendPct = prev7 === 0 ? last7 > 0 ? 100 : 0 : Math.round((last7 - prev7) / prev7 * 100);
		const topIssue = ISSUE_KEYS.slice().sort((a, b) => counts[b] - counts[a])[0] ?? "other";
		const health = healthFromCount(total, filters.time);
		const density = total / Math.max(1, Math.PI * (area.radiusMeters / 1e3) ** 2);
		const risk = Math.max(0, Math.min(100, Math.round(density * 5 + total * .5 + last7 * 2)));
		const r = rng(`meta:${area.id}`);
		return {
			area,
			counts,
			total,
			resolved: Math.round(total * (.28 + r() * .34)),
			last7,
			trendPct,
			health,
			topIssue,
			hotspot: risk >= 62 && total >= 20,
			risk,
			recent: list.slice().sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 4).map((p) => ({
				issue: p.issue,
				daysAgo: p.daysAgo,
				health: p.health
			}))
		};
	});
}
var HEALTH_RANK = {
	low: 0,
	moderate: 1,
	high: 2,
	critical: 3
};
var RANK_HEALTH = [
	"low",
	"moderate",
	"high",
	"critical"
];
/** Grid clustering: coarse when zoomed out, individual points when zoomed in. */
function clusterPoints(points, zoom) {
	if (zoom >= 16) return points.map((p) => ({
		id: p.id,
		lat: p.lat,
		lng: p.lng,
		count: 1,
		health: p.health,
		areaId: p.areaId
	}));
	const cell = zoom >= 15 ? .004 : zoom >= 14 ? .008 : zoom >= 13 ? .016 : zoom >= 12 ? .03 : .06;
	const buckets = /* @__PURE__ */ new Map();
	for (const p of points) {
		const key = `${Math.floor(p.lat / cell)}:${Math.floor(p.lng / cell)}`;
		const b = buckets.get(key);
		if (b) {
			b.lat += p.lat;
			b.lng += p.lng;
			b.n += 1;
			b.rankSum += HEALTH_RANK[p.health];
		} else buckets.set(key, {
			lat: p.lat,
			lng: p.lng,
			n: 1,
			rankSum: HEALTH_RANK[p.health],
			areaId: p.areaId
		});
	}
	return Array.from(buckets.entries()).map(([key, b]) => ({
		id: key,
		lat: b.lat / b.n,
		lng: b.lng / b.n,
		count: b.n,
		health: RANK_HEALTH[Math.round(b.rankSum / b.n)],
		areaId: b.areaId
	}));
}
/** Nearest locality to a coordinate — used by "Near me". */
function nearestArea(city, lat, lng) {
	let best = null;
	let bestD = Number.POSITIVE_INFINITY;
	for (const a of cityAreas(city)) {
		const d = (a.center[0] - lat) ** 2 + (a.center[1] - lng) ** 2;
		if (d < bestD) {
			bestD = d;
			best = a;
		}
	}
	return best;
}
function searchAreas(city, query) {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return cityAreas(city).filter((a) => a.name.toLowerCase().includes(q) || (a.admin.division ?? "").toLowerCase().includes(q)).slice(0, 6);
}
var ISSUE_CHART_COLORS = {
	water: "var(--color-chart-1)",
	roads: "var(--color-chart-2)",
	garbage: "var(--color-chart-3)",
	drainage: "var(--color-chart-4)",
	lighting: "var(--color-chart-5)",
	other: "var(--muted-foreground)"
};
/** Deterministic 7-day report trend for charts. */
function cityDailyTrend(city, filters) {
	const points = filterPoints(complaintPoints(city), filters);
	const labels = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const buckets = [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	for (const p of points) {
		if (p.daysAgo > 6) continue;
		buckets[6 - p.daysAgo] += 1;
	}
	const r = rng(`trend:${city}:${filters.time}:${filters.issue}`);
	return labels.map((day, i) => ({
		day,
		reports: buckets[i] + Math.floor(r() * 4)
	}));
}
/** Issue breakdown across all localities for bar/pie charts. */
function cityIssueBreakdown(city, filters) {
	const acts = areaActivity(city, filters);
	const totals = emptyBreakdown();
	for (const a of acts) for (const k of ISSUE_KEYS) totals[k] += a.counts[k];
	return ISSUE_KEYS.map((issue) => ({
		issue,
		label: ISSUE_LABEL[issue],
		count: totals[issue],
		fill: ISSUE_CHART_COLORS[issue]
	})).filter((d) => d.count > 0);
}
/** Health distribution for radial chart. */
function cityHealthDistribution(city, filters) {
	const acts = areaActivity(city, filters);
	const buckets = {
		low: 0,
		moderate: 0,
		high: 0,
		critical: 0
	};
	for (const a of acts) buckets[a.health] += a.total;
	return AREA_HEALTH_ORDER.map((health) => ({
		health,
		label: AREA_HEALTH_LABEL[health],
		count: buckets[health],
		fill: AREA_HEALTH_HEX[health]
	})).filter((d) => d.count > 0);
}
/** Area-specific 7-day sparkline data. */
function areaDailyTrend(areaId, filters) {
	const points = filterPoints(complaintPoints(cityAreas("vadodara").some((a) => a.id === areaId) ? "vadodara" : "bengaluru"), filters).filter((p) => p.areaId === areaId);
	const labels = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const buckets = [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	for (const p of points) {
		if (p.daysAgo > 6) continue;
		buckets[6 - p.daysAgo] += 1;
	}
	return labels.map((day, i) => ({
		day,
		reports: buckets[i]
	}));
}
var CivicMap = (0, import_react.lazy)(() => import("./civic-map-DjpwamRk.mjs").then((m) => ({ default: m.CivicMap })));
function MapSkeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]", className),
		role: "status",
		"aria-label": "Loading civic map",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "jm-map-scan absolute inset-0 opacity-40",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
				className: "h-4 w-4 animate-spin text-primary",
				"aria-hidden": true
			}), "Initializing map"]
		})]
	});
}
/** Browser-only wrapper — Leaflet never loads during SSR. */
function ClientCivicMap(props) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicMap, { ...props })
	});
}
//#endregion
export { complaintPoints as _, DEFAULT_FILTERS as a, searchAreas as b, TIME_WINDOWS as c, areaFeatureCollection as d, cityDailyTrend as f, clusterPoints as g, cityIssueBreakdown as h, ClientCivicMap as i, areaActivity as l, cityHealthDistribution as m, AREA_HEALTH_LABEL as n, ISSUE_KEYS as o, cityGeography as p, AREA_HEALTH_ORDER as r, ISSUE_LABEL as s, AREA_HEALTH_HEX as t, areaDailyTrend as u, filterPoints as v, nearestArea as y };
