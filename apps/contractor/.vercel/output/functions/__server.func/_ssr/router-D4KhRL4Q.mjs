import { i as __toESM } from "../_runtime.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { A as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-P1I30qty.js
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
	contractor: "janmind_contractor_user",
	token: "janmind_contractor_token"
};
var api = new Endpoints(new APIClient({
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
}));
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
async function contractorLogin(input) {
	try {
		const res = await api.auth.loginCitizen({
			email: input.email,
			password: input.password
		});
		const userData = res.user || res.citizen || res.citizen;
		if (!userData) throw new Error("Login failed: no user data returned");
		if (userData.role !== "contractor") throw new Error("Access denied: this account is not registered as a contractor");
		if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
		write(LS.contractor, userData);
		return userData;
	} catch (error) {
		throw error;
	}
}
async function contractorLogout() {
	if (typeof window !== "undefined") {
		window.localStorage.removeItem(LS.token);
		window.localStorage.removeItem(LS.contractor);
	}
}
async function adminLogin(email, pass) {
	return {};
}
async function adminLogout() {}
async function getAdminUser() {
	return null;
}
async function getContractorUser() {
	if (typeof window === "undefined") return null;
	if (!window.localStorage.getItem(LS.token)) return null;
	const cached = read(LS.contractor, null);
	const refreshFromServer = async () => {
		try {
			const me = await api.auth.me();
			if (me && me.role === "contractor") {
				write(LS.contractor, me);
				return me;
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
var muniLogin = contractorLogin;
var muniLogout = contractorLogout;
var getMuniOfficer = getContractorUser;
var cityUuidCache = /* @__PURE__ */ new Map();
async function resolveCityUuid(cityNameOrSlug) {
	const key = cityNameOrSlug.toLowerCase();
	if (cityUuidCache.has(key)) return cityUuidCache.get(key);
	try {
		const cities = await api.cities.list();
		for (const c of cities) cityUuidCache.set(c.name.toLowerCase(), c.id);
		return cityUuidCache.get(key) ?? null;
	} catch {
		return null;
	}
}
async function getEligibleTenders(cityIdOrName) {
	const uuid = cityIdOrName.includes("-") && cityIdOrName.length === 36 ? cityIdOrName : await resolveCityUuid(cityIdOrName) ?? cityIdOrName;
	return await api.tenders.list(uuid);
}
async function getTenderDetails(id) {
	return await api.tenders.get(id);
}
async function submitBid(tenderId, quotedAmount, technicalProposal) {
	return await api.tenders.submitBid(tenderId, {
		quoted_amount: quotedAmount,
		technical_proposal: technicalProposal
	});
}
async function getWorkOrders(cityIdOrName) {
	const user = await getContractorUser();
	const raw = cityIdOrName || user?.city || "vadodara";
	const uuid = raw.includes("-") && raw.length === 36 ? raw : await resolveCityUuid(raw) ?? raw;
	return await api.workOrders.list(uuid);
}
async function getWorkOrder(id) {
	return await api.workOrders.get(id);
}
async function submitFieldEvidence(workOrderId, photoUrl, description) {
	return await api.workOrders.submitEvidence(workOrderId, {
		photo_url: photoUrl,
		description
	});
}
async function updateWorkOrderStatus(id, status) {
	return await api.workOrders.updateStatus(id, status);
}
async function getMuniSettings() {
	return { theme: "system" };
}
async function saveMuniSettings() {
	return null;
}
async function getContractor(id) {
	return null;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D4KhRL4Q.js
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
var styles_default = "/assets/styles-DvCf1gak.css";
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
function ContractorAuthProvider({ children }) {
	const [contractor, setContractor] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getContractorUser().then(setContractor).finally(() => setReady(true));
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const user = await contractorLogin({
			email,
			password,
			city: "vadodara"
		});
		setContractor(user);
		return user;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await contractorLogout();
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
function useContractorAuth() {
	const ctx = (0, import_react.useContext)(CTX$1);
	if (!ctx) throw new Error("useContractorAuth must be inside ContractorAuthProvider");
	return ctx;
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
	throw redirect({ to: "/contractor/dashboard" });
} });
var $$splitComponentImporter$8 = () => import("./route-B3i-w3y8.mjs");
var Route$8 = createFileRoute("/contractor")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./login-6An0MTgU.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Contractor Login - JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-Ci18RCYA.mjs");
var Route$6 = createFileRoute("/contractor/dashboard")({
	head: () => ({ meta: [{ title: "Contractor Operations Center" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./performance-CnnaEUwZ.mjs");
var Route$5 = createFileRoute("/contractor/performance")({
	head: () => ({ meta: [{ title: "Performance - Contractor Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./profile-CT6ai8HJ.mjs");
var Route$4 = createFileRoute("/contractor/profile")({
	head: () => ({ meta: [{ title: "Profile - Contractor Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./tenders-CkJ7Gk8z.mjs");
var Route$3 = createFileRoute("/contractor/tenders/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_id-B002Qsut.mjs");
var Route$2 = createFileRoute("/contractor/tenders/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./work-orders-kIu8KVV1.mjs");
var Route$1 = createFileRoute("/contractor/work-orders/")({
	head: () => ({ meta: [{ title: "Work Orders - Contractor Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-GTNaL4BH.mjs");
var Route = createFileRoute("/contractor/work-orders/$id")({
	head: ({ params }) => ({ meta: [{ title: `Work Order – JANMIND` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var ContractorRouteRoute = Route$8.update({
	id: "/contractor",
	path: "/contractor",
	getParentRoute: () => Route$10
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$10
});
var ContractorDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorPerformanceRoute = Route$5.update({
	id: "/performance",
	path: "/performance",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorTendersIndexRoute = Route$3.update({
	id: "/tenders/",
	path: "/tenders/",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorTendersIdRoute = Route$2.update({
	id: "/tenders/$id",
	path: "/tenders/$id",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorWorkOrdersIndexRoute = Route$1.update({
	id: "/work-orders/",
	path: "/work-orders/",
	getParentRoute: () => ContractorRouteRoute
});
var ContractorRouteRouteChildren = {
	ContractorDashboardRoute,
	ContractorPerformanceRoute,
	ContractorProfileRoute,
	ContractorTendersIdRoute,
	ContractorWorkOrdersIdRoute: Route.update({
		id: "/work-orders/$id",
		path: "/work-orders/$id",
		getParentRoute: () => ContractorRouteRoute
	}),
	ContractorTendersIndexRoute,
	ContractorWorkOrdersIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ContractorRouteRoute: ContractorRouteRoute._addFileChildren(ContractorRouteRouteChildren),
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
export { getContractor as a, getWorkOrder as c, submitFieldEvidence as d, updateWorkOrderStatus as f, useContractorAuth as i, getWorkOrders as l, Route as n, getEligibleTenders as o, Route$2 as r, getTenderDetails as s, router_exports as t, submitBid as u };
