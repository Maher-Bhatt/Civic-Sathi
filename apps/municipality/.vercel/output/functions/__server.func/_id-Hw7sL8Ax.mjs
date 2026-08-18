import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { G as getTender, X as listBids, b as awardBid, r as Route$3, u as useI18n } from "./_ssr/router-CzUebAlT.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { F as CircleCheck, U as ArrowLeft } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-Hw7sL8Ax.js
var import_jsx_runtime = require_jsx_runtime();
function TenderDetailPage() {
	const { t } = useI18n();
	const { id } = Route$3.useParams();
	const queryClient = useQueryClient();
	const { data: tender, isLoading: loadingTender, error: tenderError } = useQuery({
		queryKey: ["tender", id],
		queryFn: () => getTender(id)
	});
	const { data: bids = [], isLoading: loadingBids } = useQuery({
		queryKey: ["tender-bids", id],
		queryFn: () => listBids(id),
		enabled: !!tender
	});
	const awardMutation = useMutation({
		mutationFn: (bidId) => awardBid(id, bidId),
		onSuccess: () => {
			toast.success("Tender awarded successfully!");
			queryClient.invalidateQueries({ queryKey: ["tender", id] });
			queryClient.invalidateQueries({ queryKey: ["tender-bids", id] });
		},
		onError: (err) => toast.error(err.message || "Failed to award tender")
	});
	if (loadingTender) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading tender details..." });
	if (tenderError || !tender) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Tender not found.",
		onRetry: () => window.location.reload()
	});
	const isAwarded = tender.status === "AWARDED" || tender.status === "CLOSED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tenders",
				className: "inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }),
					" ",
					t("ui.all_tenders")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					className: "tabular-nums",
					children: tender.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-[var(--surface-elevated)] text-[var(--primary)] px-3 py-1 text-xs font-medium",
					children: tender.status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.tender_details") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-xl font-semibold",
								children: tender.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-[var(--muted-foreground)]",
								children: tender.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-6 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.department")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-sm font-medium",
										children: tender.department_id || "N/A"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.estimated_cost")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 text-sm font-semibold text-[var(--foreground)]",
										children: ["₹", tender.estimated_budget?.toLocaleString("en-IN")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: t("ui.civic_issue_id")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-sm",
										children: tender.civic_issue_id || "N/A"
									})] })
								]
							}),
							tender.scope_of_work && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs mt-5",
								children: t("ui.scope_of_work")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 whitespace-pre-wrap rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]",
								children: tender.scope_of_work
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
							t("ui.submitted_bids"),
							bids.length,
							")"
						] }), loadingBids ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-[var(--muted-foreground)]",
							children: t("ui.loading_bids")
						}) : bids.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-[var(--muted-foreground)]",
							children: t("ui.no_bids_submitted_yet")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3",
							children: bids.map((bid) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 transition-all duration-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-sm",
											children: [t("ui.contractor_id"), bid.contractor_id]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-[var(--muted-foreground)] mt-1",
											children: [t("ui.bid_id"), bid.id]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-lg font-bold tabular-nums text-[var(--primary)]",
												children: ["₹", bid.quoted_amount.toLocaleString("en-IN")]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold px-2 py-0.5 rounded border border-[var(--glass-border)]",
												children: bid.status
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 pt-3 border-t border-[var(--glass-border)] text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[var(--muted-foreground)] whitespace-pre-wrap",
											children: bid.technical_proposal
										})
									}),
									!isAwarded && bid.status === "SUBMITTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => awardMutation.mutate(bid.id),
										disabled: awardMutation.isPending,
										className: "mt-4 action-btn primary w-full flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), awardMutation.isPending ? "Awarding..." : "Award Tender to this Bid"]
									})
								]
							}, bid.id))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.tender_info") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: t("ui.city")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm capitalize",
								children: tender.city_id
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: t("ui.status")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-semibold",
								children: tender.status
							})] })]
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { TenderDetailPage as component };
