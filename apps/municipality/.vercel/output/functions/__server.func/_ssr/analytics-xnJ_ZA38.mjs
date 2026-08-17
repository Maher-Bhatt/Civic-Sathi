import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as useMuniAuth, w as getAnalyticsData } from "./router-Cd9GNziQ.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, i as LineChart, l as CartesianGrid, n as PieChart, o as XAxis, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { n as ChartTooltip, r as ChartTooltipContent, t as ChartContainer } from "./chart-C5d9m3zh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-xnJ_ZA38.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var complaintConfig = {
	total: {
		label: "Total",
		color: "var(--color-chart-1)"
	},
	critical: {
		label: "Critical",
		color: "var(--color-chart-4)"
	}
};
var severityConfig = {
	low: {
		label: "Low",
		color: AREA_HEALTH_HEX.low
	},
	moderate: {
		label: "Moderate",
		color: AREA_HEALTH_HEX.moderate
	},
	high: {
		label: "High",
		color: AREA_HEALTH_HEX.high
	},
	critical: {
		label: "Critical",
		color: AREA_HEALTH_HEX.critical
	}
};
var PIE_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
	AREA_HEALTH_HEX.moderate
];
function AnalyticsPage() {
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getAnalyticsData(city).then(setData).finally(() => setLoading(false));
	}, [city]);
	if (loading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading analytics..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "City Analytics" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "jm-glitch-text mt-2 text-2xl font-semibold",
				children: "Trends and distribution insights"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Prototype Intelligence Data"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Complaint Volume Trend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
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
									id: "muniVolFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-chart-1)",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-chart-1)",
										stopOpacity: .02
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "total",
									stroke: "var(--color-chart-1)",
									fill: "url(#muniVolFill)",
									strokeWidth: 2,
									animationDuration: 1400
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "critical",
									stroke: "var(--color-chart-4)",
									strokeWidth: 2,
									dot: false,
									animationDuration: 1400
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Severity Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
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
									vertical: false
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "low",
									stackId: "a",
									fill: AREA_HEALTH_HEX.low,
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
									fill: AREA_HEALTH_HEX.moderate,
									animationDuration: 1200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "high",
									stackId: "a",
									fill: AREA_HEALTH_HEX.high,
									animationDuration: 1200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "critical",
									stackId: "a",
									fill: AREA_HEALTH_HEX.critical,
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Department Workload" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { value: { label: "Complaints" } },
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: data.departmentDistribution,
							dataKey: "value",
							nameKey: "name",
							cx: "50%",
							cy: "50%",
							innerRadius: 60,
							outerRadius: 90,
							paddingAngle: 2,
							animationDuration: 1500,
							children: data.departmentDistribution.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
						})] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Category Distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { value: {
							label: "Reports",
							color: "var(--color-chart-1)"
						} },
						className: "mt-4 h-[260px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data.categoryDistribution,
							layout: "vertical",
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									horizontal: false
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "var(--color-chart-1)",
									radius: [
										0,
										4,
										4,
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Emerging Issues Trend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { count: {
							label: "Issues",
							color: "var(--color-chart-1)"
						} },
						className: "mt-4 h-[220px] w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: data.emergingTrend,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "count",
									stroke: "var(--color-count)",
									strokeWidth: 2,
									dot: { r: 3 },
									animationDuration: 1400
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-chart-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Average Response Time (days)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
						config: { days: {
							label: "Days",
							color: "var(--color-chart-3)"
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
									vertical: false
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "days",
									stroke: "var(--color-days)",
									strokeWidth: 2,
									dot: { r: 3 },
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
