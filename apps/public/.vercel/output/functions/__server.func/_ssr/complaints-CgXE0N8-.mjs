import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { B as CalendarDays, L as ChevronRight, S as MapPin } from "../_libs/lucide-react.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as StatusBadge } from "./badges-jtQKvOp1.mjs";
import { O as useI18n, a as LoadingState, b as getMyComplaints, d as SectionLabel, i as ErrorState, l as GlassCard, n as AuthGate, r as EmptyState, u as PageShell } from "./router-sgrg9cFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-CgXE0N8-.js
var import_jsx_runtime = require_jsx_runtime();
function ComplaintCard({ complaint, index = 0 }) {
	const date = new Date(complaint.createdAt).toLocaleDateString(void 0, {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
		as: "li",
		interactive: true,
		className: "animate-rise list-none p-0",
		style: { animationDelay: `${index * 70}ms` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/complaint/$id",
			params: { id: complaint.id },
			className: "flex items-start gap-4 p-5 outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs",
							children: complaint.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: complaint.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[0.95rem] leading-snug font-semibold",
						children: complaint.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 text-sm text-muted-foreground",
						children: complaint.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), complaint.location.ward]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), date]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "mt-1 h-4 w-4 shrink-0 text-subtle transition-transform duration-200 group-hover:translate-x-0.5",
				"aria-hidden": true
			})]
		})
	});
}
function ComplaintsPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["complaints"],
		queryFn: getMyComplaints
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-rise space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.your_activity") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold sm:text-3xl",
					children: t("ui.my_complaints")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("ui.every_report_you_submit_stays_")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading your reports..." }),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					description: "We couldn't load your complaints right now.",
					onRetry: () => void refetch()
				}),
				data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: t("ui.no_reports_yet"),
					description: "You haven't submitted any reports yet.",
					actionLabel: "Report a problem",
					onAction: () => navigate({ to: "/report" })
				}),
				data && data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: data.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintCard, {
						complaint: c,
						index: i
					}, c.id))
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/complaints",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintsPage, {})
});
//#endregion
export { SplitComponent as component };
