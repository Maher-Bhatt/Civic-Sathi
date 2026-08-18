import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { A as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/i18n-C5F9ZnHa.js
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
var GEOGRAPHY = {
	vadodara: VADODARA,
	bengaluru: {
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
	}
};
var cityAreas = (city) => GEOGRAPHY[city].areas;
var RELATED_SAMPLES = [
	"No water supply since Monday.",
	"Water has stopped in our neighborhood.",
	"Our taps have been dry for three days.",
	"No municipal water reaching our apartment.",
	"Pothole on main road after rain.",
	"Garbage not collected for a week.",
	"Sewage overflow on street corner.",
	"Streetlights not working in sector B."
];
var DEMO_OFFICER = {
	id: "off_001",
	name: "Priya Sharma",
	email: "priya.sharma@vmc.gov.in",
	department: "Municipal Water",
	role: "Officer",
	city: "vadodara",
	lastActive: (/* @__PURE__ */ new Date()).toISOString()
};
var now = Date.now();
var SEED_SYSTEMIC_ISSUES = [
	{
		id: "sys_water_vad_14",
		category: "Water Supply",
		areaId: "vad-sarvodaya",
		areaName: "Sarvodaya Nagar",
		ward: "Ward 14",
		city: "vadodara",
		complaintCount: 127,
		riskScore: 91,
		trendPct: 38,
		dominantIssue: "Water Supply",
		possibleCause: "Localized infrastructure-related issue suspected.",
		causeConfidence: 91,
		recommendedActions: [
			"Inspect affected infrastructure",
			"Verify water pressure",
			"Dispatch maintenance team",
			"Monitor complaints for 24 hours"
		],
		whyFlagged: "127 reports are concentrated in this area, share strong semantic similarity, and have increased during the current monitoring period.",
		evidence: [
			{
				label: "Complaint Volume",
				value: "127 reports",
				detail: "94th percentile for this ward in the last 30 days"
			},
			{
				label: "Geographic Concentration",
				value: "89% within 520m",
				detail: "Reports cluster in a tight geographic band"
			},
			{
				label: "Semantic Similarity",
				value: "91% match",
				detail: "Complaints describe similar water supply failures"
			},
			{
				label: "Recent Growth",
				value: "+38% this week",
				detail: "Accelerating trend over 7-day window"
			}
		],
		riskFactors: {
			complaintVolume: 94,
			geographicConcentration: 89,
			semanticSimilarity: 91,
			recentGrowth: 88,
			severity: 85,
			overall: 91
		},
		status: "Emerging",
		relatedComplaintIds: [
			"JN-2026-00127",
			"JN-2026-00128",
			"JN-2026-00129"
		],
		createdAt: (/* @__PURE__ */ new Date(now - 1728e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 9e5)).toISOString()
	},
	{
		id: "sys_road_vad_9",
		category: "Road Damage",
		areaId: "vad-alkapuri",
		areaName: "Alkapuri",
		ward: "Ward 9",
		city: "vadodara",
		complaintCount: 83,
		riskScore: 76,
		trendPct: 12,
		dominantIssue: "Road Damage",
		possibleCause: "Repeated surface deterioration pattern detected in high-traffic corridor.",
		causeConfidence: 78,
		recommendedActions: [
			"Schedule road inspection",
			"Assess traffic load impact",
			"Plan resurfacing intervention"
		],
		whyFlagged: "83 reports share location proximity and describe pothole-related damage with increasing frequency.",
		evidence: [
			{
				label: "Complaint Volume",
				value: "83 reports",
				detail: "Above ward average"
			},
			{
				label: "Geographic Concentration",
				value: "72%",
				detail: "Along main arterial road"
			},
			{
				label: "Semantic Similarity",
				value: "84%",
				detail: "Pothole and surface damage language"
			},
			{
				label: "Recent Growth",
				value: "+12%",
				detail: "Steady increase over 14 days"
			}
		],
		riskFactors: {
			complaintVolume: 78,
			geographicConcentration: 72,
			semanticSimilarity: 84,
			recentGrowth: 65,
			severity: 70,
			overall: 76
		},
		status: "Investigating",
		department: "Public Works",
		relatedComplaintIds: ["JN-2026-00094"],
		createdAt: (/* @__PURE__ */ new Date(now - 2592e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 72e5)).toISOString()
	},
	{
		id: "sys_garbage_vad_6",
		category: "Garbage Collection",
		areaId: "vad-karelibaug",
		areaName: "Karelibaug",
		ward: "Ward 6",
		city: "vadodara",
		complaintCount: 61,
		riskScore: 64,
		trendPct: 4,
		dominantIssue: "Garbage Collection",
		possibleCause: "Collection schedule disruption suspected in residential lanes.",
		causeConfidence: 72,
		recommendedActions: [
			"Verify collection route adherence",
			"Deploy additional pickup crew",
			"Notify residents of schedule"
		],
		whyFlagged: "61 reports indicate missed collection cycles with moderate geographic spread.",
		evidence: [
			{
				label: "Complaint Volume",
				value: "61 reports",
				detail: "Moderate for ward size"
			},
			{
				label: "Geographic Concentration",
				value: "58%",
				detail: "Spread across 3 lanes"
			},
			{
				label: "Semantic Similarity",
				value: "79%",
				detail: "Missed pickup descriptions"
			},
			{
				label: "Recent Growth",
				value: "+4%",
				detail: "Stable with slight uptick"
			}
		],
		riskFactors: {
			complaintVolume: 62,
			geographicConcentration: 58,
			semanticSimilarity: 79,
			recentGrowth: 45,
			severity: 55,
			overall: 64
		},
		status: "Assigned",
		department: "Sanitation",
		relatedComplaintIds: ["JN-2026-00061"],
		createdAt: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 288e5)).toISOString()
	},
	{
		id: "sys_drain_vad_11",
		category: "Drainage",
		areaId: "vad-manjalpur",
		areaName: "Manjalpur",
		ward: "Ward 11",
		city: "vadodara",
		complaintCount: 54,
		riskScore: 71,
		trendPct: 31,
		dominantIssue: "Drainage",
		possibleCause: "Blockage pattern in storm drain network suspected.",
		causeConfidence: 80,
		recommendedActions: [
			"Inspect storm drains",
			"Clear blockages",
			"Monitor waterlogging after rain"
		],
		whyFlagged: "54 reports with +31% growth, concentrated near low-lying intersections.",
		evidence: [
			{
				label: "Complaint Volume",
				value: "54 reports",
				detail: "Rising quickly"
			},
			{
				label: "Geographic Concentration",
				value: "81%",
				detail: "Low-lying intersections"
			},
			{
				label: "Semantic Similarity",
				value: "86%",
				detail: "Waterlogging descriptions"
			},
			{
				label: "Recent Growth",
				value: "+31%",
				detail: "Post-monsoon spike"
			}
		],
		riskFactors: {
			complaintVolume: 70,
			geographicConcentration: 81,
			semanticSimilarity: 86,
			recentGrowth: 82,
			severity: 68,
			overall: 71
		},
		status: "Emerging",
		relatedComplaintIds: [],
		createdAt: (/* @__PURE__ */ new Date(now - 1296e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 27e5)).toISOString()
	},
	{
		id: "sys_light_vad_3",
		category: "Street Lighting",
		areaId: "vad-gotri",
		areaName: "Gotri",
		ward: "Ward 3",
		city: "vadodara",
		complaintCount: 38,
		riskScore: 52,
		trendPct: -3,
		dominantIssue: "Street Lighting",
		possibleCause: "Multiple non-functional street lights in residential sector.",
		causeConfidence: 68,
		recommendedActions: [
			"Survey street light inventory",
			"Replace faulty units",
			"Test circuit"
		],
		whyFlagged: "38 reports describe dark streets with moderate clustering.",
		evidence: [
			{
				label: "Complaint Volume",
				value: "38 reports",
				detail: "Below critical threshold"
			},
			{
				label: "Geographic Concentration",
				value: "65%",
				detail: "Residential sector B"
			},
			{
				label: "Semantic Similarity",
				value: "77%",
				detail: "Non-functional light descriptions"
			},
			{
				label: "Recent Growth",
				value: "-3%",
				detail: "Slight decrease"
			}
		],
		riskFactors: {
			complaintVolume: 48,
			geographicConcentration: 65,
			semanticSimilarity: 77,
			recentGrowth: 35,
			severity: 42,
			overall: 52
		},
		status: "Monitoring",
		relatedComplaintIds: [],
		createdAt: (/* @__PURE__ */ new Date(now - 432e6)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 864e5)).toISOString()
	}
];
function generateComplaints(city) {
	const areas = cityAreas(city);
	const categories = [
		"Water Supply",
		"Road Damage",
		"Garbage Collection",
		"Drainage",
		"Street Lighting",
		"Electricity",
		"Sanitation"
	];
	const severities = [
		"Low",
		"Moderate",
		"High",
		"Critical"
	];
	const statuses = [
		"Received",
		"Under Review",
		"Assigned",
		"In Progress",
		"Resolved",
		"Closed"
	];
	const complaints = [];
	for (let i = 0; i < 80; i++) {
		const area = areas[i % areas.length];
		const cat = categories[i % categories.length];
		const sev = severities[i % severities.length];
		const status = statuses[i % statuses.length];
		const dept = cat === "Water Supply" ? "Municipal Water" : cat === "Road Damage" ? "Public Works" : cat === "Garbage Collection" || cat === "Sanitation" ? "Sanitation" : cat === "Drainage" ? "Drainage" : cat === "Electricity" || cat === "Street Lighting" ? "Electrical" : "Transport";
		complaints.push({
			id: `JN-2026-${String(i + 1).padStart(5, "0")}`,
			description: RELATED_SAMPLES[i % RELATED_SAMPLES.length] ?? `Civic issue report #${i + 1}`,
			category: cat,
			severity: sev,
			area: area.name,
			ward: area.admin.division ?? "Ward —",
			city,
			department: dept,
			status,
			lat: area.center[0] + (Math.random() - .5) * .008,
			lng: area.center[1] + (Math.random() - .5) * .008,
			createdAt: (/* @__PURE__ */ new Date(now - 36e5 * (i * 3 + 1))).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date(now - 18e5 * i)).toISOString(),
			...i < 5 ? { clusterId: "sys_water_vad_14" } : {},
			...i < 5 ? { similarity: 92 - i * 2 } : {},
			aiAnalysis: {
				category: cat,
				severity: sev,
				sentiment: sev === "Critical" ? "Urgent" : "Negative",
				similarity: 75 + i % 20,
				...i < 5 ? { cluster: "Water Supply cluster — Sarvodaya Nagar" } : {}
			},
			timeline: [
				{
					label: "Received",
					at: (/* @__PURE__ */ new Date(now - 36e5 * (i * 3 + 1))).toISOString()
				},
				{
					label: "AI classification complete",
					at: (/* @__PURE__ */ new Date(now - 36e5 * (i * 3 + 1) + 12e4)).toISOString()
				},
				...status !== "Received" ? [{
					label: "Assigned",
					at: (/* @__PURE__ */ new Date(now - 36e5 * i)).toISOString(),
					actor: dept
				}] : [],
				...status === "In Progress" || status === "Resolved" || status === "Closed" ? [{
					label: "In Progress",
					at: (/* @__PURE__ */ new Date(now - 18e5 * i)).toISOString()
				}] : [],
				...status === "Resolved" || status === "Closed" ? [{
					label: "Resolved",
					at: (/* @__PURE__ */ new Date(now - 9e5 * i)).toISOString()
				}] : []
			]
		});
	}
	return complaints;
}
[...generateComplaints("vadodara"), ...generateComplaints("bengaluru").map((c, i) => ({
	...c,
	id: `JN-2026-B${String(i + 1).padStart(4, "0")}`
}))];
SEED_SYSTEMIC_ISSUES.filter((s) => s.riskScore >= 40).map((s, i) => ({
	id: `alert_${s.id}`,
	priority: s.riskScore >= 85 ? "Critical" : s.riskScore >= 70 ? "High" : "Moderate",
	category: s.category,
	area: s.areaName,
	ward: s.ward,
	city: s.city,
	complaintCount: s.complaintCount,
	riskScore: s.riskScore,
	trendPct: s.trendPct,
	issueId: s.id,
	acknowledged: i > 1,
	createdAt: s.updatedAt
}));
(/* @__PURE__ */ new Date(now - 3e5)).toISOString(), (/* @__PURE__ */ new Date(now - 27e5)).toISOString(), (/* @__PURE__ */ new Date(now - 72e5)).toISOString(), (/* @__PURE__ */ new Date(now - 18e6)).toISOString(), (/* @__PURE__ */ new Date(now - 288e5)).toISOString();
(/* @__PURE__ */ new Date(now - 3e4)).toISOString(), (/* @__PURE__ */ new Date(now - 12e4)).toISOString(), (/* @__PURE__ */ new Date(now - 48e4)).toISOString(), (/* @__PURE__ */ new Date(now - 9e5)).toISOString();
SEED_SYSTEMIC_ISSUES.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 8).map((s, i) => ({
	rank: i + 1,
	category: s.category,
	area: s.areaName,
	reports: s.complaintCount,
	risk: s.riskScore,
	trend: s.trendPct,
	issueId: s.id
}));
(/* @__PURE__ */ new Date(now - 7776e6)).toISOString(), (/* @__PURE__ */ new Date()).toISOString();
var SEED_CONTRACTORS = [
	{
		id: "CTR-001",
		companyName: "Bharat Infrastructure Pvt Ltd",
		registrationNumber: "GJ-REG-2018-00847",
		contactPerson: "Suresh Patel",
		email: "suresh.patel@bharatinfra.in",
		phone: "+91 98250 11234",
		address: "Plot 14, GIDC Makarpura, Vadodara, Gujarat 390010",
		gstin: "24AABCB1234F1Z5",
		pan: "AABCB1234F",
		status: "VERIFIED",
		verificationStatus: "VERIFIED",
		registrationDate: (/* @__PURE__ */ new Date(now - 94608e6)).toISOString(),
		expiryDate: new Date(now + 63072e6).toISOString(),
		specializationCategories: [
			"Road Damage",
			"General Civil",
			"Drainage"
		],
		serviceAreas: ["vadodara", "bengaluru"],
		performanceScore: 94,
		slaScore: 96,
		inspectionPassRate: 91,
		onTimeCompletionRate: 94,
		reworkRate: 7,
		rating: 4.6,
		activeWorkCount: 2,
		totalCompleted: 47,
		createdAt: (/* @__PURE__ */ new Date(now - 94608e6)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 1728e5)).toISOString()
	},
	{
		id: "CTR-002",
		companyName: "Sigma Civil Works",
		registrationNumber: "GJ-REG-2020-01293",
		contactPerson: "Ramesh Joshi",
		email: "ramesh@sigmacivil.co.in",
		phone: "+91 99099 55678",
		address: "12-A Industrial Area, Waghodia, Vadodara, Gujarat 391760",
		gstin: "24BBBCS9876G1Z2",
		pan: "BBBCS9876G",
		status: "VERIFIED",
		verificationStatus: "VERIFIED",
		registrationDate: (/* @__PURE__ */ new Date(now - 47304e6)).toISOString(),
		expiryDate: new Date(now + 31536e6).toISOString(),
		specializationCategories: [
			"Water Supply",
			"Drainage",
			"Sewage"
		],
		serviceAreas: ["vadodara"],
		performanceScore: 78,
		slaScore: 74,
		inspectionPassRate: 82,
		onTimeCompletionRate: 76,
		reworkRate: 16,
		rating: 3.9,
		activeWorkCount: 5,
		totalCompleted: 23,
		createdAt: (/* @__PURE__ */ new Date(now - 47304e6)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 432e6)).toISOString()
	},
	{
		id: "CTR-003",
		companyName: "Pioneer Constructions",
		registrationNumber: "GJ-REG-2022-02141",
		contactPerson: "Manish Shah",
		email: "manish@pioneerconstructions.in",
		phone: "+91 95101 77890",
		address: "56 New VIP Road, Baroda City, Gujarat 390021",
		gstin: "24CCCP2345H1Z8",
		pan: "CCCP2345H",
		status: "VERIFIED",
		verificationStatus: "VERIFIED",
		registrationDate: (/* @__PURE__ */ new Date(now - 252288e5)).toISOString(),
		expiryDate: new Date(now + 15552e6).toISOString(),
		specializationCategories: [
			"Garbage Collection",
			"Sanitation",
			"General Civil"
		],
		serviceAreas: ["vadodara"],
		performanceScore: 61,
		slaScore: 65,
		inspectionPassRate: 71,
		onTimeCompletionRate: 68,
		reworkRate: 24,
		rating: 3.4,
		activeWorkCount: 1,
		totalCompleted: 8,
		createdAt: (/* @__PURE__ */ new Date(now - 252288e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 6912e5)).toISOString()
	},
	{
		id: "CTR-004",
		companyName: "Apex Road Solutions Pvt Ltd",
		registrationNumber: "KA-REG-2019-03389",
		contactPerson: "Arjun Nair",
		email: "arjun@apexroads.in",
		phone: "+91 98448 23456",
		address: "48 Industrial Layout, Peenya Phase 1, Bengaluru, Karnataka 560058",
		gstin: "29AAAPA7890I1Z1",
		pan: "AAAPA7890I",
		status: "VERIFIED",
		verificationStatus: "VERIFIED",
		registrationDate: (/* @__PURE__ */ new Date(now - 7884e7)).toISOString(),
		expiryDate: new Date(now + 47304e6).toISOString(),
		specializationCategories: ["Road Damage", "General Civil"],
		serviceAreas: ["bengaluru"],
		performanceScore: 88,
		slaScore: 90,
		inspectionPassRate: 88,
		onTimeCompletionRate: 91,
		reworkRate: 9,
		rating: 4.4,
		activeWorkCount: 3,
		totalCompleted: 34,
		createdAt: (/* @__PURE__ */ new Date(now - 7884e7)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 2592e5)).toISOString()
	},
	{
		id: "CTR-005",
		companyName: "NovaTech Utilities",
		registrationNumber: "GJ-REG-2023-04567",
		contactPerson: "Priti Mehta",
		email: "priti@novatech-util.com",
		phone: "+91 97270 34567",
		address: "Unit 7, Synergy Business Park, Vadodara, Gujarat 390009",
		gstin: "24BBBCN5678J1Z3",
		pan: "BBBCN5678J",
		status: "PENDING_VERIFICATION",
		verificationStatus: "PENDING",
		registrationDate: (/* @__PURE__ */ new Date(now - 2592e6)).toISOString(),
		expiryDate: new Date(now + 28944e6).toISOString(),
		specializationCategories: ["Street Lighting", "Electricity"],
		serviceAreas: ["vadodara"],
		performanceScore: 0,
		slaScore: 0,
		inspectionPassRate: 0,
		onTimeCompletionRate: 0,
		reworkRate: 0,
		rating: 0,
		activeWorkCount: 0,
		totalCompleted: 0,
		createdAt: (/* @__PURE__ */ new Date(now - 2592e6)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 2592e6)).toISOString()
	}
];
var SEED_CONTRACTOR_DOCUMENTS = [
	{
		id: "doc_001",
		contractorId: "CTR-001",
		documentType: "Registration Certificate",
		documentName: "Company Registration — Bharat Infrastructure",
		fileUrl: "/documents/ctr001_reg.pdf",
		status: "VERIFIED",
		uploadedAt: (/* @__PURE__ */ new Date(now - 94608e6)).toISOString(),
		verifiedAt: (/* @__PURE__ */ new Date(now - 94608e6 + 864e5)).toISOString(),
		verifiedBy: "admin_001"
	},
	{
		id: "doc_002",
		contractorId: "CTR-001",
		documentType: "GST Certificate",
		documentName: "GST Registration — Bharat Infrastructure",
		fileUrl: "/documents/ctr001_gst.pdf",
		status: "VERIFIED",
		uploadedAt: (/* @__PURE__ */ new Date(now - 94608e6)).toISOString(),
		verifiedAt: (/* @__PURE__ */ new Date(now - 94608e6 + 864e5)).toISOString(),
		verifiedBy: "admin_001",
		expiryDate: new Date(now + 63072e6).toISOString()
	},
	{
		id: "doc_003",
		contractorId: "CTR-001",
		documentType: "Experience Certificate",
		documentName: "Road Construction Experience — 3 Years",
		fileUrl: "/documents/ctr001_exp.pdf",
		status: "VERIFIED",
		uploadedAt: (/* @__PURE__ */ new Date(now - 63072e6)).toISOString(),
		verifiedAt: (/* @__PURE__ */ new Date(now - 63072e6 + 1728e5)).toISOString(),
		verifiedBy: "admin_001"
	},
	{
		id: "doc_004",
		contractorId: "CTR-005",
		documentType: "Registration Certificate",
		documentName: "Company Registration — NovaTech Utilities",
		fileUrl: "/documents/ctr005_reg.pdf",
		status: "PENDING",
		uploadedAt: (/* @__PURE__ */ new Date(now - 216e7)).toISOString()
	},
	{
		id: "doc_005",
		contractorId: "CTR-005",
		documentType: "GST Certificate",
		documentName: "GST Registration — NovaTech Utilities",
		fileUrl: "/documents/ctr005_gst.pdf",
		status: "PENDING",
		uploadedAt: (/* @__PURE__ */ new Date(now - 216e7)).toISOString()
	}
];
var SEED_WORK_PACKAGES = [
	{
		id: "WP-2026-00001",
		title: "Road Repair — Ward 14, Sarvodaya Nagar",
		description: "Pothole patching and road resurfacing on the stretch between Sarvodaya Nagar main road and the school junction. Multiple complaints indicate surface failure over a 400m stretch.",
		category: "Road Damage",
		department: "Public Works",
		cityId: "vadodara",
		ward: "Ward 14",
		area: "Sarvodaya Nagar",
		lat: 22.3072,
		lng: 73.1812,
		relatedComplaintIds: [
			"JN-2026-00094",
			"JN-2026-00095",
			"JN-2026-00096",
			"JN-2026-00097"
		],
		estimatedCost: 85e4,
		priority: "High",
		scope: "1. Pothole patching (approx. 40 potholes, avg depth 8cm)\n2. Surface milling and relaying for 400m × 7m carriageway\n3. Edge repair and kerb restoration\n4. Road marking reinstatement",
		status: "IN_EXECUTION",
		workOrderId: "WO-2026-00001",
		createdBy: "off_001",
		createdAt: (/* @__PURE__ */ new Date(now - 432e6)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString()
	},
	{
		id: "WP-2026-00002",
		title: "Drainage Clearance — Ward 11, Manjalpur",
		description: "Storm drain network inspection and clearance in Manjalpur area. 54 complaints of waterlogging indicate systemic blockage.",
		category: "Drainage",
		department: "Drainage",
		cityId: "vadodara",
		ward: "Ward 11",
		area: "Manjalpur",
		lat: 22.2793,
		lng: 73.1932,
		relatedComplaintIds: [],
		relatedSystemicIssueId: "sys_drain_vad_11",
		estimatedCost: 32e4,
		priority: "High",
		scope: "1. CCTV inspection of 600m drain network\n2. Manual desilting and clearance\n3. Manhole covers inspection and replacement\n4. Junction chamber cleaning",
		status: "CONTRACTOR_SELECTION",
		createdBy: "off_001",
		createdAt: (/* @__PURE__ */ new Date(now - 1728e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 1728e5)).toISOString()
	},
	{
		id: "WP-2026-00003",
		title: "Garbage Collection Route Restoration — Ward 6",
		description: "Resumption and regularization of garbage collection schedule in Karelibaug.",
		category: "Garbage Collection",
		department: "Sanitation",
		cityId: "vadodara",
		ward: "Ward 6",
		area: "Karelibaug",
		lat: 22.3262,
		lng: 73.1994,
		relatedComplaintIds: ["JN-2026-00061"],
		estimatedCost: 18e4,
		priority: "Moderate",
		scope: "1. Additional pickup vehicle deployment for 30 days\n2. Route optimization\n3. Resident communication",
		status: "OPEN",
		createdBy: "off_001",
		createdAt: (/* @__PURE__ */ new Date(now - 864e5)).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date(now - 864e5)).toISOString()
	}
];
var SEED_WORK_ORDERS = [{
	id: "WO-2026-00001",
	workPackageId: "WP-2026-00001",
	contractorId: "CTR-001",
	contractorName: "Bharat Infrastructure Pvt Ltd",
	assignedEngineerId: "off_001",
	assignedEngineerName: "Priya Sharma",
	departmentId: "dept_works",
	department: "Public Works",
	title: "Road Repair — Ward 14, Sarvodaya Nagar (WO)",
	description: "Pothole patching and road resurfacing — 400m stretch, Ward 14. Reference Work Package WP-2026-00001.",
	cityId: "vadodara",
	ward: "Ward 14",
	area: "Sarvodaya Nagar",
	lat: 22.3072,
	lng: 73.1812,
	priority: "High",
	estimatedCost: 85e4,
	approvedAmount: 82e4,
	startDate: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString(),
	expectedCompletionDate: new Date(now + 864e6).toISOString(),
	actualStartDate: (/* @__PURE__ */ new Date(now - 2592e5)).toISOString(),
	slaDeadline: new Date(now + 12096e5).toISOString(),
	status: "IN_PROGRESS",
	boqItems: [
		{
			id: "boq_1",
			description: "Pothole patching with bituminous macadam",
			unit: "sqm",
			quantity: 280,
			unitRate: 1200,
			amount: 336e3
		},
		{
			id: "boq_2",
			description: "Road milling and surface relaying",
			unit: "sqm",
			quantity: 2800,
			unitRate: 180,
			amount: 504e3
		},
		{
			id: "boq_3",
			description: "Road marking reinstatement",
			unit: "m",
			quantity: 400,
			unitRate: 100,
			amount: 4e4
		}
	],
	terms: "Work to be completed within 14 days of acceptance. Daily progress reports required. Inspection by municipal engineer prior to payment.",
	relatedComplaintIds: [
		"JN-2026-00094",
		"JN-2026-00095",
		"JN-2026-00096",
		"JN-2026-00097"
	],
	createdBy: "off_001",
	approvedBy: "off_001",
	createdAt: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date(now - 864e5)).toISOString()
}];
var SEED_WORK_ORDER_EVENTS = [
	{
		id: "evt_001",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		toStatus: "DRAFT",
		title: "Work Order Created",
		description: "Work order created and assigned to Bharat Infrastructure Pvt Ltd.",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		at: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString()
	},
	{
		id: "evt_002",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		fromStatus: "DRAFT",
		toStatus: "APPROVED",
		title: "Work Order Approved",
		description: "Work order reviewed and approved. Approved amount: ₹8,20,000.",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "supervisor",
		metadata: { approvedAmount: 82e4 },
		at: (/* @__PURE__ */ new Date(now - 3456e5 + 18e5)).toISOString()
	},
	{
		id: "evt_003",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		fromStatus: "APPROVED",
		toStatus: "PENDING_ACCEPTANCE",
		title: "Sent to Contractor for Acceptance",
		description: "Work order dispatched to Bharat Infrastructure Pvt Ltd for review and acceptance.",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		at: (/* @__PURE__ */ new Date(now - 3456e5 + 36e5)).toISOString()
	},
	{
		id: "evt_004",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		fromStatus: "PENDING_ACCEPTANCE",
		toStatus: "ACCEPTED",
		title: "Work Order Accepted",
		description: "Bharat Infrastructure Pvt Ltd has accepted the work order.",
		actorId: "CTR-001",
		actorName: "Suresh Patel",
		actorRole: "contractor",
		at: (/* @__PURE__ */ new Date(now - 3024e5)).toISOString()
	},
	{
		id: "evt_005",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		fromStatus: "ACCEPTED",
		toStatus: "MOBILIZATION",
		title: "Mobilization Started",
		description: "Equipment and material mobilization begun at site.",
		actorId: "CTR-001",
		actorName: "Suresh Patel",
		actorRole: "contractor",
		gpsLat: 22.3075,
		gpsLng: 73.1815,
		at: (/* @__PURE__ */ new Date(now - 2592e5)).toISOString()
	},
	{
		id: "evt_006",
		workOrderId: "WO-2026-00001",
		eventType: "STATUS_CHANGE",
		fromStatus: "MOBILIZATION",
		toStatus: "IN_PROGRESS",
		title: "Work Started",
		description: "Pothole patching work commenced on Sarvodaya Nagar main road.",
		actorId: "CTR-001",
		actorName: "Suresh Patel",
		actorRole: "contractor",
		gpsLat: 22.3072,
		gpsLng: 73.1812,
		at: (/* @__PURE__ */ new Date(now - 2592e5 + 72e5)).toISOString()
	},
	{
		id: "evt_007",
		workOrderId: "WO-2026-00001",
		eventType: "PROGRESS_UPDATE",
		title: "Progress Update: 35% complete",
		description: "Pothole patching 60% done. Road milling starting tomorrow.",
		actorId: "CTR-001",
		actorName: "Suresh Patel",
		actorRole: "contractor",
		metadata: { percentComplete: 35 },
		gpsLat: 22.3072,
		gpsLng: 73.1812,
		at: (/* @__PURE__ */ new Date(now - 864e5)).toISOString()
	}
];
var SEED_INSPECTIONS = [];
var SEED_MEASUREMENTS = [];
var SEED_BILLS = [];
var SEED_FIELD_PROGRESS = [{
	id: "fp_001",
	workOrderId: "WO-2026-00001",
	progressType: "START",
	percentComplete: 0,
	description: "Work commenced at site. Equipment mobilized. Team of 12 workers deployed.",
	photoUrls: [],
	gpsLat: 22.3072,
	gpsLng: 73.1812,
	submittedBy: "Suresh Patel",
	submittedAt: (/* @__PURE__ */ new Date(now - 2592e5 + 72e5)).toISOString()
}, {
	id: "fp_002",
	workOrderId: "WO-2026-00001",
	progressType: "PROGRESS",
	percentComplete: 35,
	description: "Pothole patching complete on 60% of affected stretch. Road milling equipment arriving tomorrow.",
	photoUrls: [],
	gpsLat: 22.3072,
	gpsLng: 73.1812,
	materialUsed: "Bituminous Macadam Mix: 4.2 MT used",
	submittedBy: "Suresh Patel",
	submittedAt: (/* @__PURE__ */ new Date(now - 864e5)).toISOString()
}];
var SEED_AUDIT_LOGS = [
	{
		id: "audit_001",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		action: "COMPLAINT_ASSIGNED",
		entityType: "complaint",
		entityId: "JN-2026-00094",
		entityLabel: "JN-2026-00094 — Road Damage",
		previousValue: "Received",
		newValue: "Assigned — Public Works",
		at: (/* @__PURE__ */ new Date(now - 5184e5)).toISOString()
	},
	{
		id: "audit_002",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		action: "WORK_PACKAGE_CREATED",
		entityType: "work_package",
		entityId: "WP-2026-00001",
		entityLabel: "WP-2026-00001 — Road Repair Ward 14",
		at: (/* @__PURE__ */ new Date(now - 432e6)).toISOString()
	},
	{
		id: "audit_003",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		action: "CONTRACTOR_SELECTED",
		entityType: "work_order",
		entityId: "WO-2026-00001",
		entityLabel: "WO-2026-00001",
		newValue: "Bharat Infrastructure Pvt Ltd",
		at: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString()
	},
	{
		id: "audit_004",
		actorId: "off_001",
		actorName: "Priya Sharma",
		actorRole: "officer",
		action: "WORK_ORDER_CREATED",
		entityType: "work_order",
		entityId: "WO-2026-00001",
		entityLabel: "WO-2026-00001 — Road Repair Ward 14",
		at: (/* @__PURE__ */ new Date(now - 3456e5)).toISOString()
	},
	{
		id: "audit_005",
		actorId: "admin_001",
		actorName: "Kavya Reddy",
		actorRole: "admin",
		action: "CONTRACTOR_VERIFIED",
		entityType: "contractor",
		entityId: "CTR-001",
		entityLabel: "Bharat Infrastructure Pvt Ltd",
		at: (/* @__PURE__ */ new Date(now - 94608e6 + 864e5)).toISOString()
	},
	{
		id: "audit_006",
		actorId: "admin_001",
		actorName: "Kavya Reddy",
		actorRole: "admin",
		action: "SLA_RULE_CHANGED",
		entityType: "sla",
		entityId: "sla_road_high",
		entityLabel: "Road Damage / High",
		previousValue: "72 hours",
		newValue: "48 hours",
		at: (/* @__PURE__ */ new Date(now - 1296e6)).toISOString()
	}
];
var SEED_SLA_RULES = [
	{
		id: "sla_water_critical",
		category: "Water Supply",
		severity: "Critical",
		responseHours: 4,
		resolutionHours: 24,
		escalationHours: 12,
		active: true
	},
	{
		id: "sla_water_high",
		category: "Water Supply",
		severity: "High",
		responseHours: 8,
		resolutionHours: 48,
		escalationHours: 24,
		active: true
	},
	{
		id: "sla_water_moderate",
		category: "Water Supply",
		severity: "Moderate",
		responseHours: 24,
		resolutionHours: 72,
		escalationHours: 48,
		active: true
	},
	{
		id: "sla_water_low",
		category: "Water Supply",
		severity: "Low",
		responseHours: 48,
		resolutionHours: 120,
		escalationHours: 96,
		active: true
	},
	{
		id: "sla_road_critical",
		category: "Road Damage",
		severity: "Critical",
		responseHours: 4,
		resolutionHours: 24,
		escalationHours: 12,
		active: true
	},
	{
		id: "sla_road_high",
		category: "Road Damage",
		severity: "High",
		responseHours: 12,
		resolutionHours: 48,
		escalationHours: 24,
		active: true
	},
	{
		id: "sla_road_moderate",
		category: "Road Damage",
		severity: "Moderate",
		responseHours: 24,
		resolutionHours: 96,
		escalationHours: 48,
		active: true
	},
	{
		id: "sla_road_low",
		category: "Road Damage",
		severity: "Low",
		responseHours: 72,
		resolutionHours: 168,
		escalationHours: 120,
		active: true
	},
	{
		id: "sla_garbage_critical",
		category: "Garbage Collection",
		severity: "Critical",
		responseHours: 8,
		resolutionHours: 24,
		escalationHours: 16,
		active: true
	},
	{
		id: "sla_garbage_high",
		category: "Garbage Collection",
		severity: "High",
		responseHours: 24,
		resolutionHours: 48,
		escalationHours: 36,
		active: true
	},
	{
		id: "sla_garbage_moderate",
		category: "Garbage Collection",
		severity: "Moderate",
		responseHours: 48,
		resolutionHours: 72,
		escalationHours: 60,
		active: true
	},
	{
		id: "sla_garbage_low",
		category: "Garbage Collection",
		severity: "Low",
		responseHours: 72,
		resolutionHours: 120,
		escalationHours: 96,
		active: true
	},
	{
		id: "sla_drain_critical",
		category: "Drainage",
		severity: "Critical",
		responseHours: 4,
		resolutionHours: 24,
		escalationHours: 8,
		active: true
	},
	{
		id: "sla_drain_high",
		category: "Drainage",
		severity: "High",
		responseHours: 12,
		resolutionHours: 72,
		escalationHours: 36,
		active: true
	},
	{
		id: "sla_drain_moderate",
		category: "Drainage",
		severity: "Moderate",
		responseHours: 24,
		resolutionHours: 96,
		escalationHours: 48,
		active: true
	},
	{
		id: "sla_drain_low",
		category: "Drainage",
		severity: "Low",
		responseHours: 72,
		resolutionHours: 168,
		escalationHours: 120,
		active: true
	},
	{
		id: "sla_light_critical",
		category: "Street Lighting",
		severity: "Critical",
		responseHours: 4,
		resolutionHours: 48,
		escalationHours: 24,
		active: true
	},
	{
		id: "sla_light_high",
		category: "Street Lighting",
		severity: "High",
		responseHours: 24,
		resolutionHours: 72,
		escalationHours: 48,
		active: true
	},
	{
		id: "sla_light_moderate",
		category: "Street Lighting",
		severity: "Moderate",
		responseHours: 48,
		resolutionHours: 120,
		escalationHours: 72,
		active: true
	},
	{
		id: "sla_light_low",
		category: "Street Lighting",
		severity: "Low",
		responseHours: 72,
		resolutionHours: 168,
		escalationHours: 120,
		active: true
	},
	{
		id: "sla_elec_critical",
		category: "Electricity",
		severity: "Critical",
		responseHours: 2,
		resolutionHours: 12,
		escalationHours: 6,
		active: true
	},
	{
		id: "sla_elec_high",
		category: "Electricity",
		severity: "High",
		responseHours: 8,
		resolutionHours: 48,
		escalationHours: 24,
		active: true
	},
	{
		id: "sla_elec_moderate",
		category: "Electricity",
		severity: "Moderate",
		responseHours: 24,
		resolutionHours: 72,
		escalationHours: 48,
		active: true
	},
	{
		id: "sla_elec_low",
		category: "Electricity",
		severity: "Low",
		responseHours: 48,
		resolutionHours: 120,
		escalationHours: 96,
		active: true
	},
	{
		id: "sla_san_critical",
		category: "Sanitation",
		severity: "Critical",
		responseHours: 4,
		resolutionHours: 24,
		escalationHours: 12,
		active: true
	},
	{
		id: "sla_san_high",
		category: "Sanitation",
		severity: "High",
		responseHours: 24,
		resolutionHours: 48,
		escalationHours: 36,
		active: true
	},
	{
		id: "sla_san_moderate",
		category: "Sanitation",
		severity: "Moderate",
		responseHours: 48,
		resolutionHours: 96,
		escalationHours: 72,
		active: true
	},
	{
		id: "sla_san_low",
		category: "Sanitation",
		severity: "Low",
		responseHours: 72,
		resolutionHours: 168,
		escalationHours: 120,
		active: true
	}
];
var API_BASE_URL = "https://janmind.onrender.com";
async function fetchStore(collection, method = "GET", body) {
	const store = {
		contractors: SEED_CONTRACTORS,
		contractorDocuments: SEED_CONTRACTOR_DOCUMENTS,
		workPackages: SEED_WORK_PACKAGES,
		workOrders: SEED_WORK_ORDERS,
		workOrderEvents: SEED_WORK_ORDER_EVENTS,
		fieldProgress: SEED_FIELD_PROGRESS,
		inspections: SEED_INSPECTIONS,
		measurements: SEED_MEASUREMENTS,
		bills: SEED_BILLS,
		auditLogs: SEED_AUDIT_LOGS,
		slaRules: SEED_SLA_RULES,
		evidence: []
	};
	const storageKey = `janmind_admin_${collection}`;
	let data = store[collection] || [];
	try {
		const cached = localStorage.getItem(storageKey);
		if (cached) data = JSON.parse(cached);
		else localStorage.setItem(storageKey, JSON.stringify(data));
	} catch {}
	if (method === "GET") return data;
	if (method === "POST") {
		const newItem = {
			id: Date.now().toString(),
			...body
		};
		data = [...data, newItem];
		localStorage.setItem(storageKey, JSON.stringify(data));
		return newItem;
	}
	return data;
}
async function fetchStorePatch(collection, id, body) {
	const storageKey = `janmind_admin_${collection}`;
	let data = [];
	try {
		const cached = localStorage.getItem(storageKey);
		if (cached) data = JSON.parse(cached);
	} catch {}
	const idx = data.findIndex((item) => item.id === id);
	if (idx >= 0) {
		data[idx] = {
			...data[idx],
			...body
		};
		localStorage.setItem(storageKey, JSON.stringify(data));
		return data[idx];
	}
	return {
		id,
		...body
	};
}
async function appendAudit(actorId, actorName, actorRole, action, entityType, entityId, entityLabel, opts) {
	await fetchStore("auditLogs", "POST", {
		actorId,
		actorName,
		actorRole,
		action,
		entityType,
		entityId,
		entityLabel,
		...opts?.previousValue ? { previousValue: opts.previousValue } : {},
		...opts?.newValue ? { newValue: opts.newValue } : {},
		...opts?.reason ? { reason: opts.reason } : {},
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function getContractors() {
	return fetchStore("contractors");
}
async function getContractor(id) {
	return (await fetchStore("contractors")).find((c) => c.id === id) ?? null;
}
async function updateContractor(id, patch) {
	return fetchStorePatch("contractors", id, {
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function verifyContractor(id, actorId, actorName) {
	const updated = await updateContractor(id, {
		status: "VERIFIED",
		verificationStatus: "VERIFIED"
	});
	await appendAudit(actorId, actorName, "admin", "CONTRACTOR_VERIFIED", "contractor", id, updated.companyName);
	return updated;
}
async function suspendContractor(id, actorId, actorName, reason) {
	const updated = await updateContractor(id, { status: "SUSPENDED" });
	await appendAudit(actorId, actorName, "admin", "CONTRACTOR_SUSPENDED", "contractor", id, updated.companyName, { reason });
	return updated;
}
async function getContractorDocuments(contractorId) {
	return (await fetchStore("contractorDocuments")).filter((d) => d.contractorId === contractorId);
}
async function getWorkOrders(filters) {
	let list = await fetchStore("workOrders");
	if (filters?.contractorId) list = list.filter((w) => w.contractorId === filters.contractorId);
	if (filters?.cityId) list = list.filter((w) => w.cityId === filters.cityId);
	if (filters?.status) list = list.filter((w) => w.status === filters.status);
	return list;
}
async function getAuditLogs(filters) {
	let logs = await fetchStore("auditLogs");
	if (filters?.entityType) logs = logs.filter((l) => l.entityType === filters.entityType);
	if (filters?.actorRole) logs = logs.filter((l) => l.actorRole === filters.actorRole);
	return filters?.limit ? logs.slice(0, filters.limit) : logs;
}
async function getSLARules() {
	return fetchStore("slaRules");
}
async function updateSLARule(id, patch, actorId, actorName) {
	const r = await fetchStorePatch("slaRules", id, patch);
	await appendAudit(actorId, actorName, "admin", "SLA_RULE_CHANGED", "sla", id, `${r.category} / ${r.severity}`);
	return r;
}
var LS_TOKEN = "janmind.admin_token";
var LS_USER = "janmind.admin_user";
function getAdminToken() {
	try {
		return localStorage.getItem(LS_TOKEN);
	} catch {
		return null;
	}
}
async function adminApiFetch(path, options = {}) {
	const token = getAdminToken();
	const headers = {
		"Content-Type": "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {},
		...options.headers ?? {}
	};
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: res.statusText }));
		throw new Error(err.detail ?? res.statusText);
	}
	if (res.status === 204) return void 0;
	return res.json();
}
async function getAdminUser() {
	if (!getAdminToken()) return null;
	try {
		const raw = localStorage.getItem(LS_USER);
		if (raw) {
			const cached = JSON.parse(raw);
			adminApiFetch("/api/v1/auth/me").then((me) => {
				if (me) {
					const updated = {
						...cached,
						name: me.name,
						email: me.email,
						lastActive: (/* @__PURE__ */ new Date()).toISOString()
					};
					localStorage.setItem(LS_USER, JSON.stringify(updated));
				}
			}).catch(() => {});
			return cached;
		}
	} catch {}
	return null;
}
async function adminLogin(email, password) {
	if (!email.trim()) throw new Error("Email is required");
	if (!password.trim()) throw new Error("Password is required");
	const res = await adminApiFetch("/api/v1/auth/officer-login", {
		method: "POST",
		body: JSON.stringify({
			email: email.trim(),
			password
		})
	});
	const userData = res.officer || res.user;
	if (!userData) throw new Error("Login failed: no user data returned");
	const allowedRoles = [
		"admin",
		"supervisor",
		"municipality",
		"officer"
	];
	const role = (userData.role ?? "").toLowerCase();
	if (!allowedRoles.includes(role)) throw new Error("Access denied — admin or officer role required");
	localStorage.setItem(LS_TOKEN, res.access_token);
	const admin = {
		id: userData.id ?? "admin",
		name: userData.name ?? email,
		email: userData.email ?? email,
		role: userData.role ?? "admin",
		department: userData.department ?? "Administration",
		city: userData.city ?? void 0,
		lastActive: (/* @__PURE__ */ new Date()).toISOString(),
		permissions: ["ALL"]
	};
	localStorage.setItem(LS_USER, JSON.stringify(admin));
	return admin;
}
/** List all users from the real backend. */
async function listAllUsers(filters) {
	const params = new URLSearchParams();
	if (filters?.role) params.set("role", filters.role);
	if (filters?.city) params.set("city", filters.city);
	if (filters?.limit) params.set("limit", String(filters.limit));
	return adminApiFetch(`/api/v1/admin/users?${params.toString()}`);
}
/** Create any user (officer, municipality, contractor login, admin). */
async function createUser(data) {
	return adminApiFetch("/api/v1/admin/users", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
/** Update a user's details. */
async function updateUser(userId, patch) {
	return adminApiFetch(`/api/v1/admin/users/${userId}`, {
		method: "PATCH",
		body: JSON.stringify(patch)
	});
}
/** Delete a user. */
async function deleteUser(userId) {
	return adminApiFetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
}
/** Get platform-wide stats. */
async function getPlatformStats() {
	return adminApiFetch("/api/v1/admin/stats");
}
/** List all work orders across all cities (admin view). */
async function listRealWorkOrders() {
	return adminApiFetch("/api/v1/admin/work-orders");
}
/** List all cities (admin). */
async function listAdminCities() {
	return adminApiFetch("/api/v1/admin/cities");
}
async function adminLogout() {
	localStorage.removeItem(LS_TOKEN);
	localStorage.removeItem(LS_USER);
}
var TRANSLATIONS = {
	en: {
		"ui.issue_mix_in_this_locality": "Issue mix in this locality",
		"ui.initializing_map": "Initializing map",
		"ui.loading_civic_map": "Loading civic map",
		"ui.loading_tiles": "Loading tiles…",
		"ui.loading_map": "Loading map",
		"ui.zoom_in": "Zoom in",
		"ui.zoom_out": "Zoom out",
		"ui.reset_map_view": "Reset map view",
		"ui.find_my_area": "Find my area",
		"ui.page_not_found": "Page not found",
		"ui.the_page_you_re_looking_for_do": "The page you're looking for doesn't exist or has been moved.",
		"ui.go_to_dashboard": "Go to dashboard",
		"ui.this_page_didn_t_load": "This page didn't load",
		"ui.something_went_wrong_on_our_en": "Something went wrong on our end. You can try refreshing or head back to the dashboard.",
		"ui.try_again": "Try again",
		"ui.dashboard": "Dashboard",
		"ui.janmind": "JANMIND",
		"ui.municipal_intelligence": "Municipal Intelligence",
		"ui.city": "City",
		"ui.role": "Role *",
		"ui.remember_session": "Remember session",
		"ui.forgot_password": "Forgot password?",
		"ui.janmind_municipal_intelligence": "JANMIND Municipal Intelligence Platform",
		"ui.officer_id_email": "Officer ID / Email",
		"ui.officer_vmc_gov_in": "officer@vmc.gov.in",
		"ui.password": "Password",
		"ui.janmind_copilot": "JANMIND Copilot",
		"ui.ask_copilot": "Ask Copilot...",
		"ui.no_complaints_match_the_select": "No complaints match the selected filters.",
		"ui.complaint_id": "Complaint ID",
		"ui.category": "Category",
		"ui.area": "Area",
		"ui.ward": "Ward",
		"ui.severity": "Severity",
		"ui.department": "Department",
		"ui.status": "Status",
		"ui.created": "Created",
		"ui.select_all": "Select all",
		"ui.emerging_systemic_issue": "Emerging Systemic Issue",
		"ui.reports": "Reports",
		"ui.risk": "Risk",
		"ui.trend": "Trend",
		"ui.dominant_issue": "Dominant issue",
		"ui.possible_cause": "Possible cause",
		"ui.view_intelligence": "View Intelligence",
		"ui.why_janmind_flagged_this": "Why JANMIND Flagged This",
		"ui.prototype_intelligence_data": "Prototype Intelligence Data",
		"ui.possible_root_cause": "Possible Root Cause",
		"ui.confidence": "Confidence:",
		"ui.inferred_candidate_based_on_co": "Inferred candidate based on complaint patterns. Not a confirmed physical\n        infrastructure failure.",
		"ui.recommended_action": "Recommended Action",
		"ui.start_investigation": "Start Investigation",
		"ui.assign_department": "Assign Department",
		"ui.create_field_action": "Create Field Action",
		"ui.mark_investigating": "Mark Investigating",
		"ui.filters": "Filters",
		"ui.all_cities": "All cities",
		"ui.all_categories": "All categories",
		"ui.all_severities": "All severities",
		"ui.all_departments": "All departments",
		"ui.all_statuses": "All statuses",
		"ui.clear": "Clear",
		"ui.apply": "Apply",
		"ui.area_name": "Area name",
		"ui.issue": "Issue",
		"ui.risk_range": "Risk range",
		"ui.min": "Min",
		"ui.max": "Max",
		"ui.officer_activity_timeline": "Officer Activity Timeline",
		"ui.field_action": "Field Action",
		"ui.priority": "Priority",
		"ui.recommended": "Recommended",
		"ui.assign": "Assign",
		"ui.acknowledge": "Acknowledge",
		"ui.start": "Start",
		"ui.complete": "Complete",
		"ui.live_activity": "Live Activity",
		"ui.prototype_simulation": "Prototype simulation",
		"ui.search": "Search",
		"ui.open_navigation": "Open navigation",
		"ui.search_press": "Search (press /)",
		"ui.notifications": "Notifications",
		"ui.officer_search": "Officer Search",
		"ui.searching": "Searching...",
		"ui.complaints": "Complaints",
		"ui.emerging_issues": "Emerging Issues",
		"ui.no_results_found": "No results found.",
		"ui.complaint_id_area_ward_issue_d": "Complaint ID, area, ward, issue, department...",
		"ui.close_navigation": "Close navigation",
		"ui.municipality_navigation": "Municipality navigation",
		"ui.mark_read": "Mark read",
		"ui.view_details": "View Details",
		"ui.janmind_prototype_risk_score": "JANMIND Prototype Risk Score",
		"ui.complaint_volume": "Complaint Volume",
		"ui.geographic_concentration": "Geographic Concentration",
		"ui.semantic_similarity": "Semantic Similarity",
		"ui.recent_growth": "Recent Growth",
		"ui.ai_triage_queue": "AI Triage Queue",
		"ui.review_incoming_complaints_fla": "Review incoming complaints flagged by JANMIND AI as potentially related to existing civic issues.",
		"ui.pending": "Pending",
		"ui.all_caught_up": "All caught up!",
		"ui.no_pending_complaints_require_": "No pending complaints require human review.",
		"ui.needs_review": "Needs Review",
		"ui.match": "% Match",
		"ui.candidate_civic_issue": "Candidate Civic Issue",
		"ui.existing_complaints": "existing complaints",
		"ui.merge_duplicate": "Merge (Duplicate)",
		"ui.split_unique": "Split (Unique)",
		"ui.operational_alerts": "Operational Alerts",
		"ui.city_wide_risk_notifications": "City-wide risk notifications",
		"ui.view_issue": "View Issue",
		"ui.no_alerts": "No alerts",
		"ui.city_analytics": "City Analytics",
		"ui.trends_and_distribution_insigh": "Trends and distribution insights",
		"ui.complaint_volume_trend": "Complaint Volume Trend",
		"ui.severity_distribution": "Severity distribution",
		"ui.department_workload": "Department Workload",
		"ui.category_distribution": "Category Distribution",
		"ui.emerging_issues_trend": "Emerging Issues Trend",
		"ui.average_response_time_days": "Average Response Time (days)",
		"ui.see_what_is_happening_across_y": "See what is happening across your city.",
		"ui.city_health": "City Health",
		"ui.7_day_activity_pulse": "7-day activity pulse",
		"ui.issue_breakdown": "Issue breakdown",
		"ui.no_data_yet": "No data yet.",
		"ui.emerging_systemic_issues": "Emerging Systemic Issues",
		"ui.something_is_happening_in_thes": "Something is happening in these areas",
		"ui.view_all": "View All",
		"ui.hotspot_analysis": "Hotspot Analysis",
		"ui.total_reports": "Total Reports",
		"ui.critical": "critical",
		"ui.active": "Active",
		"ui.resolved": "Resolved",
		"ui.area_hotspots": "Area Hotspots",
		"ui.civic_map": "Civic Map",
		"ui.city_wide_operational_view": "City-wide operational view",
		"ui.7_day_pulse": "7-day pulse",
		"ui.severity_mix": "Severity mix",
		"ui.no_data_under_filters": "No data under filters.",
		"ui.map_legend": "Map Legend",
		"ui.click_an_area_to_view_operatio": "Click an area to view operational details, complaint counts, trends and risk scores.\n                Individual complaint locations appear when zoomed in.",
		"ui.prototype_area_boundaries_not_": "Prototype area boundaries — not official ward delimitation.",
		"ui.area_details": "Area Details",
		"ui.prototype_area_boundary": "Prototype area boundary",
		"ui.7_day_trend": "7-day trend",
		"ui.top_category": "Top category",
		"ui.local_7_day_trend": "Local 7-day trend",
		"ui.view_reports": "View Reports",
		"ui.view_emerging_issues": "View emerging issues",
		"ui.activity": "activity",
		"ui.officer_profile": "Officer Profile",
		"ui.officer_id": "Officer ID",
		"ui.last_active": "Last active",
		"ui.frontend_only_mock_authenticat": "Frontend-only mock authentication · Prototype Intelligence Data",
		"ui.sign_out": "Sign Out",
		"ui.portal_settings": "Portal Settings",
		"ui.preferences": "Preferences",
		"ui.settings_are_stored_locally_in": "Settings are stored locally in this prototype.",
		"ui.theme": "Theme",
		"ui.system": "System",
		"ui.dark": "Dark",
		"ui.light": "Light",
		"ui.default_city": "Default city",
		"ui.default_map_mode": "Default map mode",
		"ui.area_health": "Area Health",
		"ui.complaint_activity": "Complaint Activity",
		"ui.hotspots": "Hotspots",
		"ui.compact_mode": "Compact mode",
		"ui.area_intelligence": "Area Intelligence",
		"ui.neighbourhood_activity_overvie": "Neighbourhood activity overview",
		"ui.sort_by": "Sort by",
		"ui.all_civic_issues": "All Civic Issues",
		"ui.civic_issue_intelligence": "Civic Issue Intelligence",
		"ui.issue_summary": "Issue Summary",
		"ui.impact_score": "Impact Score",
		"ui.first_reported": "First Reported",
		"ui.linked_complaints": "Linked Complaints",
		"ui.jn_2026_00001": "JN-2026-00001",
		"ui.primary_reporter": "Primary reporter",
		"ui.split": "Split",
		"ui.jn_2026_00002": "JN-2026-00002",
		"ui.citizen_confirmation": "Citizen confirmation",
		"ui.merge_issue": "Merge Issue",
		"ui.if_this_issue_is_a_duplicate_o": "If this issue is a duplicate of another Civic Issue, you can merge them together to consolidate impact scores and reports.",
		"ui.select_target_issue": "Select target issue...",
		"ui.confirm_merge": "Confirm Merge",
		"ui.cancel": "Cancel",
		"ui.merge_with_another_issue": "Merge with another issue",
		"ui.work_execution": "Work Execution",
		"ui.this_civic_issue_is_ready_to_b": "This Civic Issue is ready to be converted into a Work Package for contractors.",
		"ui.create_work_package": "Create Work Package",
		"ui.civic_issues": "Civic Issues",
		"ui.clustered_citizen_reports": "Clustered Citizen Reports",
		"ui.intelligence_layer_identifying": "Intelligence layer identifying singular problems from multiple citizen reports.",
		"ui.impact": "Impact:",
		"ui.review": "Review",
		"ui.no_civic_issues": "No civic issues",
		"ui.all_complaints": "All complaints",
		"ui.report_details": "Report Details",
		"ui.assigned_to": "Assigned to",
		"ui.last_updated": "Last updated:",
		"ui.ai_intelligence_analysis": "AI Intelligence Analysis",
		"ui.detected_category": "Detected category",
		"ui.urgency": "Urgency",
		"ui.similarity_match": "Similarity match",
		"ui.cluster": "Cluster",
		"ui.view_related_systemic_issue": "View related systemic issue →",
		"ui.location": "Location",
		"ui.officer_actions": "Officer Actions",
		"ui.verify_accept_complaint": "✓ Verify & Accept Complaint",
		"ui.reject_as_invalid": "✕ Reject as Invalid",
		"ui.classify_route": "Classify & Route",
		"ui.link_to_civic_issue": "Link to Civic Issue",
		"ui.create_procurement_opportunity": "Create Procurement Opportunity",
		"ui.complaint_management": "Complaint Management",
		"ui.all_civic_reports": "All civic reports",
		"ui.complaints_prototype_intellige": "complaints · Prototype Intelligence Data",
		"ui.export": "Export",
		"ui.selected": "selected",
		"ui.bulk_verify": "✓ Bulk Verify",
		"ui.bulk_classify": "Bulk Classify",
		"ui.department_detail": "Department Detail",
		"ui.average_response_time": "Average response time:",
		"ui.days": "days",
		"ui.category_breakdown": "Category Breakdown",
		"ui.view_department_complaints": "View department complaints",
		"ui.open": "Open",
		"ui.in_progress": "In progress",
		"ui.department_overview": "Department Overview",
		"ui.operational_workload_by_depart": "Operational workload by department",
		"ui.avg_response": "Avg response",
		"ui.systemic_issue_intelligence": "Systemic Issue Intelligence",
		"ui.updated": "Updated",
		"ui.related_complaints": "Related Complaints",
		"ui.patterns_janmind_has_detected": "Patterns JANMIND has detected",
		"ui.no_critical_issues": "No critical issues",
		"ui.all_tenders": "All tenders",
		"ui.tender_details": "Tender Details",
		"ui.estimated_cost": "Estimated Cost (₹)",
		"ui.civic_issue_id": "Civic Issue ID",
		"ui.scope_of_work": "Scope of Work",
		"ui.submitted_bids": "Submitted Bids (",
		"ui.loading_bids": "Loading bids...",
		"ui.no_bids_submitted_yet": "No bids submitted yet.",
		"ui.contractor_id": "Contractor ID:",
		"ui.bid_id": "Bid ID:",
		"ui.tender_info": "Tender Info",
		"ui.tenders": "Tenders",
		"ui.tender": "tender",
		"ui.publish_tender": "Publish Tender",
		"ui.no_tenders_published_yet": "No tenders published yet.",
		"ui.define_public_procurement_requ": "Define public procurement requirements",
		"ui.title": "Title",
		"ui.description": "Description",
		"ui.civic_issue_ids_comma_separate": "Civic Issue IDs (comma-separated)",
		"ui.road_repair_ward_14_sarvodaya_": "Road Repair — Ward 14, Sarvodaya Nagar",
		"ui.describe_the_civic_issue_and_w": "Describe the civic issue and why work is needed...",
		"ui.ward_14": "Ward 14",
		"ui.sarvodaya_nagar": "Sarvodaya Nagar",
		"ui.1_pothole_patching_10_2_road_m": "1. Pothole patching...&#10;2. Road milling...",
		"ui.ci_171850389_ci_2819030": "CI-171850389, CI-2819030",
		"ui.all_work_orders": "All work orders",
		"ui.overdue": "(overdue)",
		"ui.work_order_details": "Work Order Details",
		"ui.contractor": "Contractor",
		"ui.assigned_engineer": "Assigned Engineer",
		"ui.start_date": "Start Date",
		"ui.sla_deadline": "SLA Deadline",
		"ui.bill_of_quantities": "Bill of Quantities",
		"ui.unit": "Unit",
		"ui.qty": "Qty",
		"ui.rate": "Rate",
		"ui.amount": "Amount",
		"ui.total": "Total",
		"ui.approved_amount": "Approved Amount",
		"ui.record_inspection": "Record Inspection",
		"ui.record_site_inspection": "Record Site Inspection",
		"ui.inspection_notes": "Inspection Notes",
		"ui.verify_measurement": "Verify Measurement",
		"ui.verify_measurement_proceed_to_": "Verify Measurement & Proceed to Billing",
		"ui.verified_total_amount": "Verified Total Amount (₹)",
		"ui.bill_approval": "Bill Approval",
		"ui.contractor_submitted_bill_for": "Contractor submitted bill for",
		"ui.close_work_order": "Close Work Order",
		"ui.payment_approved_close_the_wor": "Payment approved. Close the work order to resolve all linked complaints.",
		"ui.work_order_timeline": "Work Order Timeline",
		"ui.linked_civic_issues": "Linked Civic Issues (",
		"ui.evidence_ai_validation": "Evidence & AI Validation",
		"ui.ai_relevance": "AI Relevance:",
		"ui.tamper_risk": "Tamper Risk:",
		"ui.gps_distance": "GPS Distance:",
		"ui.m": "m",
		"ui.no_evidence_submitted_yet": "No evidence submitted yet.",
		"ui.financial_summary": "Financial Summary",
		"ui.estimated": "Estimated",
		"ui.approved": "Approved",
		"ui.bill_approved": "Bill Approved",
		"ui.quick_actions": "Quick Actions",
		"ui.view_work_package": "View Work Package",
		"ui.describe_findings_quality_obse": "Describe findings, quality observations, deficiencies...",
		"ui.work_orders": "Work Orders",
		"ui.work_order": "work order",
		"ui.no_work_orders_found": "No work orders found.",
		"ui.due": "Due:",
		"ui.contractor_portal": "Contractor Portal",
		"ui.email_address": "Email Address",
		"ui.sign_in_with_your_registered_c": "Sign in with your registered contractor account.",
		"ui.contact_your_administrator_if_": "Contact your administrator if you need access.",
		"ui.suresh_patel_bharatinfra_in": "suresh.patel@bharatinfra.in",
		"ui.contractor_operations_center": "Contractor Operations Center",
		"ui.ai_operations_brief": "AI Operations Brief",
		"ui.you_have": "You have",
		"ui.active_work_orders": "Active Work Orders",
		"ui.projects_are_currently_at_high": "projects are currently at high schedule risk.",
		"ui.work_orders_are_awaiting_munic": "work orders are awaiting municipal inspection.",
		"ui.eligible_tenders_close_within_": "eligible tenders close within the next 72 hours.",
		"ui.needs_your_attention": "NEEDS YOUR ATTENTION",
		"ui.behind_schedule": "- Behind Schedule",
		"ui.provide_evidence": "Provide Evidence →",
		"ui.inspection_pending": "Inspection Pending",
		"ui.payments_pending": "Payments Pending",
		"ui.risk_alerts": "Risk Alerts",
		"ui.active_project_health": "Active Project Health",
		"ui.no_active_projects": "No active projects.",
		"ui.planned": "Planned:",
		"ui.verified": "Verified",
		"ui.recommended_tender_opportuniti": "Recommended Tender Opportunities",
		"ui.view_market": "View Market",
		"ui.no_matching_tenders_available_": "No matching tenders available in your registered cities.",
		"ui.high_match": "HIGH MATCH",
		"ui.closes": "Closes:",
		"ui.performance_metrics": "Performance Metrics",
		"ui.track_your_company_s_rating_an": "Track your company's rating and operational statistics.",
		"ui.overall_rating": "Overall Rating",
		"ui.out_of_100": "out of 100",
		"ui.sla_compliance": "SLA Compliance",
		"ui.target_gt_90": "Target: &gt; 90%",
		"ui.first_time_inspection_pass": "First-Time Inspection Pass",
		"ui.target_gt_85": "Target: &gt; 85%",
		"ui.on_time_completion": "On-Time Completion",
		"ui.target_gt_95": "Target: &gt; 95%",
		"ui.total_historical_work_orders": "Total Historical Work Orders",
		"ui.lifetime_completed": "Lifetime completed",
		"ui.score_trend_last_4_quarters": "Score Trend (Last 4 Quarters)",
		"ui.company_profile_data": "Company Profile Data",
		"ui.specializations": "Specializations",
		"ui.service_wards": "Service Wards",
		"ui.company_profile": "Company Profile",
		"ui.manage_your_business_informati": "Manage your business information and registration details.",
		"ui.verified_contractor": "Verified Contractor",
		"ui.contact_details": "Contact Details",
		"ui.phone": "Phone",
		"ui.email": "Email *",
		"ui.address": "Address",
		"ui.company_information": "Company Information",
		"ui.company_name": "Company Name",
		"ui.id": "ID:",
		"ui.legal_registration": "Legal & Registration",
		"ui.registration_number": "Registration Number",
		"ui.gstin": "GSTIN",
		"ui.pan": "PAN",
		"ui.user": "User",
		"ui.loading_tender": "Loading tender...",
		"ui.tender_not_found": "Tender not found.",
		"ui.back_to_tenders": "Back to Tenders",
		"ui.est_budget": "Est. Budget",
		"ui.submit_sealed_bid": "Submit Sealed Bid",
		"ui.quoted_amount": "Quoted Amount (₹)",
		"ui.technical_proposal_notes": "Technical Proposal / Notes",
		"ui.e_g_500000": "e.g. 500000",
		"ui.detail_your_approach_timeline_": "Detail your approach, timeline, and resources...",
		"ui.tenders_amp_bidding": "Tenders &amp; Bidding",
		"ui.open_procurement_opportunities": "Open procurement opportunities you are eligible for.",
		"ui.no_open_tenders_found_for_your": "No open tenders found for your approved categories and cities.",
		"ui.your_contractor_profile_must_b": "Your contractor profile must be approved in a city before tenders appear here.",
		"ui.back_to_work_orders": "Back to Work Orders",
		"ui.contract_value": "Contract Value",
		"ui.estimated_budget": "Estimated Budget",
		"ui.risk_level": "Risk Level",
		"ui.issued_on": "Issued On",
		"ui.target_completion": "Target Completion",
		"ui.execution_progress": "Execution Progress",
		"ui.submit_field_evidence": "Submit Field Evidence",
		"ui.stage": "Stage",
		"ui.before_repair": "Before Repair",
		"ui.start_of_work": "Start of Work",
		"ui.during_execution": "During Execution",
		"ui.completion": "Completion",
		"ui.description_optional": "Description (optional)",
		"ui.photo": "Photo",
		"ui.awaiting_municipal_inspection": "Awaiting Municipal Inspection",
		"ui.evidence_has_been_submitted_a_": "Evidence has been submitted. A municipal officer will review and either pass or\n                    request rework.",
		"ui.rework_required": "Rework Required",
		"ui.the_municipal_inspection_did_n": "The municipal inspection did not pass. Please address the issues and resubmit\n                    evidence.",
		"ui.resubmit_for_inspection": "Resubmit for Inspection",
		"ui.work_completed": "Work Completed",
		"ui.this_work_order_has_been_inspe": "This work order has been inspected and marked complete. The linked civic issue\n                    and citizen complaints have been resolved automatically.",
		"ui.quick_info": "Quick Info",
		"ui.awarded_by": "Awarded By",
		"ui.award_value": "Award Value",
		"ui.tender_id": "Tender ID",
		"ui.brief_note_about_the_photo": "Brief note about the photo…",
		"ui.no_work_orders_found_for_the_s": "No work orders found for the selected filter.",
		"ui.issued": "Issued:",
		"ui.janmind_admin": "JANMIND Admin",
		"ui.platform_administration": "Platform Administration",
		"ui.sign_in_to_platform": "Sign In to Platform",
		"ui.admin_janmind_gov_in": "admin@janmind.gov.in",
		"ui.system_audit_logs": "System Audit Logs",
		"ui.immutable_record_of_platform_a": "Immutable record of platform activities",
		"ui.all_roles": "All Roles",
		"ui.all_entities": "All Entities",
		"ui.timestamp": "Timestamp",
		"ui.actor": "Actor",
		"ui.action": "Action",
		"ui.target_entity": "Target Entity",
		"ui.details": "Details",
		"ui.no_details": "No details",
		"ui.no_audit_logs_match_your_crite": "No audit logs match your criteria.",
		"ui.refresh": "Refresh",
		"ui.search_actor_or_action": "Search actor or action...",
		"ui.make_sure_you_are_logged_in_wi": "Make sure you are logged in with an admin account.",
		"ui.live_platform_data": "Live Platform Data",
		"ui.platform_dashboard": "Platform Dashboard",
		"ui.real_time_overview_from_the_ba": "Real-time overview from the backend database",
		"ui.total_complaints": "Total Complaints",
		"ui.work_order_status_distribution": "Work Order Status Distribution",
		"ui.recent_work_orders": "Recent Work Orders",
		"ui.no_work_orders_yet": "No work orders yet",
		"ui.total_users": "Total Users",
		"ui.officers": "Officers",
		"ui.contractors": "Contractors",
		"ui.active_work": "Active Work",
		"ui.open_complaints": "Open Complaints",
		"ui.cities": "Cities",
		"ui.platform_settings": "Platform Settings",
		"ui.system_configuration_and_admin": "System configuration and administration",
		"ui.global_notification_settings": "Global Notification Settings",
		"ui.platform_name": "Platform Name",
		"ui.janmind_civic_infrastructure_p": "JANMIND Civic Infrastructure Platform",
		"ui.environment": "Environment",
		"ui.prototype_demo": "Prototype / Demo",
		"ui.version": "Version",
		"ui.v1_0_0_prototype": "v1.0.0-prototype",
		"ui.storage_mode": "Storage Mode",
		"ui.browser_localstorage": "Browser LocalStorage",
		"ui.security_authentication": "Security & Authentication",
		"ui.danger_zone": "Danger Zone",
		"ui.reset_prototype_data": "Reset Prototype Data",
		"ui.this_will_clear_all_shared_pro": "This will clear all shared prototype data (contractors, work orders, audit logs, SLA rules) from local storage. Default mock data will be re-initialized on next load.",
		"ui.clear_all_data": "Clear All Data",
		"ui.sla_configuration": "SLA Configuration",
		"ui.define_response_and_resolution": "Define response and resolution time limits across categories",
		"ui.response_hrs": "Response (Hrs)",
		"ui.resolution_hrs": "Resolution (Hrs)",
		"ui.escalation_hrs": "Escalation (Hrs)",
		"ui.user_management": "User Management",
		"ui.total_users_across_all_roles": "total users across all roles",
		"ui.add_user": "Add User",
		"ui.name": "Name",
		"ui.actions": "Actions",
		"ui.no_users_found": "No users found",
		"ui.full_name": "Full Name *",
		"ui.none": "— None —",
		"ui.search_name_email_city": "Search name, email, city...",
		"ui.edit_user": "Edit user",
		"ui.delete_user": "Delete user",
		"ui.e_g_priya_sharma": "e.g. Priya Sharma",
		"ui.user_example_com": "user@example.com",
		"ui.min_8_characters": "Min 8 characters",
		"ui.e_g_roads": "e.g. Roads",
		"ui.platform_work_orders": "Platform Work Orders",
		"ui.global_view_of_all_municipal_w": "Global view of all municipal work orders",
		"ui.global_work_order_distribution": "Global Work Order Distribution",
		"ui.status_breakdown_across_all_ci": "Status breakdown across all cities",
		"ui.id_title": "ID / Title",
		"ui.municipality": "Municipality",
		"ui.no_work_orders_found_in_the_pl": "No work orders found in the platform.",
		"ui.registration": "Registration:",
		"ui.current_status": "Current Status",
		"ui.verify_contractor": "Verify Contractor",
		"ui.suspend_contractor": "Suspend Contractor",
		"ui.tax_id_pan": "Tax ID / PAN",
		"ui.contractor_tier": "Contractor Tier",
		"ui.class_a": "Class A",
		"ui.registration_compliance": "Registration & Compliance",
		"ui.document_type": "Document Type",
		"ui.uploaded_date": "Uploaded Date",
		"ui.no_documents_uploaded": "No documents uploaded",
		"ui.system_security_logging": "System Security Logging",
		"ui.pending_verification": "Pending Verification",
		"ui.suspended": "Suspended",
		"ui.not_found": "Not Found",
		"ui.overall_score": "Overall Score",
		"ui.inspection_pass_rate": "Inspection Pass Rate",
		"ui.contractor_registry": "Contractor Registry",
		"ui.manage_and_verify_platform_con": "Manage and verify platform contractors",
		"ui.reg": "Reg:",
		"ui.more": "more",
		"ui.verify": "Verify",
		"ui.suspend": "Suspend",
		"ui.no_contractors_found_matching_": "No contractors found matching your criteria.",
		"ui.search_by_name_or_registration": "Search by name or registration number...",
		"nav.home": "Home",
		"nav.howitworks": "How It Works",
		"nav.map": "Civic Map",
		"nav.report": "Report Problem",
		"nav.complaints": "My Complaints",
		"nav.notifications": "Notifications",
		"nav.profile": "Profile",
		"nav.signin": "Sign In",
		"nav.signout": "Sign Out",
		"home.hero.badge": "Citizen portal",
		"home.hero.title": "JANMIND",
		"home.hero.subtitle": "Make your city better, one report at a time.",
		"home.hero.desc": "Report civic problems with location and evidence. JANMIND helps connect individual complaints into larger patterns so public-service issues can be identified faster.",
		"home.hero.howitworks": "How it works",
		"home.hero.smallprint": "Takes about a minute. You don't need to know the department or the category — JANMIND suggests them for you.",
		"hiw.label": "How it works",
		"hiw.heading": "Four steps from a problem on your street to a tracked civic record.",
		"hiw.step1.title": "Report",
		"hiw.step1.body": "Tell JANMIND what happened.",
		"hiw.step2.title": "Location",
		"hiw.step2.body": "Use your current location or choose a location manually.",
		"hiw.step3.title": "Evidence",
		"hiw.step3.body": "Upload a photo if available.",
		"hiw.step4.title": "Track",
		"hiw.step4.body": "Follow your complaint and receive updates.",
		"pattern.label": "Pattern detection",
		"pattern.heading": "One report is a complaint. Many reports are a pattern.",
		"pattern.desc": "When several citizens describe a similar issue nearby, JANMIND groups them into an aggregated hotspot — without exposing anyone's identity or exact private address.",
		"pattern.bullet1": "23 similar reports within approximately 500m",
		"pattern.bullet2": "127 related reports in Ward 14",
		"pattern.bullet3": "Aggregate view only — no personal details shared",
		"pattern.issues.label": "Issues you can report",
		"pattern.startreport": "Start a report",
		"stats.label": "Civic intelligence — sample data",
		"stats.reports": "Related reports in Ward 14",
		"stats.types": "Issue types",
		"stats.update": "Median first update",
		"stats.cities": "Cities supported",
		"map.card.label": "Locality civic activity — sample data",
		"map.card.open": "Open Civic Map",
		"footer.brand": "JANMIND — Citizen Portal",
		"footer.note": "Prototype interface. Data shown is sample data.",
		"report.step.problem": "Problem",
		"report.step.location": "Location",
		"report.step.evidence": "Evidence",
		"report.step.review": "Review",
		"report.btn.continue": "Continue",
		"report.btn.back": "Back",
		"report.btn.submit": "Submit report",
		"register.access": "Citizen access",
		"register.heading": "Create your account",
		"register.subtext": "Your contact details stay private and are never shown on public maps.",
		"register.name": "Full name",
		"register.name.placeholder": "Your name",
		"register.email": "Email",
		"register.email.placeholder": "you@example.com",
		"register.phone": "Phone",
		"register.phone.placeholder": "+91 00000 00000",
		"register.password": "Password",
		"register.password.placeholder": "At least 8 characters",
		"register.password.error": "Password must be at least 8 characters.",
		"register.btn": "Create account",
		"register.btn.busy": "Creating account...",
		"register.success": "Account created",
		"register.error": "We couldn't create your account right now.",
		"register.existing": "Already registered?",
		"register.signin": "Sign in",
		"login.access": "Citizen access",
		"login.heading": "Sign in",
		"login.subtext": "Continue to your reports, notifications and complaint history.",
		"login.email": "Email",
		"login.email.placeholder": "you@example.com",
		"login.password": "Password",
		"login.btn": "Sign in",
		"login.btn.busy": "Signing in...",
		"login.success": "Signed in",
		"login.error": "We couldn't sign you in. Check your details and try again.",
		"login.new": "New to JANMIND?",
		"login.createaccount": "Create an account",
		"profile.title": "Profile settings",
		"profile.language": "Preferred language",
		"profile.theme": "Theme preference",
		"btn.save": "Save changes"
	},
	hi: {
		"ui.issue_mix_in_this_locality": "[HI] Issue mix in this locality",
		"ui.initializing_map": "[HI] Initializing map",
		"ui.loading_civic_map": "[HI] Loading civic map",
		"ui.loading_tiles": "[HI] Loading tiles…",
		"ui.loading_map": "[HI] Loading map",
		"ui.zoom_in": "[HI] Zoom in",
		"ui.zoom_out": "[HI] Zoom out",
		"ui.reset_map_view": "[HI] Reset map view",
		"ui.find_my_area": "[HI] Find my area",
		"ui.page_not_found": "[HI] Page not found",
		"ui.the_page_you_re_looking_for_do": "[HI] The page you're looking for doesn't exist or has been moved.",
		"ui.go_to_dashboard": "[HI] Go to dashboard",
		"ui.this_page_didn_t_load": "[HI] This page didn't load",
		"ui.something_went_wrong_on_our_en": "[HI] Something went wrong on our end. You can try refreshing or head back to the dashboard.",
		"ui.try_again": "[HI] Try again",
		"ui.dashboard": "डैशबोर्ड",
		"ui.janmind": "[HI] JANMIND",
		"ui.municipal_intelligence": "[HI] Municipal Intelligence",
		"ui.city": "शहर",
		"ui.role": "[HI] Role *",
		"ui.remember_session": "[HI] Remember session",
		"ui.forgot_password": "[HI] Forgot password?",
		"ui.janmind_municipal_intelligence": "[HI] JANMIND Municipal Intelligence Platform",
		"ui.officer_id_email": "[HI] Officer ID / Email",
		"ui.officer_vmc_gov_in": "[HI] officer@vmc.gov.in",
		"ui.password": "पासवर्ड",
		"ui.janmind_copilot": "[HI] JANMIND Copilot",
		"ui.ask_copilot": "[HI] Ask Copilot...",
		"ui.no_complaints_match_the_select": "[HI] No complaints match the selected filters.",
		"ui.complaint_id": "[HI] Complaint ID",
		"ui.category": "[HI] Category",
		"ui.area": "[HI] Area",
		"ui.ward": "[HI] Ward",
		"ui.severity": "[HI] Severity",
		"ui.department": "[HI] Department",
		"ui.status": "[HI] Status",
		"ui.created": "[HI] Created",
		"ui.select_all": "[HI] Select all",
		"ui.emerging_systemic_issue": "[HI] Emerging Systemic Issue",
		"ui.reports": "रिपोर्ट",
		"ui.risk": "[HI] Risk",
		"ui.trend": "[HI] Trend",
		"ui.dominant_issue": "[HI] Dominant issue",
		"ui.possible_cause": "[HI] Possible cause",
		"ui.view_intelligence": "[HI] View Intelligence",
		"ui.why_janmind_flagged_this": "[HI] Why JANMIND Flagged This",
		"ui.prototype_intelligence_data": "[HI] Prototype Intelligence Data",
		"ui.possible_root_cause": "[HI] Possible Root Cause",
		"ui.confidence": "[HI] Confidence:",
		"ui.inferred_candidate_based_on_co": "[HI] Inferred candidate based on complaint patterns. Not a confirmed physical\n        infrastructure failure.",
		"ui.recommended_action": "[HI] Recommended Action",
		"ui.start_investigation": "[HI] Start Investigation",
		"ui.assign_department": "[HI] Assign Department",
		"ui.create_field_action": "[HI] Create Field Action",
		"ui.mark_investigating": "[HI] Mark Investigating",
		"ui.filters": "फ़िल्टर",
		"ui.all_cities": "[HI] All cities",
		"ui.all_categories": "[HI] All categories",
		"ui.all_severities": "[HI] All severities",
		"ui.all_departments": "[HI] All departments",
		"ui.all_statuses": "[HI] All statuses",
		"ui.clear": "[HI] Clear",
		"ui.apply": "[HI] Apply",
		"ui.area_name": "[HI] Area name",
		"ui.issue": "[HI] Issue",
		"ui.risk_range": "[HI] Risk range",
		"ui.min": "[HI] Min",
		"ui.max": "[HI] Max",
		"ui.officer_activity_timeline": "[HI] Officer Activity Timeline",
		"ui.field_action": "[HI] Field Action",
		"ui.priority": "[HI] Priority",
		"ui.recommended": "[HI] Recommended",
		"ui.assign": "[HI] Assign",
		"ui.acknowledge": "[HI] Acknowledge",
		"ui.start": "[HI] Start",
		"ui.complete": "[HI] Complete",
		"ui.live_activity": "[HI] Live Activity",
		"ui.prototype_simulation": "[HI] Prototype simulation",
		"ui.search": "खोजें",
		"ui.open_navigation": "[HI] Open navigation",
		"ui.search_press": "[HI] Search (press /)",
		"ui.notifications": "सूचनाएं",
		"ui.officer_search": "[HI] Officer Search",
		"ui.searching": "[HI] Searching...",
		"ui.complaints": "शिकायतें",
		"ui.emerging_issues": "[HI] Emerging Issues",
		"ui.no_results_found": "[HI] No results found.",
		"ui.complaint_id_area_ward_issue_d": "[HI] Complaint ID, area, ward, issue, department...",
		"ui.close_navigation": "[HI] Close navigation",
		"ui.municipality_navigation": "[HI] Municipality navigation",
		"ui.mark_read": "[HI] Mark read",
		"ui.view_details": "[HI] View Details",
		"ui.janmind_prototype_risk_score": "[HI] JANMIND Prototype Risk Score",
		"ui.complaint_volume": "[HI] Complaint Volume",
		"ui.geographic_concentration": "[HI] Geographic Concentration",
		"ui.semantic_similarity": "[HI] Semantic Similarity",
		"ui.recent_growth": "[HI] Recent Growth",
		"ui.ai_triage_queue": "[HI] AI Triage Queue",
		"ui.review_incoming_complaints_fla": "[HI] Review incoming complaints flagged by JANMIND AI as potentially related to existing civic issues.",
		"ui.pending": "[HI] Pending",
		"ui.all_caught_up": "[HI] All caught up!",
		"ui.no_pending_complaints_require_": "[HI] No pending complaints require human review.",
		"ui.needs_review": "[HI] Needs Review",
		"ui.match": "[HI] % Match",
		"ui.candidate_civic_issue": "[HI] Candidate Civic Issue",
		"ui.existing_complaints": "[HI] existing complaints",
		"ui.merge_duplicate": "[HI] Merge (Duplicate)",
		"ui.split_unique": "[HI] Split (Unique)",
		"ui.operational_alerts": "[HI] Operational Alerts",
		"ui.city_wide_risk_notifications": "[HI] City-wide risk notifications",
		"ui.view_issue": "[HI] View Issue",
		"ui.no_alerts": "[HI] No alerts",
		"ui.city_analytics": "[HI] City Analytics",
		"ui.trends_and_distribution_insigh": "[HI] Trends and distribution insights",
		"ui.complaint_volume_trend": "[HI] Complaint Volume Trend",
		"ui.severity_distribution": "[HI] Severity distribution",
		"ui.department_workload": "[HI] Department Workload",
		"ui.category_distribution": "[HI] Category Distribution",
		"ui.emerging_issues_trend": "[HI] Emerging Issues Trend",
		"ui.average_response_time_days": "[HI] Average Response Time (days)",
		"ui.see_what_is_happening_across_y": "[HI] See what is happening across your city.",
		"ui.city_health": "[HI] City Health",
		"ui.7_day_activity_pulse": "[HI] 7-day activity pulse",
		"ui.issue_breakdown": "[HI] Issue breakdown",
		"ui.no_data_yet": "[HI] No data yet.",
		"ui.emerging_systemic_issues": "[HI] Emerging Systemic Issues",
		"ui.something_is_happening_in_thes": "[HI] Something is happening in these areas",
		"ui.view_all": "[HI] View All",
		"ui.hotspot_analysis": "[HI] Hotspot Analysis",
		"ui.total_reports": "[HI] Total Reports",
		"ui.critical": "[HI] critical",
		"ui.active": "[HI] Active",
		"ui.resolved": "[HI] Resolved",
		"ui.area_hotspots": "[HI] Area Hotspots",
		"ui.civic_map": "[HI] Civic Map",
		"ui.city_wide_operational_view": "[HI] City-wide operational view",
		"ui.7_day_pulse": "[HI] 7-day pulse",
		"ui.severity_mix": "[HI] Severity mix",
		"ui.no_data_under_filters": "[HI] No data under filters.",
		"ui.map_legend": "[HI] Map Legend",
		"ui.click_an_area_to_view_operatio": "[HI] Click an area to view operational details, complaint counts, trends and risk scores.\n                Individual complaint locations appear when zoomed in.",
		"ui.prototype_area_boundaries_not_": "[HI] Prototype area boundaries — not official ward delimitation.",
		"ui.area_details": "[HI] Area Details",
		"ui.prototype_area_boundary": "[HI] Prototype area boundary",
		"ui.7_day_trend": "[HI] 7-day trend",
		"ui.top_category": "[HI] Top category",
		"ui.local_7_day_trend": "[HI] Local 7-day trend",
		"ui.view_reports": "[HI] View Reports",
		"ui.view_emerging_issues": "[HI] View emerging issues",
		"ui.activity": "[HI] activity",
		"ui.officer_profile": "[HI] Officer Profile",
		"ui.officer_id": "[HI] Officer ID",
		"ui.last_active": "[HI] Last active",
		"ui.frontend_only_mock_authenticat": "[HI] Frontend-only mock authentication · Prototype Intelligence Data",
		"ui.sign_out": "[HI] Sign Out",
		"ui.portal_settings": "[HI] Portal Settings",
		"ui.preferences": "[HI] Preferences",
		"ui.settings_are_stored_locally_in": "[HI] Settings are stored locally in this prototype.",
		"ui.theme": "[HI] Theme",
		"ui.system": "[HI] System",
		"ui.dark": "[HI] Dark",
		"ui.light": "[HI] Light",
		"ui.default_city": "[HI] Default city",
		"ui.default_map_mode": "[HI] Default map mode",
		"ui.area_health": "[HI] Area Health",
		"ui.complaint_activity": "[HI] Complaint Activity",
		"ui.hotspots": "[HI] Hotspots",
		"ui.compact_mode": "[HI] Compact mode",
		"ui.area_intelligence": "[HI] Area Intelligence",
		"ui.neighbourhood_activity_overvie": "[HI] Neighbourhood activity overview",
		"ui.sort_by": "[HI] Sort by",
		"ui.all_civic_issues": "[HI] All Civic Issues",
		"ui.civic_issue_intelligence": "[HI] Civic Issue Intelligence",
		"ui.issue_summary": "[HI] Issue Summary",
		"ui.impact_score": "[HI] Impact Score",
		"ui.first_reported": "[HI] First Reported",
		"ui.linked_complaints": "[HI] Linked Complaints",
		"ui.jn_2026_00001": "[HI] JN-2026-00001",
		"ui.primary_reporter": "[HI] Primary reporter",
		"ui.split": "[HI] Split",
		"ui.jn_2026_00002": "[HI] JN-2026-00002",
		"ui.citizen_confirmation": "[HI] Citizen confirmation",
		"ui.merge_issue": "[HI] Merge Issue",
		"ui.if_this_issue_is_a_duplicate_o": "[HI] If this issue is a duplicate of another Civic Issue, you can merge them together to consolidate impact scores and reports.",
		"ui.select_target_issue": "[HI] Select target issue...",
		"ui.confirm_merge": "[HI] Confirm Merge",
		"ui.cancel": "[HI] Cancel",
		"ui.merge_with_another_issue": "[HI] Merge with another issue",
		"ui.work_execution": "[HI] Work Execution",
		"ui.this_civic_issue_is_ready_to_b": "[HI] This Civic Issue is ready to be converted into a Work Package for contractors.",
		"ui.create_work_package": "[HI] Create Work Package",
		"ui.civic_issues": "[HI] Civic Issues",
		"ui.clustered_citizen_reports": "[HI] Clustered Citizen Reports",
		"ui.intelligence_layer_identifying": "[HI] Intelligence layer identifying singular problems from multiple citizen reports.",
		"ui.impact": "[HI] Impact:",
		"ui.review": "[HI] Review",
		"ui.no_civic_issues": "[HI] No civic issues",
		"ui.all_complaints": "[HI] All complaints",
		"ui.report_details": "[HI] Report Details",
		"ui.assigned_to": "[HI] Assigned to",
		"ui.last_updated": "[HI] Last updated:",
		"ui.ai_intelligence_analysis": "[HI] AI Intelligence Analysis",
		"ui.detected_category": "[HI] Detected category",
		"ui.urgency": "[HI] Urgency",
		"ui.similarity_match": "[HI] Similarity match",
		"ui.cluster": "[HI] Cluster",
		"ui.view_related_systemic_issue": "[HI] View related systemic issue →",
		"ui.location": "[HI] Location",
		"ui.officer_actions": "[HI] Officer Actions",
		"ui.verify_accept_complaint": "[HI] ✓ Verify & Accept Complaint",
		"ui.reject_as_invalid": "[HI] ✕ Reject as Invalid",
		"ui.classify_route": "[HI] Classify & Route",
		"ui.link_to_civic_issue": "[HI] Link to Civic Issue",
		"ui.create_procurement_opportunity": "[HI] Create Procurement Opportunity",
		"ui.complaint_management": "[HI] Complaint Management",
		"ui.all_civic_reports": "[HI] All civic reports",
		"ui.complaints_prototype_intellige": "[HI] complaints · Prototype Intelligence Data",
		"ui.export": "[HI] Export",
		"ui.selected": "[HI] selected",
		"ui.bulk_verify": "[HI] ✓ Bulk Verify",
		"ui.bulk_classify": "[HI] Bulk Classify",
		"ui.department_detail": "[HI] Department Detail",
		"ui.average_response_time": "[HI] Average response time:",
		"ui.days": "[HI] days",
		"ui.category_breakdown": "[HI] Category Breakdown",
		"ui.view_department_complaints": "[HI] View department complaints",
		"ui.open": "[HI] Open",
		"ui.in_progress": "[HI] In progress",
		"ui.department_overview": "[HI] Department Overview",
		"ui.operational_workload_by_depart": "[HI] Operational workload by department",
		"ui.avg_response": "[HI] Avg response",
		"ui.systemic_issue_intelligence": "[HI] Systemic Issue Intelligence",
		"ui.updated": "[HI] Updated",
		"ui.related_complaints": "[HI] Related Complaints",
		"ui.patterns_janmind_has_detected": "[HI] Patterns JANMIND has detected",
		"ui.no_critical_issues": "[HI] No critical issues",
		"ui.all_tenders": "[HI] All tenders",
		"ui.tender_details": "[HI] Tender Details",
		"ui.estimated_cost": "[HI] Estimated Cost (₹)",
		"ui.civic_issue_id": "[HI] Civic Issue ID",
		"ui.scope_of_work": "[HI] Scope of Work",
		"ui.submitted_bids": "[HI] Submitted Bids (",
		"ui.loading_bids": "[HI] Loading bids...",
		"ui.no_bids_submitted_yet": "[HI] No bids submitted yet.",
		"ui.contractor_id": "[HI] Contractor ID:",
		"ui.bid_id": "[HI] Bid ID:",
		"ui.tender_info": "[HI] Tender Info",
		"ui.tenders": "[HI] Tenders",
		"ui.tender": "[HI] tender",
		"ui.publish_tender": "[HI] Publish Tender",
		"ui.no_tenders_published_yet": "[HI] No tenders published yet.",
		"ui.define_public_procurement_requ": "[HI] Define public procurement requirements",
		"ui.title": "[HI] Title",
		"ui.description": "[HI] Description",
		"ui.civic_issue_ids_comma_separate": "[HI] Civic Issue IDs (comma-separated)",
		"ui.road_repair_ward_14_sarvodaya_": "[HI] Road Repair — Ward 14, Sarvodaya Nagar",
		"ui.describe_the_civic_issue_and_w": "[HI] Describe the civic issue and why work is needed...",
		"ui.ward_14": "[HI] Ward 14",
		"ui.sarvodaya_nagar": "[HI] Sarvodaya Nagar",
		"ui.1_pothole_patching_10_2_road_m": "[HI] 1. Pothole patching...&#10;2. Road milling...",
		"ui.ci_171850389_ci_2819030": "[HI] CI-171850389, CI-2819030",
		"ui.all_work_orders": "[HI] All work orders",
		"ui.overdue": "[HI] (overdue)",
		"ui.work_order_details": "[HI] Work Order Details",
		"ui.contractor": "[HI] Contractor",
		"ui.assigned_engineer": "[HI] Assigned Engineer",
		"ui.start_date": "[HI] Start Date",
		"ui.sla_deadline": "[HI] SLA Deadline",
		"ui.bill_of_quantities": "[HI] Bill of Quantities",
		"ui.unit": "[HI] Unit",
		"ui.qty": "[HI] Qty",
		"ui.rate": "[HI] Rate",
		"ui.amount": "[HI] Amount",
		"ui.total": "[HI] Total",
		"ui.approved_amount": "[HI] Approved Amount",
		"ui.record_inspection": "[HI] Record Inspection",
		"ui.record_site_inspection": "[HI] Record Site Inspection",
		"ui.inspection_notes": "[HI] Inspection Notes",
		"ui.verify_measurement": "[HI] Verify Measurement",
		"ui.verify_measurement_proceed_to_": "[HI] Verify Measurement & Proceed to Billing",
		"ui.verified_total_amount": "[HI] Verified Total Amount (₹)",
		"ui.bill_approval": "[HI] Bill Approval",
		"ui.contractor_submitted_bill_for": "[HI] Contractor submitted bill for",
		"ui.close_work_order": "[HI] Close Work Order",
		"ui.payment_approved_close_the_wor": "[HI] Payment approved. Close the work order to resolve all linked complaints.",
		"ui.work_order_timeline": "[HI] Work Order Timeline",
		"ui.linked_civic_issues": "[HI] Linked Civic Issues (",
		"ui.evidence_ai_validation": "[HI] Evidence & AI Validation",
		"ui.ai_relevance": "[HI] AI Relevance:",
		"ui.tamper_risk": "[HI] Tamper Risk:",
		"ui.gps_distance": "[HI] GPS Distance:",
		"ui.m": "[HI] m",
		"ui.no_evidence_submitted_yet": "[HI] No evidence submitted yet.",
		"ui.financial_summary": "[HI] Financial Summary",
		"ui.estimated": "[HI] Estimated",
		"ui.approved": "[HI] Approved",
		"ui.bill_approved": "[HI] Bill Approved",
		"ui.quick_actions": "[HI] Quick Actions",
		"ui.view_work_package": "[HI] View Work Package",
		"ui.describe_findings_quality_obse": "[HI] Describe findings, quality observations, deficiencies...",
		"ui.work_orders": "[HI] Work Orders",
		"ui.work_order": "[HI] work order",
		"ui.no_work_orders_found": "[HI] No work orders found.",
		"ui.due": "[HI] Due:",
		"ui.contractor_portal": "[HI] Contractor Portal",
		"ui.email_address": "[HI] Email Address",
		"ui.sign_in_with_your_registered_c": "[HI] Sign in with your registered contractor account.",
		"ui.contact_your_administrator_if_": "[HI] Contact your administrator if you need access.",
		"ui.suresh_patel_bharatinfra_in": "[HI] suresh.patel@bharatinfra.in",
		"ui.contractor_operations_center": "[HI] Contractor Operations Center",
		"ui.ai_operations_brief": "[HI] AI Operations Brief",
		"ui.you_have": "[HI] You have",
		"ui.active_work_orders": "[HI] Active Work Orders",
		"ui.projects_are_currently_at_high": "[HI] projects are currently at high schedule risk.",
		"ui.work_orders_are_awaiting_munic": "[HI] work orders are awaiting municipal inspection.",
		"ui.eligible_tenders_close_within_": "[HI] eligible tenders close within the next 72 hours.",
		"ui.needs_your_attention": "[HI] NEEDS YOUR ATTENTION",
		"ui.behind_schedule": "[HI] - Behind Schedule",
		"ui.provide_evidence": "[HI] Provide Evidence →",
		"ui.inspection_pending": "[HI] Inspection Pending",
		"ui.payments_pending": "[HI] Payments Pending",
		"ui.risk_alerts": "[HI] Risk Alerts",
		"ui.active_project_health": "[HI] Active Project Health",
		"ui.no_active_projects": "[HI] No active projects.",
		"ui.planned": "[HI] Planned:",
		"ui.verified": "[HI] Verified",
		"ui.recommended_tender_opportuniti": "[HI] Recommended Tender Opportunities",
		"ui.view_market": "[HI] View Market",
		"ui.no_matching_tenders_available_": "[HI] No matching tenders available in your registered cities.",
		"ui.high_match": "[HI] HIGH MATCH",
		"ui.closes": "[HI] Closes:",
		"ui.performance_metrics": "[HI] Performance Metrics",
		"ui.track_your_company_s_rating_an": "[HI] Track your company's rating and operational statistics.",
		"ui.overall_rating": "[HI] Overall Rating",
		"ui.out_of_100": "[HI] out of 100",
		"ui.sla_compliance": "[HI] SLA Compliance",
		"ui.target_gt_90": "[HI] Target: &gt; 90%",
		"ui.first_time_inspection_pass": "[HI] First-Time Inspection Pass",
		"ui.target_gt_85": "[HI] Target: &gt; 85%",
		"ui.on_time_completion": "[HI] On-Time Completion",
		"ui.target_gt_95": "[HI] Target: &gt; 95%",
		"ui.total_historical_work_orders": "[HI] Total Historical Work Orders",
		"ui.lifetime_completed": "[HI] Lifetime completed",
		"ui.score_trend_last_4_quarters": "[HI] Score Trend (Last 4 Quarters)",
		"ui.company_profile_data": "[HI] Company Profile Data",
		"ui.specializations": "[HI] Specializations",
		"ui.service_wards": "[HI] Service Wards",
		"ui.company_profile": "[HI] Company Profile",
		"ui.manage_your_business_informati": "[HI] Manage your business information and registration details.",
		"ui.verified_contractor": "[HI] Verified Contractor",
		"ui.contact_details": "[HI] Contact Details",
		"ui.phone": "[HI] Phone",
		"ui.email": "[HI] Email *",
		"ui.address": "[HI] Address",
		"ui.company_information": "[HI] Company Information",
		"ui.company_name": "[HI] Company Name",
		"ui.id": "[HI] ID:",
		"ui.legal_registration": "[HI] Legal & Registration",
		"ui.registration_number": "[HI] Registration Number",
		"ui.gstin": "[HI] GSTIN",
		"ui.pan": "[HI] PAN",
		"ui.user": "[HI] User",
		"ui.loading_tender": "[HI] Loading tender...",
		"ui.tender_not_found": "[HI] Tender not found.",
		"ui.back_to_tenders": "[HI] Back to Tenders",
		"ui.est_budget": "[HI] Est. Budget",
		"ui.submit_sealed_bid": "[HI] Submit Sealed Bid",
		"ui.quoted_amount": "[HI] Quoted Amount (₹)",
		"ui.technical_proposal_notes": "[HI] Technical Proposal / Notes",
		"ui.e_g_500000": "[HI] e.g. 500000",
		"ui.detail_your_approach_timeline_": "[HI] Detail your approach, timeline, and resources...",
		"ui.tenders_amp_bidding": "[HI] Tenders &amp; Bidding",
		"ui.open_procurement_opportunities": "[HI] Open procurement opportunities you are eligible for.",
		"ui.no_open_tenders_found_for_your": "[HI] No open tenders found for your approved categories and cities.",
		"ui.your_contractor_profile_must_b": "[HI] Your contractor profile must be approved in a city before tenders appear here.",
		"ui.back_to_work_orders": "[HI] Back to Work Orders",
		"ui.contract_value": "[HI] Contract Value",
		"ui.estimated_budget": "[HI] Estimated Budget",
		"ui.risk_level": "[HI] Risk Level",
		"ui.issued_on": "[HI] Issued On",
		"ui.target_completion": "[HI] Target Completion",
		"ui.execution_progress": "[HI] Execution Progress",
		"ui.submit_field_evidence": "[HI] Submit Field Evidence",
		"ui.stage": "[HI] Stage",
		"ui.before_repair": "[HI] Before Repair",
		"ui.start_of_work": "[HI] Start of Work",
		"ui.during_execution": "[HI] During Execution",
		"ui.completion": "[HI] Completion",
		"ui.description_optional": "[HI] Description (optional)",
		"ui.photo": "[HI] Photo",
		"ui.awaiting_municipal_inspection": "[HI] Awaiting Municipal Inspection",
		"ui.evidence_has_been_submitted_a_": "[HI] Evidence has been submitted. A municipal officer will review and either pass or\n                    request rework.",
		"ui.rework_required": "[HI] Rework Required",
		"ui.the_municipal_inspection_did_n": "[HI] The municipal inspection did not pass. Please address the issues and resubmit\n                    evidence.",
		"ui.resubmit_for_inspection": "[HI] Resubmit for Inspection",
		"ui.work_completed": "[HI] Work Completed",
		"ui.this_work_order_has_been_inspe": "[HI] This work order has been inspected and marked complete. The linked civic issue\n                    and citizen complaints have been resolved automatically.",
		"ui.quick_info": "[HI] Quick Info",
		"ui.awarded_by": "[HI] Awarded By",
		"ui.award_value": "[HI] Award Value",
		"ui.tender_id": "[HI] Tender ID",
		"ui.brief_note_about_the_photo": "[HI] Brief note about the photo…",
		"ui.no_work_orders_found_for_the_s": "[HI] No work orders found for the selected filter.",
		"ui.issued": "[HI] Issued:",
		"ui.janmind_admin": "[HI] JANMIND Admin",
		"ui.platform_administration": "[HI] Platform Administration",
		"ui.sign_in_to_platform": "[HI] Sign In to Platform",
		"ui.admin_janmind_gov_in": "[HI] admin@janmind.gov.in",
		"ui.system_audit_logs": "[HI] System Audit Logs",
		"ui.immutable_record_of_platform_a": "[HI] Immutable record of platform activities",
		"ui.all_roles": "[HI] All Roles",
		"ui.all_entities": "[HI] All Entities",
		"ui.timestamp": "[HI] Timestamp",
		"ui.actor": "[HI] Actor",
		"ui.action": "[HI] Action",
		"ui.target_entity": "[HI] Target Entity",
		"ui.details": "[HI] Details",
		"ui.no_details": "[HI] No details",
		"ui.no_audit_logs_match_your_crite": "[HI] No audit logs match your criteria.",
		"ui.refresh": "[HI] Refresh",
		"ui.search_actor_or_action": "[HI] Search actor or action...",
		"ui.make_sure_you_are_logged_in_wi": "[HI] Make sure you are logged in with an admin account.",
		"ui.live_platform_data": "[HI] Live Platform Data",
		"ui.platform_dashboard": "[HI] Platform Dashboard",
		"ui.real_time_overview_from_the_ba": "[HI] Real-time overview from the backend database",
		"ui.total_complaints": "[HI] Total Complaints",
		"ui.work_order_status_distribution": "[HI] Work Order Status Distribution",
		"ui.recent_work_orders": "[HI] Recent Work Orders",
		"ui.no_work_orders_yet": "[HI] No work orders yet",
		"ui.total_users": "[HI] Total Users",
		"ui.officers": "[HI] Officers",
		"ui.contractors": "[HI] Contractors",
		"ui.active_work": "[HI] Active Work",
		"ui.open_complaints": "[HI] Open Complaints",
		"ui.cities": "[HI] Cities",
		"ui.platform_settings": "[HI] Platform Settings",
		"ui.system_configuration_and_admin": "[HI] System configuration and administration",
		"ui.global_notification_settings": "[HI] Global Notification Settings",
		"ui.platform_name": "[HI] Platform Name",
		"ui.janmind_civic_infrastructure_p": "[HI] JANMIND Civic Infrastructure Platform",
		"ui.environment": "[HI] Environment",
		"ui.prototype_demo": "[HI] Prototype / Demo",
		"ui.version": "[HI] Version",
		"ui.v1_0_0_prototype": "[HI] v1.0.0-prototype",
		"ui.storage_mode": "[HI] Storage Mode",
		"ui.browser_localstorage": "[HI] Browser LocalStorage",
		"ui.security_authentication": "[HI] Security & Authentication",
		"ui.danger_zone": "[HI] Danger Zone",
		"ui.reset_prototype_data": "[HI] Reset Prototype Data",
		"ui.this_will_clear_all_shared_pro": "[HI] This will clear all shared prototype data (contractors, work orders, audit logs, SLA rules) from local storage. Default mock data will be re-initialized on next load.",
		"ui.clear_all_data": "[HI] Clear All Data",
		"ui.sla_configuration": "[HI] SLA Configuration",
		"ui.define_response_and_resolution": "[HI] Define response and resolution time limits across categories",
		"ui.response_hrs": "[HI] Response (Hrs)",
		"ui.resolution_hrs": "[HI] Resolution (Hrs)",
		"ui.escalation_hrs": "[HI] Escalation (Hrs)",
		"ui.user_management": "[HI] User Management",
		"ui.total_users_across_all_roles": "[HI] total users across all roles",
		"ui.add_user": "[HI] Add User",
		"ui.name": "[HI] Name",
		"ui.actions": "[HI] Actions",
		"ui.no_users_found": "[HI] No users found",
		"ui.full_name": "[HI] Full Name *",
		"ui.none": "[HI] — None —",
		"ui.search_name_email_city": "[HI] Search name, email, city...",
		"ui.edit_user": "[HI] Edit user",
		"ui.delete_user": "[HI] Delete user",
		"ui.e_g_priya_sharma": "[HI] e.g. Priya Sharma",
		"ui.user_example_com": "[HI] user@example.com",
		"ui.min_8_characters": "[HI] Min 8 characters",
		"ui.e_g_roads": "[HI] e.g. Roads",
		"ui.platform_work_orders": "[HI] Platform Work Orders",
		"ui.global_view_of_all_municipal_w": "[HI] Global view of all municipal work orders",
		"ui.global_work_order_distribution": "[HI] Global Work Order Distribution",
		"ui.status_breakdown_across_all_ci": "[HI] Status breakdown across all cities",
		"ui.id_title": "[HI] ID / Title",
		"ui.municipality": "[HI] Municipality",
		"ui.no_work_orders_found_in_the_pl": "[HI] No work orders found in the platform.",
		"ui.registration": "[HI] Registration:",
		"ui.current_status": "[HI] Current Status",
		"ui.verify_contractor": "[HI] Verify Contractor",
		"ui.suspend_contractor": "[HI] Suspend Contractor",
		"ui.tax_id_pan": "[HI] Tax ID / PAN",
		"ui.contractor_tier": "[HI] Contractor Tier",
		"ui.class_a": "[HI] Class A",
		"ui.registration_compliance": "[HI] Registration & Compliance",
		"ui.document_type": "[HI] Document Type",
		"ui.uploaded_date": "[HI] Uploaded Date",
		"ui.no_documents_uploaded": "[HI] No documents uploaded",
		"ui.system_security_logging": "[HI] System Security Logging",
		"ui.pending_verification": "[HI] Pending Verification",
		"ui.suspended": "[HI] Suspended",
		"ui.not_found": "[HI] Not Found",
		"ui.overall_score": "[HI] Overall Score",
		"ui.inspection_pass_rate": "[HI] Inspection Pass Rate",
		"ui.contractor_registry": "[HI] Contractor Registry",
		"ui.manage_and_verify_platform_con": "[HI] Manage and verify platform contractors",
		"ui.reg": "[HI] Reg:",
		"ui.more": "[HI] more",
		"ui.verify": "[HI] Verify",
		"ui.suspend": "[HI] Suspend",
		"ui.no_contractors_found_matching_": "[HI] No contractors found matching your criteria.",
		"ui.search_by_name_or_registration": "[HI] Search by name or registration number...",
		"nav.home": "होम",
		"nav.howitworks": "कैसे काम करता है",
		"nav.map": "नागरिक मानचित्र",
		"nav.report": "समस्या दर्ज करें",
		"nav.complaints": "मेरी शिकायतें",
		"nav.notifications": "सूचनाएं",
		"nav.profile": "प्रोफ़ाइल",
		"nav.signin": "साइन इन करें",
		"nav.signout": "साइन आउट",
		"home.hero.badge": "नागरिक पोर्टल",
		"home.hero.title": "जनमाइंड",
		"home.hero.subtitle": "अपने शहर को बेहतर बनाएं, एक बार में एक रिपोर्ट।",
		"home.hero.desc": "स्थान और साक्ष्य के साथ नागरिक समस्याओं की रिपोर्ट करें। JANMIND व्यक्तिगत शिकायतों को बड़े पैटर्न से जोड़ने में मदद करता है।",
		"home.hero.howitworks": "यह कैसे काम करता है",
		"home.hero.smallprint": "लगभग एक मिनट लगता है। आपको विभाग या श्रेणी जानने की ज़रूरत नहीं — JANMIND आपके लिए सुझाव देता है।",
		"hiw.label": "यह कैसे काम करता है",
		"hiw.heading": "सड़क की समस्या से नागरिक रिकॉर्ड तक — चार आसान कदम।",
		"hiw.step1.title": "रिपोर्ट",
		"hiw.step1.body": "JANMIND को बताएं क्या हुआ।",
		"hiw.step2.title": "स्थान",
		"hiw.step2.body": "अपना वर्तमान स्थान उपयोग करें या मैन्युअल रूप से चुनें।",
		"hiw.step3.title": "प्रमाण",
		"hiw.step3.body": "यदि उपलब्ध हो तो फ़ोटो अपलोड करें।",
		"hiw.step4.title": "ट्रैक करें",
		"hiw.step4.body": "अपनी शिकायत की प्रगति देखें और अपडेट पाएं।",
		"pattern.label": "पैटर्न पहचान",
		"pattern.heading": "एक रिपोर्ट एक शिकायत है। कई रिपोर्ट एक पैटर्न हैं।",
		"pattern.desc": "जब कई नागरिक पास में एक जैसी समस्या बताते हैं, तो JANMIND उन्हें एक समूह में जोड़ता है — किसी की पहचान या पता उजागर किए बिना।",
		"pattern.bullet1": "लगभग 500 मीटर में 23 समान रिपोर्ट",
		"pattern.bullet2": "वार्ड 14 में 127 संबंधित रिपोर्ट",
		"pattern.bullet3": "केवल समेकित दृश्य — कोई व्यक्तिगत विवरण साझा नहीं",
		"pattern.issues.label": "जो समस्याएं आप रिपोर्ट कर सकते हैं",
		"pattern.startreport": "रिपोर्ट शुरू करें",
		"stats.label": "नागरिक जानकारी — नमूना डेटा",
		"stats.reports": "वार्ड 14 में संबंधित रिपोर्ट",
		"stats.types": "समस्या प्रकार",
		"stats.update": "पहला अपडेट औसत समय",
		"stats.cities": "समर्थित शहर",
		"map.card.label": "स्थानीय नागरिक गतिविधि — नमूना डेटा",
		"map.card.open": "नागरिक मानचित्र खोलें",
		"footer.brand": "JANMIND — नागरिक पोर्टल",
		"footer.note": "प्रोटोटाइप इंटरफ़ेस। दिखाया गया डेटा नमूना डेटा है।",
		"report.step.problem": "समस्या",
		"report.step.location": "स्थान",
		"report.step.evidence": "प्रमाण",
		"report.step.review": "समीक्षा",
		"report.btn.continue": "आगे बढ़ें",
		"report.btn.back": "पीछे",
		"report.btn.submit": "रिपोर्ट जमा करें",
		"register.access": "नागरिक पहुंच",
		"register.heading": "अपना खाता बनाएं",
		"register.subtext": "आपका संपर्क विवरण निजी रहता है और सार्वजनिक मानचित्रों पर नहीं दिखाया जाता।",
		"register.name": "पूरा नाम",
		"register.name.placeholder": "आपका नाम",
		"register.email": "ईमेल",
		"register.email.placeholder": "आप@उदाहरण.com",
		"register.phone": "फ़ोन",
		"register.phone.placeholder": "+91 00000 00000",
		"register.password": "पासवर्ड",
		"register.password.placeholder": "कम से कम 8 अक्षर",
		"register.password.error": "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
		"register.btn": "खाता बनाएं",
		"register.btn.busy": "खाता बन रहा है...",
		"register.success": "खाता बनाया गया",
		"register.error": "अभी आपका खाता नहीं बनाया जा सका।",
		"register.existing": "पहले से पंजीकृत हैं?",
		"register.signin": "साइन इन करें",
		"login.access": "नागरिक पहुंच",
		"login.heading": "साइन इन करें",
		"login.subtext": "अपनी रिपोर्ट, सूचनाओं और शिकायत इतिहास पर वापस जाएं।",
		"login.email": "ईमेल",
		"login.email.placeholder": "आप@उदाहरण.com",
		"login.password": "पासवर्ड",
		"login.btn": "साइन इन करें",
		"login.btn.busy": "साइन इन हो रहा है...",
		"login.success": "साइन इन हो गया",
		"login.error": "साइन इन नहीं हो सका। अपनी जानकारी जांचें।",
		"login.new": "JANMIND पर नए हैं?",
		"login.createaccount": "खाता बनाएं",
		"profile.title": "प्रोफ़ाइल सेटिंग्स",
		"profile.language": "पसंदीदा भाषा",
		"profile.theme": "थीम वरीयता",
		"btn.save": "बदलाव सहेजें"
	},
	gu: {
		"ui.issue_mix_in_this_locality": "[GU] Issue mix in this locality",
		"ui.initializing_map": "[GU] Initializing map",
		"ui.loading_civic_map": "[GU] Loading civic map",
		"ui.loading_tiles": "[GU] Loading tiles…",
		"ui.loading_map": "[GU] Loading map",
		"ui.zoom_in": "[GU] Zoom in",
		"ui.zoom_out": "[GU] Zoom out",
		"ui.reset_map_view": "[GU] Reset map view",
		"ui.find_my_area": "[GU] Find my area",
		"ui.page_not_found": "[GU] Page not found",
		"ui.the_page_you_re_looking_for_do": "[GU] The page you're looking for doesn't exist or has been moved.",
		"ui.go_to_dashboard": "[GU] Go to dashboard",
		"ui.this_page_didn_t_load": "[GU] This page didn't load",
		"ui.something_went_wrong_on_our_en": "[GU] Something went wrong on our end. You can try refreshing or head back to the dashboard.",
		"ui.try_again": "[GU] Try again",
		"ui.dashboard": "ડેશબોર્ડ",
		"ui.janmind": "[GU] JANMIND",
		"ui.municipal_intelligence": "[GU] Municipal Intelligence",
		"ui.city": "શહેર",
		"ui.role": "[GU] Role *",
		"ui.remember_session": "[GU] Remember session",
		"ui.forgot_password": "[GU] Forgot password?",
		"ui.janmind_municipal_intelligence": "[GU] JANMIND Municipal Intelligence Platform",
		"ui.officer_id_email": "[GU] Officer ID / Email",
		"ui.officer_vmc_gov_in": "[GU] officer@vmc.gov.in",
		"ui.password": "પાસવર્ડ",
		"ui.janmind_copilot": "[GU] JANMIND Copilot",
		"ui.ask_copilot": "[GU] Ask Copilot...",
		"ui.no_complaints_match_the_select": "[GU] No complaints match the selected filters.",
		"ui.complaint_id": "[GU] Complaint ID",
		"ui.category": "[GU] Category",
		"ui.area": "[GU] Area",
		"ui.ward": "[GU] Ward",
		"ui.severity": "[GU] Severity",
		"ui.department": "[GU] Department",
		"ui.status": "[GU] Status",
		"ui.created": "[GU] Created",
		"ui.select_all": "[GU] Select all",
		"ui.emerging_systemic_issue": "[GU] Emerging Systemic Issue",
		"ui.reports": "રિપોર્ટ",
		"ui.risk": "[GU] Risk",
		"ui.trend": "[GU] Trend",
		"ui.dominant_issue": "[GU] Dominant issue",
		"ui.possible_cause": "[GU] Possible cause",
		"ui.view_intelligence": "[GU] View Intelligence",
		"ui.why_janmind_flagged_this": "[GU] Why JANMIND Flagged This",
		"ui.prototype_intelligence_data": "[GU] Prototype Intelligence Data",
		"ui.possible_root_cause": "[GU] Possible Root Cause",
		"ui.confidence": "[GU] Confidence:",
		"ui.inferred_candidate_based_on_co": "[GU] Inferred candidate based on complaint patterns. Not a confirmed physical\n        infrastructure failure.",
		"ui.recommended_action": "[GU] Recommended Action",
		"ui.start_investigation": "[GU] Start Investigation",
		"ui.assign_department": "[GU] Assign Department",
		"ui.create_field_action": "[GU] Create Field Action",
		"ui.mark_investigating": "[GU] Mark Investigating",
		"ui.filters": "ફિલ્ટર",
		"ui.all_cities": "[GU] All cities",
		"ui.all_categories": "[GU] All categories",
		"ui.all_severities": "[GU] All severities",
		"ui.all_departments": "[GU] All departments",
		"ui.all_statuses": "[GU] All statuses",
		"ui.clear": "[GU] Clear",
		"ui.apply": "[GU] Apply",
		"ui.area_name": "[GU] Area name",
		"ui.issue": "[GU] Issue",
		"ui.risk_range": "[GU] Risk range",
		"ui.min": "[GU] Min",
		"ui.max": "[GU] Max",
		"ui.officer_activity_timeline": "[GU] Officer Activity Timeline",
		"ui.field_action": "[GU] Field Action",
		"ui.priority": "[GU] Priority",
		"ui.recommended": "[GU] Recommended",
		"ui.assign": "[GU] Assign",
		"ui.acknowledge": "[GU] Acknowledge",
		"ui.start": "[GU] Start",
		"ui.complete": "[GU] Complete",
		"ui.live_activity": "[GU] Live Activity",
		"ui.prototype_simulation": "[GU] Prototype simulation",
		"ui.search": "શોધો",
		"ui.open_navigation": "[GU] Open navigation",
		"ui.search_press": "[GU] Search (press /)",
		"ui.notifications": "સૂચનાઓ",
		"ui.officer_search": "[GU] Officer Search",
		"ui.searching": "[GU] Searching...",
		"ui.complaints": "ફરિયાદો",
		"ui.emerging_issues": "[GU] Emerging Issues",
		"ui.no_results_found": "[GU] No results found.",
		"ui.complaint_id_area_ward_issue_d": "[GU] Complaint ID, area, ward, issue, department...",
		"ui.close_navigation": "[GU] Close navigation",
		"ui.municipality_navigation": "[GU] Municipality navigation",
		"ui.mark_read": "[GU] Mark read",
		"ui.view_details": "[GU] View Details",
		"ui.janmind_prototype_risk_score": "[GU] JANMIND Prototype Risk Score",
		"ui.complaint_volume": "[GU] Complaint Volume",
		"ui.geographic_concentration": "[GU] Geographic Concentration",
		"ui.semantic_similarity": "[GU] Semantic Similarity",
		"ui.recent_growth": "[GU] Recent Growth",
		"ui.ai_triage_queue": "[GU] AI Triage Queue",
		"ui.review_incoming_complaints_fla": "[GU] Review incoming complaints flagged by JANMIND AI as potentially related to existing civic issues.",
		"ui.pending": "[GU] Pending",
		"ui.all_caught_up": "[GU] All caught up!",
		"ui.no_pending_complaints_require_": "[GU] No pending complaints require human review.",
		"ui.needs_review": "[GU] Needs Review",
		"ui.match": "[GU] % Match",
		"ui.candidate_civic_issue": "[GU] Candidate Civic Issue",
		"ui.existing_complaints": "[GU] existing complaints",
		"ui.merge_duplicate": "[GU] Merge (Duplicate)",
		"ui.split_unique": "[GU] Split (Unique)",
		"ui.operational_alerts": "[GU] Operational Alerts",
		"ui.city_wide_risk_notifications": "[GU] City-wide risk notifications",
		"ui.view_issue": "[GU] View Issue",
		"ui.no_alerts": "[GU] No alerts",
		"ui.city_analytics": "[GU] City Analytics",
		"ui.trends_and_distribution_insigh": "[GU] Trends and distribution insights",
		"ui.complaint_volume_trend": "[GU] Complaint Volume Trend",
		"ui.severity_distribution": "[GU] Severity distribution",
		"ui.department_workload": "[GU] Department Workload",
		"ui.category_distribution": "[GU] Category Distribution",
		"ui.emerging_issues_trend": "[GU] Emerging Issues Trend",
		"ui.average_response_time_days": "[GU] Average Response Time (days)",
		"ui.see_what_is_happening_across_y": "[GU] See what is happening across your city.",
		"ui.city_health": "[GU] City Health",
		"ui.7_day_activity_pulse": "[GU] 7-day activity pulse",
		"ui.issue_breakdown": "[GU] Issue breakdown",
		"ui.no_data_yet": "[GU] No data yet.",
		"ui.emerging_systemic_issues": "[GU] Emerging Systemic Issues",
		"ui.something_is_happening_in_thes": "[GU] Something is happening in these areas",
		"ui.view_all": "[GU] View All",
		"ui.hotspot_analysis": "[GU] Hotspot Analysis",
		"ui.total_reports": "[GU] Total Reports",
		"ui.critical": "[GU] critical",
		"ui.active": "[GU] Active",
		"ui.resolved": "[GU] Resolved",
		"ui.area_hotspots": "[GU] Area Hotspots",
		"ui.civic_map": "[GU] Civic Map",
		"ui.city_wide_operational_view": "[GU] City-wide operational view",
		"ui.7_day_pulse": "[GU] 7-day pulse",
		"ui.severity_mix": "[GU] Severity mix",
		"ui.no_data_under_filters": "[GU] No data under filters.",
		"ui.map_legend": "[GU] Map Legend",
		"ui.click_an_area_to_view_operatio": "[GU] Click an area to view operational details, complaint counts, trends and risk scores.\n                Individual complaint locations appear when zoomed in.",
		"ui.prototype_area_boundaries_not_": "[GU] Prototype area boundaries — not official ward delimitation.",
		"ui.area_details": "[GU] Area Details",
		"ui.prototype_area_boundary": "[GU] Prototype area boundary",
		"ui.7_day_trend": "[GU] 7-day trend",
		"ui.top_category": "[GU] Top category",
		"ui.local_7_day_trend": "[GU] Local 7-day trend",
		"ui.view_reports": "[GU] View Reports",
		"ui.view_emerging_issues": "[GU] View emerging issues",
		"ui.activity": "[GU] activity",
		"ui.officer_profile": "[GU] Officer Profile",
		"ui.officer_id": "[GU] Officer ID",
		"ui.last_active": "[GU] Last active",
		"ui.frontend_only_mock_authenticat": "[GU] Frontend-only mock authentication · Prototype Intelligence Data",
		"ui.sign_out": "[GU] Sign Out",
		"ui.portal_settings": "[GU] Portal Settings",
		"ui.preferences": "[GU] Preferences",
		"ui.settings_are_stored_locally_in": "[GU] Settings are stored locally in this prototype.",
		"ui.theme": "[GU] Theme",
		"ui.system": "[GU] System",
		"ui.dark": "[GU] Dark",
		"ui.light": "[GU] Light",
		"ui.default_city": "[GU] Default city",
		"ui.default_map_mode": "[GU] Default map mode",
		"ui.area_health": "[GU] Area Health",
		"ui.complaint_activity": "[GU] Complaint Activity",
		"ui.hotspots": "[GU] Hotspots",
		"ui.compact_mode": "[GU] Compact mode",
		"ui.area_intelligence": "[GU] Area Intelligence",
		"ui.neighbourhood_activity_overvie": "[GU] Neighbourhood activity overview",
		"ui.sort_by": "[GU] Sort by",
		"ui.all_civic_issues": "[GU] All Civic Issues",
		"ui.civic_issue_intelligence": "[GU] Civic Issue Intelligence",
		"ui.issue_summary": "[GU] Issue Summary",
		"ui.impact_score": "[GU] Impact Score",
		"ui.first_reported": "[GU] First Reported",
		"ui.linked_complaints": "[GU] Linked Complaints",
		"ui.jn_2026_00001": "[GU] JN-2026-00001",
		"ui.primary_reporter": "[GU] Primary reporter",
		"ui.split": "[GU] Split",
		"ui.jn_2026_00002": "[GU] JN-2026-00002",
		"ui.citizen_confirmation": "[GU] Citizen confirmation",
		"ui.merge_issue": "[GU] Merge Issue",
		"ui.if_this_issue_is_a_duplicate_o": "[GU] If this issue is a duplicate of another Civic Issue, you can merge them together to consolidate impact scores and reports.",
		"ui.select_target_issue": "[GU] Select target issue...",
		"ui.confirm_merge": "[GU] Confirm Merge",
		"ui.cancel": "[GU] Cancel",
		"ui.merge_with_another_issue": "[GU] Merge with another issue",
		"ui.work_execution": "[GU] Work Execution",
		"ui.this_civic_issue_is_ready_to_b": "[GU] This Civic Issue is ready to be converted into a Work Package for contractors.",
		"ui.create_work_package": "[GU] Create Work Package",
		"ui.civic_issues": "[GU] Civic Issues",
		"ui.clustered_citizen_reports": "[GU] Clustered Citizen Reports",
		"ui.intelligence_layer_identifying": "[GU] Intelligence layer identifying singular problems from multiple citizen reports.",
		"ui.impact": "[GU] Impact:",
		"ui.review": "[GU] Review",
		"ui.no_civic_issues": "[GU] No civic issues",
		"ui.all_complaints": "[GU] All complaints",
		"ui.report_details": "[GU] Report Details",
		"ui.assigned_to": "[GU] Assigned to",
		"ui.last_updated": "[GU] Last updated:",
		"ui.ai_intelligence_analysis": "[GU] AI Intelligence Analysis",
		"ui.detected_category": "[GU] Detected category",
		"ui.urgency": "[GU] Urgency",
		"ui.similarity_match": "[GU] Similarity match",
		"ui.cluster": "[GU] Cluster",
		"ui.view_related_systemic_issue": "[GU] View related systemic issue →",
		"ui.location": "[GU] Location",
		"ui.officer_actions": "[GU] Officer Actions",
		"ui.verify_accept_complaint": "[GU] ✓ Verify & Accept Complaint",
		"ui.reject_as_invalid": "[GU] ✕ Reject as Invalid",
		"ui.classify_route": "[GU] Classify & Route",
		"ui.link_to_civic_issue": "[GU] Link to Civic Issue",
		"ui.create_procurement_opportunity": "[GU] Create Procurement Opportunity",
		"ui.complaint_management": "[GU] Complaint Management",
		"ui.all_civic_reports": "[GU] All civic reports",
		"ui.complaints_prototype_intellige": "[GU] complaints · Prototype Intelligence Data",
		"ui.export": "[GU] Export",
		"ui.selected": "[GU] selected",
		"ui.bulk_verify": "[GU] ✓ Bulk Verify",
		"ui.bulk_classify": "[GU] Bulk Classify",
		"ui.department_detail": "[GU] Department Detail",
		"ui.average_response_time": "[GU] Average response time:",
		"ui.days": "[GU] days",
		"ui.category_breakdown": "[GU] Category Breakdown",
		"ui.view_department_complaints": "[GU] View department complaints",
		"ui.open": "[GU] Open",
		"ui.in_progress": "[GU] In progress",
		"ui.department_overview": "[GU] Department Overview",
		"ui.operational_workload_by_depart": "[GU] Operational workload by department",
		"ui.avg_response": "[GU] Avg response",
		"ui.systemic_issue_intelligence": "[GU] Systemic Issue Intelligence",
		"ui.updated": "[GU] Updated",
		"ui.related_complaints": "[GU] Related Complaints",
		"ui.patterns_janmind_has_detected": "[GU] Patterns JANMIND has detected",
		"ui.no_critical_issues": "[GU] No critical issues",
		"ui.all_tenders": "[GU] All tenders",
		"ui.tender_details": "[GU] Tender Details",
		"ui.estimated_cost": "[GU] Estimated Cost (₹)",
		"ui.civic_issue_id": "[GU] Civic Issue ID",
		"ui.scope_of_work": "[GU] Scope of Work",
		"ui.submitted_bids": "[GU] Submitted Bids (",
		"ui.loading_bids": "[GU] Loading bids...",
		"ui.no_bids_submitted_yet": "[GU] No bids submitted yet.",
		"ui.contractor_id": "[GU] Contractor ID:",
		"ui.bid_id": "[GU] Bid ID:",
		"ui.tender_info": "[GU] Tender Info",
		"ui.tenders": "[GU] Tenders",
		"ui.tender": "[GU] tender",
		"ui.publish_tender": "[GU] Publish Tender",
		"ui.no_tenders_published_yet": "[GU] No tenders published yet.",
		"ui.define_public_procurement_requ": "[GU] Define public procurement requirements",
		"ui.title": "[GU] Title",
		"ui.description": "[GU] Description",
		"ui.civic_issue_ids_comma_separate": "[GU] Civic Issue IDs (comma-separated)",
		"ui.road_repair_ward_14_sarvodaya_": "[GU] Road Repair — Ward 14, Sarvodaya Nagar",
		"ui.describe_the_civic_issue_and_w": "[GU] Describe the civic issue and why work is needed...",
		"ui.ward_14": "[GU] Ward 14",
		"ui.sarvodaya_nagar": "[GU] Sarvodaya Nagar",
		"ui.1_pothole_patching_10_2_road_m": "[GU] 1. Pothole patching...&#10;2. Road milling...",
		"ui.ci_171850389_ci_2819030": "[GU] CI-171850389, CI-2819030",
		"ui.all_work_orders": "[GU] All work orders",
		"ui.overdue": "[GU] (overdue)",
		"ui.work_order_details": "[GU] Work Order Details",
		"ui.contractor": "[GU] Contractor",
		"ui.assigned_engineer": "[GU] Assigned Engineer",
		"ui.start_date": "[GU] Start Date",
		"ui.sla_deadline": "[GU] SLA Deadline",
		"ui.bill_of_quantities": "[GU] Bill of Quantities",
		"ui.unit": "[GU] Unit",
		"ui.qty": "[GU] Qty",
		"ui.rate": "[GU] Rate",
		"ui.amount": "[GU] Amount",
		"ui.total": "[GU] Total",
		"ui.approved_amount": "[GU] Approved Amount",
		"ui.record_inspection": "[GU] Record Inspection",
		"ui.record_site_inspection": "[GU] Record Site Inspection",
		"ui.inspection_notes": "[GU] Inspection Notes",
		"ui.verify_measurement": "[GU] Verify Measurement",
		"ui.verify_measurement_proceed_to_": "[GU] Verify Measurement & Proceed to Billing",
		"ui.verified_total_amount": "[GU] Verified Total Amount (₹)",
		"ui.bill_approval": "[GU] Bill Approval",
		"ui.contractor_submitted_bill_for": "[GU] Contractor submitted bill for",
		"ui.close_work_order": "[GU] Close Work Order",
		"ui.payment_approved_close_the_wor": "[GU] Payment approved. Close the work order to resolve all linked complaints.",
		"ui.work_order_timeline": "[GU] Work Order Timeline",
		"ui.linked_civic_issues": "[GU] Linked Civic Issues (",
		"ui.evidence_ai_validation": "[GU] Evidence & AI Validation",
		"ui.ai_relevance": "[GU] AI Relevance:",
		"ui.tamper_risk": "[GU] Tamper Risk:",
		"ui.gps_distance": "[GU] GPS Distance:",
		"ui.m": "[GU] m",
		"ui.no_evidence_submitted_yet": "[GU] No evidence submitted yet.",
		"ui.financial_summary": "[GU] Financial Summary",
		"ui.estimated": "[GU] Estimated",
		"ui.approved": "[GU] Approved",
		"ui.bill_approved": "[GU] Bill Approved",
		"ui.quick_actions": "[GU] Quick Actions",
		"ui.view_work_package": "[GU] View Work Package",
		"ui.describe_findings_quality_obse": "[GU] Describe findings, quality observations, deficiencies...",
		"ui.work_orders": "[GU] Work Orders",
		"ui.work_order": "[GU] work order",
		"ui.no_work_orders_found": "[GU] No work orders found.",
		"ui.due": "[GU] Due:",
		"ui.contractor_portal": "[GU] Contractor Portal",
		"ui.email_address": "[GU] Email Address",
		"ui.sign_in_with_your_registered_c": "[GU] Sign in with your registered contractor account.",
		"ui.contact_your_administrator_if_": "[GU] Contact your administrator if you need access.",
		"ui.suresh_patel_bharatinfra_in": "[GU] suresh.patel@bharatinfra.in",
		"ui.contractor_operations_center": "[GU] Contractor Operations Center",
		"ui.ai_operations_brief": "[GU] AI Operations Brief",
		"ui.you_have": "[GU] You have",
		"ui.active_work_orders": "[GU] Active Work Orders",
		"ui.projects_are_currently_at_high": "[GU] projects are currently at high schedule risk.",
		"ui.work_orders_are_awaiting_munic": "[GU] work orders are awaiting municipal inspection.",
		"ui.eligible_tenders_close_within_": "[GU] eligible tenders close within the next 72 hours.",
		"ui.needs_your_attention": "[GU] NEEDS YOUR ATTENTION",
		"ui.behind_schedule": "[GU] - Behind Schedule",
		"ui.provide_evidence": "[GU] Provide Evidence →",
		"ui.inspection_pending": "[GU] Inspection Pending",
		"ui.payments_pending": "[GU] Payments Pending",
		"ui.risk_alerts": "[GU] Risk Alerts",
		"ui.active_project_health": "[GU] Active Project Health",
		"ui.no_active_projects": "[GU] No active projects.",
		"ui.planned": "[GU] Planned:",
		"ui.verified": "[GU] Verified",
		"ui.recommended_tender_opportuniti": "[GU] Recommended Tender Opportunities",
		"ui.view_market": "[GU] View Market",
		"ui.no_matching_tenders_available_": "[GU] No matching tenders available in your registered cities.",
		"ui.high_match": "[GU] HIGH MATCH",
		"ui.closes": "[GU] Closes:",
		"ui.performance_metrics": "[GU] Performance Metrics",
		"ui.track_your_company_s_rating_an": "[GU] Track your company's rating and operational statistics.",
		"ui.overall_rating": "[GU] Overall Rating",
		"ui.out_of_100": "[GU] out of 100",
		"ui.sla_compliance": "[GU] SLA Compliance",
		"ui.target_gt_90": "[GU] Target: &gt; 90%",
		"ui.first_time_inspection_pass": "[GU] First-Time Inspection Pass",
		"ui.target_gt_85": "[GU] Target: &gt; 85%",
		"ui.on_time_completion": "[GU] On-Time Completion",
		"ui.target_gt_95": "[GU] Target: &gt; 95%",
		"ui.total_historical_work_orders": "[GU] Total Historical Work Orders",
		"ui.lifetime_completed": "[GU] Lifetime completed",
		"ui.score_trend_last_4_quarters": "[GU] Score Trend (Last 4 Quarters)",
		"ui.company_profile_data": "[GU] Company Profile Data",
		"ui.specializations": "[GU] Specializations",
		"ui.service_wards": "[GU] Service Wards",
		"ui.company_profile": "[GU] Company Profile",
		"ui.manage_your_business_informati": "[GU] Manage your business information and registration details.",
		"ui.verified_contractor": "[GU] Verified Contractor",
		"ui.contact_details": "[GU] Contact Details",
		"ui.phone": "[GU] Phone",
		"ui.email": "[GU] Email *",
		"ui.address": "[GU] Address",
		"ui.company_information": "[GU] Company Information",
		"ui.company_name": "[GU] Company Name",
		"ui.id": "[GU] ID:",
		"ui.legal_registration": "[GU] Legal & Registration",
		"ui.registration_number": "[GU] Registration Number",
		"ui.gstin": "[GU] GSTIN",
		"ui.pan": "[GU] PAN",
		"ui.user": "[GU] User",
		"ui.loading_tender": "[GU] Loading tender...",
		"ui.tender_not_found": "[GU] Tender not found.",
		"ui.back_to_tenders": "[GU] Back to Tenders",
		"ui.est_budget": "[GU] Est. Budget",
		"ui.submit_sealed_bid": "[GU] Submit Sealed Bid",
		"ui.quoted_amount": "[GU] Quoted Amount (₹)",
		"ui.technical_proposal_notes": "[GU] Technical Proposal / Notes",
		"ui.e_g_500000": "[GU] e.g. 500000",
		"ui.detail_your_approach_timeline_": "[GU] Detail your approach, timeline, and resources...",
		"ui.tenders_amp_bidding": "[GU] Tenders &amp; Bidding",
		"ui.open_procurement_opportunities": "[GU] Open procurement opportunities you are eligible for.",
		"ui.no_open_tenders_found_for_your": "[GU] No open tenders found for your approved categories and cities.",
		"ui.your_contractor_profile_must_b": "[GU] Your contractor profile must be approved in a city before tenders appear here.",
		"ui.back_to_work_orders": "[GU] Back to Work Orders",
		"ui.contract_value": "[GU] Contract Value",
		"ui.estimated_budget": "[GU] Estimated Budget",
		"ui.risk_level": "[GU] Risk Level",
		"ui.issued_on": "[GU] Issued On",
		"ui.target_completion": "[GU] Target Completion",
		"ui.execution_progress": "[GU] Execution Progress",
		"ui.submit_field_evidence": "[GU] Submit Field Evidence",
		"ui.stage": "[GU] Stage",
		"ui.before_repair": "[GU] Before Repair",
		"ui.start_of_work": "[GU] Start of Work",
		"ui.during_execution": "[GU] During Execution",
		"ui.completion": "[GU] Completion",
		"ui.description_optional": "[GU] Description (optional)",
		"ui.photo": "[GU] Photo",
		"ui.awaiting_municipal_inspection": "[GU] Awaiting Municipal Inspection",
		"ui.evidence_has_been_submitted_a_": "[GU] Evidence has been submitted. A municipal officer will review and either pass or\n                    request rework.",
		"ui.rework_required": "[GU] Rework Required",
		"ui.the_municipal_inspection_did_n": "[GU] The municipal inspection did not pass. Please address the issues and resubmit\n                    evidence.",
		"ui.resubmit_for_inspection": "[GU] Resubmit for Inspection",
		"ui.work_completed": "[GU] Work Completed",
		"ui.this_work_order_has_been_inspe": "[GU] This work order has been inspected and marked complete. The linked civic issue\n                    and citizen complaints have been resolved automatically.",
		"ui.quick_info": "[GU] Quick Info",
		"ui.awarded_by": "[GU] Awarded By",
		"ui.award_value": "[GU] Award Value",
		"ui.tender_id": "[GU] Tender ID",
		"ui.brief_note_about_the_photo": "[GU] Brief note about the photo…",
		"ui.no_work_orders_found_for_the_s": "[GU] No work orders found for the selected filter.",
		"ui.issued": "[GU] Issued:",
		"ui.janmind_admin": "[GU] JANMIND Admin",
		"ui.platform_administration": "[GU] Platform Administration",
		"ui.sign_in_to_platform": "[GU] Sign In to Platform",
		"ui.admin_janmind_gov_in": "[GU] admin@janmind.gov.in",
		"ui.system_audit_logs": "[GU] System Audit Logs",
		"ui.immutable_record_of_platform_a": "[GU] Immutable record of platform activities",
		"ui.all_roles": "[GU] All Roles",
		"ui.all_entities": "[GU] All Entities",
		"ui.timestamp": "[GU] Timestamp",
		"ui.actor": "[GU] Actor",
		"ui.action": "[GU] Action",
		"ui.target_entity": "[GU] Target Entity",
		"ui.details": "[GU] Details",
		"ui.no_details": "[GU] No details",
		"ui.no_audit_logs_match_your_crite": "[GU] No audit logs match your criteria.",
		"ui.refresh": "[GU] Refresh",
		"ui.search_actor_or_action": "[GU] Search actor or action...",
		"ui.make_sure_you_are_logged_in_wi": "[GU] Make sure you are logged in with an admin account.",
		"ui.live_platform_data": "[GU] Live Platform Data",
		"ui.platform_dashboard": "[GU] Platform Dashboard",
		"ui.real_time_overview_from_the_ba": "[GU] Real-time overview from the backend database",
		"ui.total_complaints": "[GU] Total Complaints",
		"ui.work_order_status_distribution": "[GU] Work Order Status Distribution",
		"ui.recent_work_orders": "[GU] Recent Work Orders",
		"ui.no_work_orders_yet": "[GU] No work orders yet",
		"ui.total_users": "[GU] Total Users",
		"ui.officers": "[GU] Officers",
		"ui.contractors": "[GU] Contractors",
		"ui.active_work": "[GU] Active Work",
		"ui.open_complaints": "[GU] Open Complaints",
		"ui.cities": "[GU] Cities",
		"ui.platform_settings": "[GU] Platform Settings",
		"ui.system_configuration_and_admin": "[GU] System configuration and administration",
		"ui.global_notification_settings": "[GU] Global Notification Settings",
		"ui.platform_name": "[GU] Platform Name",
		"ui.janmind_civic_infrastructure_p": "[GU] JANMIND Civic Infrastructure Platform",
		"ui.environment": "[GU] Environment",
		"ui.prototype_demo": "[GU] Prototype / Demo",
		"ui.version": "[GU] Version",
		"ui.v1_0_0_prototype": "[GU] v1.0.0-prototype",
		"ui.storage_mode": "[GU] Storage Mode",
		"ui.browser_localstorage": "[GU] Browser LocalStorage",
		"ui.security_authentication": "[GU] Security & Authentication",
		"ui.danger_zone": "[GU] Danger Zone",
		"ui.reset_prototype_data": "[GU] Reset Prototype Data",
		"ui.this_will_clear_all_shared_pro": "[GU] This will clear all shared prototype data (contractors, work orders, audit logs, SLA rules) from local storage. Default mock data will be re-initialized on next load.",
		"ui.clear_all_data": "[GU] Clear All Data",
		"ui.sla_configuration": "[GU] SLA Configuration",
		"ui.define_response_and_resolution": "[GU] Define response and resolution time limits across categories",
		"ui.response_hrs": "[GU] Response (Hrs)",
		"ui.resolution_hrs": "[GU] Resolution (Hrs)",
		"ui.escalation_hrs": "[GU] Escalation (Hrs)",
		"ui.user_management": "[GU] User Management",
		"ui.total_users_across_all_roles": "[GU] total users across all roles",
		"ui.add_user": "[GU] Add User",
		"ui.name": "[GU] Name",
		"ui.actions": "[GU] Actions",
		"ui.no_users_found": "[GU] No users found",
		"ui.full_name": "[GU] Full Name *",
		"ui.none": "[GU] — None —",
		"ui.search_name_email_city": "[GU] Search name, email, city...",
		"ui.edit_user": "[GU] Edit user",
		"ui.delete_user": "[GU] Delete user",
		"ui.e_g_priya_sharma": "[GU] e.g. Priya Sharma",
		"ui.user_example_com": "[GU] user@example.com",
		"ui.min_8_characters": "[GU] Min 8 characters",
		"ui.e_g_roads": "[GU] e.g. Roads",
		"ui.platform_work_orders": "[GU] Platform Work Orders",
		"ui.global_view_of_all_municipal_w": "[GU] Global view of all municipal work orders",
		"ui.global_work_order_distribution": "[GU] Global Work Order Distribution",
		"ui.status_breakdown_across_all_ci": "[GU] Status breakdown across all cities",
		"ui.id_title": "[GU] ID / Title",
		"ui.municipality": "[GU] Municipality",
		"ui.no_work_orders_found_in_the_pl": "[GU] No work orders found in the platform.",
		"ui.registration": "[GU] Registration:",
		"ui.current_status": "[GU] Current Status",
		"ui.verify_contractor": "[GU] Verify Contractor",
		"ui.suspend_contractor": "[GU] Suspend Contractor",
		"ui.tax_id_pan": "[GU] Tax ID / PAN",
		"ui.contractor_tier": "[GU] Contractor Tier",
		"ui.class_a": "[GU] Class A",
		"ui.registration_compliance": "[GU] Registration & Compliance",
		"ui.document_type": "[GU] Document Type",
		"ui.uploaded_date": "[GU] Uploaded Date",
		"ui.no_documents_uploaded": "[GU] No documents uploaded",
		"ui.system_security_logging": "[GU] System Security Logging",
		"ui.pending_verification": "[GU] Pending Verification",
		"ui.suspended": "[GU] Suspended",
		"ui.not_found": "[GU] Not Found",
		"ui.overall_score": "[GU] Overall Score",
		"ui.inspection_pass_rate": "[GU] Inspection Pass Rate",
		"ui.contractor_registry": "[GU] Contractor Registry",
		"ui.manage_and_verify_platform_con": "[GU] Manage and verify platform contractors",
		"ui.reg": "[GU] Reg:",
		"ui.more": "[GU] more",
		"ui.verify": "[GU] Verify",
		"ui.suspend": "[GU] Suspend",
		"ui.no_contractors_found_matching_": "[GU] No contractors found matching your criteria.",
		"ui.search_by_name_or_registration": "[GU] Search by name or registration number...",
		"nav.home": "મુખ્ય પૃષ્ઠ",
		"nav.howitworks": "કેવી રીતે કામ કરે છે",
		"nav.map": "નાગરિક નકશો",
		"nav.report": "સમસ્યા નોંધાવો",
		"nav.complaints": "મારી ફરિયાદો",
		"nav.notifications": "સૂચનાઓ",
		"nav.profile": "પ્રોફાઇલ",
		"nav.signin": "સાઇન ઇન",
		"nav.signout": "સાઇન આઉટ",
		"home.hero.badge": "નાગરિક પોર્ટલ",
		"home.hero.title": "જનમાઇન્ડ",
		"home.hero.subtitle": "તમારા શહેરને બહેતર બનાવો, એક સમયે એક રિપોર્ટ.",
		"home.hero.desc": "સ્થાન અને પુરાવા સાથે નાગરિક સમસ્યાઓની જાણ કરો. JANMIND વ્યક્તિગત ફરિયાદોને મોટી પેટર્ન સાથે જોડવામાં મદદ કરે છે.",
		"home.hero.howitworks": "તે કેવી રીતે કામ કરે છે",
		"home.hero.smallprint": "લગભગ એક મિનિટ લાગે છે. તમારે વિભાગ કે શ્રેણી જાણવાની જરૂર નથી — JANMIND તમારા માટે સૂચવે છે.",
		"hiw.label": "તે કેવી રીતે કામ કરે છે",
		"hiw.heading": "શેરીની સમસ્યાથી નાગરિક રેકોર્ડ સુધી — ચાર સરળ પગલાં.",
		"hiw.step1.title": "રિપોર્ટ",
		"hiw.step1.body": "JANMIND ને જણાવો શું થયું.",
		"hiw.step2.title": "સ્થાન",
		"hiw.step2.body": "તમારું વર્તમાન સ્થાન વાપરો અથવા મેન્યુઅલ રીતે પસંદ કરો.",
		"hiw.step3.title": "પુરાવા",
		"hiw.step3.body": "ઉપલબ્ધ હોય તો ફોટો અપલોડ કરો.",
		"hiw.step4.title": "ટ્રૅક",
		"hiw.step4.body": "તમારી ફરિયાદ ફોલો કરો અને અપડેટ મેળવો.",
		"pattern.label": "પેટર્ન શોધ",
		"pattern.heading": "એક રિપોર્ટ એ ફરિયાદ છે. ઘણા રિપોર્ટ એ પેટર્ન છે.",
		"pattern.desc": "જ્યારે ઘણા નાગરિકો નજીકમાં સમાન સમસ્યા વર્ણવે છે, ત્યારે JANMIND તેમને એક જૂથ હૉટસ્પૉટ માં જૂથ કરે છે — કોઈની ઓળખ કે ખાનગી સરનામું જાહેર કર્યા વગર.",
		"pattern.bullet1": "આશરે 500 મીટરમાં 23 સમાન રિપોર્ટ",
		"pattern.bullet2": "વૉર્ડ 14 માં 127 સંબંધિત રિપોર્ટ",
		"pattern.bullet3": "માત્ર એકત્રિત દૃશ્ય — કોઈ અંગત વિગત શેર નહીં",
		"pattern.issues.label": "તમે જે સમસ્યા નોંધાવી શકો",
		"pattern.startreport": "રિપોર્ટ શરૂ કરો",
		"stats.label": "નાગરિક બુદ્ધિ — નમૂના ડેટા",
		"stats.reports": "વૉર્ડ 14 માં સંબંધિત રિપોર્ટ",
		"stats.types": "સમસ્યાના પ્રકારો",
		"stats.update": "પ્રથમ અપડેટ સરેરાશ",
		"stats.cities": "ટેકો આપેલ શહેરો",
		"map.card.label": "સ્થાનિક નાગરિક પ્રવૃત્તિ — નમૂના ડેટા",
		"map.card.open": "નાગરિક નકશો ખોલો",
		"footer.brand": "JANMIND — નાગરિક પોર્ટલ",
		"footer.note": "પ્રોટોટાઇપ ઇન્ટરફેસ. બતાવેલ ડેટા નમૂના ડેટા છે.",
		"report.step.problem": "સમસ્યા",
		"report.step.location": "સ્થાન",
		"report.step.evidence": "પુરાવા",
		"report.step.review": "સમીક્ષા",
		"report.btn.continue": "આગળ વધો",
		"report.btn.back": "પાછા જાઓ",
		"report.btn.submit": "રિપોર્ટ સબમિટ કરો",
		"register.access": "નાગરિક ઍક્સેસ",
		"register.heading": "તમારું ખાતું બનાવો",
		"register.subtext": "તમારી સંપર્ક વિગત ખાનગી રહે છે અને સાર્વજનિક નકશા પર ક્યારેય બતાવાતી નથી.",
		"register.name": "પૂરું નામ",
		"register.name.placeholder": "તમારું નામ",
		"register.email": "ઇ-મેઇલ",
		"register.email.placeholder": "you@example.com",
		"register.phone": "ફોન",
		"register.phone.placeholder": "+91 00000 00000",
		"register.password": "પાસવર્ડ",
		"register.password.placeholder": "ઓછામાં ઓછા 8 અક્ષર",
		"register.password.error": "પાસવર્ડ ઓછામાં ઓછા 8 અક્ષરનો હોવો જોઈએ.",
		"register.btn": "ખાતું બનાવો",
		"register.btn.busy": "ખાતું બનાવાઈ રહ્યું છે...",
		"register.success": "ખાતું બનાવ્યું",
		"register.error": "અત્યારે તમારું ખાતું બનાવી શકાયું નહીં.",
		"register.existing": "પહેલેથી નોંધાયેલ છો?",
		"register.signin": "સાઇન ઇન",
		"login.access": "નાગરિક ઍક્સેસ",
		"login.heading": "સાઇન ઇન",
		"login.subtext": "તમારા રિપોર્ટ, સૂચનાઓ અને ફરિયાદ ઇતિહાસ પર જાઓ.",
		"login.email": "ઇ-મેઇલ",
		"login.email.placeholder": "you@example.com",
		"login.password": "પાસવર્ડ",
		"login.btn": "સાઇન ઇન",
		"login.btn.busy": "સાઇન ઇન થઈ રહ્યું છે...",
		"login.success": "સાઇન ઇન થઈ ગયું",
		"login.error": "સાઇન ઇન થઈ શક્યું નહીં. તમારી વિગત તપાસો.",
		"login.new": "JANMIND માં નવા છો?",
		"login.createaccount": "ખાતું બનાવો",
		"profile.title": "પ્રોફાઇલ સેટિંગ્સ",
		"profile.language": "પસંદીદા ભાષા",
		"profile.theme": "થીમ પસંદગી",
		"btn.save": "ફેરફારો સાચવો"
	},
	kn: {
		"ui.issue_mix_in_this_locality": "[KN] Issue mix in this locality",
		"ui.initializing_map": "[KN] Initializing map",
		"ui.loading_civic_map": "[KN] Loading civic map",
		"ui.loading_tiles": "[KN] Loading tiles…",
		"ui.loading_map": "[KN] Loading map",
		"ui.zoom_in": "[KN] Zoom in",
		"ui.zoom_out": "[KN] Zoom out",
		"ui.reset_map_view": "[KN] Reset map view",
		"ui.find_my_area": "[KN] Find my area",
		"ui.page_not_found": "[KN] Page not found",
		"ui.the_page_you_re_looking_for_do": "[KN] The page you're looking for doesn't exist or has been moved.",
		"ui.go_to_dashboard": "[KN] Go to dashboard",
		"ui.this_page_didn_t_load": "[KN] This page didn't load",
		"ui.something_went_wrong_on_our_en": "[KN] Something went wrong on our end. You can try refreshing or head back to the dashboard.",
		"ui.try_again": "[KN] Try again",
		"ui.dashboard": "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
		"ui.janmind": "[KN] JANMIND",
		"ui.municipal_intelligence": "[KN] Municipal Intelligence",
		"ui.city": "ನಗರ",
		"ui.role": "[KN] Role *",
		"ui.remember_session": "[KN] Remember session",
		"ui.forgot_password": "[KN] Forgot password?",
		"ui.janmind_municipal_intelligence": "[KN] JANMIND Municipal Intelligence Platform",
		"ui.officer_id_email": "[KN] Officer ID / Email",
		"ui.officer_vmc_gov_in": "[KN] officer@vmc.gov.in",
		"ui.password": "ಪಾಸ್ವರ್ಡ್",
		"ui.janmind_copilot": "[KN] JANMIND Copilot",
		"ui.ask_copilot": "[KN] Ask Copilot...",
		"ui.no_complaints_match_the_select": "[KN] No complaints match the selected filters.",
		"ui.complaint_id": "[KN] Complaint ID",
		"ui.category": "[KN] Category",
		"ui.area": "[KN] Area",
		"ui.ward": "[KN] Ward",
		"ui.severity": "[KN] Severity",
		"ui.department": "[KN] Department",
		"ui.status": "[KN] Status",
		"ui.created": "[KN] Created",
		"ui.select_all": "[KN] Select all",
		"ui.emerging_systemic_issue": "[KN] Emerging Systemic Issue",
		"ui.reports": "ವರದಿಗಳು",
		"ui.risk": "[KN] Risk",
		"ui.trend": "[KN] Trend",
		"ui.dominant_issue": "[KN] Dominant issue",
		"ui.possible_cause": "[KN] Possible cause",
		"ui.view_intelligence": "[KN] View Intelligence",
		"ui.why_janmind_flagged_this": "[KN] Why JANMIND Flagged This",
		"ui.prototype_intelligence_data": "[KN] Prototype Intelligence Data",
		"ui.possible_root_cause": "[KN] Possible Root Cause",
		"ui.confidence": "[KN] Confidence:",
		"ui.inferred_candidate_based_on_co": "[KN] Inferred candidate based on complaint patterns. Not a confirmed physical\n        infrastructure failure.",
		"ui.recommended_action": "[KN] Recommended Action",
		"ui.start_investigation": "[KN] Start Investigation",
		"ui.assign_department": "[KN] Assign Department",
		"ui.create_field_action": "[KN] Create Field Action",
		"ui.mark_investigating": "[KN] Mark Investigating",
		"ui.filters": "ಫಿಲ್ಟರ್",
		"ui.all_cities": "[KN] All cities",
		"ui.all_categories": "[KN] All categories",
		"ui.all_severities": "[KN] All severities",
		"ui.all_departments": "[KN] All departments",
		"ui.all_statuses": "[KN] All statuses",
		"ui.clear": "[KN] Clear",
		"ui.apply": "[KN] Apply",
		"ui.area_name": "[KN] Area name",
		"ui.issue": "[KN] Issue",
		"ui.risk_range": "[KN] Risk range",
		"ui.min": "[KN] Min",
		"ui.max": "[KN] Max",
		"ui.officer_activity_timeline": "[KN] Officer Activity Timeline",
		"ui.field_action": "[KN] Field Action",
		"ui.priority": "[KN] Priority",
		"ui.recommended": "[KN] Recommended",
		"ui.assign": "[KN] Assign",
		"ui.acknowledge": "[KN] Acknowledge",
		"ui.start": "[KN] Start",
		"ui.complete": "[KN] Complete",
		"ui.live_activity": "[KN] Live Activity",
		"ui.prototype_simulation": "[KN] Prototype simulation",
		"ui.search": "ಹುಡುಕಿ",
		"ui.open_navigation": "[KN] Open navigation",
		"ui.search_press": "[KN] Search (press /)",
		"ui.notifications": "ಅಧಿಸೂಚನೆಗಳು",
		"ui.officer_search": "[KN] Officer Search",
		"ui.searching": "[KN] Searching...",
		"ui.complaints": "ದೂರುಗಳು",
		"ui.emerging_issues": "[KN] Emerging Issues",
		"ui.no_results_found": "[KN] No results found.",
		"ui.complaint_id_area_ward_issue_d": "[KN] Complaint ID, area, ward, issue, department...",
		"ui.close_navigation": "[KN] Close navigation",
		"ui.municipality_navigation": "[KN] Municipality navigation",
		"ui.mark_read": "[KN] Mark read",
		"ui.view_details": "[KN] View Details",
		"ui.janmind_prototype_risk_score": "[KN] JANMIND Prototype Risk Score",
		"ui.complaint_volume": "[KN] Complaint Volume",
		"ui.geographic_concentration": "[KN] Geographic Concentration",
		"ui.semantic_similarity": "[KN] Semantic Similarity",
		"ui.recent_growth": "[KN] Recent Growth",
		"ui.ai_triage_queue": "[KN] AI Triage Queue",
		"ui.review_incoming_complaints_fla": "[KN] Review incoming complaints flagged by JANMIND AI as potentially related to existing civic issues.",
		"ui.pending": "[KN] Pending",
		"ui.all_caught_up": "[KN] All caught up!",
		"ui.no_pending_complaints_require_": "[KN] No pending complaints require human review.",
		"ui.needs_review": "[KN] Needs Review",
		"ui.match": "[KN] % Match",
		"ui.candidate_civic_issue": "[KN] Candidate Civic Issue",
		"ui.existing_complaints": "[KN] existing complaints",
		"ui.merge_duplicate": "[KN] Merge (Duplicate)",
		"ui.split_unique": "[KN] Split (Unique)",
		"ui.operational_alerts": "[KN] Operational Alerts",
		"ui.city_wide_risk_notifications": "[KN] City-wide risk notifications",
		"ui.view_issue": "[KN] View Issue",
		"ui.no_alerts": "[KN] No alerts",
		"ui.city_analytics": "[KN] City Analytics",
		"ui.trends_and_distribution_insigh": "[KN] Trends and distribution insights",
		"ui.complaint_volume_trend": "[KN] Complaint Volume Trend",
		"ui.severity_distribution": "[KN] Severity distribution",
		"ui.department_workload": "[KN] Department Workload",
		"ui.category_distribution": "[KN] Category Distribution",
		"ui.emerging_issues_trend": "[KN] Emerging Issues Trend",
		"ui.average_response_time_days": "[KN] Average Response Time (days)",
		"ui.see_what_is_happening_across_y": "[KN] See what is happening across your city.",
		"ui.city_health": "[KN] City Health",
		"ui.7_day_activity_pulse": "[KN] 7-day activity pulse",
		"ui.issue_breakdown": "[KN] Issue breakdown",
		"ui.no_data_yet": "[KN] No data yet.",
		"ui.emerging_systemic_issues": "[KN] Emerging Systemic Issues",
		"ui.something_is_happening_in_thes": "[KN] Something is happening in these areas",
		"ui.view_all": "[KN] View All",
		"ui.hotspot_analysis": "[KN] Hotspot Analysis",
		"ui.total_reports": "[KN] Total Reports",
		"ui.critical": "[KN] critical",
		"ui.active": "[KN] Active",
		"ui.resolved": "[KN] Resolved",
		"ui.area_hotspots": "[KN] Area Hotspots",
		"ui.civic_map": "[KN] Civic Map",
		"ui.city_wide_operational_view": "[KN] City-wide operational view",
		"ui.7_day_pulse": "[KN] 7-day pulse",
		"ui.severity_mix": "[KN] Severity mix",
		"ui.no_data_under_filters": "[KN] No data under filters.",
		"ui.map_legend": "[KN] Map Legend",
		"ui.click_an_area_to_view_operatio": "[KN] Click an area to view operational details, complaint counts, trends and risk scores.\n                Individual complaint locations appear when zoomed in.",
		"ui.prototype_area_boundaries_not_": "[KN] Prototype area boundaries — not official ward delimitation.",
		"ui.area_details": "[KN] Area Details",
		"ui.prototype_area_boundary": "[KN] Prototype area boundary",
		"ui.7_day_trend": "[KN] 7-day trend",
		"ui.top_category": "[KN] Top category",
		"ui.local_7_day_trend": "[KN] Local 7-day trend",
		"ui.view_reports": "[KN] View Reports",
		"ui.view_emerging_issues": "[KN] View emerging issues",
		"ui.activity": "[KN] activity",
		"ui.officer_profile": "[KN] Officer Profile",
		"ui.officer_id": "[KN] Officer ID",
		"ui.last_active": "[KN] Last active",
		"ui.frontend_only_mock_authenticat": "[KN] Frontend-only mock authentication · Prototype Intelligence Data",
		"ui.sign_out": "[KN] Sign Out",
		"ui.portal_settings": "[KN] Portal Settings",
		"ui.preferences": "[KN] Preferences",
		"ui.settings_are_stored_locally_in": "[KN] Settings are stored locally in this prototype.",
		"ui.theme": "[KN] Theme",
		"ui.system": "[KN] System",
		"ui.dark": "[KN] Dark",
		"ui.light": "[KN] Light",
		"ui.default_city": "[KN] Default city",
		"ui.default_map_mode": "[KN] Default map mode",
		"ui.area_health": "[KN] Area Health",
		"ui.complaint_activity": "[KN] Complaint Activity",
		"ui.hotspots": "[KN] Hotspots",
		"ui.compact_mode": "[KN] Compact mode",
		"ui.area_intelligence": "[KN] Area Intelligence",
		"ui.neighbourhood_activity_overvie": "[KN] Neighbourhood activity overview",
		"ui.sort_by": "[KN] Sort by",
		"ui.all_civic_issues": "[KN] All Civic Issues",
		"ui.civic_issue_intelligence": "[KN] Civic Issue Intelligence",
		"ui.issue_summary": "[KN] Issue Summary",
		"ui.impact_score": "[KN] Impact Score",
		"ui.first_reported": "[KN] First Reported",
		"ui.linked_complaints": "[KN] Linked Complaints",
		"ui.jn_2026_00001": "[KN] JN-2026-00001",
		"ui.primary_reporter": "[KN] Primary reporter",
		"ui.split": "[KN] Split",
		"ui.jn_2026_00002": "[KN] JN-2026-00002",
		"ui.citizen_confirmation": "[KN] Citizen confirmation",
		"ui.merge_issue": "[KN] Merge Issue",
		"ui.if_this_issue_is_a_duplicate_o": "[KN] If this issue is a duplicate of another Civic Issue, you can merge them together to consolidate impact scores and reports.",
		"ui.select_target_issue": "[KN] Select target issue...",
		"ui.confirm_merge": "[KN] Confirm Merge",
		"ui.cancel": "[KN] Cancel",
		"ui.merge_with_another_issue": "[KN] Merge with another issue",
		"ui.work_execution": "[KN] Work Execution",
		"ui.this_civic_issue_is_ready_to_b": "[KN] This Civic Issue is ready to be converted into a Work Package for contractors.",
		"ui.create_work_package": "[KN] Create Work Package",
		"ui.civic_issues": "[KN] Civic Issues",
		"ui.clustered_citizen_reports": "[KN] Clustered Citizen Reports",
		"ui.intelligence_layer_identifying": "[KN] Intelligence layer identifying singular problems from multiple citizen reports.",
		"ui.impact": "[KN] Impact:",
		"ui.review": "[KN] Review",
		"ui.no_civic_issues": "[KN] No civic issues",
		"ui.all_complaints": "[KN] All complaints",
		"ui.report_details": "[KN] Report Details",
		"ui.assigned_to": "[KN] Assigned to",
		"ui.last_updated": "[KN] Last updated:",
		"ui.ai_intelligence_analysis": "[KN] AI Intelligence Analysis",
		"ui.detected_category": "[KN] Detected category",
		"ui.urgency": "[KN] Urgency",
		"ui.similarity_match": "[KN] Similarity match",
		"ui.cluster": "[KN] Cluster",
		"ui.view_related_systemic_issue": "[KN] View related systemic issue →",
		"ui.location": "[KN] Location",
		"ui.officer_actions": "[KN] Officer Actions",
		"ui.verify_accept_complaint": "[KN] ✓ Verify & Accept Complaint",
		"ui.reject_as_invalid": "[KN] ✕ Reject as Invalid",
		"ui.classify_route": "[KN] Classify & Route",
		"ui.link_to_civic_issue": "[KN] Link to Civic Issue",
		"ui.create_procurement_opportunity": "[KN] Create Procurement Opportunity",
		"ui.complaint_management": "[KN] Complaint Management",
		"ui.all_civic_reports": "[KN] All civic reports",
		"ui.complaints_prototype_intellige": "[KN] complaints · Prototype Intelligence Data",
		"ui.export": "[KN] Export",
		"ui.selected": "[KN] selected",
		"ui.bulk_verify": "[KN] ✓ Bulk Verify",
		"ui.bulk_classify": "[KN] Bulk Classify",
		"ui.department_detail": "[KN] Department Detail",
		"ui.average_response_time": "[KN] Average response time:",
		"ui.days": "[KN] days",
		"ui.category_breakdown": "[KN] Category Breakdown",
		"ui.view_department_complaints": "[KN] View department complaints",
		"ui.open": "[KN] Open",
		"ui.in_progress": "[KN] In progress",
		"ui.department_overview": "[KN] Department Overview",
		"ui.operational_workload_by_depart": "[KN] Operational workload by department",
		"ui.avg_response": "[KN] Avg response",
		"ui.systemic_issue_intelligence": "[KN] Systemic Issue Intelligence",
		"ui.updated": "[KN] Updated",
		"ui.related_complaints": "[KN] Related Complaints",
		"ui.patterns_janmind_has_detected": "[KN] Patterns JANMIND has detected",
		"ui.no_critical_issues": "[KN] No critical issues",
		"ui.all_tenders": "[KN] All tenders",
		"ui.tender_details": "[KN] Tender Details",
		"ui.estimated_cost": "[KN] Estimated Cost (₹)",
		"ui.civic_issue_id": "[KN] Civic Issue ID",
		"ui.scope_of_work": "[KN] Scope of Work",
		"ui.submitted_bids": "[KN] Submitted Bids (",
		"ui.loading_bids": "[KN] Loading bids...",
		"ui.no_bids_submitted_yet": "[KN] No bids submitted yet.",
		"ui.contractor_id": "[KN] Contractor ID:",
		"ui.bid_id": "[KN] Bid ID:",
		"ui.tender_info": "[KN] Tender Info",
		"ui.tenders": "[KN] Tenders",
		"ui.tender": "[KN] tender",
		"ui.publish_tender": "[KN] Publish Tender",
		"ui.no_tenders_published_yet": "[KN] No tenders published yet.",
		"ui.define_public_procurement_requ": "[KN] Define public procurement requirements",
		"ui.title": "[KN] Title",
		"ui.description": "[KN] Description",
		"ui.civic_issue_ids_comma_separate": "[KN] Civic Issue IDs (comma-separated)",
		"ui.road_repair_ward_14_sarvodaya_": "[KN] Road Repair — Ward 14, Sarvodaya Nagar",
		"ui.describe_the_civic_issue_and_w": "[KN] Describe the civic issue and why work is needed...",
		"ui.ward_14": "[KN] Ward 14",
		"ui.sarvodaya_nagar": "[KN] Sarvodaya Nagar",
		"ui.1_pothole_patching_10_2_road_m": "[KN] 1. Pothole patching...&#10;2. Road milling...",
		"ui.ci_171850389_ci_2819030": "[KN] CI-171850389, CI-2819030",
		"ui.all_work_orders": "[KN] All work orders",
		"ui.overdue": "[KN] (overdue)",
		"ui.work_order_details": "[KN] Work Order Details",
		"ui.contractor": "[KN] Contractor",
		"ui.assigned_engineer": "[KN] Assigned Engineer",
		"ui.start_date": "[KN] Start Date",
		"ui.sla_deadline": "[KN] SLA Deadline",
		"ui.bill_of_quantities": "[KN] Bill of Quantities",
		"ui.unit": "[KN] Unit",
		"ui.qty": "[KN] Qty",
		"ui.rate": "[KN] Rate",
		"ui.amount": "[KN] Amount",
		"ui.total": "[KN] Total",
		"ui.approved_amount": "[KN] Approved Amount",
		"ui.record_inspection": "[KN] Record Inspection",
		"ui.record_site_inspection": "[KN] Record Site Inspection",
		"ui.inspection_notes": "[KN] Inspection Notes",
		"ui.verify_measurement": "[KN] Verify Measurement",
		"ui.verify_measurement_proceed_to_": "[KN] Verify Measurement & Proceed to Billing",
		"ui.verified_total_amount": "[KN] Verified Total Amount (₹)",
		"ui.bill_approval": "[KN] Bill Approval",
		"ui.contractor_submitted_bill_for": "[KN] Contractor submitted bill for",
		"ui.close_work_order": "[KN] Close Work Order",
		"ui.payment_approved_close_the_wor": "[KN] Payment approved. Close the work order to resolve all linked complaints.",
		"ui.work_order_timeline": "[KN] Work Order Timeline",
		"ui.linked_civic_issues": "[KN] Linked Civic Issues (",
		"ui.evidence_ai_validation": "[KN] Evidence & AI Validation",
		"ui.ai_relevance": "[KN] AI Relevance:",
		"ui.tamper_risk": "[KN] Tamper Risk:",
		"ui.gps_distance": "[KN] GPS Distance:",
		"ui.m": "[KN] m",
		"ui.no_evidence_submitted_yet": "[KN] No evidence submitted yet.",
		"ui.financial_summary": "[KN] Financial Summary",
		"ui.estimated": "[KN] Estimated",
		"ui.approved": "[KN] Approved",
		"ui.bill_approved": "[KN] Bill Approved",
		"ui.quick_actions": "[KN] Quick Actions",
		"ui.view_work_package": "[KN] View Work Package",
		"ui.describe_findings_quality_obse": "[KN] Describe findings, quality observations, deficiencies...",
		"ui.work_orders": "[KN] Work Orders",
		"ui.work_order": "[KN] work order",
		"ui.no_work_orders_found": "[KN] No work orders found.",
		"ui.due": "[KN] Due:",
		"ui.contractor_portal": "[KN] Contractor Portal",
		"ui.email_address": "[KN] Email Address",
		"ui.sign_in_with_your_registered_c": "[KN] Sign in with your registered contractor account.",
		"ui.contact_your_administrator_if_": "[KN] Contact your administrator if you need access.",
		"ui.suresh_patel_bharatinfra_in": "[KN] suresh.patel@bharatinfra.in",
		"ui.contractor_operations_center": "[KN] Contractor Operations Center",
		"ui.ai_operations_brief": "[KN] AI Operations Brief",
		"ui.you_have": "[KN] You have",
		"ui.active_work_orders": "[KN] Active Work Orders",
		"ui.projects_are_currently_at_high": "[KN] projects are currently at high schedule risk.",
		"ui.work_orders_are_awaiting_munic": "[KN] work orders are awaiting municipal inspection.",
		"ui.eligible_tenders_close_within_": "[KN] eligible tenders close within the next 72 hours.",
		"ui.needs_your_attention": "[KN] NEEDS YOUR ATTENTION",
		"ui.behind_schedule": "[KN] - Behind Schedule",
		"ui.provide_evidence": "[KN] Provide Evidence →",
		"ui.inspection_pending": "[KN] Inspection Pending",
		"ui.payments_pending": "[KN] Payments Pending",
		"ui.risk_alerts": "[KN] Risk Alerts",
		"ui.active_project_health": "[KN] Active Project Health",
		"ui.no_active_projects": "[KN] No active projects.",
		"ui.planned": "[KN] Planned:",
		"ui.verified": "[KN] Verified",
		"ui.recommended_tender_opportuniti": "[KN] Recommended Tender Opportunities",
		"ui.view_market": "[KN] View Market",
		"ui.no_matching_tenders_available_": "[KN] No matching tenders available in your registered cities.",
		"ui.high_match": "[KN] HIGH MATCH",
		"ui.closes": "[KN] Closes:",
		"ui.performance_metrics": "[KN] Performance Metrics",
		"ui.track_your_company_s_rating_an": "[KN] Track your company's rating and operational statistics.",
		"ui.overall_rating": "[KN] Overall Rating",
		"ui.out_of_100": "[KN] out of 100",
		"ui.sla_compliance": "[KN] SLA Compliance",
		"ui.target_gt_90": "[KN] Target: &gt; 90%",
		"ui.first_time_inspection_pass": "[KN] First-Time Inspection Pass",
		"ui.target_gt_85": "[KN] Target: &gt; 85%",
		"ui.on_time_completion": "[KN] On-Time Completion",
		"ui.target_gt_95": "[KN] Target: &gt; 95%",
		"ui.total_historical_work_orders": "[KN] Total Historical Work Orders",
		"ui.lifetime_completed": "[KN] Lifetime completed",
		"ui.score_trend_last_4_quarters": "[KN] Score Trend (Last 4 Quarters)",
		"ui.company_profile_data": "[KN] Company Profile Data",
		"ui.specializations": "[KN] Specializations",
		"ui.service_wards": "[KN] Service Wards",
		"ui.company_profile": "[KN] Company Profile",
		"ui.manage_your_business_informati": "[KN] Manage your business information and registration details.",
		"ui.verified_contractor": "[KN] Verified Contractor",
		"ui.contact_details": "[KN] Contact Details",
		"ui.phone": "[KN] Phone",
		"ui.email": "[KN] Email *",
		"ui.address": "[KN] Address",
		"ui.company_information": "[KN] Company Information",
		"ui.company_name": "[KN] Company Name",
		"ui.id": "[KN] ID:",
		"ui.legal_registration": "[KN] Legal & Registration",
		"ui.registration_number": "[KN] Registration Number",
		"ui.gstin": "[KN] GSTIN",
		"ui.pan": "[KN] PAN",
		"ui.user": "[KN] User",
		"ui.loading_tender": "[KN] Loading tender...",
		"ui.tender_not_found": "[KN] Tender not found.",
		"ui.back_to_tenders": "[KN] Back to Tenders",
		"ui.est_budget": "[KN] Est. Budget",
		"ui.submit_sealed_bid": "[KN] Submit Sealed Bid",
		"ui.quoted_amount": "[KN] Quoted Amount (₹)",
		"ui.technical_proposal_notes": "[KN] Technical Proposal / Notes",
		"ui.e_g_500000": "[KN] e.g. 500000",
		"ui.detail_your_approach_timeline_": "[KN] Detail your approach, timeline, and resources...",
		"ui.tenders_amp_bidding": "[KN] Tenders &amp; Bidding",
		"ui.open_procurement_opportunities": "[KN] Open procurement opportunities you are eligible for.",
		"ui.no_open_tenders_found_for_your": "[KN] No open tenders found for your approved categories and cities.",
		"ui.your_contractor_profile_must_b": "[KN] Your contractor profile must be approved in a city before tenders appear here.",
		"ui.back_to_work_orders": "[KN] Back to Work Orders",
		"ui.contract_value": "[KN] Contract Value",
		"ui.estimated_budget": "[KN] Estimated Budget",
		"ui.risk_level": "[KN] Risk Level",
		"ui.issued_on": "[KN] Issued On",
		"ui.target_completion": "[KN] Target Completion",
		"ui.execution_progress": "[KN] Execution Progress",
		"ui.submit_field_evidence": "[KN] Submit Field Evidence",
		"ui.stage": "[KN] Stage",
		"ui.before_repair": "[KN] Before Repair",
		"ui.start_of_work": "[KN] Start of Work",
		"ui.during_execution": "[KN] During Execution",
		"ui.completion": "[KN] Completion",
		"ui.description_optional": "[KN] Description (optional)",
		"ui.photo": "[KN] Photo",
		"ui.awaiting_municipal_inspection": "[KN] Awaiting Municipal Inspection",
		"ui.evidence_has_been_submitted_a_": "[KN] Evidence has been submitted. A municipal officer will review and either pass or\n                    request rework.",
		"ui.rework_required": "[KN] Rework Required",
		"ui.the_municipal_inspection_did_n": "[KN] The municipal inspection did not pass. Please address the issues and resubmit\n                    evidence.",
		"ui.resubmit_for_inspection": "[KN] Resubmit for Inspection",
		"ui.work_completed": "[KN] Work Completed",
		"ui.this_work_order_has_been_inspe": "[KN] This work order has been inspected and marked complete. The linked civic issue\n                    and citizen complaints have been resolved automatically.",
		"ui.quick_info": "[KN] Quick Info",
		"ui.awarded_by": "[KN] Awarded By",
		"ui.award_value": "[KN] Award Value",
		"ui.tender_id": "[KN] Tender ID",
		"ui.brief_note_about_the_photo": "[KN] Brief note about the photo…",
		"ui.no_work_orders_found_for_the_s": "[KN] No work orders found for the selected filter.",
		"ui.issued": "[KN] Issued:",
		"ui.janmind_admin": "[KN] JANMIND Admin",
		"ui.platform_administration": "[KN] Platform Administration",
		"ui.sign_in_to_platform": "[KN] Sign In to Platform",
		"ui.admin_janmind_gov_in": "[KN] admin@janmind.gov.in",
		"ui.system_audit_logs": "[KN] System Audit Logs",
		"ui.immutable_record_of_platform_a": "[KN] Immutable record of platform activities",
		"ui.all_roles": "[KN] All Roles",
		"ui.all_entities": "[KN] All Entities",
		"ui.timestamp": "[KN] Timestamp",
		"ui.actor": "[KN] Actor",
		"ui.action": "[KN] Action",
		"ui.target_entity": "[KN] Target Entity",
		"ui.details": "[KN] Details",
		"ui.no_details": "[KN] No details",
		"ui.no_audit_logs_match_your_crite": "[KN] No audit logs match your criteria.",
		"ui.refresh": "[KN] Refresh",
		"ui.search_actor_or_action": "[KN] Search actor or action...",
		"ui.make_sure_you_are_logged_in_wi": "[KN] Make sure you are logged in with an admin account.",
		"ui.live_platform_data": "[KN] Live Platform Data",
		"ui.platform_dashboard": "[KN] Platform Dashboard",
		"ui.real_time_overview_from_the_ba": "[KN] Real-time overview from the backend database",
		"ui.total_complaints": "[KN] Total Complaints",
		"ui.work_order_status_distribution": "[KN] Work Order Status Distribution",
		"ui.recent_work_orders": "[KN] Recent Work Orders",
		"ui.no_work_orders_yet": "[KN] No work orders yet",
		"ui.total_users": "[KN] Total Users",
		"ui.officers": "[KN] Officers",
		"ui.contractors": "[KN] Contractors",
		"ui.active_work": "[KN] Active Work",
		"ui.open_complaints": "[KN] Open Complaints",
		"ui.cities": "[KN] Cities",
		"ui.platform_settings": "[KN] Platform Settings",
		"ui.system_configuration_and_admin": "[KN] System configuration and administration",
		"ui.global_notification_settings": "[KN] Global Notification Settings",
		"ui.platform_name": "[KN] Platform Name",
		"ui.janmind_civic_infrastructure_p": "[KN] JANMIND Civic Infrastructure Platform",
		"ui.environment": "[KN] Environment",
		"ui.prototype_demo": "[KN] Prototype / Demo",
		"ui.version": "[KN] Version",
		"ui.v1_0_0_prototype": "[KN] v1.0.0-prototype",
		"ui.storage_mode": "[KN] Storage Mode",
		"ui.browser_localstorage": "[KN] Browser LocalStorage",
		"ui.security_authentication": "[KN] Security & Authentication",
		"ui.danger_zone": "[KN] Danger Zone",
		"ui.reset_prototype_data": "[KN] Reset Prototype Data",
		"ui.this_will_clear_all_shared_pro": "[KN] This will clear all shared prototype data (contractors, work orders, audit logs, SLA rules) from local storage. Default mock data will be re-initialized on next load.",
		"ui.clear_all_data": "[KN] Clear All Data",
		"ui.sla_configuration": "[KN] SLA Configuration",
		"ui.define_response_and_resolution": "[KN] Define response and resolution time limits across categories",
		"ui.response_hrs": "[KN] Response (Hrs)",
		"ui.resolution_hrs": "[KN] Resolution (Hrs)",
		"ui.escalation_hrs": "[KN] Escalation (Hrs)",
		"ui.user_management": "[KN] User Management",
		"ui.total_users_across_all_roles": "[KN] total users across all roles",
		"ui.add_user": "[KN] Add User",
		"ui.name": "[KN] Name",
		"ui.actions": "[KN] Actions",
		"ui.no_users_found": "[KN] No users found",
		"ui.full_name": "[KN] Full Name *",
		"ui.none": "[KN] — None —",
		"ui.search_name_email_city": "[KN] Search name, email, city...",
		"ui.edit_user": "[KN] Edit user",
		"ui.delete_user": "[KN] Delete user",
		"ui.e_g_priya_sharma": "[KN] e.g. Priya Sharma",
		"ui.user_example_com": "[KN] user@example.com",
		"ui.min_8_characters": "[KN] Min 8 characters",
		"ui.e_g_roads": "[KN] e.g. Roads",
		"ui.platform_work_orders": "[KN] Platform Work Orders",
		"ui.global_view_of_all_municipal_w": "[KN] Global view of all municipal work orders",
		"ui.global_work_order_distribution": "[KN] Global Work Order Distribution",
		"ui.status_breakdown_across_all_ci": "[KN] Status breakdown across all cities",
		"ui.id_title": "[KN] ID / Title",
		"ui.municipality": "[KN] Municipality",
		"ui.no_work_orders_found_in_the_pl": "[KN] No work orders found in the platform.",
		"ui.registration": "[KN] Registration:",
		"ui.current_status": "[KN] Current Status",
		"ui.verify_contractor": "[KN] Verify Contractor",
		"ui.suspend_contractor": "[KN] Suspend Contractor",
		"ui.tax_id_pan": "[KN] Tax ID / PAN",
		"ui.contractor_tier": "[KN] Contractor Tier",
		"ui.class_a": "[KN] Class A",
		"ui.registration_compliance": "[KN] Registration & Compliance",
		"ui.document_type": "[KN] Document Type",
		"ui.uploaded_date": "[KN] Uploaded Date",
		"ui.no_documents_uploaded": "[KN] No documents uploaded",
		"ui.system_security_logging": "[KN] System Security Logging",
		"ui.pending_verification": "[KN] Pending Verification",
		"ui.suspended": "[KN] Suspended",
		"ui.not_found": "[KN] Not Found",
		"ui.overall_score": "[KN] Overall Score",
		"ui.inspection_pass_rate": "[KN] Inspection Pass Rate",
		"ui.contractor_registry": "[KN] Contractor Registry",
		"ui.manage_and_verify_platform_con": "[KN] Manage and verify platform contractors",
		"ui.reg": "[KN] Reg:",
		"ui.more": "[KN] more",
		"ui.verify": "[KN] Verify",
		"ui.suspend": "[KN] Suspend",
		"ui.no_contractors_found_matching_": "[KN] No contractors found matching your criteria.",
		"ui.search_by_name_or_registration": "[KN] Search by name or registration number...",
		"nav.home": "ಮುಖಪುಟ",
		"nav.howitworks": "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
		"nav.map": "ನಾಗರಿಕ ನಕ್ಷೆ",
		"nav.report": "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
		"nav.complaints": "ನನ್ನ ದೂರುಗಳು",
		"nav.notifications": "ಅಧಿಸೂಚನೆಗಳು",
		"nav.profile": "ಪ್ರೊಫೈಲ್",
		"nav.signin": "ಸೈನ್ ಇನ್",
		"nav.signout": "ಸೈನ್ ಔಟ್",
		"home.hero.badge": "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
		"home.hero.title": "ಜನ್‌ಮೈಂಡ್",
		"home.hero.subtitle": "ನಿಮ್ಮ ನಗರವನ್ನು ಉತ್ತಮಗೊಳಿಸಿ, ಒಂದು ಸಮಯದಲ್ಲಿ ಒಂದು ವರದಿ.",
		"home.hero.desc": "ಸ್ಥಳ ಮತ್ತು ಪುರಾವೆಯೊಂದಿಗೆ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. JANMIND ವೈಯಕ್ತಿಕ ದೂರುಗಳನ್ನು ದೊಡ್ಡ ಮಾದರಿಗಳಿಗೆ ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
		"home.hero.howitworks": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
		"home.hero.smallprint": "ಸುಮಾರು ಒಂದು ನಿಮಿಷ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ. ನೀವು ವಿಭಾಗ ಅಥವಾ ವರ್ಗ ತಿಳಿದಿರಬೇಕಿಲ್ಲ — JANMIND ನಿಮಗೆ ಸೂಚಿಸುತ್ತದೆ.",
		"hiw.label": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
		"hiw.heading": "ನಿಮ್ಮ ಬೀದಿಯ ಸಮಸ್ಯೆಯಿಂದ ನಾಗರಿಕ ದಾಖಲೆಯವರೆಗೆ — ನಾಲ್ಕು ಹಂತಗಳು.",
		"hiw.step1.title": "ವರದಿ",
		"hiw.step1.body": "JANMIND ಗೆ ಏನಾಯಿತು ಎಂದು ತಿಳಿಸಿ.",
		"hiw.step2.title": "ಸ್ಥಳ",
		"hiw.step2.body": "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ ಅಥವಾ ಹಸ್ತಚಾಲಿತವಾಗಿ ಆಯ್ಕೆ ಮಾಡಿ.",
		"hiw.step3.title": "ಪುರಾವೆ",
		"hiw.step3.body": "ಲಭ್ಯವಿದ್ದರೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
		"hiw.step4.title": "ಟ್ರ್ಯಾಕ್",
		"hiw.step4.body": "ನಿಮ್ಮ ದೂರನ್ನು ಅನುಸರಿಸಿ ಮತ್ತು ನವೀಕರಣಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.",
		"pattern.label": "ಮಾದರಿ ಪತ್ತೆ",
		"pattern.heading": "ಒಂದು ವರದಿ ದೂರು. ಅನೇಕ ವರದಿಗಳು ಒಂದು ಮಾದರಿ.",
		"pattern.desc": "ಹಲವಾರು ನಾಗರಿಕರು ಹತ್ತಿರದಲ್ಲಿ ಒಂದೇ ರೀತಿಯ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿದಾಗ, JANMIND ಅವರನ್ನು ಒಂದು ಹಾಟ್‌ಸ್ಪಾಟ್‌ ಆಗಿ ಗುಂಪು ಮಾಡುತ್ತದೆ — ಯಾರ ಗುರುತು ಅಥವಾ ಖಾಸಗಿ ವಿಳಾಸ ಬಹಿರಂಗಪಡಿಸದೆ.",
		"pattern.bullet1": "ಸರಿಸುಮಾರು 500 ಮೀ ನಲ್ಲಿ 23 ಒಂದೇ ರೀತಿಯ ವರದಿಗಳು",
		"pattern.bullet2": "ವಾರ್ಡ್ 14 ರಲ್ಲಿ 127 ಸಂಬಂಧಿತ ವರದಿಗಳು",
		"pattern.bullet3": "ಸಮಗ್ರ ನೋಟ ಮಾತ್ರ — ಯಾವುದೇ ವೈಯಕ್ತಿಕ ವಿವರ ಹಂಚಿಕೆಯಿಲ್ಲ",
		"pattern.issues.label": "ನೀವು ವರದಿ ಮಾಡಬಹುದಾದ ಸಮಸ್ಯೆಗಳು",
		"pattern.startreport": "ವರದಿ ಪ್ರಾರಂಭಿಸಿ",
		"stats.label": "ನಾಗರಿಕ ಬುದ್ಧಿ — ಮಾದರಿ ಡೇಟಾ",
		"stats.reports": "ವಾರ್ಡ್ 14 ರಲ್ಲಿ ಸಂಬಂಧಿತ ವರದಿಗಳು",
		"stats.types": "ಸಮಸ್ಯೆ ವಿಧಗಳು",
		"stats.update": "ಮಧ್ಯ ಮೊದಲ ನವೀಕರಣ",
		"stats.cities": "ಬೆಂಬಲಿತ ನಗರಗಳು",
		"map.card.label": "ಸ್ಥಳೀಯ ನಾಗರಿಕ ಚಟುವಟಿಕೆ — ಮಾದರಿ ಡೇಟಾ",
		"map.card.open": "ನಾಗರಿಕ ನಕ್ಷೆ ತೆರೆಯಿರಿ",
		"footer.brand": "JANMIND — ನಾಗರಿಕ ಪೋರ್ಟಲ್",
		"footer.note": "ಪ್ರೋಟೋಟೈಪ್ ಇಂಟರ್ಫೇಸ್. ತೋರಿಸಿದ ಡೇಟಾ ಮಾದರಿ ಡೇಟಾ.",
		"report.step.problem": "ಸಮಸ್ಯೆ",
		"report.step.location": "ಸ್ಥಳ",
		"report.step.evidence": "ಪುರಾವೆ",
		"report.step.review": "ವಿಮರ್ಶೆ",
		"report.btn.continue": "ಮುಂದುವರಿಸಿ",
		"report.btn.back": "ಹಿಂದೆ",
		"report.btn.submit": "ವರದಿ ಸಲ್ಲಿಸಿ",
		"register.access": "ನಾಗರಿಕ ಪ್ರವೇಶ",
		"register.heading": "ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
		"register.subtext": "ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳು ಖಾಸಗಿಯಾಗಿ ಉಳಿಯುತ್ತವೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ನಕ್ಷೆಗಳಲ್ಲಿ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ.",
		"register.name": "ಪೂರ್ಣ ಹೆಸರು",
		"register.name.placeholder": "ನಿಮ್ಮ ಹೆಸರು",
		"register.email": "ಇಮೇಲ್",
		"register.email.placeholder": "you@example.com",
		"register.phone": "ಫೋನ್",
		"register.phone.placeholder": "+91 00000 00000",
		"register.password": "ಪಾಸ್‌ವರ್ಡ್",
		"register.password.placeholder": "ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು",
		"register.password.error": "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.",
		"register.btn": "ಖಾತೆ ರಚಿಸಿ",
		"register.btn.busy": "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
		"register.success": "ಖಾತೆ ರಚಿಸಲಾಗಿದೆ",
		"register.error": "ಈಗ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
		"register.existing": "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ?",
		"register.signin": "ಸೈನ್ ಇನ್",
		"login.access": "ನಾಗರಿಕ ಪ್ರವೇಶ",
		"login.heading": "ಸೈನ್ ಇನ್",
		"login.subtext": "ನಿಮ್ಮ ವರದಿಗಳು, ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ದೂರು ಇತಿಹಾಸಕ್ಕೆ ಮುಂದುವರಿಸಿ.",
		"login.email": "ಇಮೇಲ್",
		"login.email.placeholder": "you@example.com",
		"login.password": "ಪಾಸ್‌ವರ್ಡ್",
		"login.btn": "ಸೈನ್ ಇನ್",
		"login.btn.busy": "ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...",
		"login.success": "ಸೈನ್ ಇನ್ ಆಗಿದೆ",
		"login.error": "ಸೈನ್ ಇನ್ ಆಗಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
		"login.new": "JANMIND ಗೆ ಹೊಸಬರಾ?",
		"login.createaccount": "ಖಾತೆ ರಚಿಸಿ",
		"profile.title": "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
		"profile.language": "ಆದ್ಯತೆಯ ಭಾಷೆ",
		"profile.theme": "ಥೀಮ್ ಆದ್ಯತೆ",
		"btn.save": "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ"
	}
};
var I18nContext = (0, import_react.createContext)(void 0);
function I18nProvider({ children }) {
	const [language, setLanguageState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("janmind-lang");
		if (saved && TRANSLATIONS[saved]) setLanguageState(saved);
	}, []);
	const setLanguage = (lang) => {
		localStorage.setItem("janmind-lang", lang);
		setLanguageState(lang);
	};
	const t = (key, fallback) => {
		return TRANSLATIONS[language][key] || TRANSLATIONS["en"][key] || fallback || key;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value: {
			language,
			setLanguage,
			t
		},
		children
	});
}
function useI18n() {
	const context = (0, import_react.useContext)(I18nContext);
	if (context === void 0) throw new Error("useI18n must be used within an I18nProvider");
	return context;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dv4Gi8Y2.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-CYSTj7A7.css";
var leaflet_default = "/assets/leaflet-vh-t_kPv.css";
var STORAGE_KEY = "janmind.theme";
var ThemeContext = (0, import_react.createContext)({
	mode: "dark",
	resolved: "dark",
	setMode: () => {}
});
/** Inlined in the document head so the theme is applied before first paint. */
var themeInitScript = `(function(){try{var m=localStorage.getItem("${STORAGE_KEY}")||"dark";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;
function systemPrefersDark() {
	if (typeof window === "undefined") return true;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function ThemeProvider({ children }) {
	const [mode, setModeState] = (0, import_react.useState)("dark");
	const [resolved, setResolved] = (0, import_react.useState)("dark");
	const apply = (0, import_react.useCallback)((next) => {
		const dark = next === "dark" || next === "system" && systemPrefersDark();
		document.documentElement.classList.toggle("dark", dark);
		document.documentElement.style.colorScheme = dark ? "dark" : "light";
		setResolved(dark ? "dark" : "light");
	}, []);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(STORAGE_KEY) ?? "dark";
		setModeState(stored);
		apply(stored);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (localStorage.getItem(STORAGE_KEY) === "system") apply("system");
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [apply]);
	const setMode = (0, import_react.useCallback)((next) => {
		setModeState(next);
		localStorage.setItem(STORAGE_KEY, next);
		apply(next);
	}, [apply]);
	const value = (0, import_react.useMemo)(() => ({
		mode,
		resolved,
		setMode
	}), [
		mode,
		resolved,
		setMode
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
var delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));
var STORAGE = {
	officer: "janmind_muni_officer",
	complaints: "janmind_muni_complaints",
	issues: "janmind_muni_issues",
	alerts: "janmind_muni_alerts",
	notifications: "janmind_muni_notifications",
	settings: "janmind_muni_settings",
	savedViews: "janmind_muni_saved_views",
	liveActivity: "janmind_muni_live"
};
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(value));
}
var DEFAULT_SETTINGS = {
	theme: "system",
	compactMode: false,
	defaultCity: "vadodara",
	defaultMapMode: "health",
	notifications: {
		critical: true,
		assignments: true,
		riskChanges: true,
		dailyDigest: false
	}
};
async function muniLogin(input) {
	await delay();
	if (!input.email.trim() || !input.password.trim()) throw new Error("Invalid credentials");
	const officer = {
		...DEMO_OFFICER,
		email: input.email,
		city: input.city
	};
	write(STORAGE.officer, officer);
	return officer;
}
async function muniLogout() {
	await delay(120);
	localStorage.removeItem(STORAGE.officer);
}
async function getMuniOfficer() {
	await delay(80);
	return read(STORAGE.officer, null);
}
async function getMuniSettings() {
	await delay(80);
	return read(STORAGE.settings, DEFAULT_SETTINGS);
}
async function saveMuniSettings(patch) {
	await delay();
	const next = {
		...read(STORAGE.settings, DEFAULT_SETTINGS),
		...patch
	};
	write(STORAGE.settings, next);
	return next;
}
var MuniAuthContext = (0, import_react.createContext)(null);
function MuniAuthProvider({ children }) {
	const [officer, setOfficer] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.all([getMuniOfficer(), getMuniSettings()]).then(([o, s]) => {
			setOfficer(o);
			setSettings(s);
		}).finally(() => setReady(true));
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password, city) => {
		const o = await muniLogin({
			email,
			password,
			city
		});
		setOfficer(o);
		return o;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await muniLogout();
		setOfficer(null);
	}, []);
	const updateSettings = (0, import_react.useCallback)(async (patch) => {
		const s = await saveMuniSettings(patch);
		setSettings(s);
		return s;
	}, []);
	const refreshSettings = (0, import_react.useCallback)(async () => {
		const s = await getMuniSettings();
		setSettings(s);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		officer,
		ready,
		settings,
		signIn,
		signOut,
		updateSettings,
		refreshSettings
	}), [
		officer,
		ready,
		settings,
		signIn,
		signOut,
		updateSettings,
		refreshSettings
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniAuthContext.Provider, {
		value,
		children
	});
}
var CTX$1 = (0, import_react.createContext)(null);
var LS_KEY = "janmind.contractor_session";
var CONTRACTORS_KEY = "janmind.contractors";
var DEMO_SESSION = {
	id: "session_ctr",
	contractorId: "CTR-001",
	companyName: "Bharat Infrastructure Pvt Ltd",
	contactPerson: "Suresh Patel",
	email: "suresh.patel@bharatinfra.in"
};
function readLS(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function ContractorAuthProvider({ children }) {
	const [contractor, setContractor] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const session = readLS(LS_KEY, null);
		setContractor(session);
		setReady(true);
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, _password) => {
		await new Promise((r) => setTimeout(r, 500));
		if (!email.trim()) throw new Error("Email is required");
		const match = readLS(CONTRACTORS_KEY, []).find((c) => c.email.toLowerCase() === email.toLowerCase());
		const session = match ? {
			id: `session_${match.id}`,
			contractorId: match.id,
			companyName: match.companyName,
			contactPerson: match.contactPerson,
			email: match.email
		} : {
			...DEMO_SESSION,
			email
		};
		localStorage.setItem(LS_KEY, JSON.stringify(session));
		setContractor(session);
		return session;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		localStorage.removeItem(LS_KEY);
		setContractor(null);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		contractor,
		ready,
		signIn,
		signOut
	}), [
		contractor,
		ready,
		signIn,
		signOut
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTX$1.Provider, {
		value,
		children
	});
}
var CTX = (0, import_react.createContext)(null);
function AdminAuthProvider({ children }) {
	const [admin, setAdmin] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getAdminUser().then(setAdmin).finally(() => setReady(true));
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const a = await adminLogin(email, password);
		setAdmin(a);
		return a;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await adminLogout();
		setAdmin(null);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		admin,
		ready,
		signIn,
		signOut
	}), [
		admin,
		ready,
		signIn,
		signOut
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTX.Provider, {
		value,
		children
	});
}
function useAdminAuth() {
	const ctx = (0, import_react.useContext)(CTX);
	if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
	return ctx;
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/dashboard",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go to Dashboard"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error(error);
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. You can try refreshing or head back to the dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/admin/dashboard",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Dashboard"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "JANMIND — Municipal Intelligence" },
			{
				name: "description",
				content: "Municipal operations dashboard for civic complaint intelligence, emerging issues, and city-wide monitoring."
			},
			{
				name: "author",
				content: "JANMIND"
			},
			{
				property: "og:title",
				content: "JANMIND — Municipal Intelligence"
			},
			{
				property: "og:description",
				content: "Officer dashboard for civic intelligence and operational response."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: leaflet_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractorAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminAuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] }) }) }) }) })
	});
}
var Route$10 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/admin/dashboard" });
} });
var $$splitComponentImporter$9 = () => import("./route-CXNzjmmT.mjs");
var Route$9 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./login-D6pgwaV1.mjs");
var Route$8 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Admin Login | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./audit-logs-BvJpp5RO.mjs");
var Route$7 = createFileRoute("/admin/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-DTlcJbNV.mjs");
var Route$6 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Admin Dashboard | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./settings-slpCUHTs.mjs");
var Route$5 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "Settings | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./sla-BHdC93nB.mjs");
var Route$4 = createFileRoute("/admin/sla")({
	head: () => ({ meta: [{ title: "SLA Configuration | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/**
* User Management Page — Admin Portal
*
* Allows super admin (Maher Bhatt) and supervisors to:
* - View all users (officers, municipality, contractors, citizens, admins)
* - Create new users of any role
* - Edit user details (name, role, city, department, password)
* - Delete users
*
* All operations call the real backend via /api/v1/admin/users
*/
var $$splitComponentImporter$3 = () => import("./users-aKWiies4.mjs");
var Route$3 = createFileRoute("/admin/users")({
	head: () => ({ meta: [{ title: "User Management | JANMIND Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./work-orders-overview-CtfuXjs2.mjs");
var Route$2 = createFileRoute("/admin/work-orders-overview")({
	head: () => ({ meta: [{ title: "Work Orders Overview | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./contractors-BObo8LUF.mjs");
var Route$1 = createFileRoute("/admin/contractors/")({
	head: () => ({ meta: [{ title: "Contractors | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-gaAcmQzX.mjs");
var Route = createFileRoute("/admin/contractors/$id")({
	head: () => ({ meta: [{ title: "Contractor Details | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AdminRouteRoute = Route$9.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$11
});
var LoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$11
});
var AdminAuditLogsRoute = Route$7.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => AdminRouteRoute
});
var AdminDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRouteRoute
});
var AdminSettingsRoute = Route$5.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRouteRoute
});
var AdminSlaRoute = Route$4.update({
	id: "/sla",
	path: "/sla",
	getParentRoute: () => AdminRouteRoute
});
var AdminUsersRoute = Route$3.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRouteRoute
});
var AdminWorkOrdersOverviewRoute = Route$2.update({
	id: "/work-orders-overview",
	path: "/work-orders-overview",
	getParentRoute: () => AdminRouteRoute
});
var AdminContractorsIndexRoute = Route$1.update({
	id: "/contractors/",
	path: "/contractors/",
	getParentRoute: () => AdminRouteRoute
});
var AdminRouteRouteChildren = {
	AdminAuditLogsRoute,
	AdminDashboardRoute,
	AdminSettingsRoute,
	AdminSlaRoute,
	AdminUsersRoute,
	AdminWorkOrdersOverviewRoute,
	AdminContractorsIdRoute: Route.update({
		id: "/contractors/$id",
		path: "/contractors/$id",
		getParentRoute: () => AdminRouteRoute
	}),
	AdminContractorsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRoute._addFileChildren(AdminRouteRouteChildren),
	LoginRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { updateSLARule as _, deleteUser as a, verifyContractor as b, getContractorDocuments as c, getSLARules as d, getWorkOrders as f, suspendContractor as g, listRealWorkOrders as h, createUser as i, getContractors as l, listAllUsers as m, Route as n, getAuditLogs as o, listAdminCities as p, useAdminAuth as r, getContractor as s, router_exports as t, getPlatformStats as u, updateUser as v, useI18n as y };
