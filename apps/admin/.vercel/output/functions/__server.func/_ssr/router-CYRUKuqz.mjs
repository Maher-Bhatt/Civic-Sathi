import { i as __toESM } from "../_runtime.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { A as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-store-CPgxlkZs.js
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
var DEMO_ADMIN_USER = {
	id: "admin_001",
	name: "Kavya Reddy",
	email: "kavya.reddy@janmind.gov.in",
	role: "admin",
	createdAt: (/* @__PURE__ */ new Date(now - 7776e6)).toISOString(),
	lastActive: (/* @__PURE__ */ new Date()).toISOString()
};
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
({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_BASE_URL": "http://localhost:8000"
})["VITE_API_BASE_URL"];
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
async function getAllEvidence() {
	return fetchStore("evidence");
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
async function getAdminUser() {
	try {
		const raw = localStorage.getItem("janmind.admin_user");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
async function adminLogin(email, _password) {
	if (!email.trim()) throw new Error("Email is required");
	const admin = {
		...DEMO_ADMIN_USER,
		email
	};
	localStorage.setItem("janmind.admin_user", JSON.stringify(admin));
	return admin;
}
async function adminLogout() {
	localStorage.removeItem("janmind.admin_user");
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CYRUKuqz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var styles_default = "/assets/styles-CgSc_4wt.css";
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
						children: "Go to dashboard"
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
					children: "Something went wrong on our end. You can try refreshing or head back to the dashboard."
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
var Route$10 = createRootRouteWithContext()({
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
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
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
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractorAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminAuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] }) }) }) })
	});
}
var Route$9 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/admin/dashboard" });
} });
var $$splitComponentImporter$8 = () => import("./route-BSQood2H.mjs");
var Route$8 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./login-D3l7xbGu.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Admin Login | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./audit-logs-CFlxtdSH.mjs");
var Route$6 = createFileRoute("/admin/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./dashboard-642fsAqZ.mjs");
var Route$5 = createFileRoute("/admin/dashboard")({
	head: () => ({ meta: [{ title: "Admin Dashboard | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./settings-DLEycGh6.mjs");
var Route$4 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "Settings | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./sla-D6RruVDR.mjs");
var Route$3 = createFileRoute("/admin/sla")({
	head: () => ({ meta: [{ title: "SLA Configuration | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./work-orders-overview-BuSGtTiP.mjs");
var Route$2 = createFileRoute("/admin/work-orders-overview")({
	head: () => ({ meta: [{ title: "Work Orders Overview | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./contractors-DO4oV1Vf.mjs");
var Route$1 = createFileRoute("/admin/contractors/")({
	head: () => ({ meta: [{ title: "Contractors | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-DoXp-MJT.mjs");
var Route = createFileRoute("/admin/contractors/$id")({
	head: () => ({ meta: [{ title: "Contractor Details | Admin | JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var AdminRouteRoute = Route$8.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$10
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$10
});
var AdminAuditLogsRoute = Route$6.update({
	id: "/audit-logs",
	path: "/audit-logs",
	getParentRoute: () => AdminRouteRoute
});
var AdminDashboardRoute = Route$5.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRouteRoute
});
var AdminSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRouteRoute
});
var AdminSlaRoute = Route$3.update({
	id: "/sla",
	path: "/sla",
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
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
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
export { getAuditLogs as a, getContractors as c, suspendContractor as d, updateSLARule as f, getAllEvidence as i, getSLARules as l, Route as n, getContractor as o, verifyContractor as p, useAdminAuth as r, getContractorDocuments as s, router_exports as t, getWorkOrders as u };
