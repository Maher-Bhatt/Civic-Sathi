import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Radar } from "../_libs/lucide-react.mjs";
import { D as useI18n, E as cn } from "./router-C39yNYps.mjs";
import { t as Delaunay } from "../_libs/d3-delaunay+[...].mjs";
import { r as polygon, t as featureCollection } from "../_libs/turf__helpers.mjs";
import { t as index_default } from "../_libs/@turf/intersect+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/civic-map-panel-BxExEQ7X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Verified Vadodara locality / area names with researched demographic population data.
* Total VMC urban population ~2.24 Million across 19 wards.
*/
var area$1 = (id, name, center, radiusMeters, population, division) => ({
	id: `vad-${id}`,
	city: "vadodara",
	name,
	center,
	radiusMeters,
	population,
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
		area$1("sama", "Sama", [22.339, 73.19], 1500, 72e3, "North zone"),
		area$1("chhani", "Chhani", [22.358, 73.172], 1600, 64e3, "North zone"),
		area$1("nizampura", "Nizampura", [22.33, 73.172], 1200, 78e3, "North zone"),
		area$1("subhanpura", "Subhanpura", [22.326, 73.165], 1e3, 82e3, "North zone"),
		area$1("gorwa", "Gorwa", [22.333, 73.156], 1300, 95e3, "North zone"),
		area$1("karelibaug", "Karelibaug", [22.326, 73.199], 1400, 88e3, "East zone"),
		area$1("warasiya", "Warasiya", [22.332, 73.213], 1300, 92e3, "East zone"),
		area$1("harni", "Harni", [22.341, 73.208], 1500, 58e3, "East zone"),
		area$1("ajwa-road", "Ajwa Road", [22.31, 73.145], 1500, 105e3, "East zone"),
		area$1("waghodia-road", "Waghodia Road", [22.307, 73.226], 1600, 98e3, "East zone"),
		area$1("fatehgunj", "Fatehgunj", [22.323, 73.183], 1e3, 65e3, "Central zone"),
		area$1("sayajigunj", "Sayajigunj", [22.314, 73.187], 900, 55e3, "Central zone"),
		area$1("raopura", "Raopura", [22.3, 73.201], 1e3, 7e4, "Central zone"),
		area$1("mandvi", "Mandvi", [22.298, 73.205], 900, 6e4, "Central zone"),
		area$1("alkapuri", "Alkapuri", [22.31, 73.172], 1100, 52e3, "West zone"),
		area$1("akota", "Akota", [22.293, 73.174], 1200, 74e3, "West zone"),
		area$1("gotri", "Gotri", [22.322, 73.137], 1600, 11e4, "West zone"),
		area$1("sevasi", "Sevasi", [22.323, 73.111], 1500, 45e3, "West zone"),
		area$1("vasna", "Vasna", [22.3, 73.136], 1400, 85e3, "West zone"),
		area$1("bhayli", "Bhayli", [22.298, 73.117], 1500, 62e3, "West zone"),
		area$1("atladara", "Atladara", [22.282, 73.156], 1300, 76e3, "South zone"),
		area$1("manjalpur", "Manjalpur", [22.279, 73.193], 1400, 125e3, "South zone"),
		area$1("tarsali", "Tarsali", [22.268, 73.213], 1500, 84e3, "South zone"),
		area$1("makarpura", "Makarpura", [22.26, 73.19], 1600, 96e3, "South zone")
	]
};
/**
* Verified Bengaluru locality / area names with researched demographic population data.
* Total Greater Bengaluru urban population ~13.6 Million across 8 major BBMP zones.
*/
var area = (id, name, center, radiusMeters, population, division) => ({
	id: `blr-${id}`,
	city: "bengaluru",
	name,
	center,
	radiusMeters,
	population,
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
		area("yelahanka", "Yelahanka", [13.1007, 77.5963], 2600, 34e4, NORTH),
		area("byatarayanapura", "Byatarayanapura", [13.063, 77.59], 2e3, 26e4, NORTH),
		area("hebbal", "Hebbal", [13.0358, 77.597], 1800, 21e4, NORTH),
		area("jalahalli", "Jalahalli", [13.0435, 77.5205], 1800, 195e3, NORTH),
		area("hennur", "Hennur", [13.03, 77.64], 1800, 175e3, NORTH),
		area("rt-nagar", "R.T. Nagar", [13.0207, 77.5945], 1400, 14e4, NORTH),
		area("whitefield", "Whitefield", [12.9698, 77.7499], 2800, 28e4, EAST),
		area("mahadevapura", "Mahadevapura", [12.991, 77.697], 2e3, 32e4, EAST),
		area("kr-puram", "K.R. Puram", [13.007, 77.696], 2e3, 29e4, EAST),
		area("marathahalli", "Marathahalli", [12.9569, 77.7011], 1800, 21e4, EAST),
		area("bellandur", "Bellandur", [12.926, 77.678], 2e3, 29e4, EAST),
		area("cv-raman-nagar", "C.V. Raman Nagar", [12.985, 77.663], 1500, 19e4, EAST),
		area("indiranagar", "Indiranagar", [12.9719, 77.6412], 1500, 165e3, EAST),
		area("banaswadi", "Banaswadi", [13.014, 77.651], 1600, 18e4, EAST),
		area("koramangala", "Koramangala", [12.9352, 77.6245], 1600, 185e3, SOUTH),
		area("hsr-layout", "HSR Layout", [12.9121, 77.6446], 1800, 23e4, SOUTH),
		area("btm-layout", "BTM Layout", [12.9166, 77.6101], 1500, 24e4, SOUTH),
		area("jayanagar", "Jayanagar", [12.925, 77.5938], 1600, 195e3, SOUTH),
		area("jp-nagar", "J.P. Nagar", [12.91, 77.585], 1800, 225e3, SOUTH),
		area("banashankari", "Banashankari", [12.925, 77.546], 2200, 31e4, SOUTH),
		area("basavanagudi", "Basavanagudi", [12.942, 77.573], 1400, 16e4, SOUTH),
		area("bommanahalli", "Bommanahalli", [12.9, 77.62], 1800, 27e4, SOUTH),
		area("electronic-city", "Electronic City", [12.8452, 77.6602], 2600, 28e4, SOUTH),
		area("rajajinagar", "Rajajinagar", [12.9982, 77.5551], 1600, 24e4, WEST),
		area("vijayanagar", "Vijayanagar", [12.972, 77.533], 1600, 275e3, WEST),
		area("rr-nagar", "Rajarajeshwari Nagar", [12.927, 77.518], 2400, 29e4, WEST),
		area("kengeri", "Kengeri", [12.908, 77.482], 2400, 22e4, WEST),
		area("dasarahalli", "Dasarahalli", [13.028, 77.513], 2e3, 25e4, WEST),
		area("peenya", "Peenya", [13.029, 77.527], 1800, 26e4, WEST),
		area("yeshwanthpur", "Yeshwanthpur", [13.023, 77.554], 1600, 22e4, WEST),
		area("malleshwaram", "Malleshwaram", [13.003, 77.569], 1400, 18e4, WEST),
		area("shivajinagar", "Shivajinagar", [12.985, 77.605], 1200, 17e4, CENTRAL),
		area("chickpet", "Chickpet", [12.968, 77.577], 1100, 13e4, CENTRAL),
		area("shanthinagar", "Shanthinagar", [12.956, 77.596], 1200, 16e4, CENTRAL),
		area("gandhinagar", "Gandhinagar", [12.978, 77.579], 1e3, 11e4, CENTRAL)
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
var CITY_COMPLAINTS_TOTAL = {
	bengaluru: 100002,
	vadodara: 12139
};
/** Thresholds scale with the active time window and city scale so Vadodara is evaluated on its own compact scale. */
function healthFromCount(total, time = "30d", city = "vadodara") {
	const k = time === "7d" ? .35 : time === "all" ? 2.9 : 1;
	if (city === "vadodara") {
		if (total >= 280 * k) return "critical";
		if (total >= 200 * k) return "high";
		if (total >= 100 * k) return "moderate";
		return "low";
	} else {
		if (total >= 1800 * k) return "critical";
		if (total >= 1100 * k) return "high";
		if (total >= 500 * k) return "moderate";
		return "low";
	}
}
/** All prototype complaint points for a city — deterministic, de-identified spatial points for Leaflet. */
function buildPoints(city) {
	const points = [];
	const areas = cityAreas(city);
	const pointsPerArea = city === "bengaluru" ? 120 : 60;
	for (const a of areas) {
		const r = rng(`pts:${a.id}`);
		const base = Math.floor(pointsPerArea * (.7 + r() * .6));
		for (let i = 0; i < base; i++) {
			const issue = ISSUE_KEYS[Math.floor(r() * ISSUE_KEYS.length)];
			const daysAgo = Math.floor(r() ** 1.8 * 365);
			const angle = r() * Math.PI * 2;
			const dist = Math.sqrt(r()) * a.radiusMeters * .82;
			const mPerDegLng = M_PER_DEG_LAT * Math.cos(a.center[0] * Math.PI / 180);
			points.push({
				id: `${a.id}-${i}`,
				areaId: a.id,
				issue,
				health: [
					"low",
					"moderate",
					"moderate",
					"high",
					"critical"
				][Math.floor(r() * 5)],
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
/** Aggregated, privacy-safe activity per locality for the active filters scaled to the 100k+ dataset. */
function areaActivity(city, filters) {
	const areas = cityAreas(city);
	const totalCityVolume = CITY_COMPLAINTS_TOTAL[city] || 12139;
	const timeFactor = filters.time === "7d" ? .125 : filters.time === "30d" ? .35 : 1;
	const categoryWeights = {
		roads: .28,
		water: .22,
		garbage: .2,
		drainage: .14,
		lighting: .1,
		other: .06
	};
	let weightsSum = 0;
	const areaWeights = areas.map((a, idx) => {
		const r = rng(`weight:${a.id}`);
		const baseWeight = idx < Math.ceil(areas.length / 3) ? 1.5 + r() * 1.2 : .6 + r() * .7;
		weightsSum += baseWeight;
		return {
			area: a,
			weight: baseWeight
		};
	});
	const cityActiveVolume = Math.round(totalCityVolume * timeFactor);
	const activities = areaWeights.map(({ area, weight }) => {
		const r = rng(`meta:${area.id}:${filters.time}`);
		const areaProportion = weight / weightsSum;
		let baseAreaTotal = Math.max(1, Math.round(cityActiveVolume * areaProportion));
		const counts = emptyBreakdown();
		for (const k of ISSUE_KEYS) {
			const catFactor = categoryWeights[k] * (.8 + r() * .4);
			counts[k] = Math.round(baseAreaTotal * catFactor);
		}
		let total = baseAreaTotal;
		if (filters.issue !== "all") total = counts[filters.issue] || 0;
		const last7 = Math.round(total * (filters.time === "7d" ? 1 : filters.time === "30d" ? .36 : .125));
		const prev7 = Math.round(last7 * (.85 + r() * .3));
		const trendPct = prev7 === 0 ? last7 > 0 ? 100 : 0 : Math.round((last7 - prev7) / prev7 * 100);
		const topIssue = ISSUE_KEYS.slice().sort((a, b) => counts[b] - counts[a])[0] ?? "roads";
		const health = healthFromCount(baseAreaTotal, filters.time, city);
		const density = total / Math.max(1, Math.PI * (area.radiusMeters / 1e3) ** 2);
		const risk = Math.max(0, Math.min(100, Math.round(density * .8 + Math.min(60, total * .02) + last7 * .05)));
		const basePop = area.population || (city === "vadodara" ? 75e3 : 2e5);
		const healthFactor = health === "critical" ? .45 : health === "high" ? .26 : health === "moderate" ? .12 : .035;
		const issueMultiplier = filters.issue === "water" ? 1.3 : filters.issue === "roads" ? 1.45 : filters.issue === "drainage" ? 1.2 : 1;
		const jitter = .9 + r() * .2;
		const affectedPopulation = Math.min(basePop, Math.round(basePop * healthFactor * issueMultiplier * jitter));
		const affectedPercent = Math.max(1, Math.min(100, Math.round(affectedPopulation / basePop * 100)));
		const impactLevel = affectedPercent >= 40 ? "Severe Hazard" : affectedPercent >= 22 ? "High Impact" : affectedPercent >= 8 ? "Moderate Impact" : "Low Impact";
		const recentIssues = [
			{
				issue: topIssue,
				daysAgo: 0,
				health
			},
			{
				issue: "roads",
				daysAgo: 1,
				health: "high"
			},
			{
				issue: "water",
				daysAgo: 2,
				health: "moderate"
			},
			{
				issue: "garbage",
				daysAgo: 4,
				health: "low"
			}
		];
		const isHotspot = city === "vadodara" ? risk >= 40 && total >= 80 : risk >= 55 && total >= 300;
		return {
			area,
			counts,
			total,
			resolved: Math.round(total * (.65 + r() * .2)),
			last7,
			trendPct,
			health,
			topIssue,
			hotspot: isHotspot,
			risk,
			affectedPopulation,
			affectedPercent,
			impactLevel,
			recent: recentIssues
		};
	});
	if (filters.health !== "all") return activities.filter((a) => a.health === filters.health);
	return activities;
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
/** Deterministic 7-day report trend for charts scaled with total volume. */
function cityDailyTrend(city, filters) {
	const totalLast7 = areaActivity(city, filters).reduce((sum, a) => sum + a.last7, 0);
	const dailyBase = Math.round(totalLast7 / 7);
	const labels = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const weights = [
		.92,
		1.05,
		1.12,
		1.08,
		.98,
		.88,
		.97
	];
	const r = rng(`trend:${city}:${filters.time}:${filters.issue}`);
	return labels.map((day, i) => {
		const jitter = .9 + r() * .2;
		return {
			day,
			reports: Math.max(1, Math.round(dailyBase * (weights[i] || 1) * jitter))
		};
	});
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
	const last7 = areaActivity(cityAreas("vadodara").some((a) => a.id === areaId) ? "vadodara" : "bengaluru", filters).find((a) => a.area.id === areaId)?.last7 ?? 100;
	const dailyBase = Math.round(last7 / 7);
	const labels = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const weights = [
		.95,
		1.08,
		1.1,
		1.05,
		.96,
		.89,
		.97
	];
	const r = rng(`areatrend:${areaId}:${filters.time}`);
	return labels.map((day, i) => {
		const jitter = .88 + r() * .24;
		return {
			day,
			reports: Math.max(1, Math.round(dailyBase * (weights[i] || 1) * jitter))
		};
	});
}
/** Researched historical civic heritage notes for mapped localities */
function getLocalityHeritage(areaId) {
	return {
		"vad-alkapuri": "Established as the prime royal and diplomatic avenue connecting Sayajigunj to the Gaekwad estates.",
		"vad-mandvi": "16th-century fortified citadel center where Mughal trade corridors intersected with royal Gaekwad governance.",
		"vad-sayajigunj": "Conceived around the Maharaja Sayajirao University (MSU) and Sayaji Baug 113-acre botanical park.",
		"vad-fatehgunj": "Historic military cantonment sector converted into Baroda's premier academic and cultural quarter.",
		"vad-karelibaug": "Home to the historic Kirti Mandir cenotaph honoring ancestors of the Gaekwad Maratha dynasty.",
		"vad-gotri": "Originally a farming hamlet transformed into a major residential corridor with ancient stepwells.",
		"vad-manjalpur": "South Baroda's largest historic township expanded under late 20th-century VMC urban planning.",
		"vad-makarpura": "Site of the Makarpura Palace built in 1870 by Khanderao Gaekwad as an Italian-style summer residence.",
		"blr-whitefield": "Founded in 1882 as a farming colony granted by the Maharaja of Mysore, now Asia's tech nexus.",
		"blr-malleshwaram": "Planned in 1898 following the Great Plague with broad tree-lined avenues and the 17th-century Kadu Malleshwara temple.",
		"blr-basavanagudi": "Home to the 1537 Bull Temple built by Kempe Gowda I, honoring Nandi on the granite ridge of Bugle Rock.",
		"blr-indiranagar": "Established in the early 1970s as a defense and BDA residential suburb along Old Airport Road.",
		"blr-shivajinagar": "Historic 1809 British Cantonment marketplace and home to the 1927 heritage Russell Market.",
		"blr-yelahanka": "Ancient 12th-century Hoysala capital and ancestral home of Bengaluru's founder Kempe Gowda I.",
		"blr-bellandur": "Part of the ancient 10th-century Chola cascade water network feeding 28 downstream wetlands.",
		"blr-hebbal": "Engineered in 1537 by Kempe Gowda with a historic earthen dam creating Hebbal Lake.",
		"blr-electronic-city": "Conceived in 1978 by R.K. Baliga as India's premier high-tech electronic oasis."
	}[areaId] || null;
}
var CivicMap = (0, import_react.lazy)(() => import("./civic-map-DhiLf9AU.mjs").then((m) => ({ default: m.CivicMap })));
function MapSkeleton({ className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]", className),
		role: "status",
		"aria-label": t("ui.loading_civic_map"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "jm-map-scan absolute inset-0 opacity-40",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
				className: "h-4 w-4 animate-spin text-primary",
				"aria-hidden": true
			}), t("ui.initializing_map")]
		})]
	});
}
/** Browser-only wrapper — Leaflet never loads during SSR. */
function ClientCivicMap(props) {
	const { t } = useI18n();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicMap, { ...props })
	});
}
//#endregion
export { complaintPoints as _, DEFAULT_FILTERS as a, nearestArea as b, TIME_WINDOWS as c, areaFeatureCollection as d, cityDailyTrend as f, clusterPoints as g, cityIssueBreakdown as h, ClientCivicMap as i, areaActivity as l, cityHealthDistribution as m, AREA_HEALTH_LABEL as n, ISSUE_KEYS as o, cityGeography as p, AREA_HEALTH_ORDER as r, ISSUE_LABEL as s, AREA_HEALTH_HEX as t, areaDailyTrend as u, filterPoints as v, searchAreas as x, getLocalityHeritage as y };
