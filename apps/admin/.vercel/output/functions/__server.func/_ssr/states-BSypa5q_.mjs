import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as TriangleAlert, p as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/states-BSypa5q_.js
var import_jsx_runtime = require_jsx_runtime();
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
export { LoadingState as n, ErrorState as t };
