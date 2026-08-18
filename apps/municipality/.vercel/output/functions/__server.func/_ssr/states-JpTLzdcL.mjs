import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as Inbox, a as TriangleAlert, w as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/states-JpTLzdcL.js
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
//#endregion
export { ErrorState as n, LoadingState as r, EmptyState as t };
