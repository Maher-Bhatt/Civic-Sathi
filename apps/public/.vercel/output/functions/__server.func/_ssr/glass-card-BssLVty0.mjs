import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Menu, G as Bell, L as CirclePlus, N as Globe, P as FileText, _ as Moon, j as House, l as Sun, n as User, t as X, v as Monitor, w as Map } from "../_libs/lucide-react.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { a as useTheme, r as cn } from "./router-BpQlMeTC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-card-BssLVty0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
				errorDetail = errorData.detail || errorData.message || errorDetail;
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
var Endpoints = class {
	client;
	constructor(client) {
		this.client = client;
	}
	auth = {
		loginOfficer: (data) => this.client.post("/api/v1/auth/officer-login", data),
		loginCitizen: (data) => this.client.post("/api/v1/auth/login", data),
		registerCitizen: (data) => this.client.post("/api/v1/auth/register", data)
	};
	complaints = {
		list: (params) => {
			const query = new URLSearchParams(params).toString();
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
		listBids: (tenderId) => this.client.get(`/api/v1/procurement/tenders/${tenderId}/bids`)
	};
};
/**
* Centralised prototype data. Everything here is mock content used until the
* JANMIND backend is connected. Do not scatter mock data across components.
*/
var WARD_14 = {
	lat: 22.3072,
	lng: 73.1812,
	ward: "Ward 14",
	area: "Sarvodaya Nagar, Ward 14",
	city: "Vadodara"
};
var DEMO_USER = {
	id: "usr_demo",
	name: "Aarav Mehta",
	email: "aarav.mehta@example.com",
	phone: "+91 98250 41277",
	ward: "Ward 14",
	notifyStatus: true,
	notifyNearby: true
};
var RELATED_SAMPLES = [
	"No water supply since Monday.",
	"Water has stopped in our neighborhood.",
	"Our taps have been dry for three days.",
	"No municipal water reaching our apartment."
];
var CATEGORY_KEYWORDS = [
	{
		category: "Water Supply",
		words: [
			"water",
			"tap",
			"supply",
			"pipeline",
			"borewell",
			"dry"
		]
	},
	{
		category: "Road Damage",
		words: [
			"road",
			"pothole",
			"asphalt",
			"street surface",
			"crack"
		]
	},
	{
		category: "Garbage Collection",
		words: [
			"garbage",
			"trash",
			"waste",
			"bin",
			"dump",
			"litter"
		]
	},
	{
		category: "Drainage",
		words: [
			"drain",
			"waterlogging",
			"flood",
			"clogged",
			"overflow"
		]
	},
	{
		category: "Sewage",
		words: [
			"sewage",
			"sewer",
			"manhole",
			"septic",
			"smell"
		]
	},
	{
		category: "Street Lighting",
		words: [
			"light",
			"lamp",
			"streetlight",
			"dark",
			"pole"
		]
	},
	{
		category: "Electricity",
		words: [
			"electricity",
			"power",
			"outage",
			"transformer",
			"voltage"
		]
	},
	{
		category: "Public Transport",
		words: [
			"bus",
			"transport",
			"stop",
			"metro",
			"auto"
		]
	},
	{
		category: "Sanitation",
		words: [
			"toilet",
			"sanitation",
			"cleaning",
			"hygiene",
			"public wash"
		]
	}
];
var SEVERITY_KEYWORDS = [
	{
		severity: "Critical",
		words: [
			"danger",
			"accident",
			"collapse",
			"emergency",
			"injury"
		]
	},
	{
		severity: "High",
		words: [
			"three days",
			"days",
			"week",
			"no water",
			"no power",
			"children"
		]
	},
	{
		severity: "Moderate",
		words: [
			"often",
			"sometimes",
			"slow",
			"delay"
		]
	}
];
function timeline(stage) {
	const steps = [
		["Submitted", "Your report was received by JANMIND."],
		["JANMIND analyzed", "Category, severity and location pattern detected."],
		["Municipality received", "Forwarded to the responsible civic department."],
		["Officer assigned", "A field officer has been allocated."],
		["In progress", "Work has started on the ground."],
		["Resolved", "The civic department marked this issue resolved."]
	];
	const base = Date.now() - 936e5;
	return steps.map(([label, description], i) => ({
		label,
		description,
		done: i <= stage,
		at: i <= stage ? new Date(base + i * 1e3 * 60 * 90).toISOString() : null
	}));
}
(/* @__PURE__ */ new Date(Date.now() - 936e5)).toISOString(), timeline(3), { ...WARD_14 }, (/* @__PURE__ */ new Date(Date.now() - 5184e5)).toISOString(), timeline(4), { ...WARD_14 }, (/* @__PURE__ */ new Date(Date.now() - 16416e5)).toISOString(), timeline(5);
var SEED_NOTIFICATIONS = [
	{
		id: "ntf_1",
		title: "Officer assigned",
		body: "A field officer from the Water Works department was assigned to JN-2026-00127.",
		complaintId: "JN-2026-00127",
		at: (/* @__PURE__ */ new Date(Date.now() - 54e5)).toISOString(),
		kind: "assigned",
		read: false
	},
	{
		id: "ntf_2",
		title: "Pattern detected near you",
		body: "23 similar Water Supply reports were detected within approximately 500m of your report.",
		complaintId: "JN-2026-00127",
		at: (/* @__PURE__ */ new Date(Date.now() - 18e6)).toISOString(),
		kind: "status",
		read: false
	},
	{
		id: "ntf_3",
		title: "Status changed to In Progress",
		body: "Road resurfacing work has started for JN-2026-00094.",
		complaintId: "JN-2026-00094",
		at: (/* @__PURE__ */ new Date(Date.now() - 108e6)).toISOString(),
		kind: "status",
		read: true
	},
	{
		id: "ntf_4",
		title: "Complaint resolved",
		body: "JN-2026-00061 was marked resolved by the sanitation department.",
		complaintId: "JN-2026-00061",
		at: (/* @__PURE__ */ new Date(Date.now() - 2592e5)).toISOString(),
		kind: "resolution",
		read: true
	}
];
/** Aggregated, de-identified nearby activity used by the schematic map. */
function seededReports() {
	const out = [];
	const hotspot = {
		x: .63,
		y: .42
	};
	for (let i = 0; i < 14; i++) {
		const a = i / 14 * Math.PI * 2;
		const r = .03 + i * 37 % 11 / 220;
		out.push({
			id: `h${i}`,
			category: "Water Supply",
			severity: i % 4 === 0 ? "Critical" : "High",
			x: hotspot.x + Math.cos(a) * r * 1.5,
			y: hotspot.y + Math.sin(a) * r,
			ageHours: 2 + i * 3
		});
	}
	[
		[
			.16,
			.22,
			"Road Damage",
			"Moderate"
		],
		[
			.27,
			.68,
			"Garbage Collection",
			"Low"
		],
		[
			.38,
			.34,
			"Street Lighting",
			"Low"
		],
		[
			.82,
			.74,
			"Drainage",
			"Moderate"
		],
		[
			.72,
			.16,
			"Sanitation",
			"Low"
		],
		[
			.46,
			.82,
			"Electricity",
			"Moderate"
		],
		[
			.9,
			.36,
			"Public Transport",
			"Low"
		],
		[
			.1,
			.52,
			"Sewage",
			"Moderate"
		]
	].forEach(([x, y, category, severity], i) => out.push({
		id: `s${i}`,
		x,
		y,
		category,
		severity,
		ageHours: 12 + i * 9
	}));
	return out;
}
seededReports();
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
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_API_BASE_URL"] ?? "http://localhost:3001";
var LS = {
	user: "janmind.user",
	notifications: "janmind.notifications",
	token: "janmind.token"
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
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function detectCategory(text) {
	const t = text.toLowerCase();
	let best = {
		category: "Water Supply",
		score: 0
	};
	for (const entry of CATEGORY_KEYWORDS) {
		const score = entry.words.reduce((acc, w) => acc + (t.includes(w) ? 1 : 0), 0);
		if (score > best.score) best = {
			category: entry.category,
			score
		};
	}
	return best.category;
}
function detectSeverity(text) {
	const t = text.toLowerCase();
	for (const entry of SEVERITY_KEYWORDS) if (entry.words.some((w) => t.includes(w))) return entry.severity;
	return "Moderate";
}
async function registerUser(input) {
	const res = await api.auth.registerCitizen(input);
	if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
	write(LS.user, res.user);
	return res.user;
}
async function loginUser(input) {
	const res = await api.auth.loginCitizen(input);
	if (typeof window !== "undefined") window.localStorage.setItem(LS.token, res.access_token);
	write(LS.user, res.user);
	return res.user;
}
async function getCurrentUser() {
	if (typeof window === "undefined") return null;
	if (!window.localStorage.getItem(LS.token)) return null;
	return read(LS.user, null);
}
async function logoutUser() {
	if (typeof window !== "undefined") {
		window.localStorage.removeItem(LS.token);
		window.localStorage.removeItem(LS.user);
	}
}
async function updateProfile(patch) {
	const next = {
		...await getCurrentUser() ?? DEMO_USER,
		...patch
	};
	write(LS.user, next);
	return next;
}
async function changePassword() {}
async function createComplaint(input) {
	return await api.complaints.create(input);
}
async function getMyComplaints() {
	const res = await api.complaints.list({ limit: 100 });
	return res.data || res;
}
async function getComplaint(id) {
	return await api.complaints.get(id);
}
async function analyzeComplaint(input) {
	const category = input.imageCategory ?? detectCategory(input.description);
	const severity = detectSeverity(input.description);
	const location = input.location ?? WARD_14;
	const isDemo = category === "Water Supply";
	return {
		category,
		severity,
		confidence: "High",
		location,
		relatedCount: isDemo ? 127 : 34,
		nearbyCount: isDemo ? 23 : 7,
		radiusMeters: 500,
		hotspot: isDemo,
		relatedSamples: isDemo ? RELATED_SAMPLES : RELATED_SAMPLES.slice(0, 2),
		summary: isDemo ? "JANMIND found other reports that may describe a similar civic issue nearby." : "JANMIND found a small number of comparable reports in this area."
	};
}
async function uploadComplaintPhoto(file) {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("We couldn't read that image."));
		reader.readAsDataURL(file);
	});
}
async function analyzeComplaintPhoto(fileName) {
	const n = fileName.toLowerCase();
	if (n.includes("garbage") || n.includes("waste")) return {
		detected: "Garbage accumulation",
		category: "Garbage Collection",
		confidence: "High"
	};
	if (n.includes("water") || n.includes("tap")) return {
		detected: "Dry public water point",
		category: "Water Supply",
		confidence: "Medium"
	};
	return {
		detected: "Possible road surface damage",
		category: "Road Damage",
		confidence: "High"
	};
}
async function getNotifications() {
	return read(LS.notifications, SEED_NOTIFICATIONS);
}
async function markNotificationsRead() {
	const list = read(LS.notifications, SEED_NOTIFICATIONS).map((n) => ({
		...n,
		read: true
	}));
	write(LS.notifications, list);
	return list;
}
async function detectDuplicateIssues(input) {
	return null;
}
async function createCivicIssue(input) {
	return null;
}
async function linkToCivicIssue(issueId, complaintId, relationshipType, matchConfidence, linkedBy) {
	return null;
}
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCurrentUser().then(setUser).finally(() => setReady(true));
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const u = await loginUser({
			email,
			password
		});
		setUser(u);
		return u;
	}, []);
	const signUp = (0, import_react.useCallback)(async (input) => {
		const u = await registerUser(input);
		setUser(u);
		return u;
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await logoutUser();
		setUser(null);
	}, []);
	const save = (0, import_react.useCallback)(async (patch) => {
		const u = await updateProfile(patch);
		setUser(u);
		return u;
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		user,
		ready,
		signIn,
		signUp,
		signOut,
		save
	}), [
		user,
		ready,
		signIn,
		signUp,
		signOut,
		save
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
var LANGUAGES = {
	en: "English",
	hi: "हिन्दी",
	gu: "ગુજરાતી",
	kn: "ಕನ್ನಡ"
};
var TRANSLATIONS = {
	en: {
		"nav.home": "Home",
		"nav.howitworks": "How It Works",
		"nav.map": "Civic Map",
		"nav.report": "Report Problem",
		"nav.complaints": "My Complaints",
		"nav.notifications": "Notifications",
		"nav.profile": "Profile",
		"nav.signin": "Sign In",
		"nav.signout": "Sign Out",
		"home.hero.title": "JANMIND",
		"home.hero.subtitle": "Make your city better, one report at a time.",
		"home.hero.desc": "Report civic problems with location and evidence. JANMIND helps connect individual complaints into larger patterns so public-service issues can be identified faster.",
		"report.step.problem": "Problem",
		"report.step.location": "Location",
		"report.step.evidence": "Evidence",
		"report.step.review": "Review",
		"report.btn.continue": "Continue",
		"report.btn.back": "Back",
		"report.btn.submit": "Submit report",
		"profile.title": "Profile settings",
		"profile.language": "Preferred language",
		"profile.theme": "Theme preference",
		"btn.save": "Save changes"
	},
	hi: {
		"nav.home": "होम",
		"nav.howitworks": "कैसे काम करता है",
		"nav.map": "नागरिक मानचित्र",
		"nav.report": "समस्या दर्ज करें",
		"nav.complaints": "मेरी शिकायतें",
		"nav.notifications": "सूचनाएं",
		"nav.profile": "प्रोफ़ाइल",
		"nav.signin": "साइन इन करें",
		"nav.signout": "साइन आउट",
		"home.hero.title": "जनमाइंड",
		"home.hero.subtitle": "अपने शहर को बेहतर बनाएं, एक बार में एक रिपोर्ट।",
		"home.hero.desc": "स्थान और साक्ष्य के साथ नागरिक समस्याओं की रिपोर्ट करें। JANMIND व्यक्तिगत शिकायतों को बड़े पैटर्न से जोड़ने में मदद करता है।",
		"report.step.problem": "समस्या",
		"report.step.location": "स्थान",
		"report.step.evidence": "प्रमाण",
		"report.step.review": "समीक्षा",
		"report.btn.continue": "आगे बढ़ें",
		"report.btn.back": "पीछे",
		"report.btn.submit": "रिपोर्ट जमा करें",
		"profile.title": "प्रोफ़ाइल सेटिंग्स",
		"profile.language": "पसंदीदा भाषा",
		"profile.theme": "थीम वरीयता",
		"btn.save": "बदलाव सहेजें"
	},
	gu: {
		"nav.home": "મુખ્ય પૃષ્ઠ",
		"nav.howitworks": "કેવી રીતે કામ કરે છે",
		"nav.map": "નાગરિક નકશો",
		"nav.report": "સમસ્યા નોંધાવો",
		"nav.complaints": "મારી ફરિયાદો",
		"nav.notifications": "સૂચનાઓ",
		"nav.profile": "પ્રોફાઇલ",
		"nav.signin": "સાઇન ઇન",
		"nav.signout": "સાઇન આઉટ",
		"home.hero.title": "જનમાઇન્ડ",
		"home.hero.subtitle": "તમારા શહેરને બહેતર બનાવો, એક સમયે એક રિપોર્ટ.",
		"home.hero.desc": "સ્થાન અને પુરાવા સાથે નાગરિક સમસ્યાઓની જાણ કરો. JANMIND વ્યક્તિગત ફરિયાદોને મોટી પેટર્ન સાથે જોડવામાં મદદ કરે છે.",
		"report.step.problem": "સમસ્યા",
		"report.step.location": "સ્થાન",
		"report.step.evidence": "પુરાવા",
		"report.step.review": "સમીક્ષા",
		"report.btn.continue": "આગળ વધો",
		"report.btn.back": "પાછા જાઓ",
		"report.btn.submit": "રિપોર્ટ સબમિટ કરો",
		"profile.title": "પ્રોફાઇલ સેટિંગ્સ",
		"profile.language": "પસંદીદા ભાષા",
		"profile.theme": "થીમ પસંદગી",
		"btn.save": "ફેરફારો સાચવો"
	},
	kn: {
		"nav.home": "ಮುಖಪುಟ",
		"nav.howitworks": "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
		"nav.map": "ನಾಗರಿಕ ನಕ್ಷೆ",
		"nav.report": "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
		"nav.complaints": "ನನ್ನ ದೂರುಗಳು",
		"nav.notifications": "ಅಧಿಸೂಚನೆಗಳು",
		"nav.profile": "ಪ್ರೊಫೈಲ್",
		"nav.signin": "ಸೈನ್ ಇನ್",
		"nav.signout": "ಸೈನ್ ಔಟ್",
		"home.hero.title": "ಜನ್‌ಮೈಂಡ್",
		"home.hero.subtitle": "ನಿಮ್ಮ ನಗರವನ್ನು ಉತ್ತಮಗೊಳಿಸಿ, ಒಂದು ಸಮಯದಲ್ಲಿ ಒಂದು ವರದಿ.",
		"home.hero.desc": "ಸ್ಥಳ ಮತ್ತು ಪುರಾವೆಯೊಂದಿಗೆ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. JANMIND ವೈಯಕ್ತಿಕ ದೂರುಗಳನ್ನು ದೊಡ್ಡ ಮಾದರಿಗಳಿಗೆ ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
		"report.step.problem": "ಸಮಸ್ಯೆ",
		"report.step.location": "ಸ್ಥಳ",
		"report.step.evidence": "ಪುರಾವೆ",
		"report.step.review": "ವಿಮರ್ಶೆ",
		"report.btn.continue": "ಮುಂದುವರಿಸಿ",
		"report.btn.back": "ಹಿಂದೆ",
		"report.btn.submit": "ವರದಿ ಸಲ್ಲಿಸಿ",
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
var options = [
	{
		mode: "light",
		icon: Sun,
		label: "Light theme"
	},
	{
		mode: "dark",
		icon: Moon,
		label: "Dark theme"
	},
	{
		mode: "system",
		icon: Monitor,
		label: "System theme"
	}
];
function ThemeToggle({ className }) {
	const { mode, setMode } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "radiogroup",
		"aria-label": "Theme",
		className: cn("inline-flex items-center gap-0.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-0.5 backdrop-blur-md", className),
		children: options.map(({ mode: m, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "radio",
			"aria-checked": mode === m,
			"aria-label": label,
			onClick: () => setMode(m),
			className: cn("press flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground", mode === m ? "bg-[var(--glass-strong)] text-foreground shadow-[var(--shadow-soft)]" : "hover:text-foreground"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "h-3.5 w-3.5",
				"aria-hidden": true
			})
		}, m))
	});
}
var glassButton = cva("press inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-[0.06em] uppercase select-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]",
			glass: "glass text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass-strong)] hover:shadow-[var(--shadow-lift)]",
			outline: "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass)]",
			ghost: "text-muted-foreground hover:text-foreground hover:bg-[var(--glass)]",
			danger: "bg-critical text-primary-foreground hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]"
		},
		size: {
			sm: "h-9 px-3.5 text-[0.7rem]",
			md: "h-11 px-5 text-xs",
			lg: "h-13 px-7 text-[0.8rem]",
			icon: "h-10 w-10 p-0"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function GlassButton({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(glassButton({
			variant,
			size
		}), className),
		...props
	});
}
function LanguageToggle({ className }) {
	const { language, setLanguage } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative inline-flex items-center", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
			className: "pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: language,
			onChange: (e) => setLanguage(e.target.value),
			className: "glass press h-9 cursor-pointer appearance-none rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pl-8 pr-4 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground outline-none hover:text-foreground",
			"aria-label": "Select language",
			children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: code,
				className: "bg-[var(--surface-elevated)] text-foreground",
				children: [
					code.toUpperCase(),
					" - ",
					name
				]
			}, code))
		})]
	});
}
var navLinks = [
	{
		to: "/",
		tKey: "nav.home",
		defaultLabel: "Home"
	},
	{
		to: "/map",
		tKey: "nav.map",
		defaultLabel: "Civic Map"
	},
	{
		to: "/",
		tKey: "nav.howitworks",
		defaultLabel: "How It Works",
		hash: true
	},
	{
		to: "/report",
		tKey: "nav.report",
		defaultLabel: "Report Problem"
	},
	{
		to: "/complaints",
		tKey: "nav.complaints",
		defaultLabel: "My Complaints"
	}
];
var mobileTabs = [
	{
		to: "/",
		tKey: "nav.home",
		defaultLabel: "Home",
		icon: House
	},
	{
		to: "/map",
		tKey: "nav.map",
		defaultLabel: "Map",
		icon: Map
	},
	{
		to: "/report",
		tKey: "nav.report",
		defaultLabel: "Report",
		icon: CirclePlus
	},
	{
		to: "/complaints",
		tKey: "nav.complaints",
		defaultLabel: "Reports",
		icon: FileText
	},
	{
		to: "/profile",
		tKey: "nav.profile",
		defaultLabel: "Profile",
		icon: User
	}
];
function SiteNav() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user } = useAuth();
	const { t } = useI18n();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => setOpen(false), [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Primary",
			className: cn("mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-[var(--glass-border)] px-3 py-2.5 transition-all duration-300 ease-out sm:px-4", scrolled ? "bg-[var(--glass-strong)] shadow-[var(--shadow-lift)] backdrop-blur-2xl" : "bg-[var(--glass)] shadow-[var(--shadow-soft)] backdrop-blur-xl"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "group flex items-center gap-2.5 pr-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_oklab,var(--primary)_45%,transparent)] bg-[color-mix(in_oklab,var(--primary)_16%,transparent)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-lg border border-[color-mix(in_oklab,var(--primary)_25%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[0.95rem] font-semibold tracking-[0.18em]",
						children: "JANMIND"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "ml-2 hidden items-center gap-1 lg:flex",
					children: navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "hash" in l && l.hash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/#how-it-works",
						className: "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-[var(--glass)] hover:text-foreground",
						children: t(l.tKey, l.defaultLabel)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: cn("rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-[var(--glass)] hover:text-foreground", pathname === l.to ? "text-foreground" : "text-muted-foreground"),
						children: t(l.tKey, l.defaultLabel)
					}) }, l.tKey))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, { className: "hidden sm:inline-flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { className: "hidden sm:inline-flex" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/notifications",
							"aria-label": "Notifications",
							className: "press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
								className: "h-4 w-4",
								"aria-hidden": true
							})
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							className: "press hidden h-9 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pr-3 pl-1.5 text-sm text-foreground hover:bg-[var(--glass-strong)] sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] text-[0.65rem] font-semibold text-primary",
								children: user.name.slice(0, 1).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-24 truncate",
								children: user.name.split(" ")[0]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							asChild: true,
							size: "sm",
							variant: "glass",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { redirect: void 0 },
								children: t("nav.signin", "Sign In")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": open ? "Close menu" : "Open menu",
							"aria-expanded": open,
							onClick: () => setOpen((v) => !v),
							className: "press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-foreground lg:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-rise mx-auto mt-2 max-w-6xl rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-2 shadow-[var(--shadow-lift)] backdrop-blur-2xl lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-0.5",
				children: [navLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "hash" in l && l.hash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/#how-it-works",
					className: "block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground",
					children: t(l.tKey, l.defaultLabel)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					className: "block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground",
					children: t(l.tKey, l.defaultLabel)
				}) }, l.tKey)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: user ? "/profile" : "/login",
					className: "block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground",
					children: user ? t("nav.profile", "Profile") : t("nav.signin", "Sign In")
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-center gap-2 px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
			})]
		})]
	});
}
function MobileTabBar() {
	const { t } = useI18n();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Mobile",
		className: "fixed inset-x-0 bottom-0 z-50 border-t border-[var(--glass-border)] bg-[var(--glass-strong)] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl sm:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex items-stretch",
			children: mobileTabs.map(({ to, tKey, defaultLabel, icon: Icon }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: cn("flex flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-[0.08em] uppercase transition-colors duration-200", pathname === to ? "text-primary" : "text-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-[18px] w-[18px]",
							"aria-hidden": true
						}), t(tKey, defaultLabel)]
					})
				}, to);
			})
		})
	});
}
function PageShell({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ambient-field min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("mx-auto w-full max-w-6xl px-4 pt-28 pb-28 sm:px-6 sm:pb-20", className),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
function GlassCard({ className, elevation = "flat", interactive = false, as: Tag = "div", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className: cn("rounded-2xl", elevation === "solid" ? "solid-surface" : elevation === "raised" ? "glass-strong" : "glass", interactive && "lift cursor-pointer", className),
		...props
	});
}
function SectionLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("label-xs block", className),
		...props
	});
}
//#endregion
export { linkToCivicIssue as _, PageShell as a, useAuth as b, analyzeComplaint as c, createCivicIssue as d, createComplaint as f, getNotifications as g, getMyComplaints as h, I18nProvider as i, analyzeComplaintPhoto as l, getComplaint as m, GlassButton as n, SectionLabel as o, detectDuplicateIssues as p, GlassCard as r, WARD_14 as s, AuthProvider as t, changePassword as u, markNotificationsRead as v, useI18n as x, uploadComplaintPhoto as y };
