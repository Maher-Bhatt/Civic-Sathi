import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Timer, f as Pen } from "../_libs/lucide-react.mjs";
import { S as useI18n, b as updateSLARule, m as getSLARules, r as useAdminAuth } from "./router-BSWPfuIR.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sla-C2yWWd5l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SLAConfig() {
	const { t } = useI18n();
	const [rules, setRules] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { admin } = useAdminAuth();
	const loadData = async () => {
		setLoading(true);
		try {
			const data = await getSLARules();
			setRules(data);
		} catch (error) {
			toast.error("Failed to load SLA rules");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleUpdate = async (ruleId, field, value) => {
		if (!admin) return;
		try {
			await updateSLARule(ruleId, { [field]: value }, admin.id, admin.name);
			toast.success("SLA Rule updated");
			loadData();
		} catch (error) {
			toast.error("Failed to update rule");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading SLA rules..." });
	const groupedRules = rules.reduce((acc, rule) => {
		if (!acc[rule.category]) acc[rule.category] = [];
		acc[rule.category].push(rule);
		return acc;
	}, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 muni-page-enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: t("ui.sla_configuration")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[var(--muted-foreground)]",
			children: t("ui.define_response_and_resolution")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-8",
			children: Object.entries(groupedRules).map(([category, categoryRules]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[var(--surface-elevated)] p-4 border-b border-[var(--glass-border)] flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "w-4 h-4 text-[var(--foreground)]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: category
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--background)]/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.severity")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.response_hrs")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.resolution_hrs")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.escalation_hrs")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.status")
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[var(--glass-border)]",
							children: categoryRules.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[var(--surface-elevated)]/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: rule.severity })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableNumber, {
											value: rule.responseHours,
											onSave: (val) => handleUpdate(rule.id, "responseHours", val)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableNumber, {
											value: rule.resolutionHours,
											onSave: (val) => handleUpdate(rule.id, "resolutionHours", val)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableNumber, {
											value: rule.escalationHours,
											onSave: (val) => handleUpdate(rule.id, "escalationHours", val)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "flex items-center cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														className: "sr-only",
														checked: rule.active,
														onChange: (e) => handleUpdate(rule.id, "active", e.target.checked)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `block w-10 h-6 rounded-full transition-colors ${rule.active ? "bg-[var(--foreground)]" : "bg-[var(--surface-elevated)] border border-[var(--glass-border)]"}` }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `dot absolute left-1 top-1 bg-[var(--background)] w-4 h-4 rounded-full transition-transform ${rule.active ? "transform translate-x-4" : ""}` })
												]
											})
										})
									})
								]
							}, rule.id))
						})]
					})
				})]
			}, category))
		})]
	});
}
function EditableNumber({ value, onSave }) {
	const { t } = useI18n();
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [tempValue, setTempValue] = (0, import_react.useState)(value.toString());
	const handleBlur = () => {
		setIsEditing(false);
		const num = parseInt(tempValue, 10);
		if (!isNaN(num) && num !== value) onSave(num);
		else setTempValue(value.toString());
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter") handleBlur();
		if (e.key === "Escape") {
			setIsEditing(false);
			setTempValue(value.toString());
		}
	};
	if (isEditing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "number",
		value: tempValue,
		onChange: (e) => setTempValue(e.target.value),
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
		className: "ambient-field w-20 py-1 px-2 text-sm",
		autoFocus: true,
		min: "1"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 group cursor-pointer hover:text-[var(--foreground)]",
		onClick: () => setIsEditing(true),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium font-mono",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)]" })]
	});
}
function SeverityBadge({ severity }) {
	const { t } = useI18n();
	let colors = "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-[var(--foreground)]";
	if (severity === "CRITICAL") colors = "bg-[var(--critical)]/10 border-[var(--critical)]/20 text-[var(--critical)]";
	if (severity === "HIGH") colors = "bg-[var(--warning)]/10 border-[var(--warning)]/20 text-[var(--warning)]";
	if (severity === "MODERATE") colors = "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-[var(--foreground)]";
	if (severity === "LOW") colors = "bg-[var(--background)] border-[var(--glass-border)] text-[var(--muted-foreground)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `px-2.5 py-1 rounded text-xs font-medium border ${colors}`,
		children: severity
	});
}
//#endregion
export { SLAConfig as component };
