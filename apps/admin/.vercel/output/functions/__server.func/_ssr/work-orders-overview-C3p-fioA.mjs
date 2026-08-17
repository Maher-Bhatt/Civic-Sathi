import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as getWorkOrders } from "./router-5EWQOmCi.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-orders-overview-C3p-fioA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkOrdersOverview() {
	const [workOrders, setWorkOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			try {
				const data = await getWorkOrders();
				setWorkOrders(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading platform overview..." });
	const statusCounts = workOrders.reduce((acc, wo) => {
		acc[wo.status] = (acc[wo.status] || 0) + 1;
		return acc;
	}, {});
	const chartData = Object.entries(statusCounts).map(([status, count]) => ({
		name: status,
		count
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Platform Work Orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[var(--muted-foreground)]",
				children: "Global view of all municipal work orders"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Global Work Order Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 mt-4 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chartData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 20
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "var(--muted-foreground)",
									fontSize: 12,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									fontSize: 12,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "var(--surface-elevated)" },
									contentStyle: {
										backgroundColor: "var(--background)",
										border: "1px solid var(--glass-border)",
										borderRadius: "8px"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									fill: "var(--foreground)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-0 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--surface-elevated)]/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: "ID / Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: "Municipality"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: "Contractor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: "SLA Deadline"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-[var(--glass-border)]",
							children: [workOrders.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[var(--surface-elevated)]/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: wo.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-[var(--muted-foreground)] font-mono",
											children: wo.id.substring(0, 8)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4",
										children: [
											wo.cityId,
											" - ",
											wo.department
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-xs",
										children: wo.contractorName || wo.contractorId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2.5 py-1 rounded text-xs font-medium border border-[var(--glass-border)] bg-[var(--surface-elevated)]",
											children: wo.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-[var(--muted-foreground)] text-xs",
										children: wo.slaDeadline ? new Date(wo.slaDeadline).toLocaleDateString() : "N/A"
									})
								]
							}, wo.id)), workOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-12 text-center text-[var(--muted-foreground)]",
								children: "No work orders found in the platform."
							}) })]
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { WorkOrdersOverview as component };
