import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as getAuditLogs, l as getWorkOrders, s as getContractors } from "./router-KaY9WKDK.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { _ as CircleAlert, a as Shield, g as CircleCheck, h as ClipboardList, i as Timer, v as Building2 } from "../_libs/lucide-react.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Bm1QrnnY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboardContent() {
	const [contractors, setContractors] = (0, import_react.useState)([]);
	const [workOrders, setWorkOrders] = (0, import_react.useState)([]);
	const [auditLogs, setAuditLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			try {
				const [c, w, a] = await Promise.all([
					getContractors(),
					getWorkOrders(),
					getAuditLogs()
				]);
				setContractors(c);
				setWorkOrders(w);
				setAuditLogs(a.slice(0, 8));
			} catch (error) {
				console.error("Failed to load dashboard data", error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading administrative intelligence..." });
	const verifiedContractors = contractors.filter((c) => c.status === "VERIFIED").length;
	const pendingContractors = contractors.filter((c) => c.status === "PENDING_VERIFICATION").length;
	const activeWorkOrders = workOrders.filter((w) => ![
		"COMPLETED",
		"CANCELLED",
		"CLOSED"
	].includes(w.status)).length;
	const chartData = contractors.filter((c) => c.performanceScore !== void 0).slice(0, 5).map((c) => ({
		name: c.companyName.substring(0, 15) + (c.companyName.length > 15 ? "..." : ""),
		score: c.performanceScore || 0
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Platform Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[var(--muted-foreground)]",
					children: "Overview of system health and platform metrics"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Contractors",
						value: contractors.length,
						icon: Building2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Verified Contractors",
						value: verifiedContractors,
						icon: CircleCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Pending Verification",
						value: pendingContractors,
						icon: CircleAlert,
						alert: pendingContractors > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Active Work Orders",
						value: activeWorkOrders,
						icon: ClipboardList
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "lg:col-span-2 p-6 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Contractor Performance Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									bottom: 0
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
										dataKey: "score",
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Quick Actions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
								to: "/admin/contractors",
								icon: Building2,
								label: "Manage Contractors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
								to: "/admin/sla",
								icon: Timer,
								label: "Configure SLA Rules"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
								to: "/admin/audit-logs",
								icon: Shield,
								label: "Review Audit Logs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
								to: "/admin/work-orders-overview",
								icon: ClipboardList,
								label: "Platform Work Orders"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Recent System Activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/audit-logs",
						className: "text-sm hover:underline text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
						children: "View All"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 px-4 font-medium",
									children: "Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 px-4 font-medium",
									children: "Actor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 px-4 font-medium",
									children: "Action"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 px-4 font-medium",
									children: "Entity"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[var(--glass-border)]",
							children: auditLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[var(--surface-elevated)]/50 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 whitespace-nowrap text-[var(--muted-foreground)]",
										children: new Date(log.at).toLocaleString(void 0, {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 whitespace-nowrap",
										children: log.actorName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded text-xs border border-[var(--glass-border)] bg-[var(--surface-elevated)]",
											children: log.action
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4",
										children: [
											log.entityType,
											" (",
											log.entityId.substring(0, 8),
											")"
										]
									})
								]
							}, log.id))
						})]
					})
				})]
			})
		]
	});
}
function StatCard({ title, value, icon: Icon, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
		className: `p-6 ${alert ? "border-[var(--warning)]/50 bg-[var(--warning)]/5" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[var(--muted-foreground)] font-medium mb-1",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-3xl font-bold",
				children: value
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `p-2 rounded-md ${alert ? "bg-[var(--warning)]/20 text-[var(--warning)]" : "bg-[var(--surface-elevated)] border border-[var(--glass-border)]"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5" })
			})]
		})
	});
}
function ActionLink({ to, icon: Icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex items-center gap-3 p-3 rounded-md border border-[var(--glass-border)] bg-[var(--surface-elevated)] hover:bg-[var(--background)] transition-colors lift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5 text-[var(--muted-foreground)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-sm",
			children: label
		})]
	});
}
//#endregion
export { AdminDashboardContent as component };
