import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as getDepartments, u as useI18n } from "./router-CzUebAlT.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { H as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/departments-D1A8WKVj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DepartmentsPage() {
	const { t } = useI18n();
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getDepartments().then(setDepartments).finally(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading departments..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.department_overview") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-semibold",
				children: t("ui.operational_workload_by_depart")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("ui.prototype_intelligence_data")
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: departments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				interactive: true,
				className: "lift p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold",
							children: dept.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								t("ui.avg_response"),
								dept.avgResponseDays.toFixed(1),
								" ",
								t("ui.days")
							]
						})] }), dept.critical > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-critical/15 px-2 py-0.5 text-[0.65rem] font-medium text-critical",
							children: [
								dept.critical,
								" ",
								t("ui.critical")
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.open")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xl font-semibold tabular-nums",
								children: dept.open
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.in_progress")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xl font-semibold tabular-nums",
								children: dept.inProgress
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.resolved")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xl font-semibold tabular-nums text-primary",
								children: dept.resolved
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: t("ui.emerging_issues")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xl font-semibold tabular-nums text-warning",
								children: dept.emergingIssues
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/departments/$id",
						params: { id: dept.id },
						className: "mt-5 flex items-center justify-center gap-1 text-xs text-primary hover:underline",
						children: [t("ui.view_details"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
					})
				]
			}, dept.id))
		})]
	});
}
//#endregion
export { DepartmentsPage as component };
