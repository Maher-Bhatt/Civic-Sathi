import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as getCivicIssues, l as useMuniAuth, u as useI18n } from "./router-BQGJ9DUB.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { O as Funnel, m as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as ISSUE_LABEL, i as ISSUE_KEYS, n as AREA_HEALTH_LABEL, r as AREA_HEALTH_ORDER, t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
import { i as areaDailyTrend, n as TIME_WINDOWS, o as cityDailyTrend, r as areaActivity, s as cityHealthDistribution, t as DEFAULT_FILTERS, u as filterPoints } from "./geography-DzWCmPpr.mjs";
import { n as DEFAULT_COMPLAINT_FILTERS } from "./types-CjX07JOU.mjs";
import { t as FilterDrawer } from "./filter-drawer-Baq_foyh.mjs";
import { a as HealthPieChart, i as ClientCivicMap, n as AnimatedStat, r as AreaMiniCharts, t as ActivityTrendChart } from "./civic-charts-iWMl_-S7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-7NZEJjWB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		key: "health",
		label: "Area Health"
	},
	{
		key: "activity",
		label: "Complaint Activity"
	},
	{
		key: "hotspots",
		label: "Hotspots"
	}
];
function Chip({ active, children, ...props }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		className: cn("press shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200", active ? "border-[color-mix(in_oklab,var(--foreground)_22%,transparent)] bg-[var(--surface-elevated)] text-foreground" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:text-foreground"),
		...props,
		children
	});
}
function MuniMapPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [mode, setMode] = (0, import_react.useState)("health");
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const [selectedAreaId, setSelectedAreaId] = (0, import_react.useState)(null);
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	const [complaintFilters, setComplaintFilters] = (0, import_react.useState)(DEFAULT_COMPLAINT_FILTERS);
	const [civicIssues, setCivicIssues] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getCivicIssues().then(setCivicIssues);
	}, []);
	const allPoints = (0, import_react.useMemo)(() => {
		return civicIssues.map((ci) => {
			let issue = "other";
			const cat = (ci.category || "").toLowerCase();
			if (cat.includes("water")) issue = "water";
			else if (cat.includes("road") || cat.includes("pothole")) issue = "roads";
			else if (cat.includes("garbage") || cat.includes("waste")) issue = "garbage";
			else if (cat.includes("drainage")) issue = "drainage";
			else if (cat.includes("light")) issue = "lighting";
			let health = "low";
			const sev = (ci.severity || "").toLowerCase();
			if (sev === "critical") health = "critical";
			else if (sev === "high") health = "high";
			else if (sev === "moderate") health = "moderate";
			return {
				id: String(ci.id),
				areaId: String(ci.area || ""),
				issue,
				health,
				daysAgo: 0,
				lat: Number(ci.lat) || 0,
				lng: Number(ci.lng) || 0
			};
		});
	}, [civicIssues]);
	const activities = (0, import_react.useMemo)(() => areaActivity(city, filters, allPoints), [
		city,
		filters,
		allPoints
	]);
	const points = (0, import_react.useMemo)(() => filterPoints(allPoints, filters), [allPoints, filters]);
	const selected = activities.find((a) => a.area.id === selectedAreaId);
	const trendData = (0, import_react.useMemo)(() => cityDailyTrend(city, filters, allPoints), [
		city,
		filters,
		allPoints
	]);
	const healthData = (0, import_react.useMemo)(() => cityHealthDistribution(city, filters, allPoints), [
		city,
		filters,
		allPoints
	]);
	const areaTrend = (0, import_react.useMemo)(() => selected ? areaDailyTrend(selected.area.id, filters, allPoints) : [], [
		selected,
		filters,
		allPoints
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.civic_map") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "jm-glitch-text mt-1 text-2xl font-semibold",
					children: t("ui.city_wide_operational_view")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFilterOpen(true),
					className: "press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), t("ui.filters")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: mode === m.key,
						onClick: () => setMode(m.key),
						children: m.label
					}, m.key)),
					TIME_WINDOWS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: filters.time === w.key,
						onClick: () => setFilters((f) => ({
							...f,
							time: w.key
						})),
						children: w.label
					}, w.key)),
					ISSUE_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: filters.issue === k,
						onClick: () => setFilters((f) => ({
							...f,
							issue: f.issue === k ? "all" : k
						})),
						children: ISSUE_LABEL[k]
					}, k))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[1fr_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "jm-map-frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCivicMap, {
							cityId: city,
							mode,
							activities,
							points,
							selectedAreaId,
							onSelectArea: setSelectedAreaId,
							onResetView: () => setSelectedAreaId(null),
							className: "h-[480px] lg:h-[calc(100vh-16rem)]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-4 border-t border-[var(--glass-border)] p-4",
						children: AREA_HEALTH_ORDER.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full",
								style: { background: AREA_HEALTH_HEX[h] }
							}), AREA_HEALTH_LABEL[h]]
						}, h))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "jm-chart-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.7_day_pulse") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTrendChart, {
								data: trendData,
								className: "mt-2 h-[140px]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "jm-chart-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.severity_mix") }), healthData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthPieChart, {
								data: healthData,
								className: "h-[160px]"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted-foreground",
								children: t("ui.no_data_under_filters")
							})]
						}),
						selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaDetailPanel, {
							activity: selected,
							trendData: areaTrend,
							onClose: () => setSelectedAreaId(null)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.map_legend") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: t("ui.click_an_area_to_view_operatio")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-subtle",
									children: t("ui.prototype_area_boundaries_not_")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterDrawer, {
				open: filterOpen,
				onOpenChange: setFilterOpen,
				filters: complaintFilters,
				onChange: (p) => setComplaintFilters((f) => ({
					...f,
					...p
				})),
				onApply: () => setFilterOpen(false),
				onClear: () => setComplaintFilters(DEFAULT_COMPLAINT_FILTERS)
			})
		]
	});
}
function AreaDetailPanel({ activity, trendData, onClose }) {
	const { t } = useI18n();
	const { area, total, health, trendPct, topIssue, risk, resolved } = activity;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "jm-panel-enter jm-panel-glow animate-rise p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.area_details") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-lg font-semibold",
				children: area.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					area.admin.division ?? "—",
					" · ",
					area.admin.body
				]
			}),
			area.boundarySource === "derived" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-warning",
				children: t("ui.prototype_area_boundary")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.complaints")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-semibold tabular-nums",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: total })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.critical")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-semibold tabular-nums",
						children: Math.round(total * .08)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.7_day_trend")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: cn("font-semibold", trendPct >= 0 ? "text-[#a4503f]" : "text-primary"),
						children: [
							trendPct >= 0 ? "+" : "",
							trendPct,
							"%"
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.risk")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-semibold tabular-nums",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStat, { value: risk })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.top_category")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: ISSUE_LABEL[topIssue] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "label-xs",
						children: t("ui.resolved")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: resolved
					})] })
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/complaints",
					search: { area: area.name },
					className: "action-btn text-center",
					children: t("ui.view_reports")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/issues",
					className: "action-btn text-center",
					children: t("ui.view_emerging_issues")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-3 inline-block rounded-full px-2 py-0.5 text-[0.65rem] uppercase",
				style: {
					background: `${AREA_HEALTH_HEX[health]}22`,
					color: AREA_HEALTH_HEX[health]
				},
				children: [
					AREA_HEALTH_LABEL[health],
					" ",
					t("ui.activity")
				]
			})
		]
	});
}
//#endregion
export { MuniMapPage as component };
