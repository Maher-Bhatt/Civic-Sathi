import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { n as CITIES } from "./cities-BuKc8Yb6.mjs";
import { i as ISSUE_TYPES, r as DEPARTMENTS, t as COMPLAINT_STATUSES } from "./types-CjX07JOU.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetFooter, t as Sheet } from "./sheet-Dn_BDnu5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filter-drawer-CTln0d3Q.js
var import_jsx_runtime = require_jsx_runtime();
var SEVERITIES = [
	"Low",
	"Moderate",
	"High",
	"Critical"
];
function FilterDrawer({ open, onOpenChange, filters, onChange, onApply, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "glass-strong flex w-full flex-col border-l border-[var(--glass-border)] sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Filters" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-4 overflow-y-auto py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.city,
								onChange: (e) => onChange({ city: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All cities"
								}), CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Area",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: filters.area,
								onChange: (e) => onChange({ area: e.target.value }),
								className: "filter-input",
								placeholder: "Area name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ward",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: filters.ward,
								onChange: (e) => onChange({ ward: e.target.value }),
								className: "filter-input",
								placeholder: "Ward"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Issue",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.category,
								onChange: (e) => onChange({ category: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All categories"
								}), ISSUE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Severity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.severity,
								onChange: (e) => onChange({ severity: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All severities"
								}), SEVERITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Department",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.department,
								onChange: (e) => onChange({ department: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All departments"
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.status,
								onChange: (e) => onChange({ status: e.target.value }),
								className: "filter-input",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All statuses"
								}), COMPLAINT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Risk range",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 100,
									value: filters.riskMin,
									onChange: (e) => onChange({ riskMin: Number(e.target.value) }),
									className: "filter-input",
									placeholder: "Min"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 100,
									value: filters.riskMax,
									onChange: (e) => onChange({ riskMax: Number(e.target.value) }),
									className: "filter-input",
									placeholder: "Max"
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
						children: "Clear"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						className: "flex-1",
						onClick: onApply,
						children: "Apply"
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "label-xs mb-1.5 block",
		children: label
	}), children] });
}
//#endregion
export { FilterDrawer as t };
