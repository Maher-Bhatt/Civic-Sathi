import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Building2, m as MapPin, n as Users, o as Shield, v as FileText, x as CircleAlert, y as ClipboardList } from "../_libs/lucide-react.mjs";
import { h as listRealWorkOrders, u as getPlatformStats, y as useI18n } from "./router-B101IEkm.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DTlcJbNV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	"DRAFT": "#6c757d",
	"PUBLISHED": "#3498db",
	"IN PROGRESS": "#f39c12",
	"COMPLETED": "#27ae60",
	"INSPECTION PENDING": "#9b59b6",
	"INSPECTION FAILED": "#e74c3c",
	"REWORK": "#e67e22",
	"CANCELLED": "#95a5a6",
	"CLOSED": "#1abc9c"
};
function AdminDashboardContent() {
	const { t } = useI18n();
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
				children: t("ui.make_sure_you_are_logged_in_wi")
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.live_platform_data") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: t("ui.platform_dashboard")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--muted-foreground)]",
						children: t("ui.real_time_overview_from_the_ba")
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.total_users"),
						value: stats?.total_users ?? 0,
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.officers"),
						value: stats?.total_officers ?? 0,
						icon: Shield
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.contractors"),
						value: stats?.total_contractors ?? 0,
						icon: Building2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.active_work"),
						value: stats?.active_work_orders ?? 0,
						icon: ClipboardList,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.open_complaints"),
						value: stats?.open_complaints ?? 0,
						icon: FileText,
						alert: (stats?.open_complaints ?? 0) > 100
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.cities"),
						value: stats?.total_cities ?? 0,
						icon: MapPin,
						accent: "success"
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
							children: t("ui.total_complaints")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_complaints ?? 0).toLocaleString("en-IN")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: t("ui.resolved")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							style: { color: "#27ae60" },
							children: (stats?.resolved_complaints ?? 0).toLocaleString("en-IN")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: t("ui.civic_issues")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_issues ?? 0).toLocaleString("en-IN")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.work_order_status_distribution") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								margin: {
									top: 5,
									right: 20,
									left: -15,
									bottom: 5
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: `barGrad${i}`,
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: .6
										})]
									}, entry.name)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "rgba(255,255,255,0.08)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "rgba(255,255,255,0.05)" },
										contentStyle: {
											backgroundColor: "var(--surface-elevated)",
											border: "1px solid var(--glass-border)",
											borderRadius: "10px",
											fontSize: "12px",
											boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
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
										maxBarSize: 56,
										children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: `url(#barGrad${i})` }, entry.name))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.recent_work_orders") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [workOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm py-4 text-center",
							children: t("ui.no_work_orders_yet")
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
								className: "ml-3 flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full",
								style: {
									background: `${STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970"}20`,
									color: STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970",
									border: `1px solid ${STATUS_COLORS[wo.status.replace(/_/g, " ")] ?? "#3d9970"}40`
								},
								children: wo.status.replace(/_/g, " ")
							})]
						}, wo.id))]
					})]
				})]
			})
		]
	});
}
function StatCard({ title, value, icon: Icon, suffix = "", alert = false, accent = "default" }) {
	const { t } = useI18n();
	const accentColor = alert ? "var(--critical)" : accent === "success" ? "#27ae60" : accent === "warning" ? "#f39c12" : "var(--primary)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "p-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 left-0 w-1 h-full rounded-l-xl",
				style: { background: accentColor }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2 pl-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-1.5 rounded-lg",
					style: { background: `${accentColor}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "w-3.5 h-3.5",
						style: { color: accentColor }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-2xl font-bold pl-2",
				style: { color: alert ? accentColor : void 0 },
				children: [value.toLocaleString("en-IN"), suffix]
			})
		]
	});
}
//#endregion
export { AdminDashboardContent as component };
