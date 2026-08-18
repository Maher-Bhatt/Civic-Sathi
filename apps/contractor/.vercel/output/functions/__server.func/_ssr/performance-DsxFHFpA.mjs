import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getContractor, i as useContractorAuth, p as useI18n } from "./router-CmoNjCXW.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState, t as ErrorState } from "./states-BSypa5q_.mjs";
import { a as ReferenceLine, c as ResponsiveContainer, i as CartesianGrid, l as Tooltip, n as YAxis, o as Bar, r as XAxis, s as Cell, t as BarChart, u as Legend } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/performance-DsxFHFpA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOOLTIP_STYLE = {
	backgroundColor: "var(--surface-elevated)",
	border: "1px solid var(--glass-border)",
	borderRadius: "10px",
	fontSize: "12px",
	boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
};
function ContractorPerformance() {
	const { t } = useI18n();
	const { contractor: contractorAuth } = useContractorAuth();
	const [contractor, setContractor] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			if (!contractorAuth?.contractorId) return;
			try {
				const data = await getContractor(contractorAuth.contractorId);
				setContractor(data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, [contractorAuth]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading performance metrics..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { description: error?.message ?? "Error loading performance metrics." });
	if (!contractor) return null;
	const score = contractor.performanceScore;
	const scoreColor = score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--critical)";
	const mockHistoryData = [
		{
			name: "Q1",
			score: Math.max(0, score - 15)
		},
		{
			name: "Q2",
			score: Math.max(0, score - 5)
		},
		{
			name: "Q3",
			score: Math.min(100, score + 5)
		},
		{
			name: "Q4",
			score
		}
	];
	const slaValue = Math.min(100, score + 12);
	const ftipValue = Math.min(100, score + 5);
	const otcValue = Math.min(100, score + 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight",
				children: t("ui.performance_metrics")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[var(--muted-foreground)] text-sm",
				children: t("ui.track_your_company_s_rating_an")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-8 glass-strong flex flex-col items-center justify-center text-center lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
							className: "mb-6",
							children: t("ui.overall_rating")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative w-48 h-48 rounded-full border-8 flex items-center justify-center shadow-lg",
							style: {
								borderColor: scoreColor,
								backgroundColor: "var(--surface)"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-5xl font-bold",
									style: { color: scoreColor },
									children: score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-[var(--muted-foreground)] uppercase tracking-widest mt-1",
									children: t("ui.out_of_100")
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 px-4 py-2 bg-[var(--surface-elevated)] rounded-md border border-[var(--glass-border)] text-sm",
							children: [t("ui.status"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								style: { color: scoreColor },
								children: score >= 80 ? "Excellent" : score >= 60 ? "Satisfactory" : "Needs Improvement"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 glass-strong flex flex-col justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-sm mb-2",
									children: t("ui.sla_compliance")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-3xl font-light text-[var(--foreground)]",
									children: [slaValue, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-[var(--success)] mt-1",
									children: t("ui.target_gt_90")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-1000",
										style: {
											width: `${slaValue}%`,
											background: "linear-gradient(90deg, #1abc9c, #27ae60)"
										}
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 glass-strong flex flex-col justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-sm mb-2",
									children: t("ui.first_time_inspection_pass")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-3xl font-light text-[var(--foreground)]",
									children: [ftipValue, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-[var(--warning)] mt-1",
									children: t("ui.target_gt_85")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-1000",
										style: {
											width: `${ftipValue}%`,
											background: "linear-gradient(90deg, #f39c12, #e67e22)"
										}
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 glass-strong flex flex-col justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-sm mb-2",
									children: t("ui.on_time_completion")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-3xl font-light text-[var(--foreground)]",
									children: [otcValue, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-[var(--success)] mt-1",
									children: t("ui.target_gt_95")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-1000",
										style: {
											width: `${otcValue}%`,
											background: "linear-gradient(90deg, #1abc9c, #27ae60)"
										}
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 glass-strong flex flex-col justify-between bg-[var(--surface-elevated)]/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-sm mb-2",
									children: t("ui.total_historical_work_orders")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-semibold text-[var(--primary)]",
									children: Math.floor(Math.random() * 50) + 120
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-[var(--muted-foreground)] mt-1",
									children: t("ui.lifetime_completed")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 h-1.5 w-full rounded-full bg-[var(--glass-border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all duration-1000",
										style: {
											width: "78%",
											background: "linear-gradient(90deg, #3498db, #1abc9c)"
										}
									})
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 glass-strong h-80 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "mb-4",
						children: t("ui.score_trend_last_4_quarters")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 w-full h-full min-h-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: mockHistoryData,
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "scoreGrad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#1abc9c",
											stopOpacity: 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#1abc9c",
											stopOpacity: .5
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "rgba(255,255,255,0.08)"
									}),
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
										axisLine: false,
										domain: [0, 100]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "rgba(255,255,255,0.05)" },
										contentStyle: TOOLTIP_STYLE
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: 80,
										stroke: "#27ae60",
										strokeDasharray: "4 4",
										label: {
											value: "Target: 80",
											fill: "#27ae60",
											fontSize: 10,
											position: "insideTopRight"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "score",
										radius: [
											6,
											6,
											0,
											0
										],
										animationDuration: 1200,
										animationEasing: "ease-out",
										children: mockHistoryData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											fill: entry.score >= 80 ? "#27ae60" : entry.score >= 60 ? "#f39c12" : "#e74c3c",
											fillOpacity: .85
										}, `cell-${index}`))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 glass-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "mb-4",
						children: t("ui.company_profile_data")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-[var(--muted-foreground)] mb-1",
							children: t("ui.specializations")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: contractor.specializationCategories.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-md text-xs font-medium",
								children: spec
							}, spec))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t border-[var(--glass-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-[var(--muted-foreground)] mb-1",
								children: t("ui.service_wards")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: contractor.serviceAreas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--glass-border)] rounded-md text-xs",
									children: [t("ui.ward"), area]
								}, area))
							})]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ContractorPerformance as component };
