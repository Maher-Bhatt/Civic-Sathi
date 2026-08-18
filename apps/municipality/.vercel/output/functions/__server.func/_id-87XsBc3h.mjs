import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { c as Route$11, k as getCivicIssues, u as useI18n } from "./_ssr/router-CzUebAlT.mjs";
import { n as SeverityBadge, r as StatusBadge } from "./_ssr/status-badge-DreJLRai.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { U as ArrowLeft, c as Split, u as ShieldAlert, y as Merge } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
import { r as format } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-87XsBc3h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CivicIssueDetailPage() {
	const { t } = useI18n();
	const { id } = Route$11.useParams();
	const [issue, setIssue] = (0, import_react.useState)(null);
	const [allIssues, setAllIssues] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	const [merging, setMerging] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCivicIssues().then((issues) => {
			setAllIssues(issues);
			const found = issues.find((i) => i.id === id);
			if (found) setIssue(found);
			else setError(true);
		}).catch(() => setError(true)).finally(() => setLoading(false));
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading civic issue..." });
	if (error || !issue) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Civic issue not found.",
		onRetry: () => window.location.reload()
	});
	const handleMerge = () => {
		toast.success("Issue merged successfully.");
		setMerging(false);
	};
	const handleSplit = () => {
		toast.success("Complaint split into new Civic Issue.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6 max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/civic-issues",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), t("ui.all_civic_issues")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.civic_issue_intelligence") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: issue.status }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: issue.severity })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold sm:text-3xl",
					children: issue.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-muted-foreground",
					children: [
						issue.area,
						" · ",
						issue.ward
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.issue_summary") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: issue.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-[var(--glass-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.total_reports")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-2xl font-semibold tabular-nums",
										children: issue.reportCount
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.impact_score")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 text-2xl font-semibold tabular-nums text-critical",
										children: [issue.impactScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-normal text-muted-foreground",
											children: "/100"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.first_reported")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-sm font-medium",
										children: format(new Date(issue.firstReportedAt), "dd MMM yyyy")
									})] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.linked_complaints") })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/complaints/$id",
									params: { id: "JN-2026-00001" },
									className: "text-sm font-medium text-primary hover:underline",
									children: t("ui.jn_2026_00001")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: t("ui.primary_reporter")
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSplit,
									className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--glass-strong)] transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Split, { className: "w-3 h-3" }),
										" ",
										t("ui.split")
									]
								})]
							}), issue.reportCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/complaints/$id",
									params: { id: "JN-2026-00002" },
									className: "text-sm font-medium text-primary hover:underline",
									children: t("ui.jn_2026_00002")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: t("ui.citizen_confirmation")
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSplit,
									className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--glass-strong)] transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Split, { className: "w-3 h-3" }),
										" ",
										t("ui.split")
									]
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6 border-warning/30 bg-warning/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, {
								className: "text-warning flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Merge, { className: "w-4 h-4" }),
									" ",
									t("ui.merge_issue")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: t("ui.if_this_issue_is_a_duplicate_o")
							}),
							merging ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full bg-[var(--glass-strong)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: t("ui.select_target_issue")
									}), allIssues.filter((i) => i.id !== issue.id).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: i.id,
										children: [
											i.category,
											" - ",
											i.ward
										]
									}, i.id))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleMerge,
										className: "action-btn flex-1 bg-warning text-warning-foreground hover:bg-warning/90",
										children: t("ui.confirm_merge")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMerging(false),
										className: "action-btn flex-1 bg-transparent border border-border",
										children: t("ui.cancel")
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMerging(true),
								className: "action-btn w-full mt-4 bg-[var(--glass-strong)]",
								children: t("ui.merge_with_another_issue")
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6 border-primary/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }),
									" ",
									t("ui.work_execution")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: t("ui.this_civic_issue_is_ready_to_b")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "action-btn w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90",
								children: t("ui.create_work_package")
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { CivicIssueDetailPage as component };
