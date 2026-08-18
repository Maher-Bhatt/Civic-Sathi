import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { R as getMuniComplaints, U as getSystemicIssue, ct as updateSystemicIssue, i as Route$5, it as startInvestigation, u as useI18n, y as assignIssueDepartment } from "./_ssr/router-B1-L_e4B.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { U as ArrowLeft, o as TrendingUp, s as TrendingDown } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
import { o as riskLevel, r as DEPARTMENTS } from "./_ssr/types-CjX07JOU.mjs";
import { r as format } from "./_libs/date-fns.mjs";
import { t as FieldActionCard } from "./_ssr/investigation-timeline-DKzoUkSb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-Dc9tsdED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExplainabilityPanel({ issue }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.why_janmind_flagged_this") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-foreground",
				children: issue.whyFlagged
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: t("ui.prototype_intelligence_data")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-2",
				children: issue.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "flat",
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-xs",
							children: e.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-semibold",
							children: e.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: e.detail
						})
					]
				}, e.label))
			})
		]
	});
}
function RootCausePanel({ issue }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.possible_root_cause") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: issue.possibleCause
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: t("ui.confidence")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold tabular-nums",
					children: [issue.causeConfidence, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-xs leading-relaxed text-muted-foreground",
				children: t("ui.inferred_candidate_based_on_co")
			})
		]
	});
}
function RecommendedActionsPanel({ actions, onStartInvestigation, onAssign, onFieldAction, onMarkInvestigating }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.recommended_action") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-2",
				children: actions.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-xs font-medium",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pt-0.5 text-foreground",
						children: a
					})]
				}, a))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [
					onStartInvestigation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onStartInvestigation,
						className: "press rounded-xl bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground",
						children: t("ui.start_investigation")
					}),
					onAssign && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onAssign,
						className: "press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider",
						children: t("ui.assign_department")
					}),
					onFieldAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onFieldAction,
						className: "press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider",
						children: t("ui.create_field_action")
					}),
					onMarkInvestigating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onMarkInvestigating,
						className: "press glass rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider",
						children: t("ui.mark_investigating")
					})
				]
			})
		]
	});
}
var LEVEL_COLORS = {
	Low: "text-primary",
	Moderate: "text-warning",
	High: "text-[#a4503f]",
	Critical: "text-critical"
};
function FactorBar({ label, value }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium tabular-nums text-foreground",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-[var(--glass)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary transition-all duration-500 ease-out",
				style: { width: `${value}%` }
			})
		})]
	});
}
function RiskScorePanel({ score, factors, className }) {
	const { t } = useI18n();
	const [animated, setAnimated] = (0, import_react.useState)(0);
	const level = riskLevel(score);
	(0, import_react.useEffect)(() => {
		const start = performance.now();
		const tick = (now) => {
			const p = Math.min((now - start) / 900, 1);
			setAnimated(Math.round(score * (1 - (1 - p) ** 3)));
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, [score]);
	const circumference = 2 * Math.PI * 54;
	const offset = circumference - animated / 100 * circumference;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: cn("p-6", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.janmind_prototype_risk_score") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "140",
					height: "140",
					viewBox: "0 0 120 120",
					"aria-hidden": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "54",
						fill: "none",
						stroke: "var(--glass-border)",
						strokeWidth: "6"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "54",
						fill: "none",
						stroke: "var(--primary)",
						strokeWidth: "6",
						strokeLinecap: "round",
						strokeDasharray: circumference,
						strokeDashoffset: offset,
						transform: "rotate(-90 60 60)",
						className: "transition-all duration-300"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl font-bold tabular-nums",
						children: animated
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-xs font-medium", LEVEL_COLORS[level]),
						children: level
					})]
				})]
			}), factors && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex-1 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBar, {
						label: t("ui.complaint_volume"),
						value: factors.complaintVolume
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBar, {
						label: t("ui.geographic_concentration"),
						value: factors.geographicConcentration
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBar, {
						label: t("ui.semantic_similarity"),
						value: factors.semanticSimilarity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBar, {
						label: t("ui.recent_growth"),
						value: factors.recentGrowth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBar, {
						label: t("ui.severity"),
						value: factors.severity
					})
				]
			})]
		})]
	});
}
function IssueDetailPage() {
	const { t } = useI18n();
	const { id } = Route$5.useParams();
	const [issue, setIssue] = (0, import_react.useState)(null);
	const [related, setRelated] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getSystemicIssue(id).then(async (i) => {
			if (!i) {
				setError(true);
				return;
			}
			setIssue(i);
			if (i.relatedComplaintIds.length > 0) {
				const all = await getMuniComplaints();
				setRelated(all.filter((c) => i.relatedComplaintIds.includes(c.id)));
			}
		}).catch(() => setError(true)).finally(() => setLoading(false));
	}, [id]);
	async function refresh() {
		const i = await getSystemicIssue(id);
		if (i) setIssue(i);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading issue intelligence..." });
	if (error || !issue) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Systemic issue not found.",
		onRetry: () => window.location.reload()
	});
	const level = riskLevel(issue.riskScore);
	const up = issue.trendPct >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/issues",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), t("ui.emerging_issues")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.systemic_issue_intelligence") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider", level === "Critical" ? "border-critical/40 bg-critical/10 text-critical" : "border-warning/40 bg-warning/10 text-warning"),
						children: issue.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold sm:text-3xl",
					children: issue.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-muted-foreground",
					children: [
						issue.areaName,
						" · ",
						issue.ward
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: t("ui.reports")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tabular-nums",
							children: issue.complaintCount
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: t("ui.risk")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold tabular-nums",
							children: [issue.riskScore, "/100"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-1", up ? "text-[#a4503f]" : "text-primary"),
							children: [
								up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold tabular-nums",
									children: [
										up ? "+" : "",
										issue.trendPct,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: t("ui.7_day_trend")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: [t("ui.updated"), format(new Date(issue.updatedAt), "dd MMM yyyy, HH:mm")]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 xl:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainabilityPanel, { issue }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootCausePanel, { issue }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendedActionsPanel, {
							actions: issue.recommendedActions,
							onStartInvestigation: () => void startInvestigation(id).then(() => {
								toast.success("Investigation started");
								refresh();
							}),
							onAssign: () => void assignIssueDepartment(id, "Municipal Water").then(() => {
								toast.success("Assigned to Municipal Water");
								refresh();
							}),
							onFieldAction: () => toast.info("Field action created (prototype)."),
							onMarkInvestigating: () => void updateSystemicIssue(id, { status: "Investigating" }).then(() => {
								toast.success("Marked as investigating");
								refresh();
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskScorePanel, {
							score: issue.riskScore,
							factors: issue.riskFactors
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldActionCard, {
							area: issue.areaName,
							priority: level,
							recommendations: issue.recommendedActions.slice(0, 3),
							onAssign: () => void assignIssueDepartment(id, DEPARTMENTS[0]).then(() => {
								toast.success("Field team assigned");
								refresh();
							}),
							onAcknowledge: () => toast.success("Acknowledged"),
							onStart: () => void startInvestigation(id).then(() => {
								toast.success("Field action started");
								refresh();
							})
						}),
						related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.related_complaints") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2",
								children: related.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/complaints/$id",
									params: { id: c.id },
									className: "text-sm text-primary hover:underline",
									children: c.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted-foreground",
									children: c.area
								})] }, c.id))
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { IssueDetailPage as component };
