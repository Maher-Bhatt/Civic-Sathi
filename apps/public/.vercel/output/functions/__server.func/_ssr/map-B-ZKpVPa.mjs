import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { D as Info, I as Crosshair, d as Search, p as RotateCcw, q as ArrowUpRight, t as X, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as nearestCity, o as getCity, s as getDefaultCity, u as setPreferredCity } from "./cities-J8wcazPB.mjs";
import { D as useI18n, E as cn, c as GlassButton, d as SectionLabel, l as GlassCard, u as PageShell } from "./router-DCSYOt5b.mjs";
import { _ as complaintPoints, a as DEFAULT_FILTERS, b as nearestArea, c as TIME_WINDOWS, f as cityDailyTrend, h as cityIssueBreakdown, i as ClientCivicMap, l as areaActivity, m as cityHealthDistribution, n as AREA_HEALTH_LABEL, o as ISSUE_KEYS, p as cityGeography, r as AREA_HEALTH_ORDER, s as ISSUE_LABEL, t as AREA_HEALTH_HEX, u as areaDailyTrend, v as filterPoints, x as searchAreas, y as getLocalityHeritage } from "./civic-map-panel-GXeabTLk.mjs";
import { a as XAxis, c as Bar, d as Cell, f as ResponsiveContainer, i as YAxis, l as Pie, m as Legend, n as PieChart, o as Area, p as Tooltip, r as BarChart, s as CartesianGrid, t as AreaChart, u as LabelList } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-B-ZKpVPa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = {
	light: "",
	dark: ".dark"
};
var ChartContext = import_react.createContext(null);
function useChart() {
	const context = import_react.useContext(ChartContext);
	if (!context) throw new Error("useChart must be used within a <ChartContainer />");
	return context;
}
var ChartContainer = import_react.forwardRef(({ id, className, children, config, ...props }, ref) => {
	const uniqueId = import_react.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContext.Provider, {
		value: { config },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-chart": chartId,
			ref,
			className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className),
			...props,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartStyle, {
				id: chartId,
				config
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children })]
		})
	});
});
ChartContainer.displayName = "Chart";
var ChartStyle = ({ id, config }) => {
	const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);
	if (!colorConfig.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme] || itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	}).join("\n")}
}
`).join("\n") } });
};
var ChartTooltip = Tooltip;
var ChartTooltipContent = import_react.forwardRef(({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }, ref) => {
	const { config } = useChart();
	const tooltipLabel = import_react.useMemo(() => {
		if (hideLabel || !payload?.length) return null;
		const [item] = payload;
		const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
		const itemConfig = getPayloadConfigFromPayload(config, item, key);
		const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
		if (labelFormatter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: labelFormatter(value, payload)
		});
		if (!value) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: value
		});
	}, [
		label,
		labelFormatter,
		payload,
		hideLabel,
		labelClassName,
		config,
		labelKey
	]);
	if (!active || !payload?.length) return null;
	const nestLabel = payload.length === 1 && indicator !== "dot";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className),
		children: [!nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-1.5",
			children: payload.filter((item) => item.type !== "none").map((item, index) => {
				const key = `${nameKey || item.name || item.dataKey || "value"}`;
				const itemConfig = getPayloadConfigFromPayload(config, item, key);
				const indicatorColor = color || item.payload.fill || item.color;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center"),
					children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [itemConfig?.icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": indicator === "dot",
							"w-1": indicator === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
							"my-0.5": nestLabel && indicator === "dashed"
						}),
						style: {
							"--color-bg": indicatorColor,
							"--color-border": indicatorColor
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: itemConfig?.label || item.name
							})]
						}), item.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium tabular-nums text-foreground",
							children: item.value.toLocaleString("en-IN")
						})]
					})] })
				}, item.dataKey);
			})
		})]
	});
});
ChartTooltipContent.displayName = "ChartTooltip";
var ChartLegendContent = import_react.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
	const { config } = useChart();
	if (!payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
		children: payload.filter((item) => item.type !== "none").map((item) => {
			const key = `${nameKey || item.dataKey || "value"}`;
			const itemConfig = getPayloadConfigFromPayload(config, item, key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
				children: [itemConfig?.icon && !hideIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-2 shrink-0 rounded-[2px]",
					style: { backgroundColor: item.color }
				}), itemConfig?.label]
			}, item.value);
		})
	});
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
	if (typeof payload !== "object" || payload === null) return;
	const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
	let configLabelKey = key;
	if (key in payload && typeof payload[key] === "string") configLabelKey = payload[key];
	else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") configLabelKey = payloadPayload[key];
	return configLabelKey in config ? config[configLabelKey] : config[key];
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
					id: "jmTrendFill",
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
					fill: "url(#jmTrendFill)",
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
var MODES = [
	{
		key: "health",
		label: "Area health",
		hint: "Aggregate civic health per locality"
	},
	{
		key: "activity",
		label: "Complaint activity",
		hint: "Clustered reports — separates as you zoom"
	},
	{
		key: "hotspots",
		label: "Hotspots",
		hint: "Concentrated issue areas with trend and risk"
	}
];
function Chip({ active, children, ...props }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		className: cn("press shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200", active ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"),
		...props,
		children
	});
}
function CivicMapPage() {
	const { t } = useI18n();
	const [cityId, setCityId] = (0, import_react.useState)(() => getDefaultCity());
	const [mode, setMode] = (0, import_react.useState)("health");
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [locationNote, setLocationNote] = (0, import_react.useState)(null);
	const searchRef = (0, import_react.useRef)(null);
	const handleCityChange = (c) => {
		setCityId(c);
		setPreferredCity(c);
	};
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !navigator.geolocation) return;
		try {
			if (!localStorage.getItem("janmind_preferred_city")) navigator.geolocation.getCurrentPosition((pos) => {
				const nearest = nearestCity(pos.coords.latitude, pos.coords.longitude);
				if (nearest && nearest.id !== cityId) setCityId(nearest.id);
			}, () => {}, {
				timeout: 4e3,
				maximumAge: 6e4
			});
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) setQuery("");
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const geography = cityGeography(cityId);
	const activities = (0, import_react.useMemo)(() => areaActivity(cityId, filters), [cityId, filters]);
	const points = (0, import_react.useMemo)(() => filterPoints(complaintPoints(cityId), filters), [cityId, filters]);
	const ranked = (0, import_react.useMemo)(() => [...activities].sort((a, b) => b.total - a.total), [activities]);
	const hotspots = (0, import_react.useMemo)(() => ranked.filter((a) => a.hotspot).slice(0, 6), [ranked]);
	const selectedArea = activities.find((a) => a.area.id === selected) ?? null;
	const suggestions = (0, import_react.useMemo)(() => searchAreas(cityId, query), [cityId, query]);
	const totals = (0, import_react.useMemo)(() => ({
		reports: activities.reduce((n, a) => n + a.total, 0),
		last7: activities.reduce((n, a) => n + a.last7, 0),
		areas: activities.length,
		affectedPeople: activities.reduce((n, a) => n + (a.affectedPopulation || 0), 0)
	}), [activities]);
	const trendData = (0, import_react.useMemo)(() => cityDailyTrend(cityId, filters), [cityId, filters]);
	const issueData = (0, import_react.useMemo)(() => cityIssueBreakdown(cityId, filters), [cityId, filters]);
	const healthData = (0, import_react.useMemo)(() => cityHealthDistribution(cityId, filters), [cityId, filters]);
	const areaTrend = (0, import_react.useMemo)(() => selectedArea ? areaDailyTrend(selectedArea.area.id, filters) : [], [selectedArea, filters]);
	(0, import_react.useEffect)(() => {
		setSelected(null);
		setQuery("");
		setFocus(null);
		setLocationNote(null);
	}, [cityId]);
	const goToArea = (areaId) => {
		const a = activities.find((x) => x.area.id === areaId);
		if (!a) return;
		setSelected(areaId);
		setFocus({
			lat: a.area.center[0],
			lng: a.area.center[1],
			zoom: 14
		});
	};
	const nearMe = () => {
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			setLocationNote("Location is not available in this browser.");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			setLocating(false);
			const { latitude, longitude } = pos.coords;
			const city = nearestCity(latitude, longitude);
			if (city.id !== cityId) setCityId(city.id);
			const area = nearestArea(city.id, latitude, longitude);
			setFocus({
				lat: latitude,
				lng: longitude,
				zoom: 14
			});
			if (area) {
				setTimeout(() => setSelected(area.id), 60);
				setLocationNote(`Nearest mapped locality: ${area.name}, ${city.name}.`);
			}
		}, () => {
			setLocating(false);
			setLocationNote("Location permission denied — pick a locality from search instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 1e4
		});
	};
	const reset = () => {
		setFilters(DEFAULT_FILTERS);
		setMode("health");
		setSelected(null);
		setQuery("");
		setFocus(null);
		setLocationNote(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "pt-24 sm:pt-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise jm-hero-glow space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.public_civic_intelligence") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "jm-glitch-text text-2xl font-semibold sm:text-3xl",
						children: t("ui.civic_map")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-2xl text-sm text-muted-foreground",
						children: [
							getCity(cityId).name,
							" ",
							t("ui.by_locality_coloured_by_aggreg")
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleCityChange("vadodara"),
								"aria-pressed": cityId === "vadodara",
								className: cn("press flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm", cityId === "vadodara" ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vadodara (VMC)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-normal opacity-75",
										children: "· 24 Areas (5 Zones)"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleCityChange("bengaluru"),
								"aria-pressed": cityId === "bengaluru",
								className: cn("press flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm", cityId === "bengaluru" ? "border-blue-500/50 bg-blue-500/15 text-blue-800 dark:text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-blue-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bengaluru (BBMP)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-normal opacity-75",
										children: "· 35 Areas (8 Zones)"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto text-[0.7rem] text-muted-foreground hidden sm:inline-block",
								children: cityId === "vadodara" ? "Vadodara Municipal Scale (Normalized)" : "Bengaluru Metropolitan Scale"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "tablist",
							"aria-label": t("ui.map_mode"),
							className: "inline-flex gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-1 backdrop-blur-md",
							children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": mode === m.key,
								title: m.hint,
								onClick: () => setMode(m.key),
								className: cn("press rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition-all duration-200", mode === m.key ? "jm-mode-active bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:text-foreground"),
								children: m.label
							}, m.key))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							ref: searchRef,
							className: "relative w-full sm:max-w-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-subtle",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "search",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: `Search area in ${getCity(cityId).name}`,
									"aria-label": t("ui.search_area_or_locality"),
									className: "glass h-11 w-full rounded-xl border border-[var(--glass-border)] pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-subtle focus:border-[color-mix(in_oklab,var(--foreground)_25%,transparent)]"
								}),
								suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lift)] backdrop-blur-2xl",
									children: suggestions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											goToArea(a.id);
											setQuery("");
										},
										className: "press flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[var(--glass)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: a.name
										}), a.admin.division && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.64rem] tracking-[0.08em] text-subtle uppercase",
											children: a.admin.division
										})]
									}) }, a.id))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "glass",
								size: "sm",
								onClick: nearMe,
								"aria-busy": locating,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, {
									className: cn("h-3.5 w-3.5", locating && "animate-pulse"),
									"aria-hidden": true
								}), t("ui.near_me")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "ghost",
								size: "sm",
								onClick: reset,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "h-3.5 w-3.5",
									"aria-hidden": true
								}), t("ui.reset")]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: filters.issue === "all",
								onClick: () => setFilters((f) => ({
									...f,
									issue: "all"
								})),
								children: t("ui.all_issues")
							}), ISSUE_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: filters.issue === k,
								onClick: () => setFilters((f) => ({
									...f,
									issue: k
								})),
								children: ISSUE_LABEL[k]
							}, k))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "-mx-4 flex flex-wrap items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										active: filters.health === "all",
										onClick: () => setFilters((f) => ({
											...f,
											health: "all"
										})),
										children: t("ui.any_severity")
									}), AREA_HEALTH_ORDER.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
										active: filters.health === h,
										onClick: () => setFilters((f) => ({
											...f,
											health: h
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
											style: { background: AREA_HEALTH_HEX[h] },
											"aria-hidden": true
										}), AREA_HEALTH_LABEL[h]]
									}, h))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-4 w-px bg-[var(--glass-border)]",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1",
									children: TIME_WINDOWS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										active: filters.time === w.key,
										onClick: () => setFilters((f) => ({
											...f,
											time: w.key
										})),
										children: w.label
									}, w.key))
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid items-start gap-5 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCivicMap, {
								cityId,
								mode,
								activities,
								points,
								selectedAreaId: selected,
								onSelectArea: (id) => setSelected(id),
								focus,
								className: "h-[480px] sm:h-[580px]"
							})
						}),
						locationNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: locationNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "jm-stat-card animate-rise p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-semibold tabular-nums text-[var(--foreground)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: totals.reports })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[0.66rem] tracking-[0.08em] text-muted-foreground uppercase",
										children: "Reports in view"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "jm-stat-card animate-rise p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-semibold tabular-nums text-[var(--foreground)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: totals.last7 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[0.66rem] tracking-[0.08em] text-muted-foreground uppercase",
										children: "Last 7 days"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "jm-stat-card animate-rise p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-semibold tabular-nums text-[var(--foreground)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: totals.areas })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[0.66rem] tracking-[0.08em] text-muted-foreground uppercase",
										children: "Localities mapped"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
									className: "jm-stat-card animate-rise p-3 border-blue-500/30 bg-blue-500/5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-lg font-bold tabular-nums text-blue-700 dark:text-blue-400",
										children: ["~", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: totals.affectedPeople })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[0.66rem] tracking-[0.08em] text-blue-700 dark:text-blue-300 font-medium uppercase",
										children: "Citizens Affected"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "jm-chart-card animate-rise p-4",
								style: { animationDelay: "120ms" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.7_day_activity_pulse") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTrendChart, {
									data: trendData,
									className: "mt-2"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
								className: "jm-chart-card animate-rise p-4",
								style: { animationDelay: "200ms" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.issue_breakdown") }), issueData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueBreakdownChart, {
									data: issueData,
									className: "mt-2"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-sm text-muted-foreground",
									children: t("ui.no_data_under_current_filters")
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								className: "mt-0.5 h-3.5 w-3.5 shrink-0",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								geography.dataNote,
								" ",
								t("ui.shaded_polygons_are_an_approxi")
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								className: "mt-0.5 h-3.5 w-3.5 shrink-0",
								"aria-hidden": true
							}), t("ui.aggregate_view_only_no_names_c")]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden space-y-4 lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "jm-chart-card animate-rise p-4",
						style: { animationDelay: "80ms" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.severity_distribution") }), healthData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthPieChart, { data: healthData }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: t("ui.no_data_under_current_filters")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "animate-rise p-4",
						style: { animationDelay: "160ms" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: mode === "hotspots" ? "Active hotspots" : "Most active areas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1",
							children: [(mode === "hotspots" ? hotspots : ranked.slice(0, 10)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => goToArea(a.area.id),
								className: cn("press flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors", selected === a.area.id ? "bg-[var(--surface-elevated)]" : "hover:bg-[var(--glass)]"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 shrink-0 rounded-[3px]",
										style: { background: AREA_HEALTH_HEX[a.health] },
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm",
											children: a.area.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[0.66rem] tracking-[0.08em] text-subtle uppercase",
											children: [
												AREA_HEALTH_LABEL[a.health],
												" · ~",
												(a.affectedPopulation || 0).toLocaleString("en-IN"),
												" affected"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: a.total
									})
								]
							}) }, a.area.id)), mode === "hotspots" && hotspots.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-2.5 py-2 text-sm text-muted-foreground",
								children: t("ui.no_hotspots_under_the_current_")
							})]
						})]
					})]
				})]
			}),
			selectedArea && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaPanel, {
				activity: selectedArea,
				trendData: areaTrend,
				onClose: () => setSelected(null)
			})
		]
	});
}
function AreaPanel({ activity, trendData, onClose }) {
	const { t } = useI18n();
	const { area } = activity;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-rise jm-panel-enter fixed inset-x-0 bottom-14 z-40 px-3 sm:static sm:mt-5 sm:px-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			elevation: "raised",
			className: "jm-panel-glow max-h-[72vh] overflow-y-auto p-4 sm:max-h-none sm:p-5",
			"aria-label": `${area.name} civic detail`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "label-xs",
								style: { color: AREA_HEALTH_HEX[activity.health] },
								children: [
									AREA_HEALTH_LABEL[activity.health],
									" ",
									t("ui.civic_activity")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 truncate text-lg font-semibold",
								children: area.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-[0.7rem] text-subtle",
								children: [
									area.admin.body,
									area.admin.bodyVerified ? " · verified" : "",
									area.admin.division ? ` · ${area.admin.division}${area.admin.divisionVerified ? "" : " (indicative)"}` : ""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("ui.close_area_details"),
						onClick: onClose,
						className: "press -mt-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-subtle hover:bg-[var(--glass)] hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs text-muted-foreground",
								children: t("ui.reports")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-base font-semibold tabular-nums",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: activity.total })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs text-muted-foreground",
								children: "Ward Population"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-base font-semibold tabular-nums text-[var(--foreground)]",
								children: ["~", (area.population || 8e4).toLocaleString("en-IN")]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs text-blue-700 dark:text-blue-300 font-medium",
								children: "Citizens Affected"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-base font-bold text-blue-700 dark:text-blue-400 tabular-nums",
								children: [
									"~",
									(activity.affectedPopulation || 0).toLocaleString("en-IN"),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-normal opacity-80 ml-1",
										children: [
											"(",
											activity.affectedPercent,
											"%)"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs text-muted-foreground",
								children: "Impact Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs font-bold",
								style: { color: AREA_HEALTH_HEX[activity.health] },
								children: activity.impactLevel
							})]
						})
					]
				}),
				trendData.some((d) => d.reports > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: t("ui.local_7_day_trend")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTrendChart, {
						data: trendData,
						className: "mt-2 h-[120px]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaMiniCharts, { activity }),
				getLocalityHeritage(area.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/10 border border-orange-500/25 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏛️ Locality Historic & Civic Heritage" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-foreground/85 leading-relaxed",
						children: getLocalityHeritage(area.id)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: t("ui.recent_activity")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1.5",
						children: [activity.recent.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { background: AREA_HEALTH_HEX[r.health] },
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1 truncate",
									children: [
										ISSUE_LABEL[r.issue],
										" ",
										t("ui.reported")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: r.daysAgo === 0 ? "today" : `${r.daysAgo}d ago`
								})
							]
						}, i)), activity.recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: t("ui.no_reports_under_these_filters")
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[0.68rem] leading-relaxed text-subtle",
					children: t("ui.approximate_civic_activity_are")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/report",
							children: [t("ui.report_an_issue_here"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						variant: "glass",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/complaints",
							children: t("ui.view_complaints")
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { CivicMapPage as component };
