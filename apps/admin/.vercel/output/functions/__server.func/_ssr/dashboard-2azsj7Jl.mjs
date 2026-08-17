import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Building2, m as MapPin, n as Users, o as Shield, v as FileText, x as CircleAlert, y as ClipboardList } from "../_libs/lucide-react.mjs";
import { h as listRealWorkOrders, u as getPlatformStats } from "./router-5EWQOmCi.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-2azsj7Jl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboardContent() {
	const [stats, setStats] = (0, import_react.useState)(null);
	const [workOrders, setWOs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const load = async () => {
			try {
				const [s, w] = await Promise.all([getPlatformStats(), listRealWorkOrders()]);
				setStats(s);
				setWOs(w.slice(0, 8));
			} catch (e) {
				setError(e.message ?? "Failed to load stats");
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading administrative intelligence..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-center text-[var(--critical)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-8 h-8 mx-auto mb-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[var(--muted-foreground)] mt-2",
				children: "Make sure you are logged in with an admin account."
			})
		]
	});
	const woStatusCounts = workOrders.reduce((acc, wo) => {
		acc[wo.status] = (acc[wo.status] ?? 0) + 1;
		return acc;
	}, {});
	const chartData = Object.entries(woStatusCounts).map(([status, count]) => ({
		name: status.replace(/_/g, " "),
		count
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Live Platform Data" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: "Platform Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--muted-foreground)]",
						children: "Real-time overview from the backend database"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Users",
						value: stats?.total_users ?? 0,
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Officers",
						value: stats?.total_officers ?? 0,
						icon: Shield
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Contractors",
						value: stats?.total_contractors ?? 0,
						icon: Building2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Active Work",
						value: stats?.active_work_orders ?? 0,
						icon: ClipboardList
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Open Complaints",
						value: stats?.open_complaints ?? 0,
						icon: FileText,
						alert: (stats?.open_complaints ?? 0) > 100
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Cities",
						value: stats?.total_cities ?? 0,
						icon: MapPin
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: "Total Complaints"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_complaints ?? 0).toLocaleString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: "Resolved"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1 text-green-400",
							children: (stats?.resolved_complaints ?? 0).toLocaleString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: "Civic Issues"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_issues ?? 0).toLocaleString()
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Work Order Status Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48 mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 10 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 10 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "var(--primary)",
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
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Recent Work Orders" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [workOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm py-4 text-center",
							children: "No work orders yet"
						}), workOrders.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-2 border-b border-[var(--glass-border)]/40 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-sm truncate",
									children: wo.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[var(--muted-foreground)] truncate",
									children: [
										wo.contractor_name,
										" · ",
										wo.city
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `ml-3 flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded uppercase border ${wo.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border-green-500/30" : wo.status === "IN_PROGRESS" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-[var(--surface-elevated)] text-[var(--muted-foreground)] border-[var(--glass-border)]"}`,
								children: wo.status.replace(/_/g, " ")
							})]
						}, wo.id))]
					})]
				})]
			})
		]
	});
}
function StatCard({ title, value, icon: Icon, suffix = "", alert = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 ${alert ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: `text-2xl font-bold ${alert ? "text-[var(--critical)]" : ""}`,
			children: [value.toLocaleString(), suffix]
		})]
	});
}
//#endregion
export { AdminDashboardContent as component };
