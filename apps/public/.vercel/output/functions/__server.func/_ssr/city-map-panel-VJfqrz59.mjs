import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as MapPin } from "../_libs/lucide-react.mjs";
import { n as CITIES } from "./cities-CP3Vvkkz.mjs";
import { D as useI18n, E as cn } from "./router-CqLLLgV7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/city-map-panel-VJfqrz59.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CityMap = (0, import_react.lazy)(() => import("./city-map-BWQkSzZ-.mjs").then((m) => ({ default: m.CityMap })));
function MapSkeleton({ className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]", className),
		role: "status",
		"aria-label": t("ui.loading_map"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
				className: "h-3.5 w-3.5 animate-pulse",
				"aria-hidden": true
			}), t("ui.loading_map")]
		})
	});
}
/** Browser-only wrapper: Leaflet is never imported during SSR. */
function ClientCityMap(props) {
	const { t } = useI18n();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityMap, { ...props })
	});
}
function CitySelector({ cityId, onChange, className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-xs shrink-0",
			children: t("ui.city")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "radiogroup",
			"aria-label": t("ui.city"),
			className: "inline-flex items-center gap-0.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-0.5 backdrop-blur-md",
			children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": cityId === c.id,
				onClick: () => onChange(c.id),
				className: cn("press min-h-9 rounded-full px-3.5 text-[0.7rem] font-medium tracking-[0.06em] uppercase", cityId === c.id ? "bg-[var(--glass-strong)] text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:text-foreground"),
				children: c.name
			}, c.id))
		})]
	});
}
//#endregion
export { ClientCityMap as n, CitySelector as t };
