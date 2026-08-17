import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useContractorAuth, o as getEligibleTenders } from "./router-D4KhRL4Q.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenders-CkJ7Gk8z.js
var import_jsx_runtime = require_jsx_runtime();
var TENDER_STATUS_LABEL = {
	DRAFT: "Draft",
	PUBLISHED: "Open for Bids",
	CLOSED: "Closed",
	EVALUATING: "Under Evaluation",
	AWARDED: "Awarded",
	CANCELLED: "Cancelled"
};
var TENDER_STATUS_COLOR = {
	DRAFT: "text-[var(--muted-foreground)]",
	PUBLISHED: "text-green-500",
	CLOSED: "text-[var(--warning)]",
	EVALUATING: "text-[var(--primary)]",
	AWARDED: "text-[var(--success)]",
	CANCELLED: "text-[var(--critical)]"
};
function TendersIndex() {
	const { contractor } = useContractorAuth();
	const cityParam = contractor?.city ?? "vadodara";
	const { data: tenders = [], isLoading: loading } = useQuery({
		queryKey: ["contractor-tenders", cityParam],
		queryFn: () => getEligibleTenders(cityParam),
		enabled: !!contractor?.id
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading tenders..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight",
			children: "Tenders & Bidding"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-[var(--muted-foreground)] mt-1",
			children: "Open procurement opportunities you are eligible for."
		})] }), tenders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "p-12 text-center glass-strong",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[var(--muted-foreground)]",
				children: "No open tenders found for your approved categories and cities."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[var(--muted-foreground)] mt-2",
				children: "Your contractor profile must be approved in a city before tenders appear here."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: tenders.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/contractor/tenders/$id",
				params: { id: t.id },
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
					className: "p-6 glass-strong lift transition-all hover:border-[var(--primary)]/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--glass-border)] ${TENDER_STATUS_COLOR[t.status] ?? "text-[var(--muted-foreground)]"}`,
										children: TENDER_STATUS_LABEL[t.status] ?? t.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-medium text-[var(--foreground)] leading-tight",
									children: t.title
								}),
								t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-[var(--muted-foreground)] line-clamp-2",
									children: t.description
								}),
								t.closed_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-[var(--muted-foreground)]",
									children: [
										"Closes:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[var(--foreground)]",
											children: new Date(t.closed_at).toLocaleDateString("en-IN")
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-[var(--muted-foreground)] mb-1",
								children: "Est. Budget"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg font-semibold tabular-nums text-[var(--primary)]",
								children: ["₹", (t.estimated_budget ?? 0).toLocaleString("en-IN")]
							})]
						})]
					})
				})
			}, t.id))
		})]
	});
}
//#endregion
export { TendersIndex as component };
