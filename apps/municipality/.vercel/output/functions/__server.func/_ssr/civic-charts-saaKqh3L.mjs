import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { u as useI18n } from "./router-BGmfNoyd.mjs";
import { h as Radar } from "../_libs/lucide-react.mjs";
import { a as ISSUE_LABEL, t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
import { a as YAxis, d as Bar, f as Pie, h as Cell, l as CartesianGrid, n as PieChart, o as XAxis, p as LabelList, r as BarChart, s as Area, t as AreaChart, v as Legend } from "../_libs/recharts+[...].mjs";
import { n as ChartTooltip, r as ChartTooltipContent, t as ChartContainer } from "./chart-CQNgxI-x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/civic-charts-saaKqh3L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CivicMap = (0, import_react.lazy)(() => import("./civic-map-CmcGLuL0.mjs").then((m) => ({ default: m.CivicMap })));
function MapSkeleton({ className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]", className),
		role: "status",
		"aria-label": t("ui.loading_civic_map"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "jm-map-scan absolute inset-0 opacity-40",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
				className: "h-4 w-4 animate-spin text-primary",
				"aria-hidden": true
			}), t("ui.initializing_map")]
		})]
	});
}
/** Browser-only wrapper — Leaflet never loads during SSR. */
function ClientCivicMap(props) {
	const { t } = useI18n();
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
	color: "#1abc9c"
} };
var issueConfig = { count: {
	label: "Reports",
	color: "var(--color-chart-1)"
} };
function AnimatedStat({ value, className, duration = 900 }) {
	const { t } = useI18n();
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
	const { t } = useI18n();
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#1abc9c",
							stopOpacity: .45
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "50%",
							stopColor: "#1abc9c",
							stopOpacity: .2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#1abc9c",
							stopOpacity: .02
						})
					]
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}),
					contentStyle: {
						backgroundColor: "var(--surface-elevated)",
						border: "1px solid var(--glass-border)",
						borderRadius: "10px",
						boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "reports",
					stroke: "#1abc9c",
					strokeWidth: 3,
					fill: "url(#muniTrendFill)",
					animationDuration: 1400,
					animationEasing: "ease-out",
					dot: {
						r: 4,
						fill: "#1abc9c",
						stroke: "#fff",
						strokeWidth: 2
					},
					activeDot: {
						r: 8,
						fill: "#1abc9c",
						stroke: "#fff",
						strokeWidth: 2
					}
				})
			]
		})
	});
}
function IssueBreakdownChart({ data, className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
		config: issueConfig,
		className: cn("h-[220px] w-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			layout: "vertical",
			margin: {
				top: 4,
				right: 48,
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }),
					contentStyle: {
						backgroundColor: "var(--surface-elevated)",
						border: "1px solid var(--glass-border)",
						borderRadius: "10px",
						boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bar, {
					dataKey: "count",
					radius: [
						0,
						6,
						6,
						0
					],
					animationDuration: 1200,
					animationEasing: "ease-out",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
						dataKey: "count",
						position: "right",
						style: {
							fill: "var(--muted-foreground)",
							fontSize: 10
						}
					}), data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						fill: d.fill,
						className: "jm-bar-cell"
					}, d.issue))]
				})
			]
		})
	});
}
function HealthPieChart({ data, className }) {
	const { t } = useI18n();
	const pieConfig = Object.fromEntries(data.map((d) => [d.health, {
		label: d.label,
		color: d.fill
	}]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
		config: pieConfig,
		className: cn("mx-auto h-[200px] w-full max-w-[280px]", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {
				content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }),
				contentStyle: {
					backgroundColor: "var(--surface-elevated)",
					border: "1px solid var(--glass-border)",
					borderRadius: "10px",
					boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				formatter: (value) => {
					const entry = data.find((d) => d.health === value);
					return entry ? `${entry.label} (${entry.count})` : value;
				},
				iconType: "circle",
				iconSize: 8,
				wrapperStyle: { fontSize: 10 }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data,
				dataKey: "count",
				nameKey: "health",
				innerRadius: 60,
				outerRadius: 90,
				paddingAngle: 3,
				animationDuration: 1500,
				animationEasing: "ease-out",
				children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					fill: d.fill,
					stroke: "var(--background)",
					strokeWidth: 2
				}, d.health))
			})
		] })
	});
}
function AreaMiniCharts({ activity }) {
	const { t } = useI18n();
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
			children: t("ui.issue_mix_in_this_locality")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueBreakdownChart, {
			data: issueData,
			className: "h-[140px]"
		})]
	});
}
//#endregion
export { HealthPieChart as a, ClientCivicMap as i, AnimatedStat as n, IssueBreakdownChart as o, AreaMiniCharts as r, ActivityTrendChart as t };
