import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useContractorAuth, l as getWorkOrders, p as useI18n } from "./router-CLnZYXuw.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { h as Clock, o as MapPin, y as Calendar } from "../_libs/lucide-react.mjs";
import { n as LoadingState, t as ErrorState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-orders-n8ebgJ6i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	ISSUED: "Issued",
	ACCEPTED: "Accepted",
	IN_PROGRESS: "In Progress",
	INSPECTION_PENDING: "Awaiting Inspection",
	INSPECTION_FAILED: "Inspection Failed",
	REWORK: "Rework",
	COMPLETED: "Completed",
	CLOSED: "Closed"
};
var STATUS_COLOR = {
	ISSUED: "var(--primary)",
	ACCEPTED: "var(--primary)",
	IN_PROGRESS: "var(--warning)",
	INSPECTION_PENDING: "var(--warning)",
	INSPECTION_FAILED: "var(--critical)",
	REWORK: "var(--critical)",
	COMPLETED: "var(--success)",
	CLOSED: "var(--muted-foreground)"
};
function ContractorWorkOrders() {
	const { t } = useI18n();
	const { contractor } = useContractorAuth();
	const [filter, setFilter] = (0, import_react.useState)("ALL");
	const { data: workOrders = [], isLoading: loading, error } = useQuery({
		queryKey: ["contractor-work-orders", contractor?.id],
		queryFn: () => getWorkOrders(),
		enabled: !!contractor?.id
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading work orders..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { description: error.message ?? "Error loading work orders." });
	const filterGroups = {
		ALL: [],
		ISSUED: ["ISSUED"],
		ACCEPTED: ["ACCEPTED"],
		IN_PROGRESS: ["IN_PROGRESS", "REWORK"],
		INSPECTION_PENDING: ["INSPECTION_PENDING", "INSPECTION_FAILED"],
		REWORK: ["REWORK"],
		COMPLETED: ["COMPLETED"],
		CLOSED: ["CLOSED"]
	};
	const filtered = filter === "ALL" ? workOrders : workOrders.filter((wo) => filterGroups[filter]?.includes(wo.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-4",
			children: t("ui.work_orders")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex space-x-2 overflow-x-auto pb-2",
			children: [
				{
					label: "All",
					value: "ALL"
				},
				{
					label: "Issued",
					value: "ISSUED"
				},
				{
					label: "In Progress",
					value: "IN_PROGRESS"
				},
				{
					label: "Awaiting Inspection",
					value: "INSPECTION_PENDING"
				},
				{
					label: "Completed",
					value: "COMPLETED"
				},
				{
					label: "Closed",
					value: "CLOSED"
				}
			].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(tab.value),
				className: `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filter === tab.value ? "bg-[var(--surface-elevated)] border-[var(--primary)]/50 text-[var(--foreground)] shadow-sm" : "bg-[var(--surface)] border-[var(--glass-border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]/50"}`,
				children: tab.label
			}, tab.value))
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
			children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-full py-12 text-center text-[var(--muted-foreground)] bg-[var(--surface)] rounded-xl border border-[var(--glass-border)]",
				children: t("ui.no_work_orders_found_for_the_s")
			}) : filtered.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/contractor/work-orders/$id",
				params: { id: wo.id },
				className: "block group",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5 glass-strong h-full flex flex-col gap-4 lift transition-all hover:border-[var(--primary)]/40 hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs px-2 py-1 bg-[var(--surface-elevated)] rounded border border-[var(--glass-border)] text-[var(--muted-foreground)] truncate max-w-[120px]",
								children: wo.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface)] shrink-0",
								style: { color: STATUS_COLOR[wo.status] ?? "var(--foreground)" },
								children: STATUS_LABEL[wo.status] ?? wo.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium text-lg leading-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors",
							children: wo.title ?? "Work Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 mt-auto pt-4 text-sm text-[var(--muted-foreground)] border-t border-[var(--glass-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 14,
										className: "shrink-0 opacity-70"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: wo.department_id ? `Dept: ${wo.department_id}` : "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
										size: 14,
										className: "shrink-0 opacity-70"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										t("ui.issued"),
										" ",
										wo.created_at ? new Date(wo.created_at).toLocaleDateString("en-IN") : "—"
									] })]
								}),
								wo.target_completion_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										size: 14,
										className: `shrink-0 ${new Date(wo.target_completion_date) < /* @__PURE__ */ new Date() ? "text-[var(--critical)]" : "opacity-70"}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: new Date(wo.target_completion_date) < /* @__PURE__ */ new Date() ? "text-[var(--critical)]" : "",
										children: [t("ui.due"), new Date(wo.target_completion_date).toLocaleDateString("en-IN")]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-medium text-[var(--foreground)]",
										children: ["₹", (wo.award_value ?? 0).toLocaleString("en-IN")]
									}), wo.risk_level && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${wo.risk_level === "HIGH" || wo.risk_level === "CRITICAL" ? "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_10%,transparent)]" : "text-[var(--muted-foreground)] bg-[var(--surface-elevated)]"}`,
										children: [
											wo.risk_level,
											" ",
											t("ui.risk")
										]
									})]
								})
							]
						})
					]
				})
			}, wo.id))
		})]
	});
}
//#endregion
export { ContractorWorkOrders as component };
