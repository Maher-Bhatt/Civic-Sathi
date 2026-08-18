import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as getDashboardKPIs, F as getLiveActivity, P as getHotspotRankings, W as getSystemicIssues, k as getCivicIssues, l as useMuniAuth, ot as stopLiveSimulation, u as useI18n } from "./router-Cf3D64gF.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { H as ArrowUpRight, o as TrendingUp, s as TrendingDown } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { n as AREA_HEALTH_LABEL, t as AREA_HEALTH_HEX } from "./types-4uHn1A5k.mjs";
import { c as cityIssueBreakdown, o as cityDailyTrend, r as areaActivity, s as cityHealthDistribution, t as DEFAULT_FILTERS } from "./geography-DzWCmPpr.mjs";
import { t as EmergingIssueCard } from "./emerging-issue-card-DoE6A-an.mjs";
import { a as HealthPieChart, i as ClientCivicMap, o as IssueBreakdownChart, t as ActivityTrendChart } from "./civic-charts-Ab-jGrkJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DLs6dDTg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CountUp({ value, duration = 800, className }) {
	const [display, setDisplay] = (0, import_react.useState)(0);
	const prev = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const start = prev.current;
		const diff = value - start;
		const startTime = performance.now();
		const tick = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			setDisplay(Math.round(start + diff * eased));
			if (progress < 1) requestAnimationFrame(tick);
			else prev.current = value;
		};
		requestAnimationFrame(tick);
	}, [value, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular-nums", className),
		children: display.toLocaleString("en-IN")
	});
}
function KpiCard({ label, value, accent, delay = 0, className }) {
	const accentClass = accent === "critical" ? "text-critical" : accent === "warning" ? "text-warning" : accent === "success" ? "text-primary" : "text-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: cn("animate-rise p-5", className),
		style: { animationDelay: `${delay}ms` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-2 text-3xl font-semibold tracking-tight", accentClass),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value })
		})]
	});
}
function LiveActivityFeed({ activities, className }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: cn("p-5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.live_activity") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-[0.65rem] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative flex h-2 w-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
				}), t("ui.prototype_simulation")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3",
			children: activities.slice(0, 6).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "animate-rise rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3",
				style: { animationDelay: `${i * 80}ms` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: a.subtitle
					}),
					a.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: a.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[0.65rem] text-subtle",
						children: formatDistanceToNow(new Date(a.at), { addSuffix: true })
					})
				]
			}, a.id))
		})]
	});
}
function MuniDashboardPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [live, setLive] = (0, import_react.useState)([]);
	const [mapMode] = (0, import_react.useState)("health");
	const points = (0, import_react.useMemo)(() => {
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
	const activities = (0, import_react.useMemo)(() => areaActivity(city, DEFAULT_FILTERS, points), [city, points]);
	const trendData = (0, import_react.useMemo)(() => cityDailyTrend(city, DEFAULT_FILTERS, points), [city, points]);
	const issueData = (0, import_react.useMemo)(() => cityIssueBreakdown(city, DEFAULT_FILTERS, points), [city, points]);
	const healthData = (0, import_react.useMemo)(() => cityHealthDistribution(city, DEFAULT_FILTERS, points), [city, points]);
	const { data, isLoading: loading } = useQuery({
		queryKey: ["muni-dashboard", city],
		queryFn: async () => {
			const [k, i, l, h, c] = await Promise.all([
				getDashboardKPIs(),
				getSystemicIssues(city),
				getLiveActivity(),
				getHotspotRankings(),
				getCivicIssues()
			]);
			return {
				kpis: k,
				issues: i.slice(0, 4),
				live: l,
				hotspots: h.slice(0, 3),
				civicIssues: c
			};
		}
	});
	(0, import_react.useEffect)(() => {
		return () => /* @__PURE__ */ stopLiveSimulation();
	}, [city]);
	const kpis = data?.kpis;
	const issues = data?.issues || [];
	const hotspots = data?.hotspots || [];
	const civicIssues = data?.civicIssues || [];
	if (loading || !kpis) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading municipal intelligence..." });
	const healthCounts = activities.reduce((acc, a) => {
		acc[a.health] += 1;
		return acc;
	}, {
		low: 0,
		moderate: 0,
		high: 0,
		critical: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.municipal_intelligence") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "jm-glitch-text mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
					children: t("ui.see_what_is_happening_across_y")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("ui.prototype_intelligence_data")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.total_reports"),
						value: kpis.totalReports,
						delay: 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.critical"),
						value: kpis.critical,
						accent: "critical",
						delay: 60
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.active"),
						value: kpis.active,
						delay: 120
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.resolved"),
						value: kpis.resolved,
						accent: "success",
						delay: 180
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.emerging_issues"),
						value: kpis.emergingIssues,
						accent: "warning",
						delay: 240
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: t("ui.area_hotspots"),
						value: kpis.areaHotspots,
						delay: 300
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "overflow-hidden xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-[var(--glass-border)] p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.city_health") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-4",
							children: [
								"low",
								"moderate",
								"high",
								"critical"
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 rounded-full",
										style: { background: AREA_HEALTH_HEX[h] }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: AREA_HEALTH_LABEL[h]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium tabular-nums",
										children: healthCounts[h]
									})
								]
							}, h))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "jm-map-frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCivicMap, {
							cityId: city,
							mode: mapMode,
							activities,
							points,
							selectedAreaId: null,
							onSelectArea: () => {},
							compact: true,
							className: "h-[280px] sm:h-[320px]"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveActivityFeed, { activities: live })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "jm-chart-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.7_day_activity_pulse") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTrendChart, {
							data: trendData,
							className: "mt-2"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "jm-chart-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.issue_breakdown") }), issueData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueBreakdownChart, {
							data: issueData,
							className: "mt-2"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted-foreground",
							children: t("ui.no_data_yet")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "jm-chart-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.severity_distribution") }), healthData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthPieChart, { data: healthData }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted-foreground",
							children: t("ui.no_data_yet")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.emerging_systemic_issues") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-lg font-semibold",
					children: t("ui.something_is_happening_in_thes")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/issues",
					className: "flex items-center gap-1 text-xs text-primary hover:underline",
					children: [t("ui.view_all"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: issues.map((issue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmergingIssueCard, {
					issue,
					delay: i * 80
				}, issue.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.hotspot_analysis") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				children: hotspots.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/issues/$id",
					params: { id: h.issueId },
					className: "lift glass flex flex-wrap items-center gap-4 rounded-2xl p-4 transition-all duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-sm font-semibold",
							children: h.rank
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: h.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: h.area
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold tabular-nums",
								children: [
									h.reports,
									" ",
									t("ui.reports")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [t("ui.risk"), h.risk]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("flex items-center gap-1 text-sm font-medium", h.trend >= 0 ? "text-[#a4503f]" : "text-primary"),
							children: [
								h.trend >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }),
								h.trend >= 0 ? "+" : "",
								h.trend,
								"%"
							]
						})
					]
				}, h.issueId))
			})] })
		]
	});
}
//#endregion
export { MuniDashboardPage as component };
