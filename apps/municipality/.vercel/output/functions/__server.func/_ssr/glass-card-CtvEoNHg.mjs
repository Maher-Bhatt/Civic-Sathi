import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-card-CtvEoNHg.js
var import_jsx_runtime = require_jsx_runtime();
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
export { SectionLabel as n, GlassCard as t };
