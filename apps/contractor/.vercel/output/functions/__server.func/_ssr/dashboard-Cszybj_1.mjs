import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useContractorAuth, l as getWorkOrders, o as getEligibleTenders, p as useI18n } from "./router-CmoNjCXW.mjs";
import { f as HardHat, i as Sparkles, m as FileCheck, v as CircleAlert, x as Banknote } from "../_libs/lucide-react.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState, t as ErrorState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Cszybj_1.js
var import_jsx_runtime = require_jsx_runtime();
function workOrderStatusLabel(status) {
	return {
		DRAFT: "Draft",
		PENDING_APPROVAL: "Pending Approval",
		APPROVED: "Approved",
		CONTRACTOR_ASSIGNED: "Contractor Assigned",
		PENDING_ACCEPTANCE: "Pending Acceptance",
		ACCEPTED: "Accepted",
		MOBILIZATION: "Mobilization",
		IN_PROGRESS: "In Progress",
		SUBMITTED_FOR_INSPECTION: "Submitted for Inspection",
		INSPECTION_FAILED: "Inspection Failed",
		REWORK: "Rework",
		RESUBMITTED: "Resubmitted",
		INSPECTION_PASSED: "Inspection Passed",
		COMPLETED: "Completed",
		MEASUREMENT_PENDING: "Measurement Pending",
		BILL_SUBMITTED: "Bill Submitted",
		BILL_VERIFIED: "Bill Verified",
		PAYMENT_APPROVED: "Payment Approved",
		CLOSED: "Closed"
	}[status] ?? status;
}
function workOrderStatusColor(status) {
	if (status === "CLOSED" || status === "PAYMENT_APPROVED") return "success";
	if (status === "INSPECTION_FAILED" || status === "REWORK" || status === "DRAFT" || status === "PENDING_APPROVAL") return "warning";
	if (status === "IN_PROGRESS" || status === "MOBILIZATION" || status === "ACCEPTED") return "primary";
	return "muted";
}
function ContractorDashboard() {
	const { t } = useI18n();
	const { contractor } = useContractorAuth();
	const cityId = contractor?.city || "11111111-1111-1111-1111-111111111111";
	const { data, isLoading: loading, error } = useQuery({
		queryKey: [
			"contractor-dashboard",
			contractor?.id,
			cityId
		],
		queryFn: async () => {
			const [woData, tenderData] = await Promise.all([getWorkOrders(cityId), getEligibleTenders(cityId)]);
			return {
				workOrders: woData,
				tenders: tenderData
			};
		},
		enabled: !!contractor?.id
	});
	const workOrders = data?.workOrders || [];
	const tenders = data?.tenders || [];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Initializing Operations Center..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { description: error?.message ?? "Connection Error" });
	if (!contractor) return null;
	const activeWorkOrders = workOrders.filter((wo) => wo.status !== "COMPLETED" && wo.status !== "CLOSED");
	const delayedWorkOrders = activeWorkOrders.filter((wo) => wo.risk_level === "HIGH" || wo.risk_level === "CRITICAL");
	const pendingInspections = workOrders.filter((wo) => wo.status === "INSPECTION_PENDING");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade max-w-6xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight",
					children: t("ui.contractor_operations_center")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[var(--muted-foreground)] text-sm",
					children: [
						contractor.name,
						" | ",
						contractor.email
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-5 glass-strong border-[var(--primary)] border-l-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-[var(--primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "!mb-0 !text-sm",
						children: t("ui.ai_operations_brief")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm text-[var(--foreground)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							t("ui.you_have"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								activeWorkOrders.length,
								" ",
								t("ui.active_work_orders")
							] }),
							"."
						] }),
						delayedWorkOrders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[var(--destructive)]",
							children: [
								"⚠️ ",
								delayedWorkOrders.length,
								" ",
								t("ui.projects_are_currently_at_high")
							]
						}),
						pendingInspections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[var(--warning)]",
							children: [
								"⏳ ",
								pendingInspections.length,
								" ",
								t("ui.work_orders_are_awaiting_munic")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[var(--success)]",
							children: [
								"💡 ",
								tenders.length,
								" ",
								t("ui.eligible_tenders_close_within_")
							]
						})
					]
				})]
			}),
			delayedWorkOrders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-5 bg-red-500/10 border-red-500/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3 text-red-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-sm",
						children: t("ui.needs_your_attention")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "text-sm space-y-2",
					children: delayedWorkOrders.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							wo.title,
							" ",
							t("ui.behind_schedule")
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contractor/work-orders/$id",
							params: { id: wo.id },
							className: "text-red-600 hover:underline",
							children: t("ui.provide_evidence")
						})]
					}, wo.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong flex flex-col gap-1 lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[var(--muted-foreground)] mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4" }),
								" ",
								t("ui.active_work_orders")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-light text-[var(--foreground)]",
							children: activeWorkOrders.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong flex flex-col gap-1 lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[var(--muted-foreground)] mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4" }),
								" ",
								t("ui.inspection_pending")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-light text-[var(--warning)]",
							children: pendingInspections.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong flex flex-col gap-1 lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[var(--muted-foreground)] mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4" }),
								" ",
								t("ui.payments_pending")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-light text-[var(--success)]",
							children: "₹0.00"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong flex flex-col gap-1 lift",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[var(--muted-foreground)] mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
								" ",
								t("ui.risk_alerts")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-light text-[var(--destructive)]",
							children: delayedWorkOrders.length
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "glass-strong overflow-hidden flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-[var(--glass-border)] flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.active_project_health") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contractor/work-orders",
							className: "text-xs text-[var(--primary)] hover:underline",
							children: t("ui.view_all")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-0 overflow-y-auto max-h-[300px]",
						children: activeWorkOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-[var(--muted-foreground)] text-sm",
							children: t("ui.no_active_projects")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-[var(--glass-border)]",
							children: activeWorkOrders.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "p-4 hover:bg-[var(--surface-elevated)] transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/contractor/work-orders/$id",
											params: { id: wo.id },
											className: "font-medium hover:text-[var(--primary)]",
											children: wo.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs px-2 py-0.5 rounded border border-[var(--glass-border)]",
											style: { color: workOrderStatusColor(wo.status) },
											children: workOrderStatusLabel(wo.status)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs text-[var(--muted-foreground)] mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t("ui.risk"), wo.risk_level || "LOW"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											t("ui.planned"),
											wo.planned_progress_pct || 0,
											t("ui.verified"),
											wo.verified_progress_pct || 0,
											"%"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-[var(--surface)] h-1.5 mt-2 rounded-full overflow-hidden flex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-[var(--primary)] h-full",
											style: { width: `${wo.verified_progress_pct || 0}%` }
										})
									})
								]
							}, wo.id))
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "glass-strong overflow-hidden flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-[var(--glass-border)] flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.recommended_tender_opportuniti") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contractor/tenders",
							className: "text-xs text-[var(--primary)] hover:underline",
							children: t("ui.view_market")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-0 overflow-y-auto max-h-[300px]",
						children: tenders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-[var(--muted-foreground)] text-sm",
							children: t("ui.no_matching_tenders_available_")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-[var(--glass-border)]",
							children: tenders.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "p-4 hover:bg-[var(--surface-elevated)] transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-[var(--success)] font-mono",
										children: ["₹", t.estimated_budget?.toLocaleString("en-IN")]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-xs text-[var(--muted-foreground)] mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded",
										children: t("ui.high_match")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t("ui.closes"), new Date(t.closed_at).toLocaleDateString("en-IN")] })]
								})]
							}, t.id))
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { ContractorDashboard as component };
