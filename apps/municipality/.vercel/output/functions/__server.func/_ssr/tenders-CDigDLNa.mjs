import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as listTenders, l as useMuniAuth, u as useI18n } from "./router-C5G_q8ix.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { H as ArrowUpRight, _ as Package, g as Plus } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenders-CDigDLNa.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	DRAFT: "Draft",
	PUBLISHED: "Open",
	CLOSED: "Closed",
	EVALUATING: "Under Evaluation",
	AWARDED: "Awarded",
	CANCELLED: "Cancelled"
};
var STATUS_CHIP = {
	DRAFT: "text-[var(--muted-foreground)] bg-[var(--muted)]",
	PUBLISHED: "text-green-500 bg-[color-mix(in_oklab,#22c55e_12%,transparent)]",
	CLOSED: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	EVALUATING: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
	AWARDED: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
	CANCELLED: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]"
};
function TendersPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const { data: tenders = [], isLoading: loading } = useQuery({
		queryKey: ["muni-tenders", city],
		queryFn: () => listTenders(city),
		enabled: !!city
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading tenders..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.tenders") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-2 text-2xl font-semibold tracking-tight",
				children: [
					tenders.length,
					" ",
					t("ui.tender"),
					tenders.length !== 1 ? "s" : ""
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tenders/new",
				className: "action-btn primary flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), t("ui.publish_tender")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: tenders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-10 w-10 text-muted-foreground opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: t("ui.no_tenders_published_yet")
				})]
			}) : tenders.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tenders/$id",
				params: { id: t.id },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
					elevation: "raised",
					className: "lift p-5 cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-2 mb-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CHIP[t.status] ?? STATUS_CHIP["DRAFT"]),
										children: STATUS_LABEL[t.status] ?? t.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: t.title
								}),
								t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground line-clamp-2",
									children: t.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground",
									children: t.scope_of_work && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-1",
										children: t.scope_of_work
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-mono text-muted-foreground",
									children: t.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm font-semibold tabular-nums",
									children: ["₹", (t.estimated_budget ?? 0).toLocaleString("en-IN")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: t.published_at ? format(new Date(t.published_at), "dd MMM yyyy") : "Draft"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mt-2 ml-auto h-4 w-4 text-muted-foreground" })
							]
						})]
					})
				})
			}, t.id))
		})]
	});
}
//#endregion
export { TendersPage as component };
