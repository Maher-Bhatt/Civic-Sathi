import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-DreJLRai.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STYLES = {
	Received: "bg-[var(--glass)] text-muted-foreground",
	"Under Review": "bg-warning/15 text-warning",
	Assigned: "bg-primary/15 text-primary",
	"In Progress": "bg-[#a4503f]/15 text-[#a4503f]",
	Resolved: "bg-primary/20 text-primary",
	Closed: "bg-[var(--glass)] text-subtle"
};
var SEVERITY_STYLES = {
	Low: "text-subtle",
	Moderate: "text-warning",
	High: "text-[#a4503f]",
	Critical: "text-critical"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider", STATUS_STYLES[status]),
		children: status
	});
}
function SeverityBadge({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("text-xs font-medium", SEVERITY_STYLES[severity]),
		children: severity
	});
}
function PriorityBadge({ priority }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider", {
			Critical: "border-critical/40 bg-critical/10 text-critical",
			High: "border-[#a4503f]/40 bg-[#a4503f]/10 text-[#a4503f]",
			Moderate: "border-warning/40 bg-warning/10 text-warning",
			Informational: "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground"
		}[priority]),
		children: priority
	});
}
//#endregion
export { SeverityBadge as n, StatusBadge as r, PriorityBadge as t };
