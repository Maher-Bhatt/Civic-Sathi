import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BpUolG9Z.js
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
var APIClientError = class extends Error {
	status;
	details;
	constructor(message, status, details) {
		super(message);
		this.name = "APIClientError";
		this.status = status;
		this.details = details;
	}
};
var APIClient = class {
	config;
	constructor(config) {
		this.config = config;
	}
	async request(endpoint, options = {}) {
		const url = `${this.config.baseUrl}${endpoint}`;
		const token = await this.config.getToken();
		const headers = new Headers(options.headers);
		if (token) headers.set("Authorization", `Bearer ${token}`);
		if (!headers.has("Content-Type") && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
		const response = await fetch(url, {
			...options,
			headers
		});
		if (response.status === 401 && this.config.onUnauthorized) this.config.onUnauthorized();
		if (!response.ok) {
			let errorDetail = "API Request Failed";
			try {
				const errorData = await response.json();
				if (typeof errorData.detail === "string") errorDetail = errorData.detail;
				else if (Array.isArray(errorData.detail)) errorDetail = errorData.detail.map((e) => e.msg || e.message).join("; ");
				else errorDetail = errorData.message || errorDetail;
			} catch (e) {}
			throw new APIClientError(errorDetail, response.status);
		}
		if (response.status === 204) return {};
		return response.json();
	}
	get(endpoint, options) {
		return this.request(endpoint, {
			...options,
			method: "GET"
		});
	}
	post(endpoint, body, options) {
		return this.request(endpoint, {
			...options,
			method: "POST",
			body: body instanceof FormData ? body : JSON.stringify(body)
		});
	}
	patch(endpoint, body, options) {
		return this.request(endpoint, {
			...options,
			method: "PATCH",
			body: body instanceof FormData ? body : JSON.stringify(body)
		});
	}
	delete(endpoint, options) {
		return this.request(endpoint, {
			...options,
			method: "DELETE"
		});
	}
};
function normaliseAuthResponse(raw) {
	const user = raw.user ?? raw.citizen ?? raw.officer ?? void 0;
	return {
		...raw,
		user
	};
}
var Endpoints = class {
	client;
	constructor(client) {
		this.client = client;
	}
	auth = {
		loginOfficer: async (data) => {
			return normaliseAuthResponse(await this.client.post("/api/v1/auth/officer-login", data));
		},
		loginCitizen: async (data) => {
			return normaliseAuthResponse(await this.client.post("/api/v1/auth/login", data));
		},
		registerCitizen: async (data) => {
			return normaliseAuthResponse(await this.client.post("/api/v1/auth/register", data));
		},
		me: async () => {
			return this.client.get("/api/v1/auth/me");
		}
	};
	complaints = {
		list: (params) => {
			const query = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== void 0).map(([k, v]) => [k, String(v)])).toString() : "";
			return this.client.get(`/api/v1/complaints${query ? "?" + query : ""}`);
		},
		get: (id) => this.client.get(`/api/v1/complaints/${id}`),
		create: (data) => this.client.post("/api/v1/complaints", data),
		updateStatus: (id, status) => this.client.patch(`/api/v1/complaints/${id}/status`, { status })
	};
	tenders = {
		list: (cityId) => this.client.get(`/api/v1/procurement/tenders?city_id=${cityId}`),
		get: (id) => this.client.get(`/api/v1/procurement/tenders/${id}`),
		create: (data) => this.client.post("/api/v1/procurement/tenders", data),
		submitBid: (tenderId, data) => this.client.post(`/api/v1/procurement/tenders/${tenderId}/bids`, data),
		listBids: (tenderId) => this.client.get(`/api/v1/procurement/tenders/${tenderId}/bids`),
		awardBid: (tenderId, bidId) => this.client.post(`/api/v1/procurement/tenders/${tenderId}/bids/${bidId}/award`, {})
	};
	workOrders = {
		list: (cityId) => this.client.get(`/api/v1/procurement/work-orders?city_id=${cityId}`),
		get: (id) => this.client.get(`/api/v1/procurement/work-orders/${id}`),
		updateStatus: (id, status) => this.client.patch(`/api/v1/procurement/work-orders/${id}/status`, { status }),
		submitEvidence: (id, data) => this.client.post(`/api/v1/procurement/work-orders/${id}/evidence`, data),
		inspect: (id, data) => this.client.post(`/api/v1/procurement/work-orders/${id}/inspections`, data)
	};
	cities = { list: () => this.client.get("/api/v1/cities") };
};
var api_exports = /* @__PURE__ */ __exportAll({
	API_BASE_URL: () => API_BASE_URL,
	acknowledgeAlert: () => acknowledgeAlert,
	adminLogin: () => adminLogin,
	adminLogout: () => adminLogout,
	api: () => api,
	approveBill: () => approveBill,
	assignComplaint: () => assignComplaint,
	assignIssueDepartment: () => assignIssueDepartment,
	awardBid: () => awardBid,
	bulkUpdateComplaints: () => bulkUpdateComplaints,
	client: () => client,
	createTender: () => createTender,
	getAdminUser: () => getAdminUser,
	getAlerts: () => getAlerts,
	getAnalyticsData: () => getAnalyticsData,
	getAreaOverviews: () => getAreaOverviews,
	getBill: () => getBill,
	getCivicIssues: () => getCivicIssues,
	getDashboardKPIs: () => getDashboardKPIs,
	getDepartment: () => getDepartment,
	getDepartments: () => getDepartments,
	getEvidence: () => getEvidence,
	getHotspotRankings: () => getHotspotRankings,
	getLiveActivity: () => getLiveActivity,
	getMeasurement: () => getMeasurement,
	getMuniComplaint: () => getMuniComplaint,
	getMuniComplaints: () => getMuniComplaints,
	getMuniOfficer: () => getMuniOfficer,
	getMuniSettings: () => getMuniSettings,
	getOfficerNotifications: () => getOfficerNotifications,
	getSavedViews: () => getSavedViews,
	getSystemicIssue: () => getSystemicIssue,
	getSystemicIssues: () => getSystemicIssues,
	getTender: () => getTender,
	getWorkOrder: () => getWorkOrder,
	getWorkOrderEvents: () => getWorkOrderEvents,
	getWorkOrders: () => getWorkOrders,
	inspectWorkOrder: () => inspectWorkOrder,
	listBids: () => listBids,
	listTenders: () => listTenders,
	markNotificationRead: () => markNotificationRead,
	muniLogin: () => muniLogin,
	muniLogout: () => muniLogout,
	officerSearch: () => officerSearch,
	recordInspection: () => recordInspection,
	saveMuniSettings: () => saveMuniSettings,
	startInvestigation: () => startInvestigation,
	startLiveSimulation: () => startLiveSimulation,
	stopLiveSimulation: () => stopLiveSimulation,
	submitMeasurement: () => submitMeasurement,
	updateMuniComplaint: () => updateMuniComplaint,
	updateSystemicIssue: () => updateSystemicIssue,
	updateWorkOrderStatus: () => updateWorkOrderStatus
});
var API_BASE_URL = {
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
	"VITE_API_BASE_URL": "https://janmind.onrender.com"
}["VITE_API_BASE_URL"] ?? "https://janmind.onrender.com";
var LS = {
	officer: "janmind_muni_officer",
	token: "janmind_muni_token"
};
var client = new APIClient({
	baseUrl: API_BASE_URL,
	getToken: () => {
		if (typeof window === "undefined") return null;
		return window.localStorage.getItem(LS.token);
	},
	onUnauthorized: () => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(LS.token);
			window.location.href = "/login";
		}
	}
});
var api = new Endpoints(client);
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key, JSON.stringify(value));
}
async function muniLogin(input) {
	try {
		const res = await api.auth.loginOfficer(input);
		if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
		const backendUser = res.user || res.officer;
		if (!backendUser) throw new Error("Login failed: no user data returned");
		const role = (backendUser.role || "").toLowerCase();
		if (![
			"officer",
			"supervisor",
			"admin",
			"municipality"
		].includes(role)) throw new Error("Access denied: this account does not have officer permissions");
		const officer = {
			id: backendUser.id ?? "",
			name: backendUser.name ?? "",
			email: backendUser.email ?? "",
			department: backendUser.department ?? "General",
			role: "Officer",
			city: input.city,
			lastActive: (/* @__PURE__ */ new Date()).toISOString()
		};
		write(LS.officer, officer);
		return officer;
	} catch (error) {
		throw error;
	}
}
async function muniLogout() {
	if (typeof window !== "undefined") {
		window.localStorage.removeItem(LS.token);
		window.localStorage.removeItem(LS.officer);
	}
}
async function adminLogin(email, pass) {
	return {};
}
async function adminLogout() {}
async function getAdminUser() {
	return null;
}
async function getMuniOfficer() {
	if (typeof window === "undefined") return null;
	if (!window.localStorage.getItem(LS.token)) return null;
	const cached = read(LS.officer, null);
	const refreshFromServer = async () => {
		try {
			const me = await api.auth.me();
			if (me && [
				"officer",
				"supervisor",
				"admin",
				"municipality"
			].includes(me.role || "")) {
				const officer = {
					id: me.id,
					name: me.name,
					email: me.email ?? "",
					department: me.department ?? "General",
					role: "Officer",
					city: me.city || "bengaluru",
					lastActive: (/* @__PURE__ */ new Date()).toISOString()
				};
				write(LS.officer, officer);
				return officer;
			}
		} catch {}
		return null;
	};
	if (cached) {
		refreshFromServer();
		return cached;
	}
	return refreshFromServer();
}
async function getDashboardKPIs() {
	const data = await client.get("/api/v1/analytics/summary");
	if (data) return {
		totalReports: data.total_complaints || 0,
		critical: data.critical_issues || 0,
		active: data.unresolved_complaints || 0,
		resolved: data.status_distribution?.resolved || 0,
		emergingIssues: data.total_issues || 0,
		areaHotspots: 0
	};
	return {
		totalReports: 0,
		critical: 0,
		active: 0,
		resolved: 0,
		emergingIssues: 0,
		areaHotspots: 0
	};
}
async function getLiveActivity() {
	return [];
}
async function getSystemicIssues(city) {
	return client.get("/api/v1/issues" + (city ? `?city=${city}` : ""));
}
async function getSystemicIssue(id) {
	return client.get(`/api/v1/issues/${id}`);
}
async function updateSystemicIssue(id, patch) {
	return client.patch(`/api/v1/issues/${id}`, patch);
}
async function startInvestigation(id) {
	return updateSystemicIssue(id, { status: "Investigating" });
}
async function assignIssueDepartment(id, department) {
	return updateSystemicIssue(id, {
		status: "Assigned",
		department
	});
}
async function getCivicIssues() {
	return await client.get("/api/v1/issues") || [];
}
async function getMuniComplaints(filters) {
	const res = await api.complaints.list(filters);
	return res.data || res;
}
async function getMuniComplaint(id) {
	return api.complaints.get(id);
}
async function updateMuniComplaint(id, patch) {
	if (patch.status) return api.complaints.updateStatus(id, patch.status);
	return client.patch(`/api/v1/complaints/${id}`, patch);
}
async function assignComplaint(id, input) {
	return updateMuniComplaint(id, {
		status: "Assigned",
		department: input.department
	});
}
async function bulkUpdateComplaints(ids, patch) {
	for (const id of ids) await updateMuniComplaint(id, patch);
}
async function listTenders(cityIdOrName) {
	let cityId = cityIdOrName;
	if (!cityIdOrName.includes("-") || cityIdOrName.length !== 36) try {
		const match = (await client.get("/api/v1/cities")).find((c) => c.name.toLowerCase() === cityIdOrName.toLowerCase());
		if (match) cityId = match.id;
	} catch {}
	return await api.tenders.list(cityId);
}
async function getTender(id) {
	return await api.tenders.get(id);
}
async function createTender(data) {
	return await api.tenders.create(data);
}
async function listBids(tenderId) {
	return await api.tenders.listBids(tenderId);
}
async function awardBid(tenderId, bidId) {
	return await api.tenders.awardBid(tenderId, bidId);
}
async function inspectWorkOrder(workOrderId, result, feedback = "") {
	return await api.workOrders.inspect(workOrderId, {
		result,
		feedback
	});
}
async function getWorkOrders(params) {
	const officer = await getMuniOfficer();
	const rawCity = params?.cityId || officer?.city || "vadodara";
	let cityId = rawCity;
	if (!rawCity.includes("-") || rawCity.length !== 36) try {
		const match = (await client.get("/api/v1/cities")).find((c) => c.name.toLowerCase() === rawCity.toLowerCase());
		if (match) cityId = match.id;
	} catch {}
	return await api.workOrders.list(cityId);
}
async function getWorkOrder(id) {
	return await api.workOrders.get(id);
}
async function updateWorkOrderStatus(id, status, byId, byName, role) {
	return await api.workOrders.updateStatus(id, status);
}
async function getWorkOrderEvents(id) {
	return [];
}
async function getEvidence(id) {
	return [];
}
async function submitMeasurement(data, byId, byName) {
	return null;
}
async function getMeasurement(id) {
	return null;
}
async function getBill(id) {
	return null;
}
async function approveBill(billId, woId, byId, byName, amount) {
	return null;
}
async function recordInspection(data, byId, byName) {
	return null;
}
async function getAlerts(city) {
	return [];
}
async function acknowledgeAlert(id) {
	return {};
}
async function getDepartments() {
	return (await client.get("/api/v1/analytics/summary"))?.department_distribution || [];
}
async function getDepartment(id) {
	return (await getDepartments()).find((d) => d.id === id) ?? null;
}
async function getAreaOverviews(city) {
	return [];
}
async function getHotspotRankings() {
	return [];
}
async function getAnalyticsData(city) {
	const data = await client.get("/api/v1/analytics/summary?days=30");
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	return {
		complaintTrend: data?.daily_trends || [],
		severityTrend: [],
		departmentDistribution: data?.department_distribution || [],
		categoryDistribution: [],
		resolutionStatus: [],
		emergingTrend: months.map((m, i) => ({
			month: m,
			count: 8 + i * 2
		})),
		responseTime: months.map((m, i) => ({
			month: m,
			days: 2.8 - i * .1
		})),
		city
	};
}
async function getOfficerNotifications() {
	return [];
}
async function markNotificationRead(id) {}
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
async function getMuniSettings() {
	return read("janmind_muni_settings", DEFAULT_SETTINGS);
}
async function saveMuniSettings(patch) {
	const next = {
		...await getMuniSettings(),
		...patch
	};
	write("janmind_muni_settings", next);
	return next;
}
async function getSavedViews() {
	return [];
}
async function officerSearch(query) {
	return {
		complaints: [],
		issues: [],
		areas: []
	};
}
function startLiveSimulation(onUpdate) {}
function stopLiveSimulation() {}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D25gp3g4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var useTheme = () => (0, import_react.useContext)(ThemeContext);
var styles_default = "/assets/styles-Bt-aoy_r.css";
var leaflet_default = "/assets/leaflet-vh-t_kPv.css";
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
function useMuniAuth() {
	const ctx = (0, import_react.useContext)(MuniAuthContext);
	if (!ctx) throw new Error("useMuniAuth must be used inside MuniAuthProvider");
	return ctx;
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
						to: "/dashboard",
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
						href: "/dashboard",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Dashboard"
					})]
				})
			]
		})
	});
}
var Route$24 = createRootRouteWithContext()({
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
	const { queryClient } = Route$24.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractorAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminAuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] }) }) }) })
	});
}
var Route$23 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard" });
} });
var $$splitComponentImporter$22 = () => import("./route-L-SirZyQ.mjs");
var Route$22 = createFileRoute("/_auth")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./login-NBKUZs7d.mjs");
var Route$21 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Municipal Sign In — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./ai-triage-D8O1genj.mjs");
var Route$20 = createFileRoute("/_auth/ai-triage")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./alerts-DwZ5kgVS.mjs");
var Route$19 = createFileRoute("/_auth/alerts")({
	head: () => ({ meta: [{ title: "Alerts — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./analytics-DLbuMTks.mjs");
var Route$18 = createFileRoute("/_auth/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./dashboard-DA1cL3qW.mjs");
var Route$17 = createFileRoute("/_auth/dashboard")({
	head: () => ({ meta: [{ title: "Municipal Intelligence — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./map-BdwmpeOt.mjs");
var Route$16 = createFileRoute("/_auth/map")({
	head: () => ({ meta: [{ title: "Civic Map — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./profile-S_YjFkcq.mjs");
var Route$15 = createFileRoute("/_auth/profile")({
	head: () => ({ meta: [{ title: "Profile — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./settings-Chi_Cqyn.mjs");
var Route$14 = createFileRoute("/_auth/settings")({
	head: () => ({ meta: [{ title: "Settings — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./areas-vj0kzppT.mjs");
var Route$13 = createFileRoute("/_auth/areas/")({
	head: () => ({ meta: [{ title: "Areas — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./civic-issues-CSVll2Nw.mjs");
var Route$12 = createFileRoute("/_auth/civic-issues/")({
	head: () => ({ meta: [{ title: "Civic Issues — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("../_id-BzxShmbS.mjs");
var Route$11 = createFileRoute("/_auth/civic-issues/$id")({
	head: ({ params }) => ({ meta: [{ title: `Civic Issue — ${params.id}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./complaints-Blt1PA13.mjs");
var Route$10 = createFileRoute("/_auth/complaints/")({
	validateSearch: (search) => ({ area: typeof search["area"] === "string" ? search["area"] : "" }),
	head: () => ({ meta: [{ title: "Complaints — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_id-BgYQofsp.mjs");
var Route$9 = createFileRoute("/_auth/complaints/$id")({
	head: ({ params }) => ({ meta: [{ title: `${params.id} — Municipal Intelligence` }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./departments-BkvEg_SQ.mjs");
var Route$8 = createFileRoute("/_auth/departments/")({
	head: () => ({ meta: [{ title: "Departments — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_id-B3fDap0f.mjs");
var Route$7 = createFileRoute("/_auth/departments/$id")({
	head: ({ params }) => ({ meta: [{ title: `Department — ${params.id}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./issues-DgoEgUsf.mjs");
var Route$6 = createFileRoute("/_auth/issues/")({
	head: () => ({ meta: [{ title: "Emerging Issues — Municipal Intelligence" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_id-CmKoRKcr.mjs");
var Route$5 = createFileRoute("/_auth/issues/$id")({
	head: ({ params }) => ({ meta: [{ title: `Issue Intelligence — ${params.id}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./tenders-udxis1p-.mjs");
var Route$4 = createFileRoute("/_auth/tenders/")({
	head: () => ({ meta: [{ title: "Tenders — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_id-DGZxcMH6.mjs");
var Route$3 = createFileRoute("/_auth/tenders/$id")({
	head: ({ params }) => ({ meta: [{ title: `${params.id} — Tender Details` }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./new-CltplQxJ.mjs");
var Route$2 = createFileRoute("/_auth/tenders/new")({
	head: () => ({ meta: [{ title: "Publish Tender — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./work-orders-DiaUMVCX.mjs");
var Route$1 = createFileRoute("/_auth/work-orders/")({
	head: () => ({ meta: [{ title: "Work Orders — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-CGFWiTEd.mjs");
var Route = createFileRoute("/_auth/work-orders/$id")({
	head: ({ params }) => ({ meta: [{ title: `Work Order ${params.id} — JANMIND` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$23.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$24
});
var AuthRouteRoute = Route$22.update({
	id: "/_auth",
	getParentRoute: () => Route$24
});
var LoginRoute = Route$21.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$24
});
var AuthAiTriageRoute = Route$20.update({
	id: "/ai-triage",
	path: "/ai-triage",
	getParentRoute: () => AuthRouteRoute
});
var AuthAlertsRoute = Route$19.update({
	id: "/alerts",
	path: "/alerts",
	getParentRoute: () => AuthRouteRoute
});
var AuthAnalyticsRoute = Route$18.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthRouteRoute
});
var AuthDashboardRoute = Route$17.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthRouteRoute
});
var AuthMapRoute = Route$16.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => AuthRouteRoute
});
var AuthProfileRoute = Route$15.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthRouteRoute
});
var AuthSettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthRouteRoute
});
var AuthAreasIndexRoute = Route$13.update({
	id: "/areas/",
	path: "/areas/",
	getParentRoute: () => AuthRouteRoute
});
var AuthCivicIssuesIndexRoute = Route$12.update({
	id: "/civic-issues/",
	path: "/civic-issues/",
	getParentRoute: () => AuthRouteRoute
});
var AuthCivicIssuesIdRoute = Route$11.update({
	id: "/civic-issues/$id",
	path: "/civic-issues/$id",
	getParentRoute: () => AuthRouteRoute
});
var AuthComplaintsIndexRoute = Route$10.update({
	id: "/complaints/",
	path: "/complaints/",
	getParentRoute: () => AuthRouteRoute
});
var AuthComplaintsIdRoute = Route$9.update({
	id: "/complaints/$id",
	path: "/complaints/$id",
	getParentRoute: () => AuthRouteRoute
});
var AuthDepartmentsIndexRoute = Route$8.update({
	id: "/departments/",
	path: "/departments/",
	getParentRoute: () => AuthRouteRoute
});
var AuthDepartmentsIdRoute = Route$7.update({
	id: "/departments/$id",
	path: "/departments/$id",
	getParentRoute: () => AuthRouteRoute
});
var AuthIssuesIndexRoute = Route$6.update({
	id: "/issues/",
	path: "/issues/",
	getParentRoute: () => AuthRouteRoute
});
var AuthIssuesIdRoute = Route$5.update({
	id: "/issues/$id",
	path: "/issues/$id",
	getParentRoute: () => AuthRouteRoute
});
var AuthTendersIndexRoute = Route$4.update({
	id: "/tenders/",
	path: "/tenders/",
	getParentRoute: () => AuthRouteRoute
});
var AuthTendersIdRoute = Route$3.update({
	id: "/tenders/$id",
	path: "/tenders/$id",
	getParentRoute: () => AuthRouteRoute
});
var AuthTendersNewRoute = Route$2.update({
	id: "/tenders/new",
	path: "/tenders/new",
	getParentRoute: () => AuthRouteRoute
});
var AuthWorkOrdersIndexRoute = Route$1.update({
	id: "/work-orders/",
	path: "/work-orders/",
	getParentRoute: () => AuthRouteRoute
});
var AuthRouteRouteChildren = {
	AuthAiTriageRoute,
	AuthAlertsRoute,
	AuthAnalyticsRoute,
	AuthDashboardRoute,
	AuthMapRoute,
	AuthProfileRoute,
	AuthSettingsRoute,
	AuthCivicIssuesIdRoute,
	AuthComplaintsIdRoute,
	AuthDepartmentsIdRoute,
	AuthIssuesIdRoute,
	AuthTendersIdRoute,
	AuthTendersNewRoute,
	AuthWorkOrdersIdRoute: Route.update({
		id: "/work-orders/$id",
		path: "/work-orders/$id",
		getParentRoute: () => AuthRouteRoute
	}),
	AuthAreasIndexRoute,
	AuthCivicIssuesIndexRoute,
	AuthComplaintsIndexRoute,
	AuthDepartmentsIndexRoute,
	AuthIssuesIndexRoute,
	AuthTendersIndexRoute,
	AuthWorkOrdersIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthRouteRoute: AuthRouteRoute._addFileChildren(AuthRouteRouteChildren),
	LoginRoute
};
var routeTree = Route$24._addFileChildren(rootRouteChildren)._addFileTypes();
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
export { officerSearch as $, getDepartments as A, getSavedViews as B, getAlerts as C, getCivicIssues as D, getBill as E, getMuniComplaint as F, getWorkOrderEvents as G, getSystemicIssues as H, getMuniComplaints as I, listBids as J, getWorkOrders as K, getMuniOfficer as L, getHotspotRankings as M, getLiveActivity as N, getDashboardKPIs as O, getMeasurement as P, muniLogout as Q, getMuniSettings as R, getAdminUser as S, getAreaOverviews as T, getTender as U, getSystemicIssue as V, getWorkOrder as W, markNotificationRead as X, listTenders as Y, muniLogin as Z, assignIssueDepartment as _, Route$7 as a, submitMeasurement as at, client as b, Route$11 as c, __exportAll as d, recordInspection as et, acknowledgeAlert as f, approveBill as g, api_exports as h, Route$5 as i, stopLiveSimulation as it, getEvidence as j, getDepartment as k, useMuniAuth as l, adminLogout as m, Route as n, startInvestigation as nt, Route$9 as o, updateSystemicIssue as ot, adminLogin as p, inspectWorkOrder as q, Route$3 as r, startLiveSimulation as rt, Route$10 as s, updateWorkOrderStatus as st, router_exports as t, saveMuniSettings as tt, useTheme as u, awardBid as v, getAnalyticsData as w, createTender as x, bulkUpdateComplaints as y, getOfficerNotifications as z };
