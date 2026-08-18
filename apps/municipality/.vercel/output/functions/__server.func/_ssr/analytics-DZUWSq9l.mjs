import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as getAnalyticsData, l as useMuniAuth, u as useI18n } from "./router-B1-L_e4B.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { a as YAxis, c as Line, d as Bar, f as Pie, h as Cell, i as LineChart, l as CartesianGrid, m as Label, n as PieChart, o as XAxis, p as LabelList, r as BarChart, s as Area, t as AreaChart, u as ReferenceLine, v as Legend } from "../_libs/recharts+[...].mjs";
import { n as ChartTooltip, r as ChartTooltipContent, t as ChartContainer } from "./chart-CQNgxI-x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DZUWSq9l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEPT_COLORS = [
	"#1abc9c",
	"#3498db",
	"#9b59b6",
	"#e74c3c",
	"#f39c12",
	"#e67e22",
	"#2ecc71",
	"#fd79a8"
];
var complaintConfig = {
	total: {
		label: "Total Reports",
		color: "#1abc9c"
	},
	critical: {
		label: "Critical",
		color: "#e74c3c"
	}
};
var severityConfig = {
	low: {
		label: "Low",
		color: "#27ae60"
	},
	moderate: {
		label: "Moderate",
		color: "#f39c12"
	},
	high: {
		label: "High",
		color: "#e67e22"
	},
	critical: {
		label: "Critical",
		color: "#e74c3c"
	}
};
var TOOLTIP_STYLE = {
	backgroundColor: "var(--surface-elevated)",
	border: "1px solid var(--glass-border)",
	borderRadius: "10px",
	fontSize: "12px",
	boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
};
function AnalyticsPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getAnalyticsData(city).then(setData).finally(() => setLoading(false));
	}, [city]);
	if (loading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading analytics..." });
	const totalDeptReports = data.departmentDistribution.reduce((s, d) => s + d.value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.city_analytics") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "jm-glitch-text mt-2 text-2xl font-semibold",
				children: t("ui.trends_and_distribution_insigh")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("ui.prototype_intelligence_data")
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.complaint_volume_trend") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: complaintConfig,
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: data.complaintTrend,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "analyticsTotalFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#1abc9c",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#1abc9c",
										stopOpacity: .02
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false,
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									width: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
									content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}),
									contentStyle: TOOLTIP_STYLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "total",
									stroke: "#1abc9c",
									fill: "url(#analyticsTotalFill)",
									strokeWidth: 2.5,
									animationDuration: 1400,
									dot: {
										r: 3,
										fill: "#1abc9c",
										stroke: "#fff",
										strokeWidth: 1.5
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "critical",
									stroke: "#e74c3c",
									strokeWidth: 2,
									dot: {
										r: 3,
										fill: "#e74c3c"
									},
									animationDuration: 1400
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.severity_distribution") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: severityConfig,
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data.severityTrend,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false,
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									width: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
									content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}),
									contentStyle: TOOLTIP_STYLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "low",
									stackId: "a",
									fill: "#27ae60",
									radius: [
										0,
										0,
										0,
										0
									],
									animationDuration: 1200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "moderate",
									stackId: "a",
									fill: "#f39c12",
									animationDuration: 1200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "high",
									stackId: "a",
									fill: "#e67e22",
									animationDuration: 1200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "critical",
									stackId: "a",
									fill: "#e74c3c",
									radius: [
										4,
										4,
										0,
										0
									],
									animationDuration: 1200
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.department_workload") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { value: { label: "Complaints" } },
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }),
								contentStyle: TOOLTIP_STYLE
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconType: "circle",
								iconSize: 8,
								wrapperStyle: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
								data: data.departmentDistribution,
								dataKey: "value",
								nameKey: "name",
								cx: "50%",
								cy: "50%",
								innerRadius: 65,
								outerRadius: 100,
								paddingAngle: 2,
								animationDuration: 1500,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									value: totalDeptReports,
									position: "center",
									style: {
										fontSize: 22,
										fontWeight: 700,
										fill: "var(--foreground)"
									}
								}), data.departmentDistribution.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: DEPT_COLORS[i % DEPT_COLORS.length],
									stroke: "var(--background)",
									strokeWidth: 2
								}, i))]
							})
						] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.category_distribution") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { value: {
							label: "Reports",
							color: "#3498db"
						} },
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data.categoryDistribution,
							layout: "vertical",
							margin: {
								top: 8,
								right: 48,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									horizontal: false,
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									tickLine: false,
									axisLine: false,
									width: 72,
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
									content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }),
									contentStyle: TOOLTIP_STYLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bar, {
									dataKey: "value",
									radius: [
										0,
										4,
										4,
										0
									],
									animationDuration: 1200,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
										dataKey: "value",
										position: "right",
										style: {
											fill: "var(--muted-foreground)",
											fontSize: 11
										}
									}), data.categoryDistribution.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: DEPT_COLORS[i % DEPT_COLORS.length] }, i))]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.emerging_issues_trend") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { count: {
							label: "Issues",
							color: "#9b59b6"
						} },
						className: "mt-4 h-[220px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: data.emergingTrend,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "emergingFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#9b59b6",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#9b59b6",
										stopOpacity: .02
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false,
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									width: 30
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
									content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}),
									contentStyle: TOOLTIP_STYLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "count",
									stroke: "#9b59b6",
									strokeWidth: 2.5,
									fill: "url(#emergingFill)",
									dot: {
										r: 4,
										fill: "#9b59b6",
										stroke: "#fff",
										strokeWidth: 2
									},
									activeDot: {
										r: 7,
										fill: "#9b59b6",
										stroke: "#fff",
										strokeWidth: 2
									},
									animationDuration: 1400
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.average_response_time_days") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { days: {
							label: "Days",
							color: "#f39c12"
						} },
						className: "mt-4 h-[220px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: data.responseTime,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false,
									stroke: "rgba(255,255,255,0.06)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									width: 30,
									domain: ["auto", "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
									content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}),
									contentStyle: TOOLTIP_STYLE
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: 7,
									stroke: "#e74c3c",
									strokeDasharray: "4 4",
									label: {
										value: "SLA Target",
										fill: "#e74c3c",
										fontSize: 10
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "days",
									stroke: "#f39c12",
									strokeWidth: 2.5,
									dot: {
										r: 4,
										fill: "#f39c12",
										stroke: "#fff",
										strokeWidth: 2
									},
									activeDot: {
										r: 7,
										fill: "#f39c12",
										stroke: "#fff",
										strokeWidth: 2
									},
									animationDuration: 1400
								})
							]
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { AnalyticsPage as component };
