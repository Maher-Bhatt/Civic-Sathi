import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as getAreaOverviews, l as useMuniAuth, u as useI18n } from "./router-Cf3D64gF.mjs";
import { n as SectionLabel } from "./glass-card-CtvEoNHg.mjs";
import { o as TrendingUp, s as TrendingDown } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as AREA_HEALTH_LABEL, t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/areas-C9T32frF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AreasPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [areas, setAreas] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [sortBy, setSortBy] = (0, import_react.useState)("risk");
	(0, import_react.useEffect)(() => {
		getAreaOverviews(city).then(setAreas).finally(() => setLoading(false));
	}, [city]);
	const sorted = [...areas].sort((a, b) => {
		if (sortBy === "risk") return b.risk - a.risk;
		if (sortBy === "reports") return b.reports - a.reports;
		return b.trendPct - a.trendPct;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading area overviews..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.area_intelligence") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: t("ui.neighbourhood_activity_overvie")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("ui.prototype_intelligence_data")
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"risk",
					"reports",
					"trend"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSortBy(s),
					className: cn("press rounded-full border px-3 py-1.5 text-xs capitalize", sortBy === s ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)]" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground"),
					children: [t("ui.sort_by"), s]
				}, s))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: sorted.map((area) => {
				const up = area.trendPct >= 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/map",
					className: "lift glass flex flex-wrap items-center gap-4 rounded-2xl p-4 transition-all duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-3 w-3 shrink-0 rounded-full",
							style: { background: AREA_HEALTH_HEX[area.health] }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: area.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									area.ward,
									" · ",
									AREA_HEALTH_LABEL[area.health],
									" ",
									t("ui.activity")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold tabular-nums",
								children: [
									area.reports,
									" ",
									t("ui.reports")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [
									area.critical,
									" ",
									t("ui.critical")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold tabular-nums",
								children: [t("ui.risk"), area.risk]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: area.topIssue
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("flex items-center gap-1 text-sm font-medium", up ? "text-[#a4503f]" : "text-primary"),
							children: [
								up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }),
								up ? "+" : "",
								area.trendPct,
								"%"
							]
						})
					]
				}, area.id);
			})
		})]
	});
}
//#endregion
export { AreasPage as component };
