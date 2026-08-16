import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-card-CoNgXAty.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
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
export { SectionLabel as n, cn as r, GlassCard as t };
