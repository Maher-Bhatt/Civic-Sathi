import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as getAlerts, l as useMuniAuth, m as acknowledgeAlert, u as useI18n } from "./router-DyFCvMMN.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { r as LoadingState, t as EmptyState } from "./states-JpTLzdcL.mjs";
import { a as alertPriority } from "./types-CjX07JOU.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { t as PriorityBadge } from "./status-badge-DreJLRai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-VVidHbEZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const [alerts, setAlerts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		getAlerts(officer?.city).then(setAlerts).finally(() => setLoading(false));
	}, [officer?.city]);
	const filtered = alerts.filter((a) => {
		if (filter === "active") return !a.acknowledged;
		if (filter === "acknowledged") return a.acknowledged;
		return true;
	});
	async function handleAcknowledge(id) {
		const updated = await acknowledgeAlert(id);
		setAlerts((list) => list.map((a) => a.id === id ? updated : a));
		toast.success("Alert acknowledged");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading alerts..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.operational_alerts") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: t("ui.city_wide_risk_notifications")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("ui.prototype_intelligence_data")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"all",
					"active",
					"acknowledged"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(f),
					className: cn("press rounded-full border px-3 py-1.5 text-xs capitalize transition-all", filter === f ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground"),
					children: f
				}, f))
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: t("ui.no_alerts"),
				description: "No alerts match the selected filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: filtered.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
					elevation: "raised",
					className: cn("p-5 transition-opacity", alert.acknowledged && "opacity-60"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: alertPriority(alert.riskScore) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: alert.category
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: [
										alert.area,
										" · ",
										alert.ward
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("ui.reports")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold tabular-nums",
											children: alert.complaintCount
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("ui.risk")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold tabular-nums",
											children: alert.riskScore
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("ui.trend")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold tabular-nums",
											children: [
												alert.trendPct >= 0 ? "+" : "",
												alert.trendPct,
												"%"
											]
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-subtle",
									children: format(new Date(alert.createdAt), "dd MMM yyyy, HH:mm")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [alert.issueId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/issues/$id",
								params: { id: alert.issueId },
								className: "action-btn text-center",
								children: t("ui.view_issue")
							}), !alert.acknowledged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void handleAcknowledge(alert.id),
								className: "action-btn primary",
								children: t("ui.acknowledge")
							})]
						})]
					})
				}, alert.id))
			})
		]
	});
}
//#endregion
export { AlertsPage as component };
