import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as useI18n, h as getWorkOrders } from "./router-Y89kYKHN.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-orders-overview-cG6kbIXi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WO_STATUS_COLORS = {
	"DRAFT": "#74b9ff",
	"PUBLISHED": "#0984e3",
	"IN_PROGRESS": "#fdcb6e",
	"COMPLETED": "#00b894",
	"INSPECTION_PENDING": "#a29bfe",
	"INSPECTION_FAILED": "#d63031",
	"REWORK": "#e17055",
	"CANCELLED": "#636e72",
	"CLOSED": "#55efc4"
};
function WorkOrdersOverview() {
	const { t } = useI18n();
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
				children: t("ui.platform_work_orders")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[var(--muted-foreground)]",
				children: t("ui.global_view_of_all_municipal_w")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.global_work_order_distribution") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[var(--muted-foreground)] mb-4",
						children: t("ui.status_breakdown_across_all_ci")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72 mt-2 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								margin: {
									top: 10,
									right: 20,
									left: -10,
									bottom: 20
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: `woGrad${i}`,
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: WO_STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: .95
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: WO_STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: .55
										})]
									}, entry.name)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "rgba(255,255,255,0.07)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "var(--muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										tick: { fill: "var(--muted-foreground)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										tick: { fill: "var(--muted-foreground)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "rgba(255,255,255,0.04)" },
										contentStyle: {
											backgroundColor: "var(--surface-elevated)",
											border: "1px solid var(--glass-border)",
											borderRadius: "10px",
											fontSize: "12px",
											boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
										},
										formatter: (value) => [value, "Work Orders"],
										labelStyle: {
											color: "var(--foreground)",
											fontWeight: 600
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										radius: [
											6,
											6,
											0,
											0
										],
										maxBarSize: 60,
										children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: `url(#woGrad${i})` }, entry.name))
									})
								]
							})
						})
					})
				]
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
									children: t("ui.id_title")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.municipality")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.contractor")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.status")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.sla_deadline")
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
											className: "px-2.5 py-1 rounded-full text-xs font-semibold",
											style: {
												background: `${WO_STATUS_COLORS[wo.status] ?? "#3d9970"}20`,
												color: WO_STATUS_COLORS[wo.status] ?? "#3d9970",
												border: `1px solid ${WO_STATUS_COLORS[wo.status] ?? "#3d9970"}40`
											},
											children: wo.status.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-[var(--muted-foreground)] text-xs",
										children: wo.slaDeadline ? new Date(wo.slaDeadline).toLocaleDateString("en-IN") : "N/A"
									})
								]
							}, wo.id)), workOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-12 text-center text-[var(--muted-foreground)]",
								children: t("ui.no_work_orders_found_in_the_pl")
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
