import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as LoaderCircle, a as TriangleAlert, k as Inbox } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageShell, b as useAuth, n as GlassButton, r as GlassCard } from "./glass-card-BssLVty0.mjs";
import { r as cn } from "./router-BpQlMeTC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/require-auth-U5VF4pEa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoadingState({ message = "Loading...", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		"aria-live": "polite",
		className: cn("flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "h-5 w-5 animate-spin text-primary",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: message
		})]
	});
}
function EmptyState({ title, description, actionLabel, onAction, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "flex flex-col items-center gap-4 px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[var(--glass-strong)] text-muted-foreground",
				children: icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
					className: "h-5 w-5",
					"aria-hidden": true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto max-w-sm text-sm text-muted-foreground",
					children: description
				})]
			}),
			actionLabel && onAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
				onClick: onAction,
				size: "sm",
				children: actionLabel
			})
		]
	});
}
function ErrorState({ title = "Something went wrong", description, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "flex flex-col items-center gap-4 px-6 py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--critical)_35%,transparent)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] text-critical",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "h-5 w-5",
					"aria-hidden": true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto max-w-sm text-sm text-muted-foreground",
					children: description
				})]
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
				variant: "glass",
				size: "sm",
				onClick: onRetry,
				children: "Try again"
			})
		]
	});
}
/** Routes a signed-out citizen can be returned to after authenticating. */
var PROTECTED_PATHS = [
	"/report",
	"/complaints",
	"/notifications",
	"/profile"
];
function parseRedirect(value) {
	return typeof value === "string" && PROTECTED_PATHS.includes(value) ? value : void 0;
}
/**
* Client-side authentication gate. Reporting and every personal page requires a
* signed-in citizen; Home, Civic Map and How It Works stay public.
*/
function AuthGate({ redirectTo, children }) {
	const { user, ready } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !user) navigate({
			to: "/login",
			search: { redirect: redirectTo },
			replace: true
		});
	}, [
		ready,
		user,
		navigate,
		redirectTo
	]);
	if (!ready || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: ready ? "Redirecting to sign in..." : "Checking your session..." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { parseRedirect as a, LoadingState as i, EmptyState as n, ErrorState as r, AuthGate as t };
