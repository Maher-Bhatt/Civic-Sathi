import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as getWorkOrders, l as useMuniAuth, u as useI18n } from "./router-erLYgovb.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { H as ArrowUpRight, I as CircleAlert, N as ClipboardList } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as formatDistanceToNow, r as format, t as isPast } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-orders-6oGGdHWf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	ISSUED: "Issued",
	ACCEPTED: "Accepted",
	IN_PROGRESS: "In Progress",
	INSPECTION_PENDING: "Pending Inspection",
	INSPECTION_FAILED: "Inspection Failed",
	REWORK: "Rework",
	COMPLETED: "Completed",
	CLOSED: "Closed"
};
var STATUS_CHIP = {
	ISSUED: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
	ACCEPTED: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
	IN_PROGRESS: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	INSPECTION_PENDING: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	INSPECTION_FAILED: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
	REWORK: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
	COMPLETED: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
	CLOSED: "text-[var(--muted-foreground)] bg-[var(--muted)]"
};
function WorkOrdersPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [filter, setFilter] = (0, import_react.useState)("all");
	const { data: orders = [], isLoading: loading } = useQuery({
		queryKey: ["muni-work-orders", city],
		queryFn: () => getWorkOrders({ cityId: city }),
		enabled: !!city
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading work orders..." });
	const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
	const overdue = orders.filter((o) => o.target_completion_date && isPast(new Date(o.target_completion_date)) && !["COMPLETED", "CLOSED"].includes(o.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.work_orders") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: [
						orders.length,
						" ",
						t("ui.work_order"),
						orders.length !== 1 ? "s" : ""
					]
				})] }), overdue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--critical)_30%,transparent)] bg-[color-mix(in_oklab,var(--critical)_8%,transparent)] px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-[var(--critical)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[var(--critical)] font-medium",
						children: [
							overdue.length,
							" ",
							t("ui.overdue")
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"all",
					"ISSUED",
					"IN_PROGRESS",
					"INSPECTION_PENDING",
					"REWORK",
					"COMPLETED",
					"CLOSED"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(s),
					className: cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", filter === s ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "glass text-muted-foreground hover:text-foreground"),
					children: s === "all" ? "All" : STATUS_LABEL[s] ?? s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "p-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mx-auto h-10 w-10 text-muted-foreground opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: t("ui.no_work_orders_found")
					})]
				}) : filtered.map((wo) => {
					const isOverdue = wo.target_completion_date && isPast(new Date(wo.target_completion_date)) && !["COMPLETED", "CLOSED"].includes(wo.status);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/work-orders/$id",
						params: { id: wo.id },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							elevation: "raised",
							className: cn("lift p-5 cursor-pointer", isOverdue && "border-[color-mix(in_oklab,var(--critical)_30%,transparent)]"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CHIP[wo.status] ?? STATUS_CHIP["CLOSED"]),
													children: STATUS_LABEL[wo.status] ?? wo.status
												}),
												isOverdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--critical)]",
													children: t("ui.overdue")
												}),
												wo.risk_level && wo.risk_level !== "LOW" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-[var(--muted-foreground)]",
													children: [
														wo.risk_level,
														" ",
														t("ui.risk")
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 font-semibold",
											children: wo.title ?? `Work Order – ${wo.id}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground",
											children: [
												wo.contractor_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: wo.contractor_name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", (wo.estimated_budget ?? wo.award_value ?? 0).toLocaleString("en-IN")] }),
												wo.target_completion_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													t("ui.due"),
													" ",
													isOverdue ? "Overdue" : formatDistanceToNow(new Date(wo.target_completion_date), { addSuffix: true })
												] })
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "label-xs font-mono text-[0.65rem] text-muted-foreground",
											children: wo.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: wo.created_at ? format(new Date(wo.created_at), "dd MMM yyyy") : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mt-2 ml-auto h-4 w-4 text-muted-foreground" })
									]
								})]
							})
						})
					}, wo.id);
				})
			})
		]
	});
}
//#endregion
export { WorkOrdersPage as component };
