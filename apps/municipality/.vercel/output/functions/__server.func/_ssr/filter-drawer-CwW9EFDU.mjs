import { n as CITIES } from "./cities-BuKc8Yb6.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { u as useI18n } from "./router-BJrV6yDr.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { i as ISSUE_TYPES, r as DEPARTMENTS, t as COMPLAINT_STATUSES } from "./types-CjX07JOU.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetFooter, t as Sheet } from "./sheet-Dn_BDnu5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filter-drawer-CwW9EFDU.js
var import_jsx_runtime = require_jsx_runtime();
var SEVERITIES = [
	"Low",
	"Moderate",
	"High",
	"Critical"
];
function FilterDrawer({ open, onOpenChange, filters, onChange, onApply, onClear }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "glass-strong flex w-full flex-col border-l border-[var(--glass-border)] sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: t("ui.filters") }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-4 overflow-y-auto py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.city"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.city,
								onChange: (e) => onChange({ city: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("ui.all_cities")
								}), CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.area"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: filters.area,
								onChange: (e) => onChange({ area: e.target.value }),
								className: "filter-input",
								placeholder: t("ui.area_name")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.ward"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: filters.ward,
								onChange: (e) => onChange({ ward: e.target.value }),
								className: "filter-input",
								placeholder: t("ui.ward")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.issue"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.category,
								onChange: (e) => onChange({ category: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("ui.all_categories")
								}), ISSUE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.severity"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.severity,
								onChange: (e) => onChange({ severity: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("ui.all_severities")
								}), SEVERITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.department"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.department,
								onChange: (e) => onChange({ department: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("ui.all_departments")
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.status"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.status,
								onChange: (e) => onChange({ status: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("ui.all_statuses")
								}), COMPLAINT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("ui.risk_range"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 100,
									value: filters.riskMin,
									onChange: (e) => onChange({ riskMin: Number(e.target.value) }),
									className: "filter-input",
									placeholder: t("ui.min")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 100,
									value: filters.riskMax,
									onChange: (e) => onChange({ riskMax: Number(e.target.value) }),
									className: "filter-input",
									placeholder: t("ui.max")
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
					className: "flex-row gap-2 border-t border-[var(--glass-border)] pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						variant: "outline",
						className: "flex-1",
						onClick: onClear,
						children: t("ui.clear")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						className: "flex-1",
						onClick: onApply,
						children: t("ui.apply")
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "label-xs mb-1.5 block",
		children: label
	}), children] });
}
//#endregion
export { FilterDrawer as t };
