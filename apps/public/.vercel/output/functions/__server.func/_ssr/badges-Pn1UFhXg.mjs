import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as cn } from "./router-BECM0GLq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-Pn1UFhXg.js
var import_jsx_runtime = require_jsx_runtime();
var statusStyles = {
	Received: "text-muted-foreground border-border bg-[var(--glass)]",
	"Under Review": "text-muted-foreground border-border bg-[var(--glass)]",
	Assigned: "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	"In Progress": "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	Resolved: "text-success border-[color-mix(in_oklab,var(--success)_40%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
	Closed: "text-subtle border-border bg-[var(--glass)]"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.08em] uppercase", statusStyles[status], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-80" }), status]
	});
}
var severityStyles = {
	Low: "text-subtle border-border bg-[var(--glass)]",
	Moderate: "text-warning border-[color-mix(in_oklab,var(--warning)_38%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	High: "text-critical border-[color-mix(in_oklab,var(--critical)_38%,transparent)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
	Critical: "text-critical border-[color-mix(in_oklab,var(--critical)_55%,transparent)] bg-[color-mix(in_oklab,var(--critical)_18%,transparent)]"
};
function SeverityBadge({ severity, className }) {
	const bars = {
		Low: 1,
		Moderate: 2,
		High: 3,
		Critical: 4
	}[severity];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.08em] uppercase", severityStyles[severity], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex items-end gap-[2px]",
			"aria-hidden": true,
			children: [
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-[3px] rounded-full bg-current transition-opacity duration-300",
				style: {
					height: 4 + i * 2,
					opacity: i < bars ? .95 : .22
				}
			}, i))
		}), severity]
	});
}
//#endregion
export { StatusBadge as n, SeverityBadge as t };
