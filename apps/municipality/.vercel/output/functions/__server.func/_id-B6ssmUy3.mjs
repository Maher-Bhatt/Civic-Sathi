import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { J as listBids, U as getTender, r as Route$3, v as awardBid } from "./_ssr/router-Cd9GNziQ.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { H as ArrowLeft, P as CircleCheck } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-B6ssmUy3.js
var import_jsx_runtime = require_jsx_runtime();
function TenderDetailPage() {
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " All tenders"]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Tender Details" }),
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
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-sm font-medium",
										children: tender.department_id || "N/A"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: "Estimated Cost"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "mt-1 text-sm font-semibold text-[var(--foreground)]",
										children: ["₹", tender.estimated_budget?.toLocaleString("en-IN")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "label-xs",
										children: "Civic Issue ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-sm",
										children: tender.civic_issue_id || "N/A"
									})] })
								]
							}),
							tender.scope_of_work && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs mt-5",
								children: "Scope of Work"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 whitespace-pre-wrap rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]",
								children: tender.scope_of_work
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
							"Submitted Bids (",
							bids.length,
							")"
						] }), loadingBids ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-[var(--muted-foreground)]",
							children: "Loading bids..."
						}) : bids.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-[var(--muted-foreground)]",
							children: "No bids submitted yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3",
							children: bids.map((bid) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 transition-all duration-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-sm",
											children: ["Contractor ID: ", bid.contractor_id]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-[var(--muted-foreground)] mt-1",
											children: ["Bid ID: ", bid.id]
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Tender Info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm capitalize",
								children: tender.city_id
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "Status"
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
