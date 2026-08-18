import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as cn } from "./router-CqLLLgV7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glass-input-C05CvLHo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fieldBase = "w-full rounded-xl border border-border bg-[var(--glass)] px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-[color-mix(in_oklab,var(--foreground)_18%,transparent)] focus:border-primary focus:bg-[var(--glass-strong)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]";
var GlassInput = (0, import_react.forwardRef)(function GlassInput({ className, label, hint, error, id, ...props }, ref) {
	const auto = (0, import_react.useId)();
	const inputId = id ?? auto;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: inputId,
				className: "label-xs block",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: inputId,
				ref,
				"aria-invalid": !!error,
				"aria-describedby": hint || error ? `${inputId}-desc` : void 0,
				className: cn(fieldBase, "h-11", error && "border-critical", className),
				...props
			}),
			(hint || error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: `${inputId}-desc`,
				className: cn("text-xs", error ? "text-critical" : "text-subtle"),
				children: error ?? hint
			})
		]
	});
});
var GlassTextarea = (0, import_react.forwardRef)(function GlassTextarea({ className, label, hint, id, ...props }, ref) {
	const auto = (0, import_react.useId)();
	const areaId = id ?? auto;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: areaId,
				className: "label-xs block",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: areaId,
				ref,
				className: cn(fieldBase, "resize-none py-3.5 leading-relaxed", className),
				...props
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: hint
			})
		]
	});
});
//#endregion
export { GlassTextarea as n, GlassInput as t };
