import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { h as Radar } from "../_libs/lucide-react.mjs";
import { a as ISSUE_LABEL, t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, n as PieChart, o as XAxis, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { n as ChartTooltip, r as ChartTooltipContent, t as ChartContainer } from "./chart-C5d9m3zh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/civic-charts-O2QBcZrN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CivicMap = (0, import_react.lazy)(() => import("./civic-map-Cpas3Q-c.mjs").then((m) => ({ default: m.CivicMap })));
function MapSkeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]", className),
		role: "status",
		"aria-label": "Loading civic map",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "jm-map-scan absolute inset-0 opacity-40",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
				className: "h-4 w-4 animate-spin text-primary",
				"aria-hidden": true
			}), "Initializing map"]
		})]
	});
}
/** Browser-only wrapper — Leaflet never loads during SSR. */
function ClientCivicMap(props) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSkeleton, { className: props.className }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicMap, { ...props })
	});
}
var trendConfig = { reports: {
	label: "Reports",
	color: "var(--color-chart-1)"
} };
var issueConfig = { count: {
	label: "Reports",
	color: "var(--color-chart-1)"
} };
function AnimatedStat({ value, className, duration = 900 }) {
	const [display, setDisplay] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const start = performance.now();
		const tick = (now) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - t) ** 3;
			setDisplay(Math.round(value * eased));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [value, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("jm-stat-pop tabular-nums", className),
		children: display
	});
}
function ActivityTrendChart({ data, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
		config: trendConfig,
		className: cn("h-[180px] w-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				top: 8,
				right: 8,
				left: -18,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "muniTrendFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-chart-1)",
						stopOpacity: .45
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-chart-1)",
						stopOpacity: .02
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "day",
					tickLine: false,
					axisLine: false,
					tickMargin: 8
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickLine: false,
					axisLine: false,
					tickMargin: 4,
					width: 28
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "reports",
					stroke: "var(--color-chart-1)",
					strokeWidth: 2.5,
					fill: "url(#muniTrendFill)",
					animationDuration: 1400,
					animationEasing: "ease-out",
					dot: {
						r: 3,
						fill: "var(--color-chart-1)",
						strokeWidth: 0
					},
					activeDot: {
						r: 6,
						strokeWidth: 2,
						stroke: "var(--background)"
					}
				})
			]
		})
	});
}
function IssueBreakdownChart({ data, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
		config: issueConfig,
		className: cn("h-[200px] w-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			layout: "vertical",
			margin: {
				top: 4,
				right: 8,
				left: 4,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					horizontal: false,
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					type: "number",
					hide: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					type: "category",
					dataKey: "label",
					tickLine: false,
					axisLine: false,
					width: 88,
					tick: { fontSize: 10 }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "count",
					radius: [
						0,
						6,
						6,
						0
					],
					animationDuration: 1200,
					animationEasing: "ease-out",
					children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						fill: d.fill,
						className: "jm-bar-cell"
					}, d.issue))
				})
			]
		})
	});
}
function HealthPieChart({ data, className }) {
	const pieConfig = Object.fromEntries(data.map((d) => [d.health, {
		label: d.label,
		color: d.fill
	}]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
		config: pieConfig,
		className: cn("mx-auto h-[200px] w-full max-w-[220px]", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
			data,
			dataKey: "count",
			nameKey: "label",
			innerRadius: 52,
			outerRadius: 78,
			paddingAngle: 3,
			animationDuration: 1500,
			animationEasing: "ease-out",
			children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				fill: d.fill,
				stroke: "transparent"
			}, d.health))
		})] })
	});
}
function AreaMiniCharts({ activity }) {
	const issueData = Object.entries(activity.counts).filter(([, n]) => n > 0).map(([issue, count]) => ({
		issue,
		label: ISSUE_LABEL[issue],
		count,
		fill: AREA_HEALTH_HEX[activity.health]
	}));
	if (issueData.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3 border-t border-border pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs",
			children: "Issue mix in this locality"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueBreakdownChart, {
			data: issueData,
			className: "h-[140px]"
		})]
	});
}
//#endregion
export { HealthPieChart as a, ClientCivicMap as i, AnimatedStat as n, IssueBreakdownChart as o, AreaMiniCharts as r, ActivityTrendChart as t };
