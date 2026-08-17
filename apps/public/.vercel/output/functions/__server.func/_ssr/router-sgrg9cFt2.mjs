import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as QueryClientProvider, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { E as I18nProvider, o as parseRedirect, s as AuthProvider } from "./router-sgrg9cFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-sgrg9cFt.js
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
var styles_default = "/assets/styles-BIMtzRtv.css";
var leaflet_default = "/assets/leaflet-vh-t_kPv.css";
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
	const { t } = useI18n();
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
					children: t("ui.page_not_found")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("ui.the_page_you_re_looking_for_do")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("ui.go_home")
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const { t } = useI18n();
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
					children: t("ui.this_page_didn_t_load")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("ui.something_went_wrong_on_our_en")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: t("ui.try_again")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: t("ui.go_home")
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
			{ title: "JANMIND — Civic Grievance Intelligence" },
			{
				name: "description",
				content: "Report civic problems with location and evidence. JANMIND connects individual complaints into larger patterns."
			},
			{
				name: "author",
				content: "JANMIND"
			},
			{
				property: "og:title",
				content: "JANMIND — Civic Grievance Intelligence"
			},
			{
				property: "og:description",
				content: "Report civic problems with location and evidence. JANMIND connects individual complaints into larger patterns."
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
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { t } = useI18n();
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] }) }) })
	});
}
var $$splitComponentImporter$9 = () => import("./routes-BbV7Zj1a.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "JANMIND — Report civic problems, see the bigger pattern" },
		{
			name: "description",
			content: "JANMIND lets citizens report water, road, garbage, drainage and lighting issues with location and photo evidence, then connects them into civic patterns."
		},
		{
			property: "og:title",
			content: "JANMIND — Government Grievance Intelligence"
		},
		{
			property: "og:description",
			content: "Report civic problems with location and evidence. JANMIND connects individual complaints into larger patterns."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./analyzing-CLwbQMdt.mjs");
var Route$8 = createFileRoute("/analyzing")({
	head: () => ({ meta: [{ title: "Analyzing your report — JANMIND" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./complaints-CgXE0N8-.mjs");
var Route$7 = createFileRoute("/complaints")({
	head: () => ({ meta: [
		{ title: "My complaints — JANMIND" },
		{
			name: "description",
			content: "Track every civic complaint you submitted through JANMIND and its current status."
		},
		{
			property: "og:title",
			content: "My complaints — JANMIND"
		},
		{
			property: "og:description",
			content: "Your civic report history with live status tracking."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./login-DSqCKy8g.mjs");
var Route$6 = createFileRoute("/login")({
	validateSearch: (search) => ({ redirect: parseRedirect(search["redirect"]) }),
	head: () => ({ meta: [
		{ title: "Sign in — JANMIND Citizen Portal" },
		{
			name: "description",
			content: "Sign in to your JANMIND account to report civic problems and track complaints."
		},
		{
			property: "og:title",
			content: "Sign in — JANMIND Citizen Portal"
		},
		{
			property: "og:description",
			content: "Access your civic reports, notifications and complaint history on JANMIND."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./map-_0FztRBf.mjs");
var Route$5 = createFileRoute("/map")({
	head: () => ({ meta: [
		{ title: "Civic Map — locality civic activity | JANMIND" },
		{
			name: "description",
			content: "Explore aggregated civic activity by locality across Vadodara and Bengaluru: area health, complaint activity and emerging hotspots."
		},
		{
			property: "og:title",
			content: "Civic Map — locality civic activity | JANMIND"
		},
		{
			property: "og:description",
			content: "A public, locality-based map of civic issue activity. Aggregate information only — no citizen identities."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./notifications-LAsXl6EH.mjs");
var Route$4 = createFileRoute("/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — JANMIND" },
		{
			name: "description",
			content: "Status changes, officer assignments and resolution updates for your civic reports."
		},
		{
			property: "og:title",
			content: "Notifications — JANMIND"
		},
		{
			property: "og:description",
			content: "Stay updated on every change to your civic complaints."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-Cw_gvm52.mjs");
var Route$3 = createFileRoute("/profile")({
	head: () => ({ meta: [
		{ title: "Profile — JANMIND" },
		{
			name: "description",
			content: "Manage your JANMIND citizen profile, ward preference and notification settings."
		},
		{
			property: "og:title",
			content: "Profile — JANMIND"
		},
		{
			property: "og:description",
			content: "Your contact details and notification preferences on JANMIND."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./register-4Xa33w7P.mjs");
var Route$2 = createFileRoute("/register")({
	validateSearch: (search) => ({ redirect: parseRedirect(search["redirect"]) }),
	head: () => ({ meta: [
		{ title: "Create account — JANMIND Citizen Portal" },
		{
			name: "description",
			content: "Create a JANMIND citizen account to report civic problems and follow their resolution."
		},
		{
			property: "og:title",
			content: "Create account — JANMIND Citizen Portal"
		},
		{
			property: "og:description",
			content: "Join JANMIND to report civic issues and track municipal response."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./report-DMWb4Ses.mjs");
var Route$1 = createFileRoute("/report")({
	head: () => ({ meta: [
		{ title: "Report a civic problem — JANMIND" },
		{
			name: "description",
			content: "Describe the problem in your own words, add your location and a photo. JANMIND suggests the category and severity."
		},
		{
			property: "og:title",
			content: "Report a civic problem — JANMIND"
		},
		{
			property: "og:description",
			content: "Describe a civic issue, pin the location, add evidence and track the response."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./complaint._id-C0FdGXvZ.mjs");
var Route = createFileRoute("/complaint/$id")({
	head: () => ({ meta: [
		{ title: "Complaint details — JANMIND" },
		{
			name: "description",
			content: "Full detail of a civic complaint: category, severity, location, evidence and resolution timeline."
		},
		{
			property: "og:title",
			content: "Complaint details — JANMIND"
		},
		{
			property: "og:description",
			content: "Follow a civic complaint from submission to resolution."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AnalyzingRoute: Route$8.update({
		id: "/analyzing",
		path: "/analyzing",
		getParentRoute: () => Route$10
	}),
	ComplaintsRoute: Route$7.update({
		id: "/complaints",
		path: "/complaints",
		getParentRoute: () => Route$10
	}),
	LoginRoute: Route$6.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$10
	}),
	MapRoute: Route$5.update({
		id: "/map",
		path: "/map",
		getParentRoute: () => Route$10
	}),
	NotificationsRoute: Route$4.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => Route$10
	}),
	ProfileRoute: Route$3.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$10
	}),
	RegisterRoute: Route$2.update({
		id: "/register",
		path: "/register",
		getParentRoute: () => Route$10
	}),
	ReportRoute: Route$1.update({
		id: "/report",
		path: "/report",
		getParentRoute: () => Route$10
	}),
	ComplaintIdRoute: Route.update({
		id: "/complaint/$id",
		path: "/complaint/$id",
		getParentRoute: () => Route$10
	})
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
export { router_exports as a, getRouter as i, Route$2 as n, useTheme as o, Route$6 as r, Route as t };
